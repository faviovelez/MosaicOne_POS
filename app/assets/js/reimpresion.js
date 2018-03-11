const localRemote = require('electron').remote;
const userHomeRePrint = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

let localWin = null;

// function reimpresion(ticketId) {
//     cmd.get(`chrome --kiosk-printing --kiosk ${userHomeRePrint}/AppData/Local/Programs/MosaicOne_POS/tickets/TicketNo_${ticketId}.html`);
// }

 function reimpresion(ticketId) {
   localWin = new localRemote.BrowserWindow({width: 800, height: 600, show: false });
   let path = `/tickets/TicketNo_${ticketId}.html`;
   localWin.loadURL(`file://${path}`);

   let contents = localWin.webContents;
   localWin.webContents.on('did-finish-load', () => {
     localWin.webContents.print({silent: true});
     localWin = null;
     localWin.close();
   });
 }

function cancelarTicket(ticketId, isChild = false){
  let Promise = require("bluebird");
  return new Promise(function(resolve, reject){
    updateBy(
      {
        movement_type: 'cancelado'
      },
      'store_movements',
      `ticket_id = ${ticketId}`
    ).then(function(){
      updateBy(
        {
          service_type: 'cancelado'
        },
        'service_offereds',
        `ticket_id = ${ticketId}`
      ).then(function(){
        updateBy(
          {
            payment_type: 'cancelado'
          },
          'payments',
          `ticket_id = ${ticketId}`
        ).then(function(){
          getAll('store_movements', '*', `ticket_id = ${ticketId}`).then(storeMovements => {
            Promise.each(storeMovements.rows, function(storeMovement){
              let warehouseData = {
                product_id : storeMovement.product_id,
                quantity : storeMovement.quantity,
                store_movement_id : storeMovement.id
              }
              let quantity = storeMovement.quantity;
              findBy('product_id', storeMovement.product_id, 'stores_inventories').then(inventory => {
                updateBy(
                  {
                    quantity: (inventory.rows[0].quantity + quantity)
                  },
                  'stores_inventories',
                  `id = ${inventory.rows[0].id}`
                );
              });
              insert(
                Object.keys(warehouseData),
                Object.values(warehouseData),
                'stores_warehouse_entries'
              ).then(function(){});
            }).then(function(){
              updateBy(
                {
                  ticket_type: 'cancelado'
                },
                'tickets',
                `id = ${ticketId}`
              ).then(function(){
                if (isChild)
                  return resolve();

                cancelChildrens(ticketId).then(function(){
                  alert(`El Ticket ${ticketId} ha sido cancelado.`);
                  $('#askForConfirmCancel').modal('hide');
                  resolve();
                  window.location.href = 'pos_sale.html';
                });
              });
            });
          });
        });
      });
    });
  });
}

function cancelChildrens(ticketId){
  return new Promise(function(resolve, reject){
    let promises = [];
    getAll('tickets_children', 'children_id', `ticket_id = ${ticketId}`)
      .then(function(ticketsResults){

        if (ticketsResults.rowCount === 0)
          return resolve(true);
        ticketsResults.rows.forEach(function(chidTicket){
          promises.push(
            cancelarTicket(chidTicket.children_id, true)
          );
        });

        Promise.all(promises).then(function(){
          resolve();
        }).catch(function(err){
          console.log(err);
          resolve();
        });
      });
  });
}
