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

  function iterateRows(rowsLot, table, call){
    if (rowsLot.length === 0) {
      return call();
    }

    rowsLot.forEach(row => {
      let objectId = row.id;
      delete row.id;

      if (table === 'users'){
        row.email = `pos_${row.email}`
      }

      sendObjects[table][objectId] = {
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

  function updateWebBan(){
    for (var tableName in sendObjects){
      delete sendObjects[tableName].rowsLimit;
      delete sendObjects[tableName].processRow;

      for (var objectId in sendObjects[tableName]){
        updatePosData(tableName, objectId).then(() => {});
      }
    }
  }

  $('#closeDay').click(function(){

    createStoreObjectsLot(function(){

      initStore().then(storage => {
        let bcrypt = require('bcryptjs'),
            salt = bcrypt.genSaltSync(10),
            installCode = bcrypt.hashSync(
              storage.get('store').install_code,
              salt
            );

        sendObjects.installCode = installCode;
        sendObjects.storeId     = storage.get('store').id;

        let Client = require('node-rest-client').Client,
          client = new Client(),
          args = {
            data: sendObjects,
            headers: { "Content-Type": "application/json" }
          };

        client.post("http://localhost:3000/pos/received_data", args, function (data, response) {
          delete sendObjects.installCode;
          delete sendObjects.storeId;

          updateWebBan();
          alert(data.message);
        });

      });

    });

    return false;
  });

});
