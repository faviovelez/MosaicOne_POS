// Print logic starts
const remote = require('electron').remote;

let win = null;

// Create window
win = new remote.BrowserWindow({width: 800, height: 600, show: false });

var html = '';

function createTicketStoreMovementList(productList, discount, call){
  let ticketList = '',
      limit = Object.keys(productList.storeMovements).length,
      count = 0;

  for (var productIndex in productList.storeMovements){
    object = productList.storeMovements[productIndex];
    findBy('id', object.product_id, 'products').then(productObject => {
      object.product = productObject.rows[0];
      ticketList += '<tr>' +
        '<td colspan="3" style="text-align:left">' +
        '<span>' +
        `${object.quantity} ` +
        '</span>' +
        '<span>' +
        `${object.product.unique_code} ` +
        '</span>' +
        '<span>' +
        `${object.product.description} ` +
        '</span>' +
        '</td>' +
        '<td colspan="1" style="width: 80px; text-align: right; vertical-align:text-top" >' +
        `$ ${object.initial_price.toFixed(2)} </td>` +
        '</tr>';
      if (discount > 0){
        ticketList += '<tr>' +
          `<td colspan="3" style="text-align:left"> ${((1 - (object.final_price / object.initial_price)) * 100).toFixed(2)} % de descuento </td>` +
          `<td colspan="1" style="text-align:right; vertical-align:text-top"> - $ ${object.discount_applied} </td>` +
          '</tr>';
      }

      ticketList += '<tr>' +
        `<td colspan="4" style="text-align:right; vertical-align:text-top"> <strong> $ ${(object.total - object.taxes)} </strong> </td>` +
        '</tr>';
      count++;

      if (count === parseInt(limit)){
        call(ticketList);
      }
    });
  }
}

function initTicket(ticketData, call) {
  createTicketStoreMovementList(ticketData.products, ticketData.ticket.discount_applied, function(productsCad){
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
      `${ticketData.billing_address.business_name} <br>` +
      '</strong>' +
      `Sucursal ${ticketData.store.store_name} <br>` +
      '<br>' +
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
      `Tel. ${ticketData.store.direct_phone} <br>` +
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
      `<strong> ${ticketData.cash_register.name} </strong>` +
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

      // Un ejemplo con service offerds (sin descuento)
      '<tr>' +
      '<td colspan="3" style="text-align:left">' +
      '<span>' +
      'ticket.service_offered.quantity ' +
      '</span>' +
      '<span>' +
      'ticket.service_offered.service.unique_code ' +
      '</span>' +
      '<span>' +
      'ticket.service_offered.service.description' +
      '</span>' +
      '</td>' +
      '<td colspan="1" style="text-align:right; vertical-align:text-top">' +
      '$ ticket.service_offered.initial_price' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="4" style="text-align:right; vertical-align:text-top"> <strong> $ (ticket.service_offered.total - ticket.service_offered.taxes) </strong> </td>' +
      '</tr>' +
      // Concluye el ejemplo con service offerds sin descuento 

      '<tr>' +
      '<td colspan="2"></td>' +
      '<td colspan="2" style="text-align: right">_________________</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="2" style="text-align: right"> Subtotal: </td>' +
      `<td colspan="2" style="text-align: right"> $ ${ticketData.ticket.subtotal} </td>` +
      '</tr>' +
      '<tr>' +
      '<td colspan="2" style="text-align: right"> IVA 16%: </td>' +
      `<td colspan="2" style="text-align: right"> $ ${ticketData.ticket.taxes} </td>` +
      '</tr>' +
      '<tr>' +
      '<td colspan="2" style="text-align: right">' +
      '<strong> Total: </strong>' +
      '</td>' +
      '<td colspan="2" style="text-align: right">' +
      `<strong> $ ${ticketData.ticket.total} </strong>` +
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

      // Esta parte se itera, una por cada 'payment' ligado al ticket
      '<tr>' +
      '<td colspan="2" style="text-align:left"> ticket.payment.payment_form.description </td>' + // Esta tabla actualmente no la llenamos, sería mejor traerla de web
      '<td colspan="2" style="text-align:right"> $ ticket.payment.total </td>' +
      '</tr>' +
      // Aquí termina el ejemplo de un payment

      // Estos espacios son para diseño (conservarlos)
      '<tr>' +
      '<td>' +
      '<br />' +
      '</td>' +
      '</tr>' +
      // Aquí terminan los espacios para diseño (conservarlos), 

      '<tr>' +
      '<td colspan="2" style="text-align:left">' +
      '<strong>' +
      'Total pagado:' +
      '</strong>' +
      '</td>' +
      '<td colspan="2" style="text-align:right">' +
      '<strong>' +
      `$ ${ticketData.ticket.payments_amount}` +
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
      `$ ${ticketData.ticket.cash_return}` +
      '</strong>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="5">' +
      '_______________________________________ <br /> <br />' +
      '</td>' +
      '</tr>' +

      // A partir de esta línea, se llena solo si hay uno o más delivery services en el ticket (se repite desde esta línea hasta el siguente comentario)
      '<tr>' +
      '<td colspan="4"> <strong>' +
      'Detalles del envío' +
      '</strong>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="1" style="text-align: left"> Empresa: </td>' +
      '<td colspan="3" style="text-align: right">' +
      '<strong>' +
      'ticket.service_offered.service.delivery_company' +
      '</strong>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="1" style="text-align:left"> Guía: </td>' +
      '<td colspan="4" style="text-align:right">' +
      '<strong>' +
      'ticket.service_offered.delivery_service.tracking_number' +
      '</strong>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="1" style="text-align:left"> Nombre: </td>' +
      '<td colspan="3" style="text-align:right">' +
      '<strong>' +
      'ticket.service_offered.delivery_service.sender_name' +
      '</strong>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="2" style="text-align:left"> C.P. Envío:' +
      '<span>' +
      '<strong>' +
      'ticket.service_offered.delivery_service.sender_zipcode' +
      '</strong>' +
      '</span>' +
      '</td>' +
      '<td colspan="2" style="text-align:right"> C.P. Dest.:' +
      '<span>' +
      '<strong>' +
      'ticket.service_offered.delivery_service.recievers_zipcode' +
      '</strong>' +
      '</span>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="1" style="text-align:left"> Destintario: </td>' +
      '<td colspan="3" style="text-align:right">' +
      '<strong>' +
      'ticket.service_offered.delivery_service.recievers_name' +
      '</strong>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="text-align:left; width: 50px"> Dir. destino: </td>' +
      '<td colspan="3" style="text-align:right; width: 280px">' +
      'ticket.service_offered.delivery_service.street ' +
      'ticket.service_offered.delivery_service.exterior_number ' +

      // Solo si existe ticket.service_offered.delivery_service.interior_number
      'Int. ' +
      'ticket.service_offered.delivery_service.interior_number ' +
      // Si no existe, omitir estas dos líneas

      // Solo si existe ticket.service_offered.delivery_service.neighborhood
      'Col.  ' +
      'ticket.service_offered.delivery_service.neighborhood ' +
      // Si no existe, omitir estas dos líneas

      'ticket.service_offered.delivery_service.city, ' +
      'ticket.service_offered.delivery_service.state, ' +
      'ticket.service_offered.delivery_service.country, ' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="text-align:left; width: 50px"> Contacto: </td>' +
      '<td colspan="3" style="text-align:right; width: 280px">' +
      'ticket.service_offered.delivery_service.contact_name <br>' +
      'Tel. ticket.service_offered.delivery_service.phone <br>' +
      'Cel. ticket.service_offered.delivery_service.cellphone <br>' + // si hay una opción como en rails (number_to_phone(1235551234, area_code: true, extension: 555)), mejor, si no, como está
      'ticket.service_offered.delivery_service.email' +
      '</td>' +
      '</tr>' +
      // Aquí termina la sección para delivery services del ticket

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
      '<span> store.delivery_address.city, </span>' +
      '<span> store.delivery_address.state </span>' +
      `<span> ${ticketData.ticket.created_at} </span>` + //En formato fecha dd/mm/aaaa
      `<span> ${ticketData.ticket.created_at} </span>` + //en formato hora (ya sea 12 o 24 hrs)
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
      '<span> ticket.user.first_name ticket.user.last_name </span>' +
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

function printTicket(ticketInfo){

  getTicketsElements(ticketInfo.ticket.id, function(products){
    ticketInfo.products = products;

    initTicket(ticketInfo, function(htmlContent){

      createHtmlFile(htmlContent, ticketInfo.ticket.id);
      win.loadURL("data:text/html;charset=utf-8," + encodeURI(htmlContent));

      let contents = win.webContents;
      win.webContents.on('did-finish-load', () => {
        win.webContents.print({silent: true});
        win = null;
      });

    });

  });

}
