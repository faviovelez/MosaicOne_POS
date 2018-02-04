const localRemote = require('electron').remote;
let localWin = null;
localWin = new localRemote.BrowserWindow({width: 800, height: 600, show: false });

function reimpresion(ticketId) {
  localWin.loadURL(`file://\./tickets/TicketNo_${ticketId}.html)`);

  let contents = localWin.webContents;
  localWin.webContents.on('did-finish-load', () => {
    localWin.webContents.print({silent: true});
    localWin = null;
  });
}
