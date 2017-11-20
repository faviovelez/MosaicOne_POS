$(document).ready(function() {
  const Inputmask = require('inputmask');

  async function initStore(){

    const store = new Store({
      configName: 'user-localStore',
      defaults: {
        windowBounds: { width: 1024, height: 768 }
      }
    });

    return store;
  }

  function productAddChange(product){
    return `<tr id="addProduct_${product.id}">` +
      '<td class="left">' +
      product.description +
      '</td>' +
      `<td> ${product.color} </td><td>` +
      '<input type="text" class="form-control" id="addProductInput" smaller-form" placeholder="1">' +
      '</td></tr>';
  }

  $('#confirmAddProduct').click(function(){
    let id = $('tr[id^=addProduct]').attr(
      'id'
    ).replace(/\D/g,''),
      table = 'stores_inventories',
      condition = `product_id = ${id}`,
      data = {
        'quantity': parseInt(
          $('#addProductInput').val().replace(/_/g,'')
        )
      };
    findBy('product_id', id, 'stores_inventories').then(inventory => {
      findBy('product_id', id, 'warehouse_entries').then(warehouse_entry_table => {
        insert(
          ['product_id', 'quantity', 'entry_number'],
          [inventory.rows[0].product_id, $('#addProductInput').val().replace(/_/g,''), warehouse_entry_table.rowCount],
          'warehouse_entries'
        );
        data.quantity += inventory.rows[0].quantity;
        updateBy(data, table, condition).then(product => {
          $('#addProductQuantity tr').remove();
        }, err => {
          $('#addProductQuantity tr').remove();
        });
      })
    });
  });

  $('#addProductSearch').click(function(){

      getProductsAndServices(list => {
        $('#addProductSearch').autocomplete({
          lookup: list,
          lookupLimit: 10,
          onSelect: function (suggestion) {
            $('#addProductQuantity').append(
              productAddChange(suggestion)
            );
            let selector = document.getElementById("addProductInput");
            var im = new Inputmask("99999999");
            im.mask(selector);
            $(this).val('');
          }
        });
      });
  });

  function createFullName(user){
    return `${user.first_name} ${user.middle_name} ${user.last_name}`;
  }

  function getProductsAndServices(call){
    getAll('products').then(products => {
      options = [];
      products.rows.forEach(product => {
        options.push(
          {
            value: `${product.unique_code} ${product.description}`,
            id:    product.id,
            price: product.price,
            color: product.exterior_color_or_design || 'Sin Diseno',
            description: product.description,
            table: 'products'
          }
        );
      });
      getAll('services').then(services => {
        services.rows.forEach(service => {
          options.push(
            {
              value: `${service.unique_code} ${service.description}`,
              id:    service.id,
              table:  'services',
              description: service.description
            }
          );
        });
      });
      setTimeout(function(){
        return call(options);
      }, 300);
    });
  }

  function addPaymentTr(){
    let count = $('#paymentMethodList tr').length - 2,
        type  = $('.payment-form-wrapper .selected')
      .html().replace(/\s/g,'');
    return `<tr id="paymentMethod_${count}">` +
      '<td class="flex">' +
      '<div class="close-icon">' +
      '<button type="button" class="close center-close"' +
      `aria-label="Close" id="closeTr_${count}">` +
      '<span aria-hidden="true" class="white-light">&times;</span>' +
      '</button></div>' +
      `${type}</td>` +
      '<td class="right cuantity" >' +
      `$ ${$('#paymentMethodCuantity').val().replace(
         /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
       )}` +
      '</td></tr>';
  }

  function resumePayment(){
    let sum = 0;
    $.each($('tr[id^=paymentMethod_]'), function(){
      let currency = $(this).find('.cuantity').html().replace(
        '$ ', ''
      ).replace(',', '');
      sum += parseFloat(currency);
    });
    let total = $('table.subtotal td.total').html().replace(
      '$ ', ''
    ).replace(',',''),
       rest = (parseFloat(total) - sum).toFixed(2);
    if (parseFloat(rest) <= 0){
      $('#paymentRest').html(
        '<strong>$ 0</strong>'
      );
      $('#currencyChange').html(
        `<strong>$ ${(rest * -1).toFixed(2).replace(
            /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
          )}</strong>`
      );
      $('.paymentProcess').addClass('hidden');
      $('#completeSale').removeClass('hidden');
    } else {
      $('#currencyChange').html(
        '<strong> $0.00 </strong>'
      );
      $('#paymentRest').html(
        `<strong>$ ${rest.replace(
            /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
         )}</strong>`
      );
      $('#completeSale').addClass('hidden');
      $('.paymentProcess').removeClass('hidden');
      $('.payment-form-wrapper.paymentProcess button.selected').click();
    }
  }

  $('#addPayment').click(function(){
    let count = $('#paymentMethodList tr').length - 2;
    $('#paymentMethodList').prepend(addPaymentTr());
    $('#paymentMethodCuantity').val('');

    $(`#closeTr_${count}`).click(function(){
      $(`tr[id=paymentMethod_${count}]`).remove();
      resumePayment();
    });

    resumePayment();
  });

  $('#ticketDiscountChange .confirm').click(function(){
    $.each($('a[id^=discount]'), function(){
      $(this).html(
        $('#globalDiscount input:first').val() + ' %'
      );
      let id = $(this).attr('id').replace(/\D/g,'');
      $(`#totalTo_${id}`).html(
        `$ ${createTotal(id, true)}`
      );
    });
    $('#ticketDiscountChange').modal('toggle');
  });

  $('#completeSale').click(function() {
    validateQuantity(function(hasInventory){

      if (hasInventory){

        initStore().then(store => {
          user = store.get('current_user').id;
          store_id = store.get('store').id;

          saveTicket(function() {
            store.set('lastTicket', parseInt(
              $('#ticketNum').html()
            ));

            window.location.reload(true);
          });

        });

      }
    });

  });

  function createRealSubtotal(){
    let discount = 0;
    $.each($(`td[id^=priceTo]`), function(){
      let price       = parseFloat($(this).html()),
          tr          = $(this).parent(),
          cuantity    = parseInt($(tr).find(
            'input[id^=cuantityTo]'
          ).val()),
          total       = price * cuantity,
          discountval = parseFloat($(tr.find(
            'a[id^=discount]'
          ))
          .html().replace(' %',''));
      discount += (parseFloat(discountval) / 100 * total);
    });
    $('#discountSum').html(
      ` $ ${discount.toFixed(
          2
        ).replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
        )}`
    );

    $('#savedSubtotal').html(
      ` $ ${(parseFloat($('#SubtotalSum').html().replace("$ ", "").replace(/,/g,'')) + parseFloat(
          $('#discountSum').html().replace('$ ', '').replace(/,/g,'')
        )).toFixed(
          2
        ).replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
        )}`
    );

  }

  function bigTotal(){
    let subTotalInput = $('table.subtotal #SubtotalSum'),
        subtotal      = 0;
    $.each($(`td[id^=totalTo_]`), function(){
      subtotal += parseFloat(
        $(this).html().replace('$ ', '').replace(/,/g,'')
      );
    });
    $(subTotalInput).html(`$ ${subtotal.toFixed(
      2
    ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`);

    let iva = subtotal * 0.16;
    $('table.subtotal td.subtotal.iva').html(
      `$ ${iva.toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`
    );
    $('table.subtotal td.total, #paymentRest').html(
      `$ ${(subtotal + parseFloat(iva)).toFixed(
        2
      ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`
    );

    createRealSubtotal();
  }

  function createTotal(id, manualDiscount = false){
    let cuantity = $(`#cuantityTo_${id}`).val(),
      price    = parseFloat(
        $(`#priceTo_${id}`).html().replace(' $ ','')
      );
    if (!price){
      price = $(`#priceTo_${id} input`).val();
    }
    let total =  price * cuantity,
        discount = $(`#discount_${id}`)
      .html().replace(' %',''),
      discountVal = parseFloat(discount) / 100 * total,
      productTotal    = total - discountVal;

    if (manualDiscount){
      let globalManual = parseFloat(
        $('#manualDiscountQuantity').html().replace(' $ ','')
      );
      $('#manualDiscountQuantity').html(
        ` $ ${(globalManual += discountVal).toFixed(
          2
        ).replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
        )}`
      );
    }

    return productTotal.toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    );
  }

  function addEvents(id){
    $(`button[id=delete_${id}]`).click(function(){
      $(`tr[id=product_${id}]`).remove();
      bigTotal();
    });

    $(`#cuantityTo_${id}`).keyup(function(){
      $(`#totalTo_${id}`).html(
        `$ ${createTotal(id)}`
      );
      bigTotal();
    });

    $(`#priceToServiceTo_${id}`).keyup(function(){
      $(`#totalTo_${id}`).html(
        `$ ${createTotal(id)}`
      );
      bigTotal();
    });
  }

  $('#productShow').on('shown.bs.modal', function(e) {
    let relatedObject = e.relatedTarget.dataset,
        productId     = relatedObject.id;

    findBy('id', productId, relatedObject.table).then(product => {
      let productData = product.rows[0];
      $('.product_description').html(
        productData.description
      );
      $('.product_unique_code').html(
        productData.unique_code
      );
      $('.product_main_material').html(
        productData.main_material
      );
      $('.product_resistance_main_material').html(
        productData.resistance_main_material
      );
      findBy('product_id', productId, 'stores_inventories').then(inventory => {
        $('.stores_inventory_quantity').html(
          inventory.rows[0].quantity
        );
        $('.stores_inventory_rack').html(
          inventory.rows[0].rack
        );
        $('.stores_inventory_level').html(
          inventory.rows[0].level
        );
      });
    });
  });

  $('#closeDiscount').click(function(e){
    let modalBody = $(this).parent().parent().find(
      '.modal-body'),
        id  = $(modalBody).attr('id').replace('discountTo_',''),
        tr = $(`#product_${id}`);
    $(tr).append(
      `<td class='hidden' id="discountReasonTo_${id}">` +
        $(modalBody).find('#discountMotive').val() +
      '</td>'
    );
    $(tr).find('a[id^=discount]').html(
      `${$(modalBody).find('#discountCount').val()} %`
    );
    $(`#totalTo_${id}`).html(
      `$ ${createTotal(id)}`
    );
    bigTotal();
    $('#discountRow').removeClass('hidden');
    $('#SubtotalRow').removeClass('hidden');
  });

  $('#discountChange').on('shown.bs.modal', function(e) {
    let relatedObject = e.relatedTarget.dataset,
        productId     = relatedObject.id;
    $(this).find('.modal-body').attr('id',
      `discountTo_${productId}`
    );

    $('#discountMotive, #discountCount').val('');
  });

  function carIcon(id){
    return '<a href="#" data-toggle="modal"' +
      'data-target="#deliveryService"' +
      `id="service_1" data-id=${id}>` +
      '<i class="fa fa-truck" aria-hidden="true"></i>' +
      '</a>';
  }

  function addTr(product){
    let color = product.table === 'services' ? carIcon(product.id) :
      product.color,
      productInList = $(`#product_${product.id}`),
      price = product.table === 'products' ? ` $ ${product.price}` :
      '<input type="text" class="form-control ' +
      `smaller-form" id="priceToServiceTo_${product.id}" placeholder="$ 100.00">`;
    if (productInList.length === 1) {
      return '';
    }
    return `<tr id="product_${product.id}"><td>` +
      '<div class="close-icon">' +
      `<button id="delete_${product.id}" type="button"` +
      'class="close center-close" aria-label="Close">' +
      '<span aria-hidden="true" class="white-light">&times;</span>' +
      '</button>' +
      '</div>' +
      '</td>' +
      '<td class="left">' +
      '<a href="#" data-toggle="modal" data-target="#productShow"' +
      `data-id="${product.id}" data-table="${product.table}" >` +
      product.description +
      '</a>' +
      '</td>' +
      `<td> ${color} </td>` +
      `<td id="priceTo_${product.id}">${parseFloat(
        price.replace(' $ ','')
      ).toFixed(2)}</td>` +
      '<td>' +
      '<input type="text" class="form-control smaller-form" ' +
      `placeholder="1" id="cuantityTo_${product.id}"></td>` +
      '<td> <a href="#" data-toggle="modal"' +
      'data-target="#discountChange" ' +
      `id="discount_${product.id}" data-id="${product.id}" ` +
      `data-table="${product.table}" > 0% </a> </td>` +
      `<td class="right" id="totalTo_${product.id}"> $ </td>` +
      '</tr>';
  }

  function formatSelection(state){
    return '';
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

      let lastTicket = store.get('lastTicket') ? store.get('lastTicket')
                       : 0;

      $('#ticketNum').html(
        ` ${lastTicket + 1} `
      );

      $('#cashRegisterNum').html(
        ` ${store.get('cash')} `
      );

      $('#store').html(store.get('store').store_name);

      getProductsAndServices(list => {
        $('#mainProductSearch').autocomplete({
          lookup: list,
          lookupLimit: 10,
          onSelect: function (suggestion) {
            $('#ticketList').append(addTr(suggestion));
            addEvents(suggestion.id);
            $(this).val('');
          }
        });
      });

    });
  })();

/* Métodos para cambiar botón de tipo de ventas*/
  $("#change-option").click(function () {

    /*Oculta las formas de pago no necesarias en esta sección*/
    $('#creditSale').removeClass('hidden');
    $('#returnCash').removeClass('hidden');
    /*Oculta la barra de búsqueda de productos y muestra las barras de navegación secundarias*/
    $('.extra-search').removeClass('hidden');
    $('.main-search').addClass('hidden');
    /*Oculta la tabla para agregar artículos al ticket*/
    $('.items-sales').addClass('hidden');
    /*Oculta la tabla de resultados para la búsqueda de tickets */
    $('.ticket-results').addClass('hidden');
    /*Oculta la tabla que muestra el detalle del ticket seleccionado */
    $('.ticket-selected').addClass('hidden');
    /*Oculta la tabla que muestra los artículos del ticket de devolución */
    $('.items-returns').addClass('hidden');
    /*Oculta la tabla que muestra los artículos del ticket de cambio */
    $('.items-changes').addClass('hidden');
    /*Oculta la tabla que muestra los artículos del ticket de venta */
    $('.items-sales').addClass('hidden');
    /* Muestra una parte de la sección lateral derecha no necesaria para cotización */
    $('.pay-forms-table').removeClass('hidden');
    $('.payment-form-wrapper').removeClass('hidden');
    $('.process-sale').removeClass('hidden');
    $('.pause-stop').removeClass('hidden');

    /*Esta sección muestra el botón elegido de la barra de navegación y oculta los demás botones*/
    $('#change').removeClass('hidden');
    $('#sale').addClass('hidden');
    $('#return').addClass('hidden');
    $('#advance').addClass('hidden');
    $('#estimate').addClass('hidden');
    $('#change').addClass('active-sale-option');
    $('#return').removeClass('active-sale-option');
    $('#sale').removeClass('active-sale-option');
    $('#advance').removeClass('active-sale-option');
    $('#estimate').removeClass('active-sale-option');

    /*Esta sección oculta la opción elegida y muestra las demás*/
    $("#change-option").addClass('hidden');
    $("#sale-option").removeClass('hidden');
    $("#return-option").removeClass('hidden');
    $("#advance-option").removeClass('hidden');
    $("#estimate-option").removeClass('hidden');
    $('.payments-received-on-ticket').addClass('hidden');

    $('.second-search').addClass('hidden');
  });

  $("#return-option").click(function () {
    $('#creditSale').addClass('hidden');
    $('#returnCash').removeClass('hidden');
    $('.items-sales').addClass('hidden');
    $('.ticket-results').addClass('hidden');
    $('.ticket-selected').addClass('hidden');
    $('.items-returns').addClass('hidden');
    $('.items-changes').addClass('hidden');
    $('.extra-search').removeClass('hidden');
    $('.main-search').addClass('hidden');
    $('.items-sales').addClass('hidden');
    /* Muestra una parte de la sección lateral derecha no necesaria para cotización */
    $('.pay-forms-table').removeClass('hidden');
    $('.payment-form-wrapper').removeClass('hidden');
    $('.process-sale').removeClass('hidden');
    $('.pause-stop').removeClass('hidden');

    /*Esta sección muestra el botón elegido de la barra de navegación (también le da estilo) y oculta los demás botones*/
    $('#return').removeClass('hidden');
    $('#sale').addClass('hidden');
    $('#change').addClass('hidden');
    $('#advance').addClass('hidden');
    $('#estimate').addClass('hidden');
    $('#return').addClass('active-sale-option');
    $('#sale').removeClass('active-sale-option');
    $('#advance').removeClass('active-sale-option');
    $('#change').removeClass('active-sale-option');
    $('#estimate').removeClass('active-sale-option');

    /*Esta sección oculta la opción elegida y muestra las demás*/
    $("#return-option").addClass('hidden');
    $("#sale-option").removeClass('hidden');
    $("#change-option").removeClass('hidden');
    $("#advance-option").removeClass('hidden');
    $("#estimate-option").removeClass('hidden');
    $('.payments-received-on-ticket').addClass('hidden');

    $('.second-search').addClass('hidden');
  });

  $("#sale-option").click(function () {
    $('#creditSale').removeClass('hidden');
    $('#returnCash').addClass('hidden');

    $('.extra-search').addClass('hidden');
    $('.main-search').removeClass('hidden');
    $('.items-sales').removeClass('hidden');
    $('.ticket-selected').addClass('hidden');
    $('.items-changes').addClass('hidden');
    $('.items-returns').addClass('hidden');
    /* Muestra una parte de la sección lateral derecha no necesaria para cotización */
    $('.pay-forms-table').removeClass('hidden');
    $('.payment-form-wrapper').removeClass('hidden');
    $('.process-sale').removeClass('hidden');
    $('.pause-stop').removeClass('hidden');

    /*Esta sección muestra el botón elegido de la barra de navegación y oculta los demás botones*/
    $('#sale').removeClass('hidden');
    $('#return').addClass('hidden');
    $('#change').addClass('hidden');
    $('#advance').addClass('hidden');
    $('#estimate').addClass('hidden');
    $('#sale').addClass('active-sale-option');
    $('#advance').removeClass('active-sale-option');
    $('#change').removeClass('active-sale-option');
    $('#return').removeClass('active-sale-option');
    $('#estimate').removeClass('active-sale-option');

    /*Esta sección oculta la opción elegida y muestra las demás*/
    $("#sale-option").addClass('hidden');
    $("#return-option").removeClass('hidden');
    $("#change-option").removeClass('hidden');
    $("#advance-option").removeClass('hidden');
    $("#estimate-option").removeClass('hidden');
    $('.payments-received-on-ticket').addClass('hidden');

    $('.second-search').addClass('hidden');
  });

  $("#advance-option").click(function () {
    $('#creditSale').addClass('hidden');
    $('#returnCash').addClass('hidden');
    $('.items-sales').removeClass('hidden');
    $('.ticket-results').addClass('hidden');
    $('.ticket-selected').addClass('hidden');
    $('.items-returns').addClass('hidden');
    $('.items-changes').addClass('hidden');
    $('.extra-search').removeClass('hidden');
    $('.main-search').addClass('hidden');
    $('.items-sales').addClass('hidden');
    /* Muestra una parte de la sección lateral derecha no necesaria para cotización */
    $('.pay-forms-table').removeClass('hidden');
    $('.payment-form-wrapper').removeClass('hidden');
    $('.process-sale').removeClass('hidden');
    $('.pause-stop').removeClass('hidden');


    /*Esta sección muestra el botón elegido de la barra de navegación y oculta los demás botones*/
    $('#advance').removeClass('hidden');
    $('#change').addClass('hidden');
    $('#sale').addClass('hidden');
    $('#return').addClass('hidden');
    $('#estimate').addClass('hidden');
    $('#advance').addClass('active-sale-option');
    $('#sale').removeClass('active-sale-option');
    $('#change').removeClass('active-sale-option');
    $('#return').removeClass('active-sale-option');
    $('#estimate').removeClass('active-sale-option');

    /*Esta sección oculta la opción elegida y muestra las demás*/
    $("#advance-option").addClass('hidden');
    $("#change-option").removeClass('hidden');
    $("#sale-option").removeClass('hidden');
    $("#return-option").removeClass('hidden');
    $("#estimate-option").removeClass('hidden');

    $('.second-search').addClass('hidden');
  });

  $("#estimate-option").click(function () {
    /*Oculta las formas de pago no necesarias en esta sección*/
    $('#creditSale').removeClass('hidden');
    $('#returnCash').addClass('hidden');
    /*Oculta la barra de búsqueda de productos y muestra las barras de navegación secundarias*/
    $('.extra-search').addClass('hidden');
    $('.main-search').removeClass('hidden');

    $('.items-sales').removeClass('hidden');
    $('.ticket-selected').addClass('hidden');
    $('.items-changes').addClass('hidden');
    $('.items-returns').addClass('hidden');

    /* Oculta una parte de la sección lateral derecha no necesaria para cotización */
    $('.pay-forms-table').addClass('hidden');
    $('.payment-form-wrapper').addClass('hidden');
    $('.process-sale').addClass('hidden');
    $('.pause-stop').addClass('hidden');

    /*Esta sección muestra el botón elegido de la barra de navegación y oculta los demás botones*/
    $('#estimate').removeClass('hidden');
    $('#sale').addClass('hidden');
    $('#return').addClass('hidden');
    $('#change').addClass('hidden');
    $('#advance').addClass('hidden');
    $('#estimate').addClass('active-sale-option');
    $('#advance').removeClass('active-sale-option');
    $('#change').removeClass('active-sale-option');
    $('#return').removeClass('active-sale-option');
    $('#sale').removeClass('active-sale-option');

    /*Esta sección oculta la opción elegida del dropdown y muestra las demás*/
    $("#sale-option").removeClass('hidden');
    $("#return-option").removeClass('hidden');
    $("#change-option").removeClass('hidden');
    $("#advance-option").removeClass('hidden');
    $("#estimate-option").addClass('hidden');
    $('.payments-received-on-ticket').addClass('hidden');

    $('.second-search').addClass('hidden');
  });


/* Métodos para los buscadores de productos / tickets / clientes (mostrar tabla de resultados) */
$("#searchProducts").click(function () {
  $('.ticket-results').removeClass('hidden');
});

$("#searchProspects").click(function () {
  $('.ticket-results').removeClass('hidden');
});

$("#searchTickets").click(function () {
  $('.ticket-results').removeClass('hidden');
});

/* Método para ocultar tabla de resultados ymostrar tablas y buscadores pagos / cambios / devoluciones */
$(".hide-results").click(function () {
  $('.ticket-results').addClass('hidden');
  $('.ticket-selected').removeClass('hidden');
  $('.payments-received-on-ticket').addClass('hidden');

  if ($("#return").hasClass('active-sale-option')) {
    $('.items-returns').removeClass('hidden');
    $('.payments-received-on-ticket').addClass('hidden');
    $('.second-search').addClass('hidden');

  } else if ($("#change").hasClass('active-sale-option')) {
    $('.items-changes').removeClass('hidden');
    $('.second-search').removeClass('hidden');
    $('.payments-received-on-ticket').addClass('hidden');

  } else if ($("#advance").hasClass('active-sale-option')) {
    $('.payments-received-on-ticket').removeClass('hidden');
    $('.second-search').addClass('hidden');
  };

});

/* Métodos para descuentos*/
  $("#manual").click(function () {
    $(this).addClass('selected');
    $('#automatic-discount').addClass('hidden');
    $('#manual-discount').removeClass('hidden');
    $('#automatic').removeClass('selected');
    $('#none').removeClass('selected');
  });

  $("#none").click(function () {
    $(this).addClass('selected');
    $('#automatic-discount').addClass('hidden');
    $('#manual-discount').addClass('hidden');
    $('#automatic').removeClass('selected');
    $('#manual').removeClass('selected');
  });

  $("#automatic").click(function () {
    $(this).addClass('selected');
    $('#automatic-discount').removeClass('hidden');
    $('#manual-discount').addClass('hidden');
    $('#manual').removeClass('selected');
    $('#none').removeClass('selected');
  });

/* Métodos para tipo de forma de pago*/
  $("#cash").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#other').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').addClass('hidden');
    $('.select-register-container').addClass('hidden');
  });

  $("#debit").click(function () {
    $(this).addClass('selected');
    $('#cash').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#other').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').addClass('hidden');
    $('.select-register-container').removeClass('hidden');
  });

  $("#credit").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#other').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').addClass('hidden');
    $('.select-register-container').removeClass('hidden');
  });

  $("#check").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#other').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').removeClass('hidden');
    $('.select-register-container').addClass('hidden');
  });

  $("#transfer").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#other').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').removeClass('hidden');
    $('.select-register-container').addClass('hidden');
  });

  $("#other").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').addClass('hidden');
    $('.select-register-container').addClass('hidden');
  });

  $("#creditSale").click(function () {
    $(this).addClass('selected');
    $('.credit-days-container').removeClass('hidden');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#other').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').removeClass('hidden');
    $('.operation-number-container').addClass('hidden');
    $('.select-register-container').addClass('hidden');
  });

  $("#returnCash").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#other').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').addClass('hidden');
    $('.select-register-container').addClass('hidden');
  });

  $(".show-payments").click(function () {
    $('.payments-received-on-ticket-two').removeClass('hidden');
    $(".show-payments").addClass('hidden');
    $(".hide-payments").removeClass('hidden');
  });

  $(".hide-payments").click(function () {
    $('.payments-received-on-ticket-two').addClass('hidden');
    $(".hide-payments").addClass('hidden');
    $(".show-payments").removeClass('hidden');
  });

});
