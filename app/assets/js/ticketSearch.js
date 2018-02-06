$(function(){
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

  function convertToPrice(price){
    return ` $ ${price.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`;
  }

  function addTr(ticket){
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

  function ticketInfoQuery(ticketId, type){
    let productQuery = '';
    let attribute = '';
    switch(type){
      case 'product':
        attribute = 'exterior_color_or_design';
        productQuery = ' SELECT * FROM store_movements INNER JOIN products ON products.id = store_movements.product_id';
        break;
      case 'service':
        attribute = 'delivery_company';
        productQuery = ' SELECT * FROM service_offereds INNER JOIN services ON services.id = service_offereds.service_id';
        break;
    }
    return 'SELECT CONCAT (warehouseWithProducts.unique_code, ' +
      "' ', warehouseWithProducts.description) as description," +
      ` warehouseWithProducts.${attribute} as color, warehouseWithProducts.price,` +
      ' warehouseWithProducts.quantity, warehouseWithProducts.discount_applied,' +
      ' warehouseWithProducts.total' +
      ' FROM tickets INNER JOIN ' +
      ' (' +
      productQuery +
      ` ) as warehouseWithProducts ON warehouseWithProducts.ticket_id = tickets.id WHERE tickets.id = ${ticketId}`
  }

  function addProductToTicket(ticketProductData){
      return '<tr>' +
        '<td>' +
          '<div class="close-icon invisible">' +
            '<button type="button" class="close center-close" aria-label="Close">' +
              '<span aria-hidden="true" class="white-light">&times;</span>' +
            '</button>' +
          '</div>' +
        '</td>' +
        '<td class="left">' +
          '<a href="#">' +
            `${ticketProductData.description}` +
          '</a>' +
        '</td>' +
        `<td> ${ticketProductData.color || 'Sin color'} </td>` +
        `<td> ${convertToPrice(ticketProductData.price)} </td>` +
        `<td> ${ticketProductData.quantity} </td>` +
        `<td> ${ticketProductData.discount_applied}% </td>` +
        `<td class="right"> ${convertToPrice(ticketProductData.total)} </td>` +
      '</tr>';
  }

  function setProspectData(){
    return new Promise(function(resolve, reject){

    });
  }

  function prospectInfo(ticket){
    if (!ticket.prospect)
      return '';

    return ' - ' +
    '<span id="ticket-prospect">' +
     `Cliente: ${ticket.prospect}` + /*Aquí agregar la lógica para obtener al cliente*/
    '</span>'
  }

  function getPayed(isPayed){
    if (isPayed) {
      $('.paymentProcess').addClass('hidden');
      return '<span class="label label-success">Pagado</span>';
    }
    else {
      $('.paymentProcess').removeClass('hidden');
      return '<span class="label label-danger">Pendiente</span>';
    }
  }

  function displayTicketInfo(ticket){
    return new Promise(function(resolve, reject){
      setUserData(ticket.userId, function(userName){
        query(ticketInfoQuery(ticket.id, 'product')).then(resultData => {
          let html = '<table class="ticket-selected">' +
            '<thead>' +
            '<tr>' +
            '<th colspan="6" class="head-blue edge-right">' +
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
            '</th>' +
            '<th class="head-blue edge-left">' +
            getPayed(ticket.payed) + /* Aquí poner una lógica dependiendo si está o no pagado*/
            `<a href="#" onclick="reimpresion(${ticket.id})" class="b">` +
              '<i class="fa fa-print bigger-icon" aria-hidden="true">' +
              '</i>' +
            '</a>' +
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
            html += addProductToTicket(ticketProductInfo);
          }).then(function(){
            query(ticketInfoQuery(ticket.id, 'service')).then(resultData => {
              Promise.each(resultData.rows, function(ticketProductInfo){
                html += addProductToTicket(ticketProductInfo);
              }).then(function(){
                html += `</tbody></table><div id="ticketTotalId" class="hidden">${ticket.total}</div>`
                resolve(html);
              });
            });
          })
        });
      })
    });
  }

  function ticketQuery(){
     return 'SELECT tickets.id, tickets.user_id, tickets.store_id, tickets.subtotal, ' +
     'tickets.taxes, tickets.total, tickets.discount_applied, tickets.ticket_type, ' +
     'tickets.cash_register_id, tickets.ticket_number, tickets.comments, ' +
     'tickets.payments_amount, tickets.cash_return, tickets.payed, tickets.parent_id, ' +
     'tickets.created_at, prospects.legal_or_business_name FROM tickets LEFT JOIN prospects ' +
     'ON tickets.prospect_id = prospects.id'
  }

  function getPaymentType(typeId, total){
    return {
       1  :   'Efectivo',
       18 :   'Débito',
       4  :   'Crédito',
       2  :   'Cheque',
       3  :   'Transferencia',
       21 :   'Venta a Crédito'
    }[typeId]
  }

  function paymentQuery(ticketId){
      return 'SELECT DISTINCT(payments.id) AS payment_id, payments.payment_date, payments.user_id, ' +
        'payments.payment_form_id, payments.payment_type, ' +
        'payments.ticket_id, payments.total, payments.created_at FROM payments, ' +
        '(' +
	       'SELECT children_id, ticket_id FROM tickets_children ' +
         `WHERE ticket_id = ${ticketId}` +
         ') AS ticketChildTable WHERE payments.ticket_id ' +
         '= ticketChildTable.ticket_id ' +
         'OR payments.ticket_id = ticketChildTable.children_id';
  }

  function insertLotPayments(payments){
    let html = '';
    let count = 0;
    let limit = payments.length;
    return new Promise(function(resolve, reject){
      payments.forEach(function(payment) {
        setUserData(payment.user_id, function(userName){
          html += '<tr class="paymentData">' +
            `<td> ${payment.ticket_id} </td>` +
            `<td> ${getPaymentType(payment.payment_form_id, payment.total)} </td>` +
            `<td data-type="${payment.payment_form_id}" class="paymentTotal"> ${convertToPrice(payment.total)} </td>` +
            `<td> ${getDate(payment.created_at)} </td>` +
            `<td> ${userName} </td>` +
          '</tr>';
          count++;
          if(limit === count){
            html += '</tbody>' +
                    '</table>';
            resolve(html);
          }
        });
      });
    });
  }

  function createPagosTable(ticket){
    return new Promise(function(resolve, reject){
      let html = '<table class="payments-received-on-ticket">' +
        '<thead>' +
          '<tr>' +
            '<th colspan="5" class="head-black">' +
              'Pagos recibidos Ticket:' +
              '<span class="ticket-number">' +
                `  ${ticket.id}` +
              '</span>' +
            '</th>' +
          '</tr>' +
          '<tr>' +
            '<th>' +
              'Ticket' +
            '</th>' +
            '<th>' +
              'Forma de pago' +
            '</th>' +
            '<th>' +
              'Monto' +
            '</th>' +
            '<th>' +
              'Fecha' +
            '</th>' +
            '<th>' +
              'Recibió' +
            '</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>';
        query(paymentQuery(ticket.id)).then(paymentsDataInfo => {
          if (paymentsDataInfo.rowCount === 0) {
            getAll('payments', '*', `ticket_id = ${ticket.id}`).then(paymentsDataInfo => {
              insertLotPayments(paymentsDataInfo.rows).then(function(htmlContent){
                html += htmlContent;
                resolve(html);
              });
            });
          } else {
            insertLotPayments(paymentsDataInfo.rows).then(function(htmlContent){
              html += htmlContent;
              resolve(html);
            });
          }
        });
    });
  }

  function calculatePaymentRest(){
    let totalPagado = 0;
    $.each($('.paymentData'), function(){
      let paymentType = parseInt($(this).find('td.paymentTotal').attr('data-type'));
      if (paymentType < 21) {
        totalPagado += parseFloat($(this).find('td.paymentTotal').html().replace(/\s|\$|,/g,''));
      }
    });

    let paymentRest = parseFloat($('#ticketTotalId').html()) - parseFloat(totalPagado);
    $('#paymentRest strong').html(
      convertToPrice(paymentRest)
    );

    $('table.subtotal td.total strong').html($('#paymentRest strong').html());

  }

  $("#advance-option").click(function () {
    //$('#creditSale').addClass('hidden');
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
            addTr(ticket).then(trInfo => {
              $('#resultTicketList').append(trInfo);
              $('.ticket-results').removeClass('hidden');
              $(`#ticketNumber${ticket.id}`).click(function(){
                $('.ticket-results').addClass('hidden');
                displayTicketInfo(ticket).then(tableHtmlContent => {
                  $('#resultOfTicketSearch').append(tableHtmlContent);
                  tableHtmlContent = null;
                  createPagosTable(ticket).then(tableHtmlContent => {
                    $('#resultOfTicketSearch').append(tableHtmlContent);
                    calculatePaymentRest();
                  });
                });
              })
            });
            $(this).val('');
          }
        });
      })
    });

    return false;
  });

});
