$(document).ready(function() {

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

  function getTranslateLotTables(){
    return {
      'users' : 'user',
      'billing_addresses' : 'billing_address',
      'prospects' : 'prospect',
      'cash_registers' : 'cash_register',
      'tickets' : 'ticket',
      'tickets_children' : 'tickets_child',
      'terminals' : 'terminal',
      'payments' : 'payment',
      'store_movements' : 'store_movement',
      'stores_warehouse_entries' : 'stores_warehouse_entry',
      'stores_inventories' : 'stores_inventory',
      'service_offereds' : 'service_offered',
      'delivery_services' : 'delivery_service',
      'expenses' : 'expense'
    };
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

  function fillSpecialIds(idsCollection){
    tableNames = getTranslateLotTables();

    for (var tableName in sendObjects){
      delete sendObjects[tableName].rowsLimit;
      delete sendObjects[tableName].processRow;

      for (var posId in sendObjects[tableName]){
        insertWebPosIds(
          tableName,
          posId,
          idsCollection[
            tableNames[tableName]
          ][parseInt(posId)]
        ).then(() => {})
      }
    }

  }

  $('#closeDay').click(function(){
    $(this).prop( "disabled", true );
    alert('Proceso de carga iniciado');
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
        client.post("http://34.214.130.203/pos/received_data", args, function (data, response) {
          delete sendObjects.installCode;
          delete sendObjects.storeId;

          updateWebBan();
          fillSpecialIds(data.ids);
          alert(data.message);
        });

      });

    });

    return false;
  });

/* Métodos para tabla de cierres*/

  $("#sales-hide").click(function () {
    $(this).addClass('hidden');
    $('#sales-show').removeClass('hidden');
    $('.sales-hide').addClass('hidden');
  });

  $("#sales-show").click(function () {
    $(this).addClass('hidden');
    $('#sales-hide').removeClass('hidden');
    $('.sales-hide').removeClass('hidden');
  });

  $("#payment-hide").click(function () {
    $(this).addClass('hidden');
    $('#payment-show').removeClass('hidden');
    $('.payment-hide').addClass('hidden');
  });

  $("#payment-show").click(function () {
    $(this).addClass('hidden');
    $('#payment-hide').removeClass('hidden');
    $('.payment-hide').removeClass('hidden');
  });

});
