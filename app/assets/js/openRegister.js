$(function(){

  function getCashRegisterSum(){
    return 'SELECT (SUM((SELECT COALESCE(SUM(deposits.amount),0) as d FROM deposits)) ' +
          '- SUM((SELECT COALESCE(SUM(withdrawals.amount),0) as w FROM withdrawals)) + ' +
          'SUM((SELECT (COALESCE(SUM(' +
          "CASE WHEN payments.payment_type = 'pago' AND payments.payment_form_id = 1 THEN payments.total " +
          "WHEN payments.payment_type = 'devolución' AND payments.payment_form_id = 1 THEN -payments.total " +
          'ELSE 0 ' +
          'END ' +
          '),0)) as s ' +
          'FROM payments INNER JOIN tickets ON tickets.id = payments.ticket_id ' +
          "WHERE (tickets.ticket_type != 'pending' AND payments.payment_form_id = 1)))) as sum";
  }

  const remote = require('electron').remote;
  const _ = require('lodash');

  async function initStore(){
    const store = new Store({
      configName: 'user-localStore',
      defaults: {
        windowBounds: { width: 1024, height: 768 }
      }
    });
    return store;
  }

  function createFullName(user){
    return `${user.first_name} ${user.middle_name} ${user.last_name}`;
  }

  (function setInitialValues(){
    initStore().then(store => {
      $('#username').html(
        '<i class="fa fa-user-circle-o bigger-icon"' +
        'aria-hidden="true"></i> ' +
        'Bienvenido, ' +
        createFullName(
          store.get('current_user')
        )
      );

      $('#store').html(store.get('store').store_name);
    });
  })();

  function getQueryCount(store){
    return 'SELECT SUM(rows) as total_rows FROM (' +
      ' SELECT COUNT (*) as rows FROM products WHERE (shared = true AND current = true AND' +
      ` classification = 'de línea' AND child_id is NULL OR store_id = ${store.id}) ` +
      ` UNION ALL` +
      ` SELECT COUNT (*) as rows FROM delivery_addresses WHERE id = ${store.delivery_address_id} UNION ALL`+
      ` SELECT COUNT (*) as rows FROM stores WHERE id = ${store.id} UNION ALL` +
      ` SELECT COUNT (*) as rows FROM services WHERE (shared = true AND current = true OR store_id = ${store.id}) ` +
    ') as u';
  }

  function getStoresInventories(ids, store){
    return new Promise(function(resolve, reject){
      if (ids.length === 0)
        return resolve({length: 0});
      getAll('stores_inventories', '*', `store_id = ${store.id} AND product_id IN (${ids})`, true).then(storesInventoriesObjects => {
        resolve(storesInventoriesObjects.rows);
      });
    })
  }

  function lotQueries(store){
      return {
        'products' : 'SELECT * FROM products WHERE (shared = true AND current = true ' +
        `AND classification = 'de línea' AND child_id is NULL OR store_id = ${store.id}) ORDER BY id`,
        'services' : 'SELECT * FROM services WHERE ' +
        `(shared = true AND current = true OR store_id = ${store.id}) ORDER BY id`,
        'delivery_addresses': 'SELECT * FROM delivery_addresses WHERE ' +
        `id = ${store.delivery_address_id}`,
        'stores' : "SELECT * FROM stores " +
        `WHERE id=${store.id}`,
      };
    }

  function createLocalArray(localQuery, type){
    return new Promise(function(resolve, reject){
      let Promise = require("bluebird");
      let table = type;
      let promises = [];
      query(localQuery, false).then(localObjects => {
        Promise.each(localObjects.rows, function(row){
          ['created_at', 'updated_at'].forEach(field => {
            delete row[field];
          });
          promises.push(createInsert(
            Object.keys(row),
            Object.values(row),
            table
          ));
        }).then(function(){
          Promise.all(promises).then(insertQuery => {
            resolve(insertQuery);
          })
        });
      });
    });
  }

  function createRemoteArray(localQuery, type, storeObject){
    updateLocalMissings(storeObject.id, storeObject.overprice);
    return new Promise(function(resolve, reject){
      let Promise = require("bluebird");
      let table = type;
      let promises = [];
      query(localQuery).then(remoteObjects => {
        Promise.each(remoteObjects.rows, function(row){
          ['created_at', 'updated_at'].forEach(field => {
            delete row[field];
          });
          if (table === 'products'){
            if (row.store_id != null) {
              newPrice = row.price;
            } else {
              newPrice = row.price * ( 1 + (storeObject.overprice / 100) );
            }
            row.price = Math.round(newPrice * 100) / 100;
          }
          promises.push(createInsert(
            Object.keys(row),
            Object.values(row),
            table
          ));
        }).then(function(){
          Promise.all(promises).then(insertQuery => {
            resolve(insertQuery);
          })
        });
      });
    });
  }

  function getProcessIds(localInserts, remoteInserts){
    let Promise = require("bluebird");
    return new Promise(function(resolve, reject){
      let validatedProductsIds = [];
      Promise.each(localInserts, function(object, index){
        if (object !== remoteInserts[index]){
          validatedProductsIds.push({
            id: object.replace(/.* VALUES \( /,'').split(',')[0].replace(/\'/g,''),
            query: object
          });
        }
      }).then(function(){
        resolve(validatedProductsIds);
      });
    });

  }

  function updateProductWithThisInfo(productId, withoutPrice, storeObject){
    return new Promise(function(resolve, reject){
      findBy('id', productId, 'products').then(productObject => {
        let product = productObject.rows[0];
        if (product.store_id != null) {
          newPrice = product.price;
        } else {
          newPrice = product.price * ( 1 + (storeObject.overprice / 100) );
        }
        product.price = Math.round(newPrice * 100) / 100;
        if (withoutPrice)
          delete product.price;
        updateBy(
          product,
          'products',
          `id = ${product.id}`
        ).then(function(updateResult){
          if (!withoutPrice) {
            updateBy(
              {
                manual_price: product.price,
                web: false
              },
              'stores_inventories',
              `product_id = ${product.id}`
            ).then((storeInventoryUpdate) => {
              resolve(storeInventoryUpdate);
            });
          } else {
            resolve(updateResult);
          }
        });
      });
    });
  }

  function updateUniqs(uniqJson){
    return uniqJson.map(function(uniqInfo){
      return new Promise(function(resolve, reject){
        findBy('id', uniqInfo.reg.id, uniqInfo.table).then(foundObjectData => {
          updateBy(
            foundObjectData.rows[0],
            uniqInfo.table,
            `id = ${uniqInfo.reg.id}`
          ).then(function(){
            resolve();
          });
        });
      });
    });
  }

  function findMissing() {
      return {
        'missingInventoriesQuery' : 'SELECT id AS missing_inventories FROM products WHERE id ' +
          'NOT IN (SELECT product_id AS id FROM stores_inventories)'
      };
  }

  function updateLocalMissings(thisStore, overPrice) {
    let promises_inventories = [];
    let usedQueries = findMissing();

    query(usedQueries.missingInventoriesQuery, false).then(missingInvs => {
      missingInvs.rows.forEach(function(inv){
        promises_inventories.push(
          new Promise(function(resolve, reject){
            storeInvFindBy(inv.missing_inventories, thisStore, 'stores_inventories', true).then(findedInventory => {
              var newObjectResult = Object.assign(findedInventory.rows[0]);
              var addQuotesToInvs = Object.keys(newObjectResult).map(value => `"${value}"`).join(',');
              var new_date_inv = Date().toString().replace(/GMT.*/,'');
              newObjectResult.web = false;
              newObjectResult.pos_id = null;
              newObjectResult.web_id = null;
              newObjectResult.created_at = `'${new_date_inv}'`;
              newObjectResult.updated_at = `'${new_date_inv}'`;
              findBy('id', inv.missing_inventories, 'products', false).then(findedProduct => {
                var manualPrice = Math.round((findedProduct.rows[0].price * (1 + (overPrice / 100))) * 100) / 100;
                newObjectResult.manual_price = manualPrice;
                var myInvQuery = `INSERT INTO stores_inventories (${addQuotesToInvs}) VALUES (${Object.values(newObjectResult)});`
                .replace(/,,/g,',null,').replace(/,,/g,',null,').replace(',)',',null)');
                query(myInvQuery, false).then(function(){ resolve(); });
              });
            });
          })
        );
      });
    });
    Promise.all(promises_inventories).then(function(){});
  }

  function getUpdatedInformacion(store){
    let promises = [];
    let Promise = require("bluebird");
    return new Promise(function(globalResolve, globalReject){
      query(getQueryCount(store)).then(limitCount => {
        let jsonQueries = lotQueries(store);
        for (var type in jsonQueries) {
          promises.push(createLocalArray(jsonQueries[type], type));
          promises.push(createRemoteArray(jsonQueries[type], type, store));
        }
        Promise.all(promises).then(function(returnArray){
          let groupsArray = _.chunk(returnArray, 2)
          let promisesArray = [];
          groupsArray.forEach(function(groupArray){
            promisesArray.push(getProcessIds(groupArray[0], groupArray[1]));
          });
          Promise.all(promisesArray).then(function(validProcessIds){
            let tablesArray = ['delivery_addresses', 'stores'];
            let uniqueJsonData = [2,3].map(function(regPosition, index){
              if (validProcessIds[regPosition].length > 0){
                return {
                  reg: validProcessIds[regPosition][0],
                  table: tablesArray[index]
                }
              }
            });
            let uniquesRegs = updateUniqs(_.compact(uniqueJsonData));
            let promisesChanges = [];
            validProcessIds[0].forEach(function(product){
              promisesChanges.push(
                new Promise(function(internalResolve, internalReject){
                  let internalProduct = product;
                  findBy('product_id', product.id, 'stores_inventories', false).then(storeInventoryObect => {
                    let storeInventory = storeInventoryObect.rows[0];
                    updateProductWithThisInfo(storeInventory.product_id, storeInventory.manual_price_update, store).then(function(updateResult){
                      internalResolve(updateResult);
                    });
                  });
                })
              )
            });
            Promise.all(promisesChanges).then(function(aProductQueryResult){
              let promisesChangesServices = [];
              validProcessIds[1].forEach(function(service){
                promisesChangesServices.push(
                  new Promise(function(internalResolve, internalReject){
                    let internalService = service;
                    findBy('id', service.id, 'services').then(serviceObject => {
                      updateBy(
                        serviceObject.rows[0],
                        'services',
                        `id = ${internalService.id}`
                      ).then(updateResult => {
                        internalResolve(updateResult);
                      });
                    });
                  })
                );
              });
              Promise.all(promisesChangesServices).then(function(aServiceQueryResult){
                Promise.all(uniquesRegs).then(function(){
                  globalResolve();
                });
              });
            });
          });
        });
      });
    });
  }

  function getQueryCountForNew(store, localIds){
    return 'SELECT SUM(rows) as total_rows FROM (' +
      ' SELECT COUNT (*) as rows FROM products WHERE (shared = true AND current = true AND' +
      ` classification = 'de línea' AND child_id is NULL OR store_id = ${store.id}) ` +
      ` AND id NOT IN (${localIds.products}) UNION ALL` +
      ` SELECT COUNT (*) as rows FROM store_movements INNER JOIN products` +
      ' ON store_movements.product_id = products.id WHERE' +
      ` store_movements.store_id = ${store.id} AND products.child_id IS NULL` +
      " AND (store_movements.movement_type = 'alta automática'" +
      " OR store_movements.movement_type = 'baja automática')" +
      ` AND store_movements.id NOT IN (${localIds.storeMovements}) UNION ALL` +
      ` SELECT COUNT (*) as rows FROM services WHERE (shared = true AND current = true OR store_id = ${store.id})` +
      ` AND id NOT IN (${localIds.services}) ` +
    ') as u';
  }

  function lotQueriesForNew(store, localIds){
      return {
        'products' : 'SELECT * FROM products WHERE (shared = true AND current = true ' +
        `AND classification = 'de línea' AND child_id is NULL OR store_id = ${store.id}) ` +
        `AND id NOT IN (${localIds.products})`,
        'services' : 'SELECT * FROM services WHERE ' +
        `(shared = true AND current = true OR store_id = ${store.id})` +
        ` AND id NOT IN (${localIds.services})`,
        'store_movements': `SELECT store_movements.* FROM store_movements INNER JOIN products ` +
        'ON store_movements.product_id = products.id WHERE ' +
        `store_movements.store_id = ${store.id} AND products.child_id IS NULL ` +
        "AND (store_movements.movement_type = 'alta automática' " +
        "OR store_movements.movement_type = 'baja automática') " +
        `AND store_movements.id NOT IN (${localIds.storeMovements})`,
      };
    }

  function getLocalIds(){
    let localIds = {};
    return new Promise(function(resolve, reject){
      getAll('products', 'id').then(productsIdsResult => {
        localIds.products = $.map(productsIdsResult.rows, function(row){
          return row.id;
        });
        getAll('services', 'id').then(servicesIdsResult => {
          localIds.services = $.map(servicesIdsResult.rows, function(row){
            return row.id;
          });
          getAll('store_movements', 'id').then(storeMovmentsIdsResult => {
            localIds.storeMovements = $.map(storeMovmentsIdsResult.rows, function(row){
              return row.id;
            });
            resolve(localIds);
          })
        });
      });
    });
  }

  function createWareHouseEntry(insertData){
    return new Promise(function(resolve, reject){
      insert(
        Object.keys(insertData),
        Object.values(insertData),
        'stores_warehouse_entries'
      ).then(function(insertResult){
        findBy('product_id', insertData.product_id, 'stores_inventories')
          .then(function(storeInventoryObject){
            let inventory = storeInventoryObject.rows[0];
            updateBy(
              {
                quantity: (inventory.quantity + insertData.quantity)
              },
              'stores_inventories',
              `id = ${inventory.id}`
            ).then(function(storeInventyResult){
              resolve();
            });
          });
      });
    });
  }

  function geInformacionForNew(store){
    return new Promise(function(resolve, reject){
      getLocalIds().then(localIds => {
        query(getQueryCountForNew(store, localIds)).then(limitCount => {
          let count = 0;
          let limit = parseInt(limitCount.rows[0].total_rows);
          let newProductsIds = [];
          let queries = lotQueriesForNew(store, localIds);
          let storeMovementsPromises = [];
          if (limit === 0) {
            resolve();
          }
          for(var key in queries){
            query(queries[key], true, key).then(tablesResult => {
              tablesResult.rows.forEach(row => {
                if (tablesResult.table === 'products')
                  newProductsIds.push(row.id);
                if (tablesResult.table === 'store_movements')
                  storeMovementsPromises.push(createWareHouseEntry({
                    product_id: row.product_id,
                    quantity: row.quantity,
                    store_movement_id: row.id
                  }));
                createInsert(
                  Object.keys(row),
                  Object.values(row),
                  tablesResult.table
                ).then(localQuery => {
                  query(localQuery, false).then(() => {
                    count++;
                    if (count === limit){
                      getStoresInventories(newProductsIds, store).then(function(storesInventoriesRows){
                        count = 0;
                        limit = storesInventoriesRows.length;
                        if (limit === 0){
                          Promise.all(storeMovementsPromises).then(function(){
                            resolve();
                          });
                        } else {
                          storesInventoriesRows.forEach(row => {
                            createInsert(
                              Object.keys(row),
                              Object.values(row),
                              'stores_inventories'
                            ).then(localQuery => {
                              query(localQuery, false).then(() => {
                                count++;
                                if (count === limit){
                                  Promise.all(storeMovementsPromises).then(function(){
                                    resolve();
                                  });
                                }
                              })
                              .catch(function(err){
                                console.log(err);
                              })
                            })
                          });
                        }
                      });
                    }
                  })
                  .catch(function(err) {
                    console.log(err);
                  })
                });
              });
            });
          }
        });
      });
    });
  }

  (function (){
    initStore().then(store => {
      let storeInfo  = store.get('store'),
        localQuery = 'SELECT * FROM business_units WHERE ' +
        `id = ${storeInfo.business_unit_id}`;
        ids = [];
      query(localQuery, false).then(business_unit => {
        ids.push(business_unit.rows[0].billing_address_id);
        let localQuery = 'SELECT billing_address_id FROM prospects' +
          ` WHERE billing_address_id IS NOT NULL`;
        query(localQuery, false).then(prospects => {
          prospects.rows.forEach(row => {
            ids.push(row.billing_address_id);
          });
          let finalQuery = 'DELETE FROM billing_addresses' +
                           ` WHERE id NOT IN (${ids})`;
          query(finalQuery, false).then(() => {});
        });
      });
      findBy('store_id', storeInfo.id, 'cash_registers', false).then(cashRegisterObject => {
        cashRegisterObject.rows.forEach(cashRegister => {
          $('#register_open_cash_register option').remove();
          $('#register_open_cash_register').append(
            `  <option value="${cashRegister.name}"> Caja ${cashRegister.name} </option>`
          );
        });
      });
      query(getCashRegisterSum(), false).then(resultSum => {
        $('#register_open_initial_cash').val(
          `$ ${(resultSum.rows[0].sum || 0).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} `
        );
      });
    });
  })();

  $('#datetimepicker1 #datetimepicker2').datetimepicker({
    locale: 'es'
  });

  function updateCeroCostMovs(overprice, type){
    return {
      'costUpdateQuery'   : 'UPDATE store_movements SET web = false, cost = CASE ' +
          'WHEN no_cost_table.store_product = false ' +
          'THEN round((no_cost_table.price / (1 + (no_cost_table.overprice / 100) ) ' +
          `* (1 - (no_cost_table.${type} / 100)) )::numeric, 2) ` +
          'ELSE round(no_cost_table.product_cost::numeric, 2) ' +
          'END ' +
          'FROM ( ' +
          `SELECT store_movements.id, products.id AS product_id, products.cost AS product_cost, ${overprice} AS overprice, ` +
          'CASE WHEN products.store_id IS NOT null THEN true ELSE false ' +
          'END AS store_product,' +
          `products.price, products.${type}, ` +
          'store_movements.quantity, store_movements.cost, store_movements.total_cost ' +
          'FROM store_movements INNER JOIN products ON products.id = store_movements.product_id ' +
          'WHERE store_movements.cost = 0 OR store_movements.cost IS null' +
          ') no_cost_table ' +
          'WHERE store_movements.id = no_cost_table.id',
      'totalCostUpdateQuery' : 'UPDATE store_movements SET web = false, total_cost = CASE ' +
          'WHEN no_cost_table.store_product = false ' +
          'THEN round((no_cost_table.quantity * no_cost_table.cost)::numeric, 2) ' +
          'ELSE round((no_cost_table.quantity * no_cost_table.product_cost)::numeric, 2) ' +
          'END ' +
          'FROM ( ' +
          `SELECT store_movements.id, products.id AS product_id, products.cost AS product_cost, ${overprice} AS overprice, ` +
          'CASE WHEN products.store_id IS NOT null THEN true ELSE false ' +
          'END AS store_product,' +
          'products.price, ' +
          'store_movements.quantity, store_movements.cost, store_movements.total_cost ' +
          'FROM store_movements INNER JOIN products ON products.id = store_movements.product_id ' +
          'WHERE store_movements.total_cost = 0' +
          ') no_cost_table ' +
          'WHERE store_movements.id = no_cost_table.id; UPDATE store_movements SET web = true WHERE total_cost = 0;'
    };
  }

  function removeUnwantedDeliveriesQuery() {
    return 'DELETE FROM delivery_services WHERE id IN ' +
            '(SELECT id FROM delivery_services ' +
            'WHERE service_offered_id IS null ' +
            'AND id NOT IN ' +
            '(SELECT id FROM delivery_services ' +
            'WHERE web_id IS NOT null ORDER BY id ASC LIMIT 1))';
  }

  function runUpdateCeroCostMovs() {
    query("SELECT id, overprice, store_type_id FROM stores LIMIT 1", false).then(value => {
      var storeType = "";
      var overPrice = value.rows[0].overprice / 100;
      var store_type = value.rows[0].store_type_id;
      var myStoreId = value.rows[0].id;
      if (store_type == 1) {
        storeType = "discount_for_stores";
      } else if ((store_type == 4)) {
        storeType = "discount_for_franchises";
      }
      var costUpdateQueries = updateCeroCostMovs(overPrice, storeType);
      let unwantedDeliveries = removeUnwantedDeliveriesQuery();
      query(costUpdateQueries.costUpdateQuery, false).then(() => {
        query(costUpdateQueries.totalCostUpdateQuery, false).then(() => {
          query(unwantedDeliveries, false).then(() => {
            window.location.href = 'pos_sale.html';
          });
        });
      });
    });
  }

  function fixQueries(discount_type, overp) {
    return {
      'fixStoresInvs' : 'UPDATE stores_inventories SET quantity = new_table.sum, web = false ' +
                          'FROM (SELECT ' +
                            'product_id, ' +
                            'SUM (' +
                              "CASE WHEN movement_type = 'alta' THEN quantity " +
                                "WHEN movement_type = 'alta automática' THEN quantity " +
                                "WHEN movement_type = 'venta' THEN -quantity " +
                                "WHEN movement_type = 'devolución' THEN quantity " +
                                "WHEN movement_type = 'baja' THEN -quantity " +
                                "WHEN movement_type = 'baja automática' THEN -quantity " +
                                'ELSE 0 ' +
                              'END' +
                            ') '+
                          'FROM ' +
                            'store_movements ' +
                            'GROUP BY ' +
                            'product_id ' +
                            'ORDER BY ' +
                            'product_id) new_table ' +
                          'WHERE stores_inventories.product_id = new_table.product_id; ' +
                          // Esta parte puede no ser necesaria
                          'DELETE FROM stores_inventories ' +
                            'WHERE id IN (SELECT id ' +
                              'FROM (SELECT id, ' +
                                     'ROW_NUMBER() OVER (partition BY product_id, store_id, quantity ORDER BY id DESC) AS rnum ' +
                                     'FROM stores_inventories) t ' +
                                     'WHERE t.rnum > 1)',
      'fixStoreMovs' : 'SELECT * FROM ' +
                        '(SELECT stores_inventories.product_id, ' +
                        'products.price, ' +
                        `${overp} AS overprice, ` +
                        `COALESCE(products.${discount_type}, 0) / 100 AS discount, ` +
                        'CASE WHEN products.store_id IS NOT null THEN true ELSE false ' +
                        'END AS store_product, ' +
                        'products.supplier_id, ' +
                        'stores_inventories.store_id AS store_id, ' +
                        'stores_inventories.quantity ' +
                        'FROM stores_inventories LEFT JOIN products ON stores_inventories.product_id = products.id ' +
                        'WHERE quantity < 0) made_up_table',
      'fixStoresWarehouses' : 'SELECT * FROM ' +
                              '(SELECT stores_inventories.product_id, stores_inventories.store_id, ' +
                              'stores_inventories.quantity AS quantity, COALESCE(results_table.sum,0) AS sum ' +
                              'FROM stores_inventories LEFT JOIN (SELECT stores_warehouse_entries.product_id, ' +
                              'COALESCE(SUM(quantity),0) AS sum FROM stores_warehouse_entries ' +
                              'GROUP BY product_id) AS results_table ' +
                              'ON stores_inventories.product_id = results_table.product_id ' +
                              'ORDER BY product_id) AS final_table ' +
                              'WHERE final_table.sum != final_table.quantity'
    }
  }

  function runFixingQueries() {
    let updatePendings = "UPDATE store_movements SET movement_type = 'pending', web = false " +
                          "WHERE ticket_id IN (SELECT id FROM tickets " +
                          "WHERE ticket_type = 'pending' AND web_id IS null); UPDATE service_offereds " +
                          "SET service_type = 'pending', web = false WHERE ticket_id IN " +
                          "(SELECT id FROM tickets WHERE ticket_type = 'pending' AND web_id IS null); " +
                          "UPDATE tickets SET web = false WHERE ticket_type = 'pending' AND web_id IS null";
    query("SELECT id, overprice, store_type_id FROM stores LIMIT 1", false).then(myStore => {
      var disc = "";
      var overPrice = myStore.rows[0].overprice / 100;
      var store_type = myStore.rows[0].store_type_id;
      var storeId = myStore.rows[0].id;
      if (store_type == 1) {
        disc = "discount_for_stores";
      } else if ((store_type == 4)) {
        disc = "discount_for_franchises";
      }
      query(updatePendings, false).then(() => {
        let fixQueriesArray = fixQueries(disc, overPrice);
        query(fixQueriesArray.fixStoresInvs, false).then(() => {
          fixinventories(fixQueriesArray);
        });
      });
    });
  }

  function fixinventories(queryArray) {
    query('SELECT MAX(id) AS max_id FROM store_movements', false).then(maxIdMovs => {
      let nextIdMov = maxIdMovs.rows[0].max_id;
      let fixInvQuery = '';
      query(queryArray.fixStoreMovs, false).then(movForFix => {
        if (movForFix.rows.length > 0) {
          movForFix.rows.forEach(function(movToFix){
            nextIdMov += 1;
            let newMov = Object.assign(movToFix);
            newMov.id = nextIdMov;
            newMov.quantity = -movToFix.quantity;
            newMov.movement_type = "'alta'";
            newMov.initial_price = newMov.price;
            newMov.pos = true;
            newMov.web = false;
            newMov.pos_id = null;
            newMov.web_id = null;
            newMov.reason = "'ajuste del sistema'";
            let manualCost = Math.round((newMov.price / (1 + newMov.overprice) * (1 - newMov.discount) ) * 100) / 100;
            let discount_app = Math.round((newMov.price * (1 - newMov.discount) ) * newMov.quantity * 100) / 100;
            newMov.automatic_discount = discount_app;
            newMov.discount_applied = discount_app;
            newMov.final_price = Math.round(newMov.price * (1 - newMov.discount)) / 100;
            newMov.cost = manualCost;
            newMov.total_cost = Math.round(manualCost * newMov.quantity * 100) / 100;
            let date_mov = Date().toString().replace(/GMT.*/,'');
            newMov.created_at = `'${date_mov}'`;
            newMov.updated_at = `'${date_mov}'`;
            ['store_product', 'discount', 'overprice', 'price'].forEach(field => {
              delete newMov[field];
            });
            var invQuotes = Object.keys(newMov).map(value => `"${value}"`).join(',');
            fixInvQuery += `INSERT INTO store_movements (${invQuotes}) VALUES (${Object.values(newMov)}); `
            .replace(/,,/g,',null,').replace(/,,/g,',null,');
          });
          query(fixInvQuery, false).then(() => {
            query(queryArray.fixStoresInvs, false).then(() => {
              fixWarehouses(queryArray.fixStoresWarehouses);
            });
          });
        } else {
          fixWarehouses(queryArray.fixStoresWarehouses);
        }
      });
    });
  }

  function fixWarehouses(queryArray){
    let fixWarehouseQuery = '';
    query('SELECT MAX(id) AS max_id FROM stores_warehouse_entries', false).then(maxIdWarehouse => {
      let nextIdWarehouse = maxIdWarehouse.rows[0].max_id;
      query(queryArray, false).then(warehousesForFix => {
        warehousesForFix.rows.forEach(function(warehouseToFix){
          fixWarehouseQuery += `DELETE FROM stores_warehouse_entries WHERE product_id = ${warehouseToFix.product_id} AND store_id = ${warehouseToFix.store_id}; `;
          console.log(`deleted all rows from product ${warehouseToFix.product_id}`);
          nextIdWarehouse += 1;
          let newWarehouse = Object.assign(warehouseToFix);
          newWarehouse.id = nextIdWarehouse;
          newWarehouse.pos = true;
          newWarehouse.web = false;
          newWarehouse.pos_id = null;
          newWarehouse.web_id = null;
          var date_warehouse = Date().toString().replace(/GMT.*/,'');
          newWarehouse.created_at = `'${date_warehouse}'`;
          newWarehouse.updated_at = `'${date_warehouse}'`;
          delete warehouseToFix['sum'];
          let warehouseQuotes = Object.keys(newWarehouse).map(value => `"${value}"`).join(',');
          let myWarehouseQuery = `INSERT INTO stores_warehouse_entries (${warehouseQuotes}) VALUES (${Object.values(newWarehouse)}); `
          .replace(/,,/g,',null,').replace(/,,/g,',null,');
          fixWarehouseQuery += myWarehouseQuery;
          console.log(`created a query to update warehouse from product ${newWarehouse.product_id}`);
        });
        query(fixWarehouseQuery, false).then(() => {
          runUpdateCeroCostMovs();
        });
      });
    });
  }

  $('#openCash').click(function(){
    $(this).prop('disabled', true);
    initStore().then(store => {
      store.set('cash', $('#register_open_cash_register').val());
      alert('Actualizando base de datos, por favor espere un momento');
      getUpdatedInformacion(store.get('store')).then(function(){
        geInformacionForNew(store.get('store')).then(function(){
          runFixingQueries();
        });
      })
    });
    return false;
  });

});
