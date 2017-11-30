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

    rowsLot.forEach(row => {

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

    lotTables.forEach(table => {
      getToTransfer(table).then(transferRows => {

        sendObjects[table] = {
          rowsLimit  : transferRows.rowCount,
          processRow : 0
        };

        iterateRows(transferRows.rows, transferRows.table, function(){
          count++;
          if (count === limit){
            return call();
          }
        });

      });
    });
  }

  function toWebDatabaseCreateObjects(call){
    query(getQueryCount()).then(result => {
      limit = result.rows[0].total_rows;
      count = 0;
      relationObjectDetails      = getRelationObjectDetails();
      relationIdsNamesCollection = getRelationIdsNamesCollection();
      tablesData                 = {};

      lotTables().forEach(table => {
        getToTransfer(table).then(transferRows => {
          tablesData[transferRows.table] = {};

          transferRows.rows.forEach(row => {

            if (relationObjectDetails[transferRows.table]) {

              for (var key in relationObjectDetails[
                transferRows.table
              ]) {
                relationObjectDetails[
                  transferRows.table
                ][key][row[key]] = {
                  'inStore' : row[key],
                };
              }

            }

            tablesData[transferRows.table][row.id] = {
              'inStore' : row.id
            };

            createInsert(
              Object.keys(row),
              Object.values(row),
              transferRows.table,
              row.id
            ).then(remoteQueryObject => {

              tablesData[remoteQueryObject.table][
                remoteQueryObject.storeId
              ].inWeb = remoteQueryObject.lastId;
              tablesData[remoteQueryObject.table][
                remoteQueryObject.storeId
              ].query = remoteQueryObject.query;

              remoteObject = remoteQueryObject;

              count++;
              console.log(count);
              if (count === limit - 1){
                return call();
              }

            });

          });

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

  $('#openCash').click(function(){

    initStore().then(store => {
      store.set('cash', $('#register_open_cash_register').val());
      $('#pos').click();
      return false;
    });

  });

  $('#closeDay').click(function(event){
    createStoreObjectsLot(function(){
      debugger
    });

    return false;
  });
});
