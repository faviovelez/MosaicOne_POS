$(function(){

  function carIcon(id, company){
    if (company === '' || !company) {
      return '';
    }

    return '<a href="#" data-toggle="modal"' +
      'data-target="#deliveryService"' +
      `id="service_1" data-id=${id}>` +
      '<i class="fa fa-truck" aria-hidden="true"></i>' +
      '</a>';
  }

  function translatePrice(price){
    let convertPrice =  parseFloat(
            price
          ).toFixed(2);

    if (convertPrice === "NaN") {
      return price;
    }
    return ` $ ${convertPrice.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`;
  }

    function devoluAddTr(productOrService){
      let percent = recalculateDiscount(productOrService),
          total = recalculateTotal(productOrService, percent, productOrService.table),
          color = productOrService.table === 'services' ? carIcon(productOrService.id, productOrService.delivery_company) :
          productOrService.exterior_color_or_design,
          price = '',
          productInList = $(`#product_${productOrService.id}`);

      if (productOrService.table === 'services'){
        price ='<input type="text" class="form-control ' +
        `smaller-form" id="priceToServiceTo_${productOrService.id}" value="${productOrService.initial_price}">`;
      } else {
        price = stringPrice(productOrService.price, productOrService.id);
      }

      return `<tr id="productDevolucion_${productOrService.id}">` +
        '<td>' +
          '<div class="close-icon">' +
            `<button id="deleteDevolucion_${productOrService.id}" type="button" class="close center-close" aria-label="Close">` +
              '<span aria-hidden="true" class="white-light">&times;</span>' +
            '</button>' +
          '</div>' +
        '</td>' +
        '<td class="left">' +
          '<a href="#" data-toggle="modal" data-target="#productShow"' +
          `data-id="${productOrService.id}" data-table="${productOrService.table}" >` +
          `${productOrService.unique_code} ${productOrService.description}` +
          '</a>' +
        '</td>' +
        `<td> ${color} </td>` +
        `<td id="priceDevolucionTo_${productOrService.id}"> ${translatePrice(price)}` +
        '<td>' +
        '<input type="text" class="form-control smaller-form" ' +
        `placeholder="1" data-valueLimit="${Math.abs(productOrService.quantity)}" id="cuantityDevolucionTo_${productOrService.id}" ` +
        `value="${Math.abs(productOrService.quantity)}">` +
        '</td>' +
        `<td id="discountDevolucionTo_${productOrService.id}"> ${percent}% </td>` +
        `<td class="right" id="totalDevolucionTo_${productOrService.id}">` +
        ` $ ${(total * 1.16).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
        `<td class="right hidden" id="totalSinTo_${productOrService.id}"> ${(total).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
      '</tr>';
    }

function createDevolucionTotal(id){
  let cuantity = $(`input[id^=cuantityDevolucionTo_${id}]`).val().replace(/_/g,''),
    price = 0;
    priceElement = $(`td[id^=priceDevolucionTo_${id}] a`);
  if (!$(priceElement).html()){
    price = $(`td[id^=priceDevolucionTo_${id}] input`).val();
  } else {
    price    = parseFloat(
      $(priceElement).html().replace(' $ ','')
    );
  }
  let total =  parseFloat( (price * cuantity).toFixed(2) ),
      discount = $(`td[id^=discountDevolucionTo_${id}]`)
    .html().replace(' %',''),
    discountVal = parseFloat(parseFloat ( (parseFloat(discount) / 100 * total).toFixed(3) ).toFixed(2)),
    productTotal    = total - discountVal;

  return productTotal;
}

function addEvents(id, productOrServiceObject){

  $(`button[id=deleteDevolucion_${id}]`).click(function(){
    $(this).parents('tr').remove();
    bigTotal();
  });

  $(`#cuantityDevolucionTo_${id}`).keyup(function(){
    let limitValue = parseInt($(this).attr('data-valueLimit'));
    let tryValue = parseInt($(this).val().replace(/_/g,''));
    if ( tryValue > limitValue ){
      $(this).val(limitValue);
    }

    let total = createDevolucionTotal(id);
    $(`#totalDevolucionTo_${id}`).html(
        `$ ${(total * 1.16).toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`
    );

    $(`#totalSinTo_${id}`).html(
        `$ ${(total).toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`
    );

    bigTotal();
  });

  $(`button[id=addToDevelucionTable_${id}]`).click(function(){
    if ($(`#productDevolucion_${productOrServiceObject.id}`).length === 0) {
      $('#devolucionTable').append(devoluAddTr(productOrServiceObject));
      bigTotal();
      addEvents(productOrServiceObject.id, productOrServiceObject);
    }
  });

}

const Inputmask = require('inputmask');

  function loadDevelocionTable(ticketObject){
    displayTicketInfo(ticketObject, true).then(tableHtmlContent => {
      $('#resultOfTicketSearch').append(tableHtmlContent);
      $('.items-returns').removeClass('hidden');
      let ticketId = ticketObject.id,
          localQuery = 'SELECT * FROM products INNER JOIN' +
                       ' store_movements ON products.id = ' +
                       ' store_movements.product_id WHERE' +
                       ` ticket_id = ${ticketId}`;

      query(localQuery).then(storeMovementProducts => {
        storeMovementProducts.rows.forEach(product => {
          product.table = 'products';
          product.id    = product.product_id;

          $('#devolucionTable').append(devoluAddTr(product));
          addEvents(product.id, product);
          bigTotal();
          let selector = $(`input[id^=cuantityDevolucionTo_${product.id}]`);
          var im = new Inputmask("99999999");
          im.mask(selector);
        });
      });

      localQuery = 'SELECT *, service_offereds.id as serviceId FROM services INNER JOIN' +
        ' service_offereds ON services.id = ' +
        ' service_offereds.service_id WHERE' +
        ` ticket_id = ${ticketId}`;
      query(localQuery).then(serviceOffereds => {
        serviceOffereds.rows.forEach(service => {

          service.table = 'services';
          service.id    = service.serviceid;

          $('#devolucionTable').append(devoluAddTr(service));
          addEvents(service.id, service);
          bigTotal();

        });
      });
    });
  }

  function initTicketSearch(){
    query(ticketQuery()).then(result => {
      createTicketOptions(result.rows).then(list => {
        $('#ticketSearch').autocomplete({
          lookup: list,
          onSelect: function(ticket) {
            $('#paymentRest strong').html('$ 0.00');
            $('table.subtotal td.total strong').html('$ 0.00');
            $('#resultTicketList tr').remove();
            $('#resultOfTicketSearch table').remove();
            $('#ticketTotalId').remove();
            $('.items-returns').addClass('hidden');
            addSearchTicketTr(ticket).then(trInfo => {
              $('#resultTicketList').append(trInfo);
              $('.ticket-results').removeClass('hidden');
              $(`#ticketNumber${ticket.id}`).click(function(){
                
                $('.ticket-results').addClass('hidden');
                loadDevelocionTable(ticket);
              })
            });
            $(this).val('');
          }
        });
      })
    });
  }

  $("#return-option").click(function () {
    $('#ticketList tr').remove();
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
    bigTotal();
    $('.paymentProcess').addClass('hidden');
    $('#completeSale').removeClass('hidden');
    initTicketSearch();
    return false;
  });

});
