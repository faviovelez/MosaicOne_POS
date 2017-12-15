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

  function updateProductPricesPrices(storeObject, call){
    findBy('manual_price_update', 'FALSE', 'stores_inventories', false).then(storesInventoriesObjects => {
      let limit = storesInventoriesObjects.rowCount,
          count = 0,
          pricesHistories = {};

      storesInventoriesObjects.rows.forEach(storeInventory => {
        let productId = storeInventory.product_id;
        findBy('id', productId, 'products', false).then(productObject => {
          let product = productObject.rows[0],
              updatedPrice = product.price * ( 1 + (storeObject.overprice / 100) );
          pricesHistories[product.id] = parseFloat(updatedPrice.toFixed(2));
          updateBy(
            {
              price: updatedPrice
            },
            'products',
            `id = ${product.id}`
          ).then(productUpdated => {
            count++;
            if (count === limit){
              call(pricesHistories);
            }
          });

        });
      });
    });
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

  function storesInventoriesColumns(){
    return [
      "stores_inventories.id as id",
      "stores_inventories.product_id as product_id",
      "stores_inventories.store_id as store_id",
      "stores_inventories.quantity as quantity",
      "stores_inventories.alert as alert",
      "stores_inventories.alert_type as alert_type",
      "stores_inventories.created_at as created_at",
      "stores_inventories.updated_at as updated_at",
      "stores_inventories.rack as rack",
      "stores_inventories.level as level",
      "stores_inventories.manual_price_update as manual_price",
      "stores_inventories.pos as pos",
      "stores_inventories.web as web",
      "stores_inventories.date as date",
      "stores_inventories.manual_price as manual_price"
    ].join(', ');
  }

function lotQueries(store, call){
    return call({
      'stores' : "SELECT * FROM stores " +
      `WHERE id=${store.id}`,
      'roles' : "SELECT * FROM roles " +
      "WHERE name IN ('store', 'store-admin')",
      'delivery_addresses': 'SELECT * FROM delivery_addresses WHERE ' +
      `id = ${store.delivery_address_id}`,
      'billing_addresses': getBillingAdressesQuery(store),
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
      'products' : 'SELECT * FROM products WHERE shared = true AND current = true ' +
      `AND classification = 'de línea' AND child_id is NULL OR store_id = ${store.id}`,
      'services' : 'SELECT * FROM services WHERE ' +
      `shared = true AND current = true OR store_id = ${store.id}`,
      'stores_inventories': `SELECT ${storesInventoriesColumns()} FROM stores_inventories INNER JOIN products ` + 
      'ON stores_inventories.product_id = products.id WHERE' +
      ` stores_inventories.store_id = ${store.id} AND products.child_id IS NULL` ,
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

  function getBillingAdressesQuery(store){
    return 'SELECT billing_addresses.id, billing_addresses.type_of_person, ' +
           'billing_addresses.business_name, billing_addresses.rfc, ' + 
           'billing_addresses.street, billing_addresses.exterior_number,' +
           'billing_addresses.interior_number, billing_addresses.zipcode, ' +
           'billing_addresses.neighborhood, billing_addresses.city, ' + 
           'billing_addresses.state, billing_addresses.country, ' + 
           'billing_addresses.created_at, billing_addresses.updated_at, ' + 
           'billing_addresses.tax_regime_id, billing_addresses.pos, ' + 
           'billing_addresses.web, billing_addresses.date, billing_addresses.store_id' +
           ' FROM billing_addresses INNER JOIN business_units ON billing_addresses.id = ' + 
           'business_units.billing_address_id INNER JOIN stores ON stores.business_unit_id ' +
           `= business_units.id WHERE stores.id = ${store.id} UNION ALL ` +
           `SELECT * FROM billing_addresses WHERE store_id = ${store.id}`; 
  }

  function getQueryCount(store){
    return 'SELECT SUM(rows) as total_rows FROM (' +
      ` SELECT COUNT (*) as rows FROM billing_addresses WHERE store_id = ${store.id} UNION ALL` +
      ` SELECT COUNT (*) as rows FROM stores WHERE id = ${store.id} UNION ALL` +
      " SELECT COUNT (*) as rows FROM roles WHERE name IN ('store', 'store-admin') UNION ALL" +
      ` SELECT COUNT (*) as rows FROM delivery_addresses WHERE id = ${store.delivery_address_id} UNION ALL`+
      ` SELECT COUNT (*) as rows FROM business_units WHERE id=${store.business_unit_id} UNION ALL` +
      ` SELECT COUNT (*) as rows FROM store_types WHERE id = ${store.store_type_id} UNION ALL`+
      ` SELECT COUNT (*) as rows FROM cost_types WHERE id = ${store.cost_type_id} UNION ALL` +
      ` SELECT COUNT (*) as rows FROM business_groups WHERE id = ${store.business_group_id} UNION ALL` +
      ` SELECT COUNT (*) as rows FROM prospects WHERE store_id = ${store.id} UNION ALL` +
      ' SELECT COUNT (*) as rows FROM products WHERE shared = true AND current = true AND' +
      ` classification = 'de línea' AND child_id is NULL OR store_id = ${store.id} UNION ALL` +
      ` SELECT COUNT (*) as rows FROM services WHERE shared = true AND current = true OR store_id = ${store.id} UNION ALL` +
      ` SELECT COUNT (*) as rows FROM stores_inventories INNER JOIN products ` + 
      'ON stores_inventories.product_id = products.id WHERE' + 
      ` stores_inventories.store_id = ${store.id} AND products.child_id IS NULL UNION ALL` +
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
                if (count++ === limit){
                  call();
                }
                current_progress += parseInt(count * 92 / limit);

                $("#dynamic")
                  .css("width", current_progress + "%")
                  .attr("aria-valuenow", current_progress)
                  .text(current_progress + "%");
              }, err => {
                console.log(err);
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

    script = `psql -U faviovelez -d mosaiconepos ` +
      `< ${path}`;
    showAlert('Info', 'Proceso de replicación de base de datos iniciado', cloneAlert());
    exec = require('child_process').exec;

//    exec('mkdir -p ./tickets', function(err, stdout, stderr){
//      if(err){
//        showAlert('Error', stderr, cloneAlert());
//      }
//    });

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
                  updateProductPricesPrices(store, function(updatedPrices){
                    let updatedPricesLimit = Object.keys(updatedPrices).length,
                        updatedPricescount = 0;

                    for (var productId in updatedPrices){
                      findBy('product_id', productId, 'stores_inventories', false, productId).then(storeInventory => {
                        updateBy(
                          {
                            manual_price: updatedPrices[storeInventory.lastId]
                          },
                          'stores_inventories',
                          `product_id = ${storeInventory.lastId}`
                        ).then(() => {
                          updatedPricescount++;
                          if (updatedPricescount === updatedPricesLimit){
                            window.location.href = 'sign_up.html';
                          }
                        });

                      });
                    }
                  });

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
