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

  function convertServiceToValidQuantity(ticketId, service){
    return new Promise(function(resolve, reject){

      let getDevolutionQuantitiesQuery ='SELECT allMovementsTickets.ticket_type, SUM(service_offereds.quantity) ' +
      'as quantityMovements, service_offereds.service_id FROM (' +
      `SELECT * FROM tickets WHERE parent_id = ${ticketId} OR id = ${ticketId}` +
      ') as allMovementsTickets ' +
      'INNER JOIN service_offereds ON ' +
      'allMovementsTickets.id = service_offereds.ticket_Id WHERE ' +
      `service_offereds.service_id = ${service.service_id} AND ` +
      'allMovementsTickets.ticket_type = \'devolución\' ' +
      'GROUP BY allMovementsTickets.ticket_type, service_offereds.service_id';

      query(getDevolutionQuantitiesQuery).then(function(resultValues){
        if (resultValues.rowCount === 0)
          return resolve(service);

        let quantityMovements = resultValues.rows[0].quantitymovements;
        service.quantity = service.quantity - quantityMovements;
        resolve(service);
      });

    });

  }

  function convertProductToValidQuantity(ticketId, product){
    return new Promise(function(resolve, reject){

      let getDevolutionQuantitiesQuery ='SELECT allMovementsTickets.ticket_type, SUM(store_movements.quantity) ' +
      'as quantityMovements, store_movements.product_id FROM (' +
      `SELECT * FROM tickets WHERE parent_id = ${ticketId} OR id = ${ticketId}` +
      ') as allMovementsTickets ' +
      'INNER JOIN store_movements ON ' +
      'allMovementsTickets.id = store_movements.ticket_Id WHERE ' +
      `store_movements.product_id = ${product.id} AND ` +
      'allMovementsTickets.ticket_type = \'devolución\' ' +
      'GROUP BY allMovementsTickets.ticket_type, store_movements.product_id';

      query(getDevolutionQuantitiesQuery).then(function(resultValues){
        if (resultValues.rowCount === 0)
          return resolve(product);

        let quantityMovements = resultValues.rows[0].quantitymovements;
        product.quantity = product.quantity - quantityMovements;
        resolve(product);
      });

    });

  }

  function devoluAddTr(productOrService){
    let percent = recalculateDiscount(productOrService),
        total = recalculateTotal(productOrService, percent, productOrService.table),
        color = productOrService.table === 'services' ? carIcon(productOrService.id, productOrService.delivery_company) :
        productOrService.exterior_color_or_design,
        price = productOrService.table === 'products' ? productOrService.price : productOrService.initial_price,
        description = productOrService.table === 'products' ? '<a href="#" data-toggle="modal" ' +
        ` data-target="#productShow" data-id="${productOrService.id}" data-table="${productOrService.table}" >` +
        `${productOrService.unique_code} ${productOrService.description} </a>` : productOrService.description
        productInList = $(`#product_${productOrService.id}`);

    if (productOrService.quantity <= 0)
      return false;

    return `<tr id="productDevolucion_${productOrService.id}_${productOrService.table}">` +
      `<td id="infoTableName" class="hidden">${productOrService.table}</td><td>` +
        '<div class="close-icon">' +
          `<button id="deleteDevolucion_${productOrService.id}_${productOrService.table}" type="button" class="close center-close" aria-label="Close">` +
            '<span aria-hidden="true" class="white-light">&times;</span>' +
          '</button>' +
        '</div>' +
      '</td>' +
      '<td class="left">' +
        description +
      '</td>' +
      `<td> ${color} </td>` +
      `<td id="priceToDevolucion_${productOrService.id}"> ${translatePrice(price)}` +
      '<td>' +
      '<input type="text" class="form-control smaller-form" ' +
      `placeholder="1" data-valueLimit="${Math.abs(productOrService.quantity)}" id="cuantityToDevolucion_${productOrService.id}" ` +
      `value="${Math.abs(productOrService.quantity)}">` +
      '</td>' +
      `<td id="discountToDevolucion_${productOrService.id}"> ${percent}% </td>` +
      `<td class="right" id="totalToDevolucion_${productOrService.id}">` +
      ` $ ${(total * 1.16).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
      `<td class="right hidden" id="totalSinTo_${productOrService.id}"> ${(total).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
    '</tr>';
  }

function createDevolucionTotal(id){
  let cuantity = $(`input[id^=cuantityToDevolucion_${id}]`).val().replace(/_/g,''),
    price = 0;
    priceElement = $(`td[id^=priceToDevolucion_${id}]`);
  if (!$(priceElement).html()){
    price = $(`td[id^=priceToDevolucion_${id}] input`).val();
  } else {
    price    = parseFloat(
      $(priceElement).html().replace(' $ ','').replace(',','')
    );
  }
  let total =  parseFloat( (price * cuantity).toFixed(2) ),
      discount = $(`td[id^=discountToDevolucion_${id}]`)
    .html().replace(' %',''),
    discountVal = parseFloat(parseFloat ( (parseFloat(discount) / 100 * total).toFixed(3) ).toFixed(2)),
    productTotal    = total - discountVal;

  return productTotal;
}

function addEvents(id, productOrServiceObject, table){

  $(`button[id=deleteDevolucion_${id}_${table}]`).click(function(){
    $(this).parents('tr').remove();
    bigTotal('td[id^=discountToDevolucion_]');
  });

  $(`#cuantityToDevolucion_${id}`).keyup(function(){
    let limitValue = parseInt($(this).attr('data-valueLimit'));
    let tryValue = parseInt($(this).val().replace(/_/g,''));
    if ( tryValue > limitValue ){
      $(this).val(limitValue);
    }

    let total = createDevolucionTotal(id);
    $(`#totalToDevolucion_${id}`).html(
        `$ ${(total * 1.16).toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`
    );

    $(`#totalSinTo_${id}`).html(
        `$ ${(total).toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`
    );

    bigTotal('td[id^=discountToDevolucion_]');
  });

  $(`button[id=addToDevolucionTable_${id}_${table}]`).click(function(){
    if ($(`#productDevolucion_${productOrServiceObject.id}_${table}`).length === 0) {
      $('#devolucionTable').append(devoluAddTr(productOrServiceObject));
      bigTotal('td[id^=discountToDevolucion_]');
      addEvents(productOrServiceObject.id, productOrServiceObject);
      let selector = $(`input[id^=cuantityToDevolucion_${productOrServiceObject.id}]`);
      var im = new Inputmask("99999999");
      im.mask(selector);
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

          convertProductToValidQuantity(ticketId, product).then(function(processProduct){
            $('#devolucionTable').append(devoluAddTr(processProduct));
            addEvents(processProduct.id, processProduct, 'products');
            bigTotal('td[id^=discountToDevolucion_]');
            let selector = $(`input[id^=cuantityToDevolucion_${processProduct.id}]`);
            var im = new Inputmask("99999999");
            im.mask(selector);
          });

        });
      });

      localQuery = 'SELECT *, service_offereds.id as serviceId FROM services INNER JOIN' +
        ' service_offereds ON services.id = ' +
        ' service_offereds.service_id WHERE' +
        ` ticket_id = ${ticketId}`;
      cleanPaymentInputs();
      query(localQuery).then(serviceOffereds => {
        serviceOffereds.rows.forEach(service => {

          service.table = 'services';
          service.id    = service.serviceid;

          convertServiceToValidQuantity(ticketId, service).then(function(processService){
            $('#devolucionTable').append(devoluAddTr(processService));
            addEvents(processService.id, processService, 'services');
            bigTotal('td[id^=discountToDevolucion_]');
            let selector = $(`input[id^=cuantityToDevolucion_${processService.id}]`);
            var im = new Inputmask("99999999");
            im.mask(selector);
          });

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
            $('#devolucionTable tr').remove();
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
    $('.btn-group').removeClass('open');
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
    $('#prospectSearch').addClass('hidden');
    $('#productSearch').addClass('hidden');

    bigTotal('td[id^=discountToDevolucion_]');
    initTicketSearch();
    return false;
  });

});
