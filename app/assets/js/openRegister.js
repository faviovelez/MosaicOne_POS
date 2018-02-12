$(function(){

  function getCashRegisterSum(){
  return 'SELECT (SUM((SELECT COALESCE(SUM(deposits.amount),0) as d FROM deposits)) ' +
      '- SUM((SELECT COALESCE(SUM(withdrawals.amount),0) as w FROM withdrawals)) + ' +
      'SUM((SELECT (COALESCE(SUM(payments.total),0)) as s ' +
      'FROM payments INNER JOIN tickets ON tickets.id = payments.ticket_id ' +
      "WHERE payment_type = 'pago' AND payment_form_id = 1 AND ticket_type = 'venta'))) as sum";
  }
  const remote = require('electron').remote;

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
      ` SELECT COUNT (*) as rows FROM services WHERE (shared = true AND current = true OR store_id = ${store.id})` +
    ') as u';
  }

  function getStoresInventories(ids, store){
    return new Promise(function(resolve, reject){
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
        `(shared = true AND current = true OR store_id = ${store.id}) ORDER BY id`
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

  function createRemoteArray(localQuery, type){
    return new Promise(function(resolve, reject){
      let Promise = require("bluebird");
      let table = type;
      let promises = [];

      query(localQuery).then(remoteObjects => {

        Promise.each(remoteObjects.rows, function(row){

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
            debugger
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

  function getProductsAndServices(store){
    let promises = [];
    let Promise = require("bluebird");
    return new Promise(function(globalResolve, globalReject){
      query(getQueryCount(store)).then(limitCount => {
        let jsonQueries = lotQueries(store);

        for (var type in jsonQueries) {
          promises.push(createLocalArray(jsonQueries[type], type));
          promises.push(createRemoteArray(jsonQueries[type], type));
        }

        Promise.all(promises).then(function(returnArray){
          let localProducts = returnArray[0];
          let remoteProducts = returnArray[1];
          let localServices = returnArray[2];
          let remoteServices = returnArray[3];
          let promisesArray = [];

          promisesArray.push(getProcessIds(localProducts, remoteProducts));
          promisesArray.push(getProcessIds(localServices, remoteServices));

          Promise.all(promisesArray).then(function(validProcessIds){
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
                globalResolve();
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
        ` AND id NOT IN (${localIds.services})`
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
          resolve(localIds);
        });
      });
    });
  }

  function getProductsAndServicesForNew(store){
    return new Promise(function(resolve, reject){
      getLocalIds().then(localIds => {
        query(getQueryCountForNew(store, localIds)).then(limitCount => {
          let count = 0;
          let limit = parseInt(limitCount.rows[0].total_rows);
          let newProductsIds = [];
          let queries = lotQueriesForNew(store, localIds);
          if (limit === 0) {
            resolve();
          }
          for(var key in queries){
            query(queries[key], true, key).then(tablesResult => {

              tablesResult.rows.forEach(row => {
                if (tablesResult.table === 'products')
                  newProductsIds.push(row.id);

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

                        storesInventoriesRows.forEach(row => {
                          createInsert(
                            Object.keys(row),
                            Object.values(row),
                            'stores_inventories'
                          ).then(localQuery => {
                            query(localQuery, false).then(() => {
                              count++;
                              if (count === limit){
                                resolve();
                              }
                            })
                            .catch(function(err){
                              console.log(err);
                            })
                          })
                        });
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
      getProductsAndServices(store.get('store')).then(function(){
        getProductsAndServicesForNew(store.get('store')).then(function(){
          window.location.href = 'pos_sale.html';
        });
      })
    });

    return false;
  });

});
