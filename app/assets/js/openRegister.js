$(function(){
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

  function getLotTables(){
    return [
      'users',
      'billing_addresses',
      'prospects',
      'cash_registers',
      'tickets',
      'tickets_children',
      'terminals',
      'payments',
      'store_movements',
      'stores_warehouse_entries',
      'stores_inventories',
      'service_offereds',
      'delivery_services',
      'expenses'
    ];
  }

  function getRelationIdsNamesCollection(){
    return [
      'billing_address_id',
      'user_id',
      'prospect_id',
      'cash_register_id',
      'parent_id',
      'ticket_id',
      'children_id',
      'bank_id',
      'terminal_id',
      'store_movement_id',
      'service_offered_id'
    ];
  }

  function getRelationObjectDetails(){
    return {

      'prospects' : {
        'billing_address_id' : {},
      },

      'tickets' : {
        'user_id': {},
        'prospect_id' : {},
        'cash_register_id' : {},
        'parent_id' : {},
      },

      'tickets_children' : {
        'ticket_id' : {},
        'children_id' : {}
      },

      'terminals' : {
        'bank_id' : {},
      },

      'payments' : {
        'user_id' : {},
        'terminal_id' : {},
        'ticket_id' : {},
        'bank_id' : {},
      },

      'store_movements': {
        'ticket_id' : {}
      },

      'stores_warehouse_entries' : {
        'store_movement_id' : {}
      },

      service_offereds : {
        'ticket_id' : {}
      },

      'delivery_services' : {
        'service_offered_id' : {}
      },

      'expenses' : {
        'user_id' : {}
      }
    };
  }

  function iterateRows(rowsLot, table, call){
    if (rowsLot.length === 0) {
      return call();
    }
    tablesData[table] = {};

    rowsLot.forEach(row => {
      if (relationObjectDetails[table]) {

        for (var key in relationObjectDetails[
          table
        ]) {
          relationObjectDetails[
            table
          ][key][row[key]] = {
            'inStore' : row[key],
          };
        }

      }

      tablesData[table][row.id] = {
        'inStore' : row.id
      };

      sendObjects[table][row.id] = {
        object : row
      };

      sendObjects[table].processRow++;
      if (
        sendObjects[
          table
        ].processRow === sendObjects[
          table
        ].rowsLimit){
        return call();
      }

    });

  }

  function createStoreObjectsLot(call){
    let lotTables = getLotTables();
    sendObjects = {};
    limit = lotTables.length;
    count = 0;
    limitRows = 0;
    relationObjectDetails      = getRelationObjectDetails();
    relationIdsNamesCollection = getRelationIdsNamesCollection();
    tablesData                 = {};

    lotTables.forEach(table => {
      getToTransfer(table).then(transferRows => {

        sendObjects[table] = {
          rowsLimit  : transferRows.rowCount,
          processRow : 0
        };

        limitRows += transferRows.rowCount;
        iterateRows(transferRows.rows, transferRows.table, function(){
          count++;
          if (count === limit){
            return call();
          }
        });

      });
    });
  }

  function createInsertsQueries(call){
    count = 0;
    limit = limitRows;

    getLotTables().forEach(table => {
      delete sendObjects[table].processRow;
      delete sendObjects[table].rowsLimit;

      for (var key in sendObjects[table]){
        let row = sendObjects[table][key].object;

        delete row.id;

        createInsert(
          Object.keys(row),
          Object.values(row),
          table,
          key
        ).then(remoteQueryObject => {

          tablesData[remoteQueryObject.table][
            remoteQueryObject.storeId
          ].inWeb = remoteQueryObject.lastId;
          tablesData[remoteQueryObject.table][
            remoteQueryObject.storeId
          ].query = remoteQueryObject.query;

          remoteObject = remoteQueryObject;

          count++;
          if (count === limit){
            return call();
          }

        });

      }

    });
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

    });
  })();

  $('#datetimepicker1 #datetimepicker2').datetimepicker({
    locale: 'es'
  });

  $('#openCash').click(function(){

    initStore().then(store => {
      store.set('cash', $('#register_open_cash_register').val());
      $('#pos').click();
      return false;
    });

  });

  function processTableToWeb(table, call){
    if (sendObjects[table].rowsLimit === 0){
      return call();
    }

    for (var key in tablesData[table]){
      insertInWeb(
        tablesData[table][key].query,
        table,
        key
      ).then(resultInsert => {
        tablesData[
          resultInsert.table
        ][
          resultInsert.storeId
        ].inWeb = resultInsert.lastId;

        sendObjects[resultInsert.table].processRow++;

        if (
        sendObjects[
          resultInsert.table
        ].processRow === sendObjects[
          resultInsert.table
        ].rowsLimit
        ) {
          return call();
        }
      });
    }
  }

  $('#closeDay').click(function(event){
    createStoreObjectsLot(function(){
      createInsertsQueries(function(){

        sendObjects.users = {
          rowsLimit  : Object.keys(tablesData.users).length,
          processRow : 0
        };

        processTableToWeb('users', function(){

          try {
            sendObjects.billing_addresses = {
              rowsLimit  : Object.keys(
                tablesData.billing_addresses
              ).length,
              processRow : 0
            };
          } catch (err) {
            sendObjects.billing_addresses = {
              rowsLimit  : 0,
              processRow : 0
            };
          }

          processTableToWeb('billing_addresses', function(){

            sendObjects.prospects = {
              rowsLimit  : Object.keys(
                tablesData.prospects
              ).length,
              processRow : 0
            };

            processTableToWeb('prospects', function(){

              try {
                sendObjects.cash_registers = {
                  rowsLimit  : Object.keys(
                    tablesData.cash_registers
                  ).length,
                  processRow : 0
                };
              } catch (err) {
                sendObjects.cash_registers = {
                  rowsLimit  : 0,
                  processRow : 0
                };
              }

              processTableToWeb('cash_registers', function(){

                sendObjects.tickets = {
                  rowsLimit  : Object.keys(
                    tablesData.tickets
                  ).length,
                  processRow : 0
                };

                processTableToWeb('tickets', function(){

                  sendObjects.tickets_children = {
                    rowsLimit  : Object.keys(
                      tablesData.tickets_children
                    ).length,
                    processRow : 0
                  };

                  processTableToWeb('tickets_children', function(){

                    sendObjects.terminals = {
                      rowsLimit  : Object.keys(
                        tablesData.terminals
                      ).length,
                      processRow : 0
                    };

                    processTableToWeb('terminals', function(){

                      sendObjects.payments = {
                        rowsLimit  : Object.keys(
                          tablesData.payments
                        ).length,
                        processRow : 0
                      };

                      processTableToWeb('payments', function(){

                        sendObjects.store_movements = {
                          rowsLimit  : Object.keys(
                            tablesData.store_movements
                          ).length,
                          processRow : 0
                        };

                        processTableToWeb('store_movements', function(){

                          sendObjects.stores_warehouse_entries = {
                            rowsLimit  : Object.keys(
                              tablesData.stores_warehouse_entries
                            ).length,
                            processRow : 0
                          };

                          processTableToWeb('stores_warehouse_entries', function(){

                            sendObjects.stores_inventories = {
                              rowsLimit  : Object.keys(
                                tablesData.stores_inventories
                              ).length,
                              processRow : 0
                            };

                            processTableToWeb('stores_inventories', function(){

                              sendObjects.service_offereds = {
                                rowsLimit  : Object.keys(
                                  tablesData.service_offereds
                                ).length,
                                processRow : 0
                              };

                              processTableToWeb('service_offereds', function(){

                                sendObjects.delivery_services = {
                                  rowsLimit  : Object.keys(
                                    tablesData.delivery_services
                                  ).length,
                                  processRow : 0
                                };

                                processTableToWeb('delivery_services', function(){

                                  sendObjects.expenses = {
                                    rowsLimit  : Object.keys(
                                      tablesData.expenses
                                    ).length,
                                    processRow : 0
                                  };

                                  processTableToWeb('expenses', function(){
                                    debugger
                                  });

                                });

                              });

                            });

                          });

                        });

                      });

                    });

                  });

                });

              });

            });

          });

        });

      });
    });

    return false;
  });
});
