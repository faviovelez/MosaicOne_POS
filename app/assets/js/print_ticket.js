// Print logic starts
const remote = require('electron').remote;

let win = null;

// Create window
win = new remote.BrowserWindow({width: 800, height: 600, show: false });

var html = '';

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

function getTime(datetime){
  let hour    = datetime.getHours(),
    minute  = datetime.getMinutes(),
    seconds = datetime.getSeconds();

  if (hour < 10){
    hour = `0${hour}`;
  }

  if (minute < 10){
    minute = `0${minute}`;
  }

  if (seconds < 10){
    seconds = `0${seconds}`;
  }

  return `${hour}:${minute}:${seconds}`;
}

function createDeliveryServiceCad(serviceOffered, call){
  let deliveryCad =  '<tr>' +
    '<td colspan="4"> <strong>' +
    'Detalles del envío' +
    '</strong>' +
    '</td>' +
    '</tr>' +
    '<tr>' +
    '<td colspan="1" style="text-align: left"> Empresa: </td>' +
    '<td colspan="3" style="text-align: right">' +
    '<strong>';
  findBy('id', serviceOffered.service_id, 'services').then(serviceObject => {
    let service = serviceObject.rows[0];
    deliveryCad += `${service.delivery_company}` +
    '</strong>' +
    '</td>' +
    '</tr>' +
    '<tr>' +
    '<td colspan="1" style="text-align:left"> Guía: </td>' +
    '<td colspan="4" style="text-align:right">' +
    '<strong>';
    findBy('service_offered_id', serviceOffered.id, 'delivery_services').then(deliveryService => {
      let deliveryServiceObject = deliveryService.rows[0];
      deliveryCad += `${deliveryServiceObject.tracking_number}` +
        '</strong>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td colspan="1" style="text-align:left"> Nombre: </td>' +
        '<td colspan="3" style="text-align:right">' +
        '<strong>' +
        `${deliveryServiceObject.sender_name}` +
        '</strong>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td colspan="2" style="text-align:left"> C.P. Envío:' +
        '<span>' +
        '<strong>' +
        `${deliveryServiceObject.sender_zipcode}` +
        '</strong>' +
        '</span>' +
        '</td>' +
        '<td colspan="2" style="text-align:right"> C.P. Dest.:' +
        '<span>' +
        '<strong>' +
        `${deliveryServiceObject.receivers_zipcode}` +
        '</strong>' +
        '</span>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td colspan="1" style="text-align:left"> Destintario: </td>' +
        '<td colspan="3" style="text-align:right">' +
        '<strong>' +
        `${deliveryServiceObject.receivers_name}` +
        '</strong>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="text-align:left; width: 50px"> Dir. destino: </td>' +
        '<td colspan="3" style="text-align:right; width: 280px">' +
        `${deliveryServiceObject.street} ` +
        `${deliveryServiceObject.exterior_number} `;

      if (deliveryServiceObject.interior_number) {
      deliveryCad += 'Int. ' +
        `${deliveryServiceObject.interior_number} `;
      }

      if (deliveryServiceObject.neighborhood){
        deliveryCad += 'Col.  ' +
        `${deliveryServiceObject.neighborhood} `;
      }
      deliveryCad += `${deliveryServiceObject.city}, ` +
        `${deliveryServiceObject.state}, ` +
        `${deliveryServiceObject.country}, ` +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="text-align:left; width: 50px"> Contacto: </td>' +
        '<td colspan="3" style="text-align:right; width: 280px">' +
        `${deliveryServiceObject.contact_name} <br>` +
        `Tel. ${deliveryServiceObject.phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2 $3")} <br>` +
        `Cel. ${deliveryServiceObject.cellphone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2 $3")} <br>` +
        `${deliveryServiceObject.email}` +
        '</td>' +
        '</tr>';
      return call(deliveryCad);
    });
  });
}

function createTicketProductList(productList, discount, call){
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
          `${object.product.description} ` +
          '</span>' +
          '</td>' +
          '<td colspan="1" style="width: 80px; text-align: right; vertical-align:text-top" >' +
          `$ ${object.initial_price.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
          '</tr>';
        if (discount > 0){
          ticketList += '<tr>' +
            `<td colspan="3" style="text-align:left"> ${((1 - (object.final_price / object.initial_price)) * 100).toFixed(0)} % de descuento </td>` +
            `<td colspan="1" style="text-align:right; vertical-align:text-top; min-width:100px"> -$ ${object.discount_applied.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
            '</tr>';
        }

        ticketList += '<tr>' +
          `<td colspan="4" style="text-align:right; vertical-align:text-top"> <strong> $ ${(object.total - object.taxes).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </strong> </td>` +
          '</tr>';

        if (productObject.table === 'serviceOffereds'){
          createDeliveryServiceCad(object, function(deliveryCad){
            deliveriesCad += deliveryCad;
            count++;
            if (count === parseInt(limit)){
              call(ticketList, deliveriesCad);
            }
          });
        } else {
          count++;
          if (count === parseInt(limit)){
            call(ticketList, deliveriesCad);
          }
        }

      });

    }
  }
}

function createPaymentFormList(payments, call){
  let ticketCad = '',
      limit = Object.keys(payments).length,
      count = 0;

  for(var paymentId in payments){
    let payment = payments[paymentId];
    ticketCad += '<tr>' +
      `<td colspan="2" style="text-align:left"> ${payment.paymentForm.description.replace('Por definir', 'Pendiente de pago (Venta a Crédito)')} </td>` +
      `<td colspan="2" style="text-align:right"> $ ${payment.total.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
      '</tr>';
    count++;
    if (count === limit){
      return call(ticketCad);
    }
  }

}

function initTicket(ticketData, call) {
  createTicketProductList(ticketData.products, ticketData.ticket.discount_applied, function(productsCad, deliveriesCad){
    createPaymentFormList(ticketData.payments, function(paymentsCad){
      return call('<!DOCTYPE html>' +
        '<html lang="es">' +
        '<head>' +
        '<meta charset="UTF-8">' +
        '<title> Ticket </title>' +
        '<style type="text/css">' +
        '@media print{' +
        '@page { size:70mm auto; margin-left: 0mm !important}' +
        '}' +
        '</style>' +
        '</head>' +
        '<body style="margin:0 auto !important; padding:0 auto !important">' +
        '<table style="font-family: Courier New; font-size: 14px; width: 330px; text-align: center; vertical-align:text-top">' +
        '<tbody>' +
        '<tr>' +
        '<td colspan="4">' +
        '<strong style="font-size: 17px;">' +
        'Diseños de Cartón <br>' +
        '</strong>' +
        `Sucursal ${ticketData.store.store_name} <br>` +
        '<br>' +
        `${ticketData.billing_address.business_name}` +
        `${ticketData.billing_address.street} ` +
        `${ticketData.billing_address.exterior_number} ` +
        `${ticketData.billing_address.interior_number} <br>` +
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
        `<strong> ${ticketData.ticket.ticket_number} </strong>` +
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
        '<td colspan="1" style="width: 80px">' +
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
        '<tr>' +
        '<td style="text-align:left"> <strong> Forma(s) de pago: </strong> </td>' +
        '</tr>' +
        paymentsCad +
        '<tr>' +
        '<td>' +
        '<br />' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td colspan="2" style="text-align:left">' +
        '<strong>' +
        'Total pagado:' +
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
        deliveriesCad +
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
        '</html>');
    });
  });
}

function createHtmlFile(html, ticketId){
  let fs = require('fs');

  try{
    fs.writeFileSync(`./tickets/TicketNo:_${ticketId}.html`, html);
  }catch (e){
    console.log("Cannot write file ", e);
  }
}

function getTicketsElements(ticketId, call){
  findBy('ticket_id', ticketId, 'store_movements').then(storeMovements => {
    let objects = {
      storeMovements : storeMovements.rows
    };

    findBy('ticket_id', ticketId, 'service_offereds').then(serviceOffereds => {
      objects.serviceOffereds = serviceOffereds.rows;
      return call(objects);
    });

  });
}

function printTicket(ticketInfo, call){

  getTicketsElements(ticketInfo.ticket.id, function(products){

    findBy('id', ticketInfo.store.delivery_address_id, 'delivery_addresses').then(deliveryAddress => {
      ticketInfo.store.deliveryAddress = deliveryAddress.rows[0];

      ticketInfo.products = products;

      initTicket(ticketInfo, function(htmlContent){

        createHtmlFile(htmlContent, ticketInfo.ticket.id);
        win.loadURL("data:text/html;charset=utf-8," + encodeURI(htmlContent));

        let contents = win.webContents;
        win.webContents.on('did-finish-load', () => {
          win.webContents.print({silent: true});
          win = null;
          return call();
        });

      });

    });

  });

}
