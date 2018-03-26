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
            let newPrice = row.price * ( 1 + (storeObject.overprice / 100) );
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
        let newPrice = product.price * ( 1 + (storeObject.overprice / 100) );

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
      ` SELECT COUNT (*) as rows FROM store_movements INNER JOIN products ` +
      'ON store_movements.product_id = products.id WHERE' +
      ` store_movements.store_id = ${store.id} AND products.child_id IS NULL` +
      ` AND store_movements.id NOT IN (${localIds.storeMovements}) UNION ALL` +
      ` SELECT COUNT (*) as rows FROM services WHERE (shared = true AND current = true OR store_id = ${store.id})` +
      ` AND id NOT IN (${localIds.services}) ` +
    ') as u';
  }

  function lotQueriesForNew(store, localIds){
      return {
        'products' : 'SELECT * FROM products WHERE (shared = true AND current = true ' +
        `AND classification = 'de línea' AND child_id is NULL OR store_id = ${store.id})` +
        ` AND id NOT IN (${localIds.products})`,
        'services' : 'SELECT * FROM services WHERE ' +
        `(shared = true AND current = true OR store_id = ${store.id})` +
        ` AND id NOT IN (${localIds.services})`,
        'store_movements': `SELECT store_movements.* FROM store_movements INNER JOIN products ` +
        'ON store_movements.product_id = products.id WHERE' +
        ` store_movements.store_id = ${store.id} AND products.child_id IS NULL ` +
        ` AND store_movements.id NOT IN (${localIds.storeMovements})`,
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

  $('#openCash').click(function(){
    $(this).prop('disabled', true);

    initStore().then(store => {
      store.set('cash', $('#register_open_cash_register').val());
      alert('Actualizando base de datos, por favor espere un momento');
      getUpdatedInformacion(store.get('store')).then(function(){
        geInformacionForNew(store.get('store')).then(function(){
          window.location.href = 'pos_sale.html';
        });
      })
    });

    return false;
  });

});
