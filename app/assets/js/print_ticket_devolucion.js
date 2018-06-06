var html = '';

function createTicketProductListDevolucion(productList, discount, call){
  let ticketList = '',
      limit = Object.keys(productList.storeMovements).length,
      count = 0,
      deliveriesCad = '';

  limit += Object.keys(productList.serviceOffereds).length;

  for (var productHead in productList){
    for (var productIndex in productList[productHead]){
      let object = productList[productHead][productIndex],
          table  = '',
          refId  = 0;
      if (productHead === 'serviceOffereds'){
        regId = object.service_id;
        table = 'services';
      } else {
        regId = object.product_id;
        table = 'products';
      }
      findBy('id', regId, table, productIndex, productHead).then(productObject => {
        object.product = productObject.rows[0];
        ticketList += '<tr>' +
          '<td colspan="3" style="text-align:left">' +
          '<span>' +
          `${Math.abs(object.quantity)} ` +
          '</span>' +
          '<span>' +
          `${object.product.unique_code} ` +
          '</span>' +
          '<span>' +
          `${object.product.description} ${object.product.only_measure} ` +
          '</span>' +
          '</td>' +
          '<td colspan="1" style="width: 80px; text-align: right; vertical-align:text-top" >' +
          `$ ${object.initial_price.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
          '</tr>';
        if (object.discount_applied > 0){
          ticketList += '<tr>' +
            `<td colspan="3" style="text-align:left"> ${((1 - (object.final_price / object.initial_price)) * 100).toFixed(0)} % de descuento </td>` +
            `<td colspan="1" style="text-align:right; vertical-align:text-top; min-width:100px"> -$ ${object.discount_applied.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
            '</tr>';
        }

        ticketList += '<tr>' +
          `<td colspan="4" style="text-align:right; vertical-align:text-top"> <strong> $ ${(object.total - object.taxes).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </strong> </td>` +
          '</tr>';

          count++;
          if (count === parseInt(limit)){
            call(ticketList, deliveriesCad);
          }

      });

    }
  }
}

function initTicketDevolucion(ticketData, call) {
  createTicketProductListDevolucion(ticketData.products, ticketData.parentTicket, function(productsCad){
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
      `Tel. ${ticketData.store.direct_phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2 $3") } <br>` +
      `${ticketData.store.email} <br>` +
      'www.disenosdecarton.com.mx <br>' +
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
      productsCad +
      '<tr>' +
      '<td colspan="2"></td>' +
      '<td colspan="2" style="text-align: right">_________________</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="2" style="text-align: right"> Subtotal: </td>' +
      `<td colspan="2" style="text-align: right"> $ ${ticketData.ticket.subtotal.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
      '</tr>' +
      '<tr>' +
      '<td colspan="2" style="text-align: right"> IVA 16%: </td>' +
      `<td colspan="2" style="text-align: right"> $ ${ticketData.ticket.taxes.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
      '</tr>' +
      '<tr>' +
      '<td colspan="2" style="text-align: right">' +
      '<strong> Total: </strong>' +
      '</td>' +
      '<td colspan="2" style="text-align: right">' +
      `<strong> $ ${ticketData.ticket.total.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </strong>` +
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
      '<tr>' +
      '<td colspan="2" style="text-align:left">' +
      '<strong>' +
      'Total devuelto:' +
      '</strong>' +
      '</td>' +
      '<td colspan="2" style="text-align:right">' +
      '<strong>' +
      `$ ${ticketData.ticket.payments_amount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}` +
      '</strong>' +
      '</td>' +
      '</tr>' +
//      '<tr>' +
//      '<td colspan="2" style="text-align:left">' +
//      '<strong>' +
//      'Cambio:' +
//      '</strong>' +
//      '</td>' +
//      '<td colspan="2" style="text-align:right">' +
//      '<strong>' +
//      `$ ${ticketData.ticket.cash_return.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}` +
//      '</strong>' +
//      '</td>' +
//      '</tr>' +
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

function printTicketDevolucion(ticketInfo, call){
  const remotePraintTicketPayment = require('electron').remote;
  let winTicketPayment = null;
  winTicketPayment = new remotePraintTicketPayment.BrowserWindow({width: 800, height: 600, show: false });
  getTicketsElements(ticketInfo.ticket.id, function(products){
    ticketInfo.products = products;
    findBy('id', ticketInfo.store.delivery_address_id, 'delivery_addresses').then(deliveryAddress => {
      ticketInfo.store.deliveryAddress = deliveryAddress.rows[0];
      initTicketDevolucion(ticketInfo, function(htmlContent){

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
