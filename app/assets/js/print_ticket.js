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
              'Diseños de Cartón S.A. de C.V. <br>' +
            '</strong>' +
            'Sucursal Patria <br>' +
            '<br>' +
            'Av. de la Patria 124 <br>' +
            'Col. Jardines Vallarta <br>' +
            'Zapopan, Jalisco. C.P. 44490 <br>' +
            'RFC: DCA8603175G2 <br>' +
            '<br>' +
            '<strong>' +
              'Régimen fiscal: <br>' +
            '</strong>' +
            'Régimen General de Ley Personas Morales <br>' +
            '<br>' +
            'Tel. (33) 3162-1401 <br>' +
            'facturacion1@disenosdecarton.com.mx <br>' +
            'www.disenosdecarton.com.mx <br>' +
            '_______________________________________ <br /> <br />' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td style="text-align:left">' +
            '<strong>' +
              'Venta' +
            '</strong>' +
          '</td>' +
          '<td>' +
            'Caja' +
            '<span>' +
              '<strong> 1 </strong>' +
            '</span>' +
          '</td>' +
          '<td colspan="2" style="text-align:right">' +
            'Ticket:' +
            '<span>' +
              '<strong> 124 </strong>' +
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
        '<tr>' +
          '<td colspan="3" style="text-align:left">' +
            '<span>' +
              '10' +
            '</span>' +
            '<span>' +
              '5034 ' +
            '</span>' +
            '<span>' +
              'Bolsa para botella Kraft Satinada Navideña' +
            '</span>' +
          '</td>' +
          '<td colspan="1" style="width: 80px; text-align: right; vertical-align:text-top" > $ 26.50 </td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="3" style="text-align:left"> 5% de descuento </td>' +
          '<td colspan="1" style="text-align:right; vertical-align:text-top"> - $ 13.25 </td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="4" style="text-align:right; vertical-align:text-top"> <strong> $ 251.75 </strong> </td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="3" style="text-align:left">' +
            '<span>' +
              '1' +
            '</span>' +
            '<span>' +
              '3103' +
            '</span>' +
            '<span>' +
              'Cilindro de acetato botella decorado Nav' +
            '</span>' +
          '</td>' +
          '<td colspan="1" style="width: 80px; text-align: right; vertical-align:text-top"> $ 37.50 </td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="3" style="text-align:left; display:none"> 0% de descuento </td>' +
          '<td colspan="1" style="text-align:right; display:none"> - 0.0 </td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="4" style="text-align:right; vertical-align:text-top"> <strong> $ 37.50 </strong> </td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="3" style="text-align:left">' +
            '<span>' +
              '1 ' +
            '</span>' +
            '<span>' +
              '2102 ' +
            '</span>' +
            '<span>' +
              'Servicio de mensajería UPS (Nacional)' +
            '</span>' +
          '</td>' +
          '<td colspan="1" style="text-align:right; vertical-align:text-top">' +
            '$ 100.00' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="4" style="text-align:right; vertical-align:text-top"> <strong> $ 100.00 </strong> </td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="2"></td>' +
          '<td colspan="2" style="text-align: right">_________________</td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="2" style="text-align: right"> Subtotal: </td>' +
          '<td colspan="2" style="text-align: right"> $ 375.46 </td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="2" style="text-align: right"> IVA 16%: </td>' +
          '<td colspan="2" style="text-align: right"> $ 13.79 </td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="2" style="text-align: right">' +
            '<strong> Total: </strong>' +
          '</td>' +
          '<td colspan="2" style="text-align: right">' +
            '<strong> $ 389.25 </strong>' +
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
        '<tr>' +
          '<td colspan="2" style="text-align:left"> Efectivo </td>' +
          '<td colspan="2" style="text-align:right"> $ 200.00 </td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="2" style="text-align:left"> Tarjeta de crédito </td>' +
          '<td colspan="2" style="text-align:right"> $ 189.25 </td>' +
        '</tr>' +
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
              '$ 389.25' +
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
              '$ 0.00' +
            '</strong>' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="5">' +
            '_______________________________________ <br /> <br />' +
          '</td>' +
        '</tr>' +
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
              'UPS' +
            '</strong>' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="1" style="text-align:left"> Guía: </td>' +
          '<td colspan="4" style="text-align:right">' +
            '<strong>' +
              'DA1S89D1AS98F189QWF' +
            '</strong>' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="1" style="text-align:left"> Nombre: </td>' +
          '<td colspan="3" style="text-align:right">' +
            '<strong>' +
              'Pedro Martínez' +
            '</strong>' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="2" style="text-align:left"> C.P. Envío:' +
            '<span>' +
              '<strong>' +
                '45060' +
              '</strong>' +
            '</span>' +
          '</td>' +
          '<td colspan="2" style="text-align:right"> C.P. Dest.:' +
            '<span>' +
              '<strong>' +
                '88600' +
              '</strong>' +
            '</span>' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td colspan="1" style="text-align:left"> Destintario: </td>' +
          '<td colspan="3" style="text-align:right">' +
            '<strong>' +
              'María Antonieta' +
            '</strong>' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td style="text-align:left; width: 50px"> Dir. destino: </td>' +
          '<td colspan="3" style="text-align:right; width: 280px">' +
            'Av. Aguascalientes 701, Int. 2, Col. Fátima, Aguascalientes, Aguascalientes, México' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td style="text-align:left; width: 50px"> Contacto: </td>' +
          '<td colspan="3" style="text-align:right; width: 280px">' +
            'María Antonieta <br>' +
            'Tel. (33) 3816-28-30 <br>' +
            'Cel. 333-745-28-90 <br>' +
            'mariaantonieta@hotmail.com' +
          '</td>' +
        '</tr>' +
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
            '<span> Zapopan, </span>' +
            '<span> Jalisco </span>' +
            '<span> 10/10/2017 </span>' +
            '<span> 14:23:17 </span>' +
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
            '<span> Favio Velez </span>' +
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
