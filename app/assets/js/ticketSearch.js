$(function(){

  function setProspectData(){
    return new Promise(function(resolve, reject){

    });
  }

  $("#ticketCancelinList").click(function () {
    cancelarTicket(
      parseInt($("#ticket-id").html())
    );
  });

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
            `<td class="paymentTypeDesc"> ${payment.payment_type} </td>` +
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
            '<th colspan="6" class="head-black">' +
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
              'Tipo' +
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
      let realType = $(this).find('td.paymentTypeDesc').html().trim();
      if (paymentType < 21 && realType == 'pago') {
        totalPagado += parseFloat($(this).find('td.paymentTotal').html().replace(/\s|\$|,/g,''));
      }
    });

    let paymentRest = parseFloat($('#ticketTotalId').html()) - parseFloat(totalPagado);
    $('#paymentRest strong').html(
      convertToPrice(paymentRest)
    );

    $('table.subtotal td.total strong').html(
      parseFloat($('#ticketTotalId').html())
      .toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
      );

  }

  function loadPagoTable(ticketObject){
    displayTicketInfo(ticketObject).then(tableHtmlContent => {
      $('#resultOfTicketSearch').append(tableHtmlContent);
      tableHtmlContent = null;
      createPagosTable(ticketObject).then(tableHtmlContent => {
        $('#resultOfTicketSearch').append(tableHtmlContent);
        calculatePaymentRest();

        // Líneas agregadas para poder esconder las secciones no necesarias
        $('#cash').addClass('selected');
        $('.credit-days-container').addClass('hidden');
        $('.operation-number-container').addClass('hidden');
        $('.select-register-container').addClass('hidden');
        // Líneas agregadas para poder esconder las secciones no necesarias

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
            addSearchTicketTr(ticket).then(trInfo => {
              $('#resultTicketList').append(trInfo);
              $('.ticket-results').removeClass('hidden');
              $(`#ticketNumber${ticket.id}`).click(function(){

                $('.ticket-results').addClass('hidden');
                loadPagoTable(ticket);

              })
            });
            $(this).val('');
          }
        });
      })
    });
  }

  $("#advance-option").click(function () {
    //$('#creditSale').addClass('hidden');
    $('.btn-group').removeClass('open');
    $('#returnCash').addClass('hidden');
    $('.items-sales').removeClass('hidden');
    $('.ticket-results').addClass('hidden');
    $('.ticket-selected').addClass('hidden');
    $('.items-returns').addClass('hidden');
    $('.items-changes').addClass('hidden');
//    $('.extra-search').removeClass('hidden');
    $('.ticket-search').removeClass('hidden');
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
    $('#ticketList tr').remove();
    $('.items-returns').addClass('hidden');
    $('#devolucionTable tr').remove();
    initTicketSearch();
    bigTotal();
    resumePayment();
    return false;
  });

});
