// Print logic starts
const remote = require('electron').remote;

let win = null;

// Create window
win = new remote.BrowserWindow({width: 800, height: 600, show: false });

var html =
  '<!DOCTYPE html>' +
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
  '</html>';

win.loadURL("data:text/html;charset=utf-8," + encodeURI(html));

let contents = win.webContents;

function printTicket(){
  // if document is loaded start printing.
  win.webContents.on('did-finish-load', () => {
    // change true for windows testing
    debugger
    win.webContents.print({silent: false, deviceName: ''});
    // close window after print order.
    debugger
    win = null;
  });
};

// Print logic finishes
