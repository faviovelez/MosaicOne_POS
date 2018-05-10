function isPago(){
  return $('#tipoDeMovimiento button[class*=active]').html(
  ).indexOf('Pago') > 0 ;
}

function isDevolucion(){
  return $('#tipoDeMovimiento button[class*=active]').html(
  ).indexOf('Devolución') > 0 ;
}

function isVenta(){
  return $('#tipoDeMovimiento button[class*=active]').html(
  ).indexOf('Venta') > 0 ;
}

function translateInfo(info){
  if (info === " NaN"){
    return 0;
  }
  return info;
}

function increaseInventory(inventory, quantity){
  updateBy(
    {
      quantity: (inventory.quantity + quantity)
    },
    'stores_inventories',
    `id = ${inventory.id}`
  );
}

function decreaseInventory(inventory, quantity){
  updateBy(
    {
      quantity: (inventory.quantity - quantity)
    },
    'stores_inventories',
    `id = ${inventory.id}`
  );
}

function Inventory(){
  updateBy(
    {
      quantity: (inventory.quantity + quantity)
    },
    'stores_inventories',
    `id = ${inventory.id}`
  );
}

function recalculateDiscount(product){
  let realTotal = product.total - product.taxes,
      percentPayment = realTotal * 100 / product.subtotal;

  return 100 - parseFloat(percentPayment.toFixed(0));
}

function calculateDiscount(product){
  if (product.subtotal == 0) {
    return 0;
  } else {
    return (product.discount / product.subtotal * 100).toFixed(0);
  }
}

function recalculateTotal(product, percent, table){
  if (table === 'products'){
    let total = product.price.toFixed(2) * Math.abs(product.quantity);

    return total * (1 - percent / 100);
  } else {
    let total = product.initial_price.toFixed(2) * Math.abs(product.quantity);

    return parseFloat(total * (1 - percent / 100));
  }
}

function recalculateTotForSavedTicket(product, percent, table){
  totalObject = {};
  if (table === 'products'){
    let total = product.price.toFixed(2) * Math.abs(product.quantity);
    totalObject["total"] = total * (1 - percent / 100);
    totalObject["totalNoDesc"] = total;
    return totalObject;
  } else {
    let total = product.initial_price.toFixed(2) * Math.abs(product.quantity);
    totalObject["total"] = parseFloat(total * (1 - percent / 100));
    totalObject["totalNoDesc"] = total;

    return totalObject;
  }
}

function ticketQuery(){
   return 'SELECT tickets.id, tickets.user_id, tickets.store_id, tickets.subtotal, ' +
   'tickets.taxes, tickets.total, tickets.discount_applied, tickets.ticket_type, ' +
   'tickets.cash_register_id, tickets.ticket_number, tickets.comments, ' +
   'tickets.payments_amount, tickets.cash_return, tickets.payed, tickets.parent_id, ' +
   'tickets.created_at, prospects.legal_or_business_name FROM tickets LEFT JOIN prospects ' +
   'ON tickets.prospect_id = prospects.id WHERE tickets.ticket_type = \'venta\''
}

function setUserData(userId, call){
  if (userId){
    findBy(
      'id',
      userId,
      'users'
    ).then(user => {
      call(createFullName(user.rows[0]));
    });
  } else {
    return call(null);
  }
}

function ticketInfoForSearch(ticketId){
  return {
  productsQuery: 'SELECT total_with_dev.productId, total_with_dev.description, total_with_dev.color, total_with_dev.initial_price, ' +
    'SUM(total_with_dev.quantity) AS quantity, SUM(total_with_dev.discount) AS discount, ' +
    'SUM(total_with_dev.total) AS total, SUM(total_with_dev.subtotal) AS subtotal, ' +
    'SUM(total_with_dev.taxes) AS taxes FROM( ' +
    "SELECT filtered.product_id AS productId, CONCAT(filtered.unique_code, ' ', filtered.description, ' ', filtered.only_measure) AS description, " +
    "COALESCE(filtered.exterior_color_or_design, 'Sin diseño') AS color, " +
    'filtered.initial_price, ' +
    "CASE WHEN filtered.movement_type = 'venta' THEN filtered.quantity " +
    "WHEN filtered.movement_type = 'devolución' THEN -filtered.quantity " +
    'ELSE 0 END AS quantity, ' +
    "CASE WHEN filtered.movement_type = 'venta' THEN filtered.discount_applied " +
    "WHEN filtered.movement_type = 'devolución' THEN -filtered.discount_applied " +
    'ELSE 0 END AS discount, ' +
    "CASE WHEN filtered.movement_type = 'venta' THEN filtered.subtotal " +
    "WHEN filtered.movement_type = 'devolución' THEN -filtered.subtotal " +
    'ELSE 0 END AS subtotal, ' +
    "CASE WHEN filtered.movement_type = 'venta' THEN filtered.taxes " +
    "WHEN filtered.movement_type = 'devolución' THEN -filtered.taxes " +
    'ELSE 0 END AS taxes, ' +
    "CASE WHEN filtered.movement_type = 'venta' THEN filtered.total " +
    "WHEN filtered.movement_type = 'devolución' THEN -filtered.total " +
    'ELSE 0 END AS total ' +
    'FROM(SELECT * FROM( ' +
    "SELECT id, (date_trunc('day', tickets.created_at) " +
    "+ interval '1 day' - interval '1 second' - interval '1 day') AS start_date, " +
    "(date_trunc('day', tickets.created_at) + interval '1 day') AS end_date " +
    `FROM tickets WHERE tickets.parent_id = ${ticketId} OR tickets.id = ${ticketId}) AS results_table ` +
    'INNER JOIN store_movements ON store_movements.ticket_id = results_table.id ' +
    'INNER JOIN products on store_movements.product_id = products.id ' +
    'WHERE (store_movements.created_at > results_table.start_date ' +
    'AND store_movements.created_at < results_table.end_date)) AS filtered) AS total_with_dev ' +
    'GROUP BY total_with_dev.productId, total_with_dev.description, total_with_dev.color, total_with_dev.initial_price;',

  servicesQuery: 'SELECT total_with_dev.productId, total_with_dev.description, total_with_dev.color, total_with_dev.initial_price, ' +
    'SUM(total_with_dev.quantity) AS quantity, SUM(total_with_dev.discount) AS discount, ' +
    'SUM(total_with_dev.total) AS total, SUM(total_with_dev.subtotal) AS subtotal, ' +
    'SUM(total_with_dev.taxes) AS taxes FROM( ' +
    "SELECT services.id AS productId, CONCAT(services.unique_code, ' ', services.description) AS description, " +
    "COALESCE((services.delivery_company), 'Sin color') AS color, " +
    'service_offereds.initial_price, ' +
    "CASE WHEN service_offereds.service_type = 'venta' THEN service_offereds.quantity " +
    "WHEN service_offereds.service_type = 'devolución' THEN -service_offereds.quantity " +
    'ELSE 0 END AS quantity, ' +
    "CASE WHEN service_offereds.service_type = 'venta' THEN service_offereds.discount_applied " +
    "WHEN service_offereds.service_type = 'devolución' THEN -service_offereds.discount_applied " +
    'ELSE 0 END AS discount, ' +
    "CASE WHEN service_offereds.service_type = 'venta' THEN service_offereds.subtotal " +
    "WHEN service_offereds.service_type = 'devolución' THEN -service_offereds.subtotal " +
    'ELSE 0 END AS subtotal, ' +
    "CASE WHEN service_offereds.service_type = 'venta' THEN service_offereds.taxes " +
    "WHEN service_offereds.service_type = 'devolución' THEN -service_offereds.taxes " +
    'ELSE 0 END AS taxes, ' +
    "CASE WHEN service_offereds.service_type = 'venta' THEN service_offereds.total " +
    "WHEN service_offereds.service_type = 'devolución' THEN -service_offereds.total " +
    'ELSE 0 END AS total ' +
    'FROM service_offereds ' +
    'INNER JOIN services ON service_offereds.service_id = services.id, ' +
    '(SELECT id AS ticket_id FROM tickets ' +
    `WHERE tickets.id = ${ticketId} OR tickets.parent_id = ${ticketId}) AS ticketChildTable ` +
    'WHERE service_offereds.ticket_id = ticketChildTable.ticket_id' +
    ') total_with_dev ' +
    'GROUP BY total_with_dev.productId, total_with_dev.description, total_with_dev.color, total_with_dev.initial_price;',
  }
}


function ticketInfoQuery(ticketId, type, start, end){
  let productQuery = '';
  let color = '';
  let price = '';
  switch(type){
    case 'product':
      color = 'exterior_color_or_design';
      price = 'price';
      productQuery = ' SELECT *, products.id as productId FROM store_movements INNER JOIN products ' +
        'ON products.id = store_movements.product_id AND store_movements.created_at > ' +
        `'${start}' AND store_movements.created_at < '${end}' `;
      break;
    case 'service':
      color = 'delivery_company';
      price = 'initial_price';
      productQuery = ' SELECT *, service_offereds.id as productId FROM service_offereds INNER JOIN services ON services.id = service_offereds.service_id';
      break;
  }
  if (type == 'product') {
    return 'SELECT warehouseWithProducts.productId, CONCAT (warehouseWithProducts.unique_code, ' +
    "' ', warehouseWithProducts.description , ' ', warehouseWithProducts.only_measure) as description," +
    ' warehouseWithProducts.taxes, warehouseWithProducts.subtotal,' +
    ` warehouseWithProducts.${color} as color, warehouseWithProducts.${price},` +
    ' warehouseWithProducts.quantity, warehouseWithProducts.discount_applied,' +
    ' warehouseWithProducts.total' +
    ' FROM tickets INNER JOIN ' +
    ' (' +
    productQuery +
    ` ) as warehouseWithProducts ON warehouseWithProducts.ticket_id = tickets.id WHERE tickets.id = ${ticketId}`
  } else {
    return 'SELECT warehouseWithProducts.productId, CONCAT (warehouseWithProducts.unique_code, ' +
    "' ', warehouseWithProducts.description) as description," +
    ' warehouseWithProducts.taxes, warehouseWithProducts.subtotal,' +
    ` warehouseWithProducts.${color} as color, warehouseWithProducts.${price},` +
    ' warehouseWithProducts.quantity, warehouseWithProducts.discount_applied,' +
    ' warehouseWithProducts.total' +
    ' FROM tickets INNER JOIN ' +
    ' (' +
    productQuery +
    ` ) as warehouseWithProducts ON warehouseWithProducts.ticket_id = tickets.id WHERE tickets.id = ${ticketId}`
  }
}

function prospectInfo(ticket){
  if (!ticket.prospect)
    return '';

  return ' - ' +
  '<span id="ticket-prospect">' +
   `Cliente: ${ticket.prospect}` +
  '</span>'
}

function cleanPaymentInputs(){
  $('#completeSale, .paymentProcess').removeClass('hidden');
  $('input.paymentProcess, .paymentProcess input, .notInAllProcess').addClass('hidden');
}

function getPayed(isPayed){
  if (isPayed) {
    $('.paymentProcess').addClass('hidden');
    return '<span class="label label-success left-10">Pagado</span>';
  }
  else {
    $('.paymentProcess').removeClass('hidden');
    return '<span class="label label-danger left-10">Pendiente</span>';
  }
}

function displayTicketInfoForSearch(ticket, extraAction = false){
  return new Promise(function(resolve, reject){
    setUserData(ticket.userId, function(userName){

      let filteredTicketQueries = ticketInfoForSearch(ticket.id);
      query(filteredTicketQueries.productsQuery).then(resultData => {
        let html = '<table class="ticket-selected">' +
          '<thead>' +
          '<tr>' +
          '<th colspan="7" class="head-blue">' +
          'Ticket:' +
          '<span id="ticket-id">' +
          `  ${ticket.id}` +
          '</span>' +
          ' - ' +
          '<span id="ticket-date">' +
          ticket.createdAt +
          '</span>' +
          ' - ' +
          '<span id="ticket-user">' +
          `  Usuario: ${userName}` +
          '</span>' +
          prospectInfo(ticket) +
          '<span>' +
          getPayed(ticket.payed) +
          `<a href="#" data-toggle="modal" data-target="#askForConfirmCancel"` +
          'class="left-10" data-placement="left" data-toggle="tooltip" title="Cancelar">' +
          '<i class="fa fa-ban bigger-icon red-icon" aria-hidden="true"></i></a>' +
          '</span>' +
          '<span>' +
          `<a href="#" onclick="reimpresion(${ticket.id})"` +
          'data-placement="left" data-toggle="tooltip" title="Reimprimir" class="left-10 b">' +
            '<i class="fa fa-print bigger-icon" aria-hidden="true">' +
            '</i>' +
          '</a>' +
          '</span>' +
          '</th>' +
          '</tr>' +
          '<tr>' +
          '<th> </th>' +
          '<th> Producto o Servicio </th>' +
          '<th> Color/Diseño </th>' +
          '<th> Precio </th>' +
          '<th class="quantity-width"> Cantidad </th>' +
          '<th> Descuento </th>' +
          '<th> Total </th>' +
          '</tr>' +
          '</thead>' +
          '<tbody>';
        let Promise = require("bluebird");
        let ticketInfo = ticket;
        Promise.each(resultData.rows, function(ticketProductInfo){
          html += addProductToTicketSearch(ticketProductInfo, extraAction, 'products');
        }).then(function(){
          query(filteredTicketQueries.servicesQuery).then(resultData => {
            Promise.each(resultData.rows, function(ticketProductInfo){
              html += addProductToTicketSearch(ticketProductInfo, extraAction, 'services');
            }).then(function(){
              html += `</tbody></table><div id="ticketTotalId" class="hidden"></div>`
              resolve(html);
            });
          });
        })
      });
    })
  });
}

function displayTicketInfo(ticket, extraAction = false){
  return new Promise(function(resolve, reject){
    setUserData(ticket.userId, function(userName){

      previewsQuery = "SELECT (date_trunc('day', created_at) " +
        "+ interval '1 day' - interval '1 second' - interval '1 day') as start_date, " +
        "(date_trunc('day', created_at) + interval '1 day') " +
        `as end_date FROM tickets WHERE id = ${ticket.id} ` +
        'ORDER BY created_at DESC LIMIT 1';

      query(previewsQuery).then(dates => {
        if (dates.rowCount > 0) {
          start = dates.rows[0].start_date.toString().replace(/GMT.*/,'')
          end = dates.rows[0].end_date.toString().replace(/GMT.*/,'');
        } else {
          start = Date().toString().replace(/GMT.*/,'');
          end = Date().toString().replace(/GMT.*/,'');
        }

        query(ticketInfoQuery(ticket.id, 'product', start, end)).then(resultData => {
          let html = '<table class="ticket-selected">' +
            '<thead>' +
            '<tr>' +
            '<th colspan="7" class="head-blue">' +
            'Ticket:' +
            '<span id="ticket-id">' +
            `  ${ticket.id}` +
            '</span>' +
            ' - ' +
            '<span id="ticket-date">' +
            ticket.createdAt +
            '</span>' +
            ' - ' +
            '<span id="ticket-user">' +
            `  Usuario: ${userName}` +
            '</span>' +
            prospectInfo(ticket) +
            '<span>' +
            getPayed(ticket.payed) +
            `<a href="#" data-toggle="modal" data-target="#askForConfirmCancel"` +
            'class="left-10" data-placement="left" data-toggle="tooltip" title="Cancelar">' +
            '<i class="fa fa-ban bigger-icon red-icon" aria-hidden="true"></i></a>' +
            '</span>' +
            '<span>' +
            `<a href="#" onclick="reimpresion(${ticket.id})"` +
            'data-placement="left" data-toggle="tooltip" title="Reimprimir" class="left-10 b">' +
              '<i class="fa fa-print bigger-icon" aria-hidden="true">' +
              '</i>' +
            '</a>' +
            '</span>' +
            '</th>' +
            '</tr>' +
            '<tr>' +
            '<th> </th>' +
            '<th> Producto o Servicio </th>' +
            '<th> Color/Diseño </th>' +
            '<th> Precio </th>' +
            '<th class="quantity-width"> Cantidad </th>' +
            '<th> Descuento </th>' +
            '<th> Total </th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
          let Promise = require("bluebird");
          let ticketInfo = ticket;
          Promise.each(resultData.rows, function(ticketProductInfo){
            html += addProductToTicket(ticketProductInfo, extraAction, 'products');
          }).then(function(){
            query(ticketInfoQuery(ticket.id, 'service')).then(resultData => {
              Promise.each(resultData.rows, function(ticketProductInfo){
                html += addProductToTicket(ticketProductInfo, extraAction, 'services');
              }).then(function(){
                html += `</tbody></table><div id="ticketTotalId" class="hidden">${ticket.total}</div>`
                resolve(html);
              });
            });
          })
        });
      });
    })
  });
}

function validateAllInputsFill(){
  let allFill = true;
  $.each($('#ticketList input'), function(){
    if($(this).val() === '')
      allFill = false;
  });
  return allFill;
}

function deleteIcon(){
  return `<div class="close-icon invisible">` +
    '<button type="button" class="close center-close" aria-label="Close">' +
      '<span aria-hidden="true" class="white-light">&times;</span>' +
    '</button>' +
  '</div>';
}

function addDevolucionIcon(productId, table){
  return `<div class="close-icon blue-button">` +
    `<button type="button" id="addToDevolucionTable_${productId}_${table}" class="close center-close" aria-label="Close">` +
      '<span aria-hidden="true" class="white-light">+</span>' +
    '</button>' +
  '</div>';
}

function extraActionId(extraAction, productId){
  return extraAction ? ` id="extraAction_${productId}"` : '';
}

function addProductToTicket(ticketProductData, extraAction = false, table){
    let iconToAction = extraAction ? addDevolucionIcon(ticketProductData.productid, table) : deleteIcon();
    let productPrice = ticketProductData.price || ticketProductData.initial_price;
    return '<tr>' +
      '<td>' +
        iconToAction +
      '</td>' +
      '<td class="left">' +
        `<a href="#">` +
          `${ticketProductData.description}` +
        '</a>' +
      '</td>' +
      `<td> ${ticketProductData.color || 'Sin color'} </td>` +
      `<td> ${convertToPrice(productPrice)} </td>` +
      `<td> ${ticketProductData.quantity} </td>` +
      `<td> ${recalculateDiscount(ticketProductData)}% </td>` +
      `<td class="right"> ${convertToPrice(ticketProductData.total)} </td>` +
    '</tr>';
}

function addProductToTicketSearch(ticketProductData, extraAction = false, table){
    let iconToAction = extraAction ? addDevolucionIcon(ticketProductData.productid, table) : deleteIcon();
    let productPrice = ticketProductData.price || ticketProductData.initial_price;
    return '<tr>' +
      '<td>' +
        iconToAction +
      '</td>' +
      '<td class="left">' +
        `<a href="#">` +
          `${ticketProductData.description}` +
        '</a>' +
      '</td>' +
      `<td> ${ticketProductData.color || 'Sin color'} </td>` +
      `<td> ${convertToPrice(productPrice)} </td>` +
      `<td> ${ticketProductData.quantity} </td>` +
      `<td> ${calculateDiscount(ticketProductData)}% </td>` +
      `<td class="right" id="totalRowProd_${table}_${ticketProductData.productid}"> ${convertToPrice(ticketProductData.total)} </td>` +
    '</tr>';
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

  function stringPrice(price, id){
    return `<a href="#" data-toggle="modal" data-target="#changeSinglePrice" data-id="${id}">` +
      `${translatePrice(price)}` +
    '</a>';
  }

function createFullName(user){
  return `${user.first_name} ${user.middle_name} ${user.last_name}`;
}

function getDate(datetime){
  let month = datetime.getMonth() + 1,
      date  = datetime.getDate();

  if (month < 10) {
    month = `0${month}`;
  }

  if (date < 10) {
    date = `0${date}`;
  }

  return `${date}/${month}/${datetime.getFullYear()}`;
}

function convertToPrice(price){
  return ` $ ${price.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`;
}

  function addSearchTicketTr(ticket){
    return new Promise (function(resolve, reject){
      setUserData(ticket.userId, function(userName){
        resolve('<tr>' +
          `<td> <a href="#" class="hide-results" id="ticketNumber${ticket.id}"> ${ticket.id} </a> </td>` +
          `<td> ${ticket.createdAt} </td>` +
          `<td class="right">${convertToPrice(ticket.total)} </td>` +
          `<td> ${userName} </td>` +
          '</tr>');
      });
    });
  }

function createTicketOptions(tickets){
  let options = [];
  return new Promise(function(resolve, reject){
    let count = 0;
    let limit = tickets.length;
    tickets.forEach(function(ticket, index){
      options.push(
        {
          value: `${ticket.id}`,
          id:    ticket.id,
          createdAt: getDate(ticket.created_at),
          total: ticket.total,
          userId: ticket.user_id,
          prospect: ticket.legal_or_business_name,
          payed: ticket.payed
        }
      );
      count++;
      if (limit === count){
        resolve(options);
      }
    });
  });
}

function calculatePaymentRestGlobal(){
  totalPagado = 0;
  $.each($('.paymentData'), function(){
    paymentType = parseInt($(this).find('td.paymentTotal').attr('data-type'));
    realType = $(this).find('td.paymentTypeDesc').html().trim();
    if (paymentType < 21 && realType == 'pago') {
      totalPagado += parseFloat($(this).find('td.paymentTotal').html().replace(/\s|\$|,/g,''));
    }
  });

  ticketTotalForPay = parseFloat($('#ticketTotalId').html())
  if (isNaN(ticketTotalForPay)) {
    ticketTotalForPay = 0;
  }

  paymentRest =  ticketTotalForPay - parseFloat(totalPagado) - parseFloat($('#sumPayments').html());
  $('#paymentRest strong').html(
    convertToPrice(paymentRest)
  );

  $('#currencyChange').html(
    `<strong>$ ${(paymentRest * -1).toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}</strong>`
  );

  $('table.subtotal td.total strong').html(
    `$ ${parseFloat($('#ticketTotalId').html())
    .toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`
  );
}

function resumePayment(){
  let sum = 0;
  $.each($('tr[id^=paymentMethod_]'), function(){
    let currency = $(this).find('.cuantity').html().replace(
      '$ ', ''
    ).replace(',', '');
    sum += parseFloat(currency);
  });
  let total = $('table.subtotal td.total strong').html().replace(
    '$ ', ''
  ).replace(/,/g,''),
     rest = (parseFloat(total) - sum).toFixed(2);
  $('#sumPayments').html(sum);

  let products = $('#ticketList tr[id^=product_]').length;
  let paymentsTable = $('.payments-received-on-ticket').length;

  if (isPago()) {
    calculatePaymentRestGlobal();
    let payRest = parseFloat($('#paymentRest strong').html().replace('$ ', '').replace(/,/g,''));
    if (payRest <= 0 && $('tr[id^=paymentMethod_]').length > 0) {
      $('#paymentRest').html(
        '<strong>$ 0.00</strong>'
      );
      $('.paymentProcess').addClass('hidden');
      $('#completeSale').removeClass('hidden');
    } else {
      $('#currencyChange').html(
        '<strong> $0.00 </strong>'
      );
      $('#completeSale').addClass('hidden');
      $('.paymentProcess').removeClass('hidden');
      $('.payment-form-wrapper.paymentProcess button.selected').click();
    }
  } else {
    if (parseFloat(rest) <= 0 && ( ( isVenta() && products > 0 ) )){
      $('#paymentRest').html(
        '<strong>$ 0.00</strong>'
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
}

function getTicketsElements(ticketId, call){
  specialFindBy('id', ticketId, 'store_movements').then(storeMovements => {
    let objects = {
      storeMovements : storeMovements.rows
    };

    findBy('ticket_id', ticketId, 'service_offereds').then(serviceOffereds => {
      objects.serviceOffereds = serviceOffereds.rows;
      return call(objects);
    });
  });
}

function createRealSubtotal(discountSelector = 'a[id^=discount]'){
  let discount = 0;
  $.each($(`td[id^=priceTo]`), function(){
    let price = 0;
    if (!$(this).find('a').html()) {
      price = $(this).find('input').val();
    } else {
      price = parseFloat($(this).find('a').html().replace(/\$|,/g,''));
    }
    let tr    = $(this).parent();
    let cuantity    = parseInt($(tr).find(
          'input[id^=cuantityTo]'
        ).val().replace(/_/g,'')),
        total       = price * cuantity,
        discountval = parseFloat($(tr.find(
          discountSelector
        )).html().replace(' %',''));
    if (total.toString() === 'NaN'){
      total = 0;
    }
    discount += parseFloat( ( parseFloat(discountval) / 100 * total).toFixed(2) );
  });

  $('#discountSum').html(
    ` $ ${discount.toFixed(
        2
      ).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`
  );

  $('#SubtotalSum').html(
    ` $ ${(
      parseFloat($('#savedSubtotal').html().replace(
        "$ ", ""
      ).replace(/,/g,'')
    ) - parseFloat(
        translateInfo(
          $('#discountSum').html().replace(
            '$ ', ''
          ).replace(/,/g,'')
        )
      )).toFixed(
        2
      ).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`
  );

  realTax = (parseFloat(
    $('#SubtotalSum').html().replace("$ ", "").replace(/,/g,'')
    ) * 0.16)
  .toFixed(2);

  realSubtot = parseFloat(
    $('#SubtotalSum').html().replace("$ ", "").replace(/,/g,'')
    )
  .toFixed(2);

  $('table.subtotal td.subtotal.iva').html(
    ` $ ${realTax.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`
  );

  realTot = (parseFloat(realTax) + parseFloat(realSubtot)).toFixed(2);

  $('table.subtotal td.total, #paymentRest').html(
    `<strong>$ ${realTot.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </strong>`
  );

}

  function bigTotal(discountSelector = 'a[id^=discount]'){
    let subTotalInput = $('#savedSubtotal'),
        taxSum        = 0,
        subtotal      = 0;
    $.each($(`td[id^=totalSinTo_]`), function(){
      let productTotal = parseFloat(
        $(this).html().replace('$ ', '').replace(/,/g,'')
      );
      productTotal = productTotal.toString() === 'NaN' ? 0 : productTotal;
      subtotal += productTotal;
      taxSum += Math.round(productTotal * 0.16 * 100) / 100;

    });
    $(subTotalInput).html(`$ ${subtotal.toFixed(
      2
    ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`);

    $('table.subtotal td.subtotal.iva').html(
      `$ ${taxSum.toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`
    );

    createRealSubtotal(discountSelector);
  }
