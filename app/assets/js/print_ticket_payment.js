var html = '';

function createPaymentFormListPayments(payments, ticketId ,call){
  let ticketCad = '',
      limit = Object.keys(payments).length,
      count = 0;

  for(var paymentId in payments){
    let payment = payments[paymentId];
    if (payment.payment_form_id === 1) {
      payment.total = payment.total + parseFloat(
        $('#currencyChange strong').html().replace(/\s|\$|,/g,'')
      );
    }
    ticketCad += '<tr>' +
      `<td colspan="2" style="text-align:left">Pago en ${payment.paymentForm.description.replace('Por definir', 'Venta a Crédito')} al ticket No. ${ticketId}</td>` +
      `<td colspan="2" style="text-align:right"> $ ${payment.total.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
      '</tr>';
    count++;
    if (count === limit){
      return call(ticketCad);
    }
  }

}

function initTicketPayment(ticketData, call) {
  createPaymentFormListPayments(ticketData.payments, ticketData.parentTicket, function(paymentsCad){
    return call('<!DOCTYPE html>' +
      '<html lang="es">' +
      '<head>' +
      '<meta charset="UTF-8">' +
      '<title> Ticket </title>' +
      '<style type="text/css">' +
      '@media print{' +
      '@page { size:65mm auto; margin-left: 0mm !important; margin-right: 0mm !important;}' +
      '}' +
      '</style>' +
      '</head>' +
      '<body style="margin:0 auto !important; padding:0 auto !important">' +
      '<table style="font-family: Arial; font-size: 11px; width: 65mm; text-align: center; vertical-align:text-top">' +
      '<tbody>' +
      '<tr>' +
      '<td colspan="4">' +
      '<strong style="font-size: 17px;">' +
      'Diseños de Cartón <br>' +
      '</strong>' +
      `Sucursal ${ticketData.store.store_name} <br>` +
      '<br>' +
      `${ticketData.delivery.street} ` +
      `${ticketData.delivery.exterior_number} ` +
      `${ticketData.delivery.interior_number}, ` +
      `Col. ${ticketData.delivery.neighborhood}, ` +
      `${ticketData.delivery.city}, ` +
      `${ticketData.delivery.state}, ` +
      `C.P. ${ticketData.delivery.zipcode} <br>` +
      '<br>' +
      `Tel. ${ticketData.store.direct_phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2 $3") } <br>` +
      `${ticketData.store.email} <br>` +
      'www.disenosdecarton.com.mx <br>' +
      '<br>' +
      `${ticketData.billing_address.business_name} <br>` +
      `${ticketData.billing_address.street} ` +
      `${ticketData.billing_address.exterior_number} ` +
      `${ticketData.billing_address.interior_number || ''} <br>` +
      `Col. ${ticketData.billing_address.neighborhood} <br>` +
      `${ticketData.billing_address.city}, ` +
      `${ticketData.billing_address.state}. ` +
      `C.P. ${ticketData.billing_address.zipcode} <br>` +
      `RFC: ${ticketData.billing_address.rfc} <br>` +
      '<br>' +
      '<strong>' +
      'Régimen fiscal: <br>' +
      '</strong>' +
      `${ticketData.tax_regime.description} <br>` +
      '<br>' +
      '_______________________________________ <br /> <br />' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="text-align:left">' +
      '<strong>' +
      `${ticketData.ticket.ticket_type}` +
      '</strong>' +
      '</td>' +
      '<td>' +
      'Caja ' +
      '<span>' +
      `<strong> ${ticketData.cashRegister.name} </strong>` +
      '</span>' +
      '</td>' +
      '<td colspan="2" style="text-align:right">' +
      'Ticket: ' +
      '<span>' +
      `<strong> ${ticketData.ticket.id} </strong>` +
      '</span>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td>' +
      '<br />' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="3">' +
      '<strong>' +
      'Cant.' +
      '</strong>' +
      '<strong>' +
      'Prod. / Serv.' +
      '</strong>' +
      '</td>' +
      '<td colspan="1">' +
      '<strong>' +
      'Precio unit. /' +
      '</strong>' +
      '<strong>' +
      'Total' +
      '</strong>' +
      '</td>' +
      '</tr>' +
      paymentsCad +
      '<tr>' +
      '<td colspan="2"></td>' +
      '<td colspan="2" style="text-align: right">_________________</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="2" style="text-align:left">' +
      '<strong>' +
      'Total:' +
      '</strong>' +
      '</td>' +
      '<td colspan="2" style="text-align:right">' +
      '<strong>' +
      `$ ${ticketData.ticket.payments_amount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}` +
      '</strong>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="5">' +
      '_______________________________________ <br /> <br />' +
      '</td>' +
      '</tr>' +
      '' +
      '<tr>' +
      '<td>' +
      '<br />' +
      '</td>' +
      '</tr>' +
//      '<tr>' +
//      '<td colspan="2" style="text-align: left">' +
//      '<strong> Total ticket original: </strong>' +
//      '</td>' +
//      '<td colspan="2" style="text-align: right">' +
//      `<strong> $ ${ticketData.ticket.total.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </strong>` +
//      '</td>' +
//      '</tr>' +
      '<tr>' +
      '<td colspan="2" style="text-align:left">' +
      '<strong>' +
      'Pagos en este ticket:' +
      '</strong>' +
      '</td>' +
      '<td colspan="2" style="text-align:right">' +
      '<strong>' +
      `$ ${ticketData.ticket.payments_amount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}` +
      '</strong>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="2" style="text-align:left">' +
      '<strong>' +
      'Cambio:' +
      '</strong>' +
      '</td>' +
      '<td colspan="2" style="text-align:right">' +
      '<strong>' +
      `$ ${ticketData.ticket.cash_return.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}` +
      '</strong>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="5">' +
      '_______________________________________ <br /> <br />' +
      '</td>' +
      '</tr>' +
      '' +
      '<tr>' +
      '<td colspan="5">' +
      '_______________________________________ <br /> <br />' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="5"> <strong> Lugar y fecha de expedición: </strong>  </td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="5">' +
      `<span> ${ticketData.store.deliveryAddress.city}, </span>` +
      `<span> ${ticketData.store.deliveryAddress.state} </span>` +
      `<span> ${getDate(ticketData.ticket.created_at)} </span>` + //En formato fecha dd/mm/aaaa
      `<span> ${getTime(ticketData.ticket.created_at)} </span>` + //en formato hora (ya sea 12 o 24 hrs)
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="5"> <br /> </td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="5">' +
      '_______________________________________ <br /> <br />' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="5">' +
      'Atendió:' +
      `<span> ${ticketData.user.first_name} ${ticketData.user.last_name} </span>` +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="5"> Gracias por su compra <br /><br /> </td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="5"> <strong> Diseños de Cartón </strong> </td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="5"> Más que cajas, soluciones... </td>' +
      '</tr>' +
      '<tr>' +
      '<td><br /><br /></td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '</body>' +
//      '<script type="text/javascript">' +
//          'window.print();'+
//      '</script>' +
      '</html>');
  });
}

function createHtmlFilePayment(html, ticketId){
  try{
    fs.writeFileSync(`./tickets/TicketNo_${ticketId}.html`, html);
  }catch (e){
    console.log("No se pudo crear el archivo ", e);
  }
}

function printTicketPayment(ticketInfo, call){
  const remotePraintTicketPayment = require('electron').remote;
  let winTicketPayment = null;
  winTicketPayment = new remotePraintTicketPayment.BrowserWindow({width: 800, height: 600, show: false });
  query("SELECT * FROM delivery_addresses WHERE id IN (SELECT delivery_address_id FROM stores)").then(delivery_address => {
    ticketInfo.delivery = delivery_address.rows[0];

    findBy('id', ticketInfo.store.delivery_address_id, 'delivery_addresses').then(deliveryAddress => {
      ticketInfo.store.deliveryAddress = deliveryAddress.rows[0];
      initTicketPayment(ticketInfo, function(htmlContent){

        createHtmlFilePayment(htmlContent, ticketInfo.ticket.id);
        winTicketPayment.loadURL("data:text/html;charset=utf-8," + encodeURI(htmlContent));

        let contents = win.webContents;
        winTicketPayment.webContents.on('did-finish-load', () => {
          winTicketPayment.webContents.print({silent: true});
          winTicketPayment = null;
          return call();
        });

      });
    });
  });

}
