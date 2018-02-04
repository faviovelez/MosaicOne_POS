const localRemote = require('electron').remote;
let localWin = null;

function reimpresion(ticketId) {
  localWin = new localRemote.BrowserWindow({width: 800, height: 600, show: false });
  let path = `./tickets/TicketNo_${ticketId}.html`;
  localWin.loadURL(`file://${path}`);

  let contents = localWin.webContents;
  localWin.webContents.on('did-finish-load', () => {
    localWin.webContents.print({silent: true});
    localWin = null;
  });
}
