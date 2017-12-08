$(function(){
  async function initStore(){

    const store = new Store({
      configName: 'user-localStore',
      defaults: {
        windowBounds: { width: 1024, height: 768 }
      }
    });

    return store;
  }

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

  function storesColumns(){
    return "id, created_at, updated_at, store_code, store_name" +
    ", delivery_address_id, business_unit_id, store_type_id" +
    ", email, cost_type_id, cost_type_selected_since, months_in_inventory"+
    ", reorder_point, critical_point, contact_first_name, contact_middle_name"+
    ", contact_last_name, direct_phone, extension, type_of_person, second_last_name"+
    ", business_group_id, cell_phone, zip_code, period_sales_achievement" +
    ", inspection_approved, overprice, series, last_bill, install_code";
  }

function lotQueries(store, call){
    return call({
      'stores' : "SELECT * FROM stores " +
      `WHERE id=${store.id}`,
      'roles' : "SELECT * FROM roles " +
      "WHERE name IN ('store', 'store-admin')",
      'delivery_addresses': 'SELECT * FROM delivery_addresses WHERE ' +
      `id = ${store.delivery_address_id}`,
      'billing_addresses': 'SELECT * FROM billing_addresses',
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
      'banks':    'SELECT * FROM banks',
      'tax_regimes' : 'SELECT * FROM tax_regimes',
      'payment_forms' : 'SELECT * FROM payment_forms'
    });
  }

  function getQueryCount(store){
    return 'SELECT SUM(rows) as total_rows FROM (' +
      " SELECT COUNT (*) as rows FROM billing_addresses UNION ALL" +
      ` SELECT COUNT (*) as rows FROM stores WHERE id = ${store.id} UNION ALL` +
      " SELECT COUNT (*) as rows FROM roles WHERE name IN ('store', 'store-admin') UNION ALL" +
      ` SELECT COUNT (*) as rows FROM delivery_addresses WHERE id = ${store.delivery_address_id} UNION ALL`+
      ` SELECT COUNT (*) as rows FROM business_units WHERE id=${store.business_unit_id} UNION ALL` +
      ` SELECT COUNT (*) as rows FROM store_types WHERE id = ${store.store_type_id} UNION ALL`+
      ` SELECT COUNT (*) as rows FROM cost_types WHERE id = ${store.cost_type_id} UNION ALL` +
      ` SELECT COUNT (*) as rows FROM business_groups WHERE id = ${store.business_group_id} UNION ALL` +
      ` SELECT COUNT (*) as rows FROM prospects WHERE store_id = ${store.id} UNION ALL` +
      ' SELECT COUNT (*) as rows FROM products WHERE supplier_id IN (1,2) UNION ALL' +
      ' SELECT COUNT (*) as rows FROM services WHERE store_id IS NULL AND shared = true UNION ALL' +
      ` SELECT COUNT (*) as rows FROM stores_inventories WHERE store_id = ${store.id} UNION ALL` +
      ` SELECT COUNT (*) as rows FROM stores_warehouse_entries WHERE store_id = ${store.id} UNION ALL` +
      ` SELECT COUNT (*) as rows FROM store_movements WHERE store_id = ${store.id} UNION ALL` +
      ` SELECT COUNT (*) as rows FROM cash_registers WHERE store_id = ${store.id} UNION ALL` +
      ' SELECT COUNT (*) as rows FROM cfdi_uses UNION ALL' +
      ' SELECT COUNT (*) as rows FROM banks UNION ALL' +
      ' SELECT COUNT (*) as rows FROM tax_regimes UNION ALL' +
      ' SELECT COUNT (*) as rows FROM payment_forms' +
    ') as u';
  }

  function cloneAllTables(queries, call, queryCount){

    query(queryCount).then(limitCount => {

      count = 0;
      limit = parseInt(limitCount.rows[0].total_rows);

      $("#dynamic")
        .css("width", 8 + "%")
        .attr("aria-valuenow", 8)
        .text(8 + "%");

      current_progress = 8;

      for(var key in queries){

        query(queries[key], true, key).then(tablesResult => {

          tablesResult.rows.forEach(row => {

            createInsert(
              Object.keys(row),
              Object.values(row),
              tablesResult.table
            ).then(localQuery => {

              query(localQuery, false).then(result => {
                if (count++ === limit - 1){
                  call();
                }
                current_progress += parseInt(count * 92 / limit);

                $("#dynamic")
                  .css("width", current_progress + "%")
                  .attr("aria-valuenow", current_progress)
                  .text(current_progress + "%");
              }, err => {
              });
            });
          });
        });

      }
    });

  }

  $('#validateInstall').click(function(){
    $(this).prop('disabled', false);

    let path = `./tmp_files/mosaiconepos.sql`;

    script = `psql -U oscar -d local_db ` +
      `< ${path}`;
    showAlert('Info', 'Proceso de replicación de base de datos iniciado', cloneAlert());
    exec = require('child_process').exec;

    dbRestore = exec(script,
      function(err, stdout, stderr) {
        $("#dynamic")
          .css("width", 2 + "%")
          .attr("aria-valuenow", 2)
          .text(2 + "%");
        if(err){
          showAlert('Error', stderr, cloneAlert());
        }
      });

    dbRestore.on('exit', function (code) {
      let installCode = $('#installCodeId').val();

      if (code ===0){

        findBy('install_code', installCode, 'stores').then(result => {
          initStore().then(storage => {
            let store = result.rows[0];

            if (store) {
              storage.set('store', store);
              storage.set('lastTicket', 0);

              lotQueries(result.rows[0], function(queries){

                $("#dynamic")
                  .css("width", 5 + "%")
                  .attr("aria-valuenow", 5)
                  .text(5 + "%");

                cloneAllTables(queries, function(){
                  window.location.href = 'sign_up.html';
                }, getQueryCount(store));

              });
            } else {
              showAlert('Error', 'Revisa que el código ingresado sea válido', cloneAlert());
            }
          });
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
