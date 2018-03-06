const userHomeRePrint = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

function reimpresion(ticketId) {
    cmd.get(`chrome --kiosk-printing --kiosk ${userHomeRePrint}/AppData/Local/Programs/MosaicOne_POS/tickets/TicketNo_${ticketId}.html`);
}

function cancelarTicket(ticketId){
  let Promise = require("bluebird");
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
              alert(`El Ticket ${ticketId} ha sido cancelado.`);
              $('#askForConfirmCancel').modal('hide');
              window.location.href = 'pos_sale.html';
            });
          });
        });
      });
    });
  });
}
