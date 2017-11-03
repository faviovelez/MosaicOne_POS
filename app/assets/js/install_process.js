$(function(){

  function cloneAlert(){
    let alerts = $('.alert').length + 1;
    $('.alerts-container').prepend(
      `<div class="alert" id="alertNo_${alerts}" hidden>` +
      `${$('.alert').html()} </div>`
    );
    return $('.alert:first').attr('id');
  }

  function showAlert(type, message, alertId){
    $(`#${alertId} span.title`).html(`${type}: ${message}`);
    $(`#${alertId}`)
      .show()
      .addClass('alert-danger')
      .removeClass('hidden');
  }

  function lotQueries(store){
    return {
      'stores' : "SELECT * FROM stores " +
      `WHERE id=${store.id}`,
      'roles' : "SELECT * FROM roles " +
      "WHERE name IN ('store', 'store-admin')",
      'delivery_addresses': 'SELECT * FROM delivery_addresses WHERE ' +
      `id = ${store.delivery_address_id}`,
      'business_units': 'SELECT * FROM business_units WHERE ' +
      `id = ${store.business_unit_id}`,
      'store_types':  'SELECT * FROM store_types WHERE ' +
      `id = ${store.store_type_id}`,
      'cost_types':   'SELECT * FROM cost_types WHERE ' +
      `id = ${store.cost_type_id}`,
      'business_groups': 'SELECT * FROM business_groups WHERE ' +
      `id = ${store.business_group_id}`,
      'prospects': 'SELECT * FROM prospects WHERE ' +
      `store_id = ${store.id}`,
      'products' : 'SELECT * FROM products WHERE supplier_id IN (1,2)',
      'services' : 'SELECT * FROM services WHERE ' +
      'store_id IS NULL AND shared = true',
      'stores_inventories': 'SELECT * FROM stores_inventories ' +
      `WHERE store_id = ${store.id}`,
      'stores_warehouse_entries': 'SELECT * FROM stores_warehouse_entries ' +
      `WHERE store_id = ${store.id}`,
      'store_movements': 'SELECT * FROM store_movements ' +
      `WHERE store_id = ${store.id}`,
      'cash_registers': 'SELECT * FROM cash_registers ' +
      `WHERE store_id = ${store.id}`,
      'cfdi_uses': 'SELECT * FROM cfdi_uses',
      'banks':    'SELECT * FROM banks'
    };
  }

  function cloneAllTables(queries, call){

    query(queries.business_units).then(mainResult => {
      queries.billing_addresses = 'SELECT * FROM billing_addresses ' +
                 `WHERE id = ${mainResult.rows[0].billing_address_id}`;
      queriesTest = [];
      count = 0;
      limit = 0;
      for(var key in queries){

        query(queries[key], true, key).then(tablesResult => {
          limit += tablesResult.rows.length;

          tablesResult.rows.forEach(row => {

            createInsert(
              Object.keys(row),
              Object.values(row),
              tablesResult.table
            ).then(localQuery => {

              query(localQuery, false).then(result => {
                if (count++ === limit-1){
                  call();
                }
              });

            });
          });
        });

      }
    });
  }

  $('#validateInstall').click(function(){
    $(this).prop('disabled', false);
    let script = `psql -U ${process.env.DB_LOCAL_USER} ${process.env.DB_LOCAL_DB} ` +
      `< ./tmp_files/${process.env.DB_FILE_NAME}`;
    showAlert('Info', 'Proceso de replicación de base de datos iniciado', cloneAlert());
    exec = require('child_process').exec;

    dbRestore = exec(script,
      function(err, stdout, stderr) {
        if(err){
          showAlert('Error', stderr, cloneAlert());
        }
      });

    dbRestore.on('exit', function (code) {
      let installCode = $('#installCodeId').val();

      if (code ===0){

        findBy('install_code', installCode, 'stores').then(result => {
          let store = result.rows[0];

          if (store) {
            cloneAllTables(lotQueries(result.rows[0]), function(){
              window.location.href = 'sign_up.html';
            });
          } else {
            showAlert('Error', 'Revisa que el código ingresado sea válido', cloneAlert());
          }
        }, err => {
          if(err){
            showAlert('Error', err, cloneAlert());
          }
        });

      }

    });

    return false;
  });

});
