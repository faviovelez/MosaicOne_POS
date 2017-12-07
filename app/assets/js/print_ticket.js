// Print logic starts
const remote = require('electron').remote;

let win = null;

// Create window
win = new remote.BrowserWindow({width: 800, height: 600, show: false });

var html = '';

function initTicket(ticketInfo) {
  return '<!DOCTYPE html>' +
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
              'store.business_unit.billing_address.business_name <br>' +
            '</strong>' +
            'Sucursal store.store_name <br>' +
            '<br>' +
            'store.business_unit.billing_address.street ' +
            'store.business_unit.billing_address.exterior_number ' + 
            'store.business_unit.billing_address.interior_number <br>' +
            'Col. store.business_unit.billing_address.neighborhood <br>' +
            'store.business_unit.billing_address.city, ' + 
            'store.business_unit.billing_address.state. ' +
            'C.P. store.business_unit.billing_address.zipcode <br>' +
            'RFC: store.business_unit.billing_address.rfc <br>' +
            '<br>' +
            '<strong>' +
              'Régimen fiscal: <br>' +
            '</strong>' +
            'store.business_unit.billing_address.tax_regime.description <br>' + //Esta tabla no nos la estamos trayendo pero hay que traerla
            '<br>' +
            'Tel. store.direct_phone <br>' + // si hay una opción como en rails (number_to_phone(1235551234, area_code: true, extension: 555)), mejor, si no, como está
            'store.email <br>' +
            'www.disenosdecarton.com.mx <br>' +
            '_______________________________________ <br /> <br />' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td style="text-align:left">' +
            '<strong>' +
              'ticket.ticket_type' +
            '</strong>' +
          '</td>' +
          '<td>' +
            'Caja ' +
            '<span>' +
              '<strong> ticket.cash_register.name </strong>' +
            '</span>' +
          '</td>' +
          '<td colspan="2" style="text-align:right">' +
            'Ticket: ' +
            '<span>' +
              '<strong> ticket.ticket_number </strong>' +
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

        // Estas líneas se iteran (1 por cada store_movement o service_offered que exista):
        // Pueden ser tanto store_movement como service_offereds (ejemplo con store_movements)
        '<tr>' +
          '<td colspan="3" style="text-align:left">' +
            '<span>' +
              'ticket.store_movement.quantity ' +
            '</span>' +
            '<span>' +
              'ticket.store_movement.product.unique_code ' +
            '</span>' +
            '<span>' +
              'ticket.store_movement.product.description ' +
            '</span>' +
          '</td>' +
          '<td colspan="1" style="width: 80px; text-align: right; vertical-align:text-top" >' +
            '$ ticket.store_movement.initial_price </td>' +
        '</tr>' +

        // Estas líneas son condicionales (solo si hay descuento, 'ticket.discount_applied > 0' ya sea en store_movement o service_offereds)
        '<tr>' +
          '<td colspan="3" style="text-align:left"> ((1 - (ticket.store_movement.final_price / ticket.store_movement.initial_price)) * 100).toFixed(2) % de descuento </td>' +
          '<td colspan="1" style="text-align:right; vertical-align:text-top"> - $ ticket.store_movement.discount_applied </td>' +
        '</tr>' +
        // Concluyen las líneas condicionales con descuento

        '<tr>' +
          '<td colspan="4" style="text-align:right; vertical-align:text-top"> <strong> $ (ticket.store_movement.total - ticket.store_movement.taxes) </strong> </td>' +
        '</tr>' +
        // Concluye el ejemplo con store_movement


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
          '<td colspan="2" style="text-align: right"> $ ticket.subtotal </td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="2" style="text-align: right"> IVA 16%: </td>' +
          '<td colspan="2" style="text-align: right"> $ ticket.taxes </td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="2" style="text-align: right">' +
            '<strong> Total: </strong>' +
          '</td>' +
          '<td colspan="2" style="text-align: right">' +
            '<strong> $ ticket.total </strong>' +
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
              '$ ticket.payments_amount' +
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
              '$ ticket.cash_return' +
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
            '<span> ticket.created_at </span>' + //En formato fecha dd/mm/aaaa
            '<span> ticket.created_at </span>' + //en formato hora (ya sea 12 o 24 hrs)
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
  '</html>';
}


function printTicket(ticketInfo){
  win.loadURL("data:text/html;charset=utf-8," + encodeURI(initTicket(
    ticketInfo
  )));

  let contents = win.webContents;
  win.webContents.on('did-finish-load', () => {
    win.webContents.print({silent: true});
    win = null;
  });
}
