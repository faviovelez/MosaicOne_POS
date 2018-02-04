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
          `<td> ${ticket.updatedAt} </td>` +
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
            updatedAt: getDate(ticket.updated_at),
            total: ticket.total,
            userId: ticket.user_id
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
        `<td> $ ${ticketProductData.price} </td>` +
        `<td> ${ticketProductData.quantity} </td>` +
        `<td> ${ticketProductData.discount_applied}% </td>` +
        `<td class="right"> $ ${ticketProductData.total} </td>` +
      '</tr>';
  }

  function displayTicketInfo(ticket){
    return new Promise(function(resolve, reject){
      setUserData(ticket.userId, function(userName){
        query(ticketInfoQuery(ticket.id, 'product')).then(resultData => {
          let html = `<a href="#" onclick="reimpresion(${ticket.id})" class"b">Reemprimir</a>` +
            '<table class="ticket-selected">' +
            '<thead>' +
            '<tr>' +
            '<th colspan="6" class="head-blue edge-right">' +
            'Ticket de venta:' +
            '<span id="ticket-id">' +
            `  ${ticket.id}` +
            '</span>' +
            ' -' +
            '<span id="ticket-date">' +
            ticket.updatedAt +
            '</span>' +
            '-' +
            '<span id="ticket-user">' +
            `  Usuario: ${userName}` +
            '</span>' +
            '-' +
            '<span id="ticket-prospect">' +
            'Cliente: Juan Perez' +
            '</span>' +
            '</th>' +
            '<th class="head-blue edge-left">' +
            '<span class="label label-danger">Pendiente</span>' +
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
                html += '</tbody></table>'
                resolve(html);
              });
            });
          })
        });
      })
    });
  }

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
    getAll('tickets').then(result => {
      createTicketOptions(result.rows).then(list => {
        $('#ticketSearch').autocomplete({
          lookup: list,
          onSelect: function(ticket) {
            $('#resultTicketList tr').remove();
            $('#resultOfTicketSearch table').remove();
            addTr(ticket).then(trInfo => {
              $('#resultTicketList').append(trInfo);
              $('.ticket-results').removeClass('hidden');
              $(`#ticketNumber${ticket.id}`).click(function(){
                $('.ticket-results').addClass('hidden');
                $('#resultOfTicketSearch table').remove();
                displayTicketInfo(ticket).then(tableHtmlContent => {
                  $('#resultOfTicketSearch').append(tableHtmlContent);
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
