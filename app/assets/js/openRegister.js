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

  function getTranslateRelations(){
    return {
      'billing_addresses_id' : 'billing_address_id',
      'users_id'             : 'user_id',
      'prospects_id'         : 'prospect_id',
      'cash_registers_id'    : 'cash_register_id',
      'parents_id'           : 'parent_id',
      'tickets_id'           : 'ticket_id',
      'childrens_id'         : 'children_id',
      'banks_id'             : 'bank_id',
      'terminals_id'         : 'terminal_id',
      'store_movements_id'   : 'store_movement_id',
      'service_offereds_id'  : 'service_offered_id'
    };
  }

  function getRelationObjectDetails(){
    return {

      'prospects' : {
        'billing_addresses_id' : {},
      },

      'tickets' : {
        'users_id': {},
        'prospects_id' : {},
        'cash_registers_id' : {},
        'parents_id' : {},
      },

      'tickets_children' : {
        'tickets_id' : {},
        'childrens_id' : {}
      },

      'terminals' : {
        'banks_id' : {},
      },

      'payments' : {
        'users_id' : {},
        'terminals_id' : {},
        'tickets_id' : {},
        'banks_id' : {},
      },

      'store_movements': {
        'tickets_id' : {}
      },

      'stores_warehouse_entries' : {
        'store_movements_id' : {}
      },

      service_offereds : {
        'tickets_id' : {}
      },

      'delivery_services' : {
        'service_offereds_id' : {}
      },

      'expenses' : {
        'users_id' : {}
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

  function findRelations(){
    return {
      'billing_addresses'        : ['business_name', 'rfc', 'created_at'],
      'users'                    : ['email'],
      'prospects'                : ['legal_or_business_name', 'created_at', 'store_id'],
      'cash_registers'           : ['name', 'created_at', 'store_id'],
      'tickets'                  : ['ticket_number', 'created_at', 'cash_register_id', 'store_id'],
      'tickets_children'         : ['ticket_id', 'children_id', 'created_at'],
      'banks'                    : ['name', 'rfc', 'created_at'],
      'store_movements'          : ['product_id', 'created_at', 'ticket_id', 'quantity', 'store_id'],
      'service_offereds'         : ['service_id', 'created_at', 'ticket_id', 'quantity', 'store_id'],
      'delivery_services'        : ['service_offered_id', 'created_at', 'sender_name', 'sender_zipcode'],
      'stores_inventories'       : ['product_id', 'store_id', 'created_at'],
      'stores_warehouse_entries' : ['product_id', 'store_id', 'created_at', 'store_movement_id'],
      'terminals'                : ['name', 'store_id', 'created_at'],
      'payments'                 : ['business_unit_id', 'payment_form_id', 'terminal_id', 'ticket_id', 'created_at'],
      'expenses'                 : ['total', 'store_id', 'business_unit_id', 'created_at']
    };
  }

  $('#openCash').click(function(){

    initStore().then(store => {
      store.set('cash', $('#register_open_cash_register').val());
      $('#pos').click();
      return false;
    });

  });

  function updatedRelationIds(table, mainKey, key, translateRelations, call){
    const objectId    = sendObjects[
                              table
                            ][
                              mainKey
                            ].object[
                              translateRelations[
                                key
                              ]
                            ],
          objectTable = key.replace('_id', '');

    if (objectId !== null) {
      try{
        sendObjects[
          table
        ][
          mainKey
        ].object[
          translateRelations[
            key
          ]
        ] = tablesData[objectTable][objectId].inWeb;
        return call();
      } catch (err) {

        findBy(
          'id',
          objectId,
          objectTable,
          false,
          objectId,
          mainKey,
          table
        ).then(objectCollection => {
          let object = objectCollection.objectResult;
          parameters = {};
          row = object.rows[0];
          localTable = object.table;

          findRelations()[object.table].forEach(field => {
            parameters[field] = row[field];
          });

          findByParameters(
            object.table,
            parameters,
            object.lastId,
            objectCollection.referenceId,
            objectCollection.referenceTable
          ).then(
            result => {

              let translateRelations = getTranslateRelations();
              sendObjects[
                result.referenceTable
              ][
                result.referenceId
              ].object[
                translateRelations[`${result.objectResult.table}_id`]
              ] = result.objectResult.rows[0].id;
              return call();

            });

        });
      }
    }
  }

  function processInsertInWeb(row, table, mainKey, call){
    row.web = true;

    if (table === 'users') {
      row.email = `user_pos${row.email}`;
    }

    createInsert(
      Object.keys(row),
      Object.values(row),
      table,
      mainKey
    ).then(remoteQueryObject => {
      insertInWeb(
        remoteQueryObject.query,
        table,
        remoteQueryObject.storeId
      ).then(resultInsert => {

        tablesData[
          resultInsert.table
        ][
          resultInsert.storeId
        ].inWeb = resultInsert.lastId;

        sendObjects[resultInsert.table].processRow++;

        return call();

      });

    });

  }

  function processTableToWeb(table, call){

    if (sendObjects[table].rowsLimit === 0){
      return call();
    }

    sendObjects[table].processRow = 0;
    let translateRelations = getTranslateRelations();

    for (var mainKey in tablesData[table]){
      if (relationObjectDetails[table]) {
        for (var key in relationObjectDetails[
          table
        ]) {
          updatedRelationIds(table, mainKey, key, translateRelations, function(){
            let row = sendObjects[table][mainKey].object;
            delete row.id;

            processInsertInWeb(row, table, mainKey, function(){
              if (
                sendObjects[
                  table
                ].processRow === sendObjects[
                  table
                ].rowsLimit
              ) {
                return call();
              }
            });

          });
        }
      } else {
        let row = sendObjects[table][mainKey].object;
        delete row.id;

        processInsertInWeb(row, table, mainKey, function(){
          if (
            sendObjects[
              table
            ].processRow === sendObjects[
              table
            ].rowsLimit
          ) {
            return call();
          }
        });
      }

    }
  }

  $('#closeDay').click(function(event){
    createStoreObjectsLot(function(){

      processTableToWeb('users', function(){

        processTableToWeb('billing_addresses', function(){

          processTableToWeb('prospects', function(){

            processTableToWeb('cash_registers', function(){

              processTableToWeb('tickets', function(){

                processTableToWeb('tickets_children', function(){

                  processTableToWeb('terminals', function(){

                    processTableToWeb('payments', function(){

                      processTableToWeb('store_movements', function(){

                        processTableToWeb('stores_warehouse_entries', function(){

                          processTableToWeb('stores_inventories', function(){

                            processTableToWeb('service_offereds', function(){

                              processTableToWeb('delivery_services', function(){

                                processTableToWeb('expenses', function(){
                                  alert('Proceso terminado correctamente');
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
