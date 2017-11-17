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

  (function (){
    initStore().then(store => {

      let storeInfo  = store.get('store'),
          localQuery = 'SELECT * FROM business_units WHERE ' +
              `id = ${store.business_unit_id}`,
          query      = {};
      query(localQuery).then(business_unit => {

        queries.billing_addresses = 'SELECT * FROM billing_addresses ' +
          `WHERE id = ${mainResult.rows[0].billing_address_id}`;


      });

    });
  })();

  $('#datetimepicker1 #datetimepicker2').datetimepicker({
    locale: 'es'
  });

  $('#closeDay').click(function(){
    toWebDatabase().then(() => {
      setTimeout(function(){
        remote.getCurrentWindow().close();
      }, 3000);
    });
    return false;
  });
});
