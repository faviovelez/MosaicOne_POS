$(document).ready(function() {
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

  function getProducts(call){
    getAll('products').then(products => {
      options = [];
      products.rows.forEach(product => {
        options.push(
          {
            value: `${product.unique_code} ${product.description}`,
            id:    product.id,
            price: product.price,
            color: product.exterior_color_or_design || 'Sin Diseno',
            description: product.description
          }
        );
      });
      return call(options);
    });
  }

  function createTotal(id){
    let cuantity = $(`#cuantityTo_${id}`).val(),
        price    = parseFloat(
          $(`#priceTo_${id}`).html().replace(' $ ','')
        );
    return price * cuantity;
  }

  function addEvents(id){
    $(`button[id=delete_${id}]`).click(function(){
      $(`tr[id=product_${id}]`).remove();
    });

    $(`#cuantityTo_${id}`).keyup(function(){
      $(`#totalTo_${id}`).html(
        $(this).html() + createTotal(id)
      );
    });
  }

  $('#productShow').on('shown.bs.modal', function(e) {
    let productId = e.relatedTarget.dataset.id;
    findBy('id', productId, 'products').then(product => {
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
      });
    });
  });

  function addTr(product){
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
      `data-id="${product.id}" >` +
      product.description +
      '</a>' +
      '</td>' +
      `<td> ${product.color} </td>` +
      `<td id="priceTo_${product.id}"> $ ${product.price} </td>` +
      '<td>' +
      '<input type="text" class="form-control smaller-form" ' +
      `placeholder="1" id="cuantityTo_${product.id}"></td>` +
      '<td> <a href="#" data-toggle="modal" data-target="#discountChange" id="discount_1"> 0% </a> </td>' +
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

      getProducts(list => {
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
  });

/* Métodos para cambiar botón de pagos*/
/* Si la cantidad de pagos (sumada) es mayor o igual al total, cambiar al botón completar venta */
  $("#addPayment").click(function () {
    $(this).addClass('hidden');
    $('#completeSale').removeClass('hidden');
    $('.credit-days-container').addClass('hidden');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#other').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('#returnCash').removeClass('selected');
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
