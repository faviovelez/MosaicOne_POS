const localRemote = require('electron').remote;
const userHomeRePrint = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

let localWin = null;

// function reimpresion(ticketId) {
//     cmd.get(`chrome --kiosk-printing ${userHomeRePrint}/AppData/Local/Programs/MosaicOne_POS/tickets/TicketNo_${ticketId}.html`);
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

function getCashRegisterSum(){
  return 'SELECT (SUM((SELECT COALESCE(SUM(deposits.amount),0) as d FROM deposits)) ' +
        '- SUM((SELECT COALESCE(SUM(withdrawals.amount),0) as w FROM withdrawals)) + ' +
        'SUM((SELECT (COALESCE(SUM(' +
        "CASE WHEN payments.payment_type = 'pago' AND payments.payment_form_id = 1 THEN payments.total " +
        "WHEN payments.payment_type = 'devolución' AND payments.payment_form_id = 1 THEN -payments.total " +
        'ELSE 0 ' +
        'END ' +
        '),0)) as s ' +
        'FROM payments INNER JOIN tickets ON tickets.id = payments.ticket_id ' +
        "WHERE (tickets.ticket_type != 'pending' AND payments.payment_form_id = 1)))) as sum";
}

 function warehouseEntriesQuery(productId){
   return ' SELECT stores_warehouse_entries.product_id' +
     ` as idIs${productId}, store_movements.cost, stores_warehouse_entries.* FROM ` +
     ' stores_warehouse_entries' +
     ' INNER JOIN store_movements ON' +
     ' stores_warehouse_entries.store_movement_id' +
     ' = store_movements.id WHERE ' +
     `stores_warehouse_entries.product_id = ${productId} ` +
     "ORDER BY stores_warehouse_entries.id ";
 }

  function queryMovsAndWarehouses(ticketId) {
    return 'SELECT store_movements.id, store_movements.quantity, ' +
    'store_movements.movement_type, store_movements.product_id, ' +
    'stores_inventories.quantity AS inv_quantity FROM(SELECT id, ticket_type, ' +
    "(date_trunc('day', created_at) + interval '1 day' - interval '1 second' - interval '1 day') as start_date, " +
    `(date_trunc('day', created_at) + interval '1 day') as end_date FROM tickets WHERE id = ${ticketId}) AS results_tickets ` +
    'INNER JOIN store_movements ON store_movements.ticket_id = results_tickets.id ' +
    'INNER JOIN stores_inventories ON store_movements.product_id = stores_inventories.product_id ' +
    'WHERE (store_movements.created_at > results_tickets.start_date ' +
    'AND store_movements.created_at < results_tickets.end_date) ' +
    'UNION ALL ' +
    "SELECT id, quantity, 'warehouse_entry' AS movement_type, product_id, 0 AS inv_quantity " +
    'FROM stores_warehouse_entries WHERE product_id IN (' +
    'SELECT store_movements.product_id FROM(SELECT id, ticket_type, ' +
    "(date_trunc('day', created_at) + interval '1 day' - interval '1 second' - interval '1 day') as start_date, " +
    `(date_trunc('day', created_at) + interval '1 day') as end_date FROM tickets WHERE id = ${ticketId}) AS results_tickets ` +
    'INNER JOIN store_movements ON store_movements.ticket_id = results_tickets.id ' +
    'WHERE (store_movements.created_at > results_tickets.start_date ' +
    'AND store_movements.created_at < results_tickets.end_date)) ORDER BY movement_type, product_id, id';
  }

  function filterObject(object){
    salesObject = {};
    returnsObject = {};
    warehousesObject = {};
    for(var i=0; i < object.length; i++) {
      for(key in object[i]) {
        if (object[i].movement_type.indexOf('devolución') !=-1) {
          if (returnsObject[object[i].product_id] === undefined) {
            returnsObject[object[i].product_id] = [];
            returnsObject[object[i].product_id].push(object[i]);
          } else {
            if (returnsObject[object[i].product_id].indexOf(object[i]) == -1) {
              returnsObject[object[i].product_id].push(object[i]);
            }
          }
          if (warehousesObject[object[i].product_id] === undefined) {
            warehousesObject[object[i].product_id] = [];
          }
        } else if (object[i].movement_type.indexOf('warehouse_entry') != -1) {
          if (warehousesObject[object[i].product_id] !== undefined) {
            if (warehousesObject[object[i].product_id].indexOf(object[i]) == -1) {
              warehousesObject[object[i].product_id].push(object[i]);
            }
          }
        } else if (object[i].movement_type.indexOf('venta') != -1) {
          if (salesObject[object[i].product_id] === undefined) {
            salesObject[object[i].product_id] = [];
            salesObject[object[i].product_id].push(object[i]);
          } else {
            if (salesObject[object[i].product_id].indexOf(object[i]) == -1) {
              salesObject[object[i].product_id].push(object[i]);
            }
          }
        }
      }
    }
  }

  function cancelarTicket(ticketId, isChild = false){
    let queryMov = queryMovsAndWarehouses(ticketId),
        cancelQuery = '';
    query(queryMov).then(storeMovs => {
      filterObject(storeMovs.rows);
      Object.values(salesObject).forEach(function(sale){
        cancelQuery += `UPDATE stores_inventories SET quantity = ${sale[0].inv_quantity} + ${sale[0].quantity}, web = false WHERE product_id = ${sale[0].product_id}; `;
        cancelQuery += `UPDATE store_movements SET movement_type = 'cancelado', web = false WHERE id = ${sale[0].id}; `;
        let warehouseData = {
          product_id : sale[0].product_id,
          quantity : sale[0].quantity,
          store_movement_id : sale[0].id
        };
        let newDateWarehouse = Date().toString().replace(/GMT.*/,'');
        warehouseData.created_at = `'${newDateWarehouse}'`;
        warehouseData.updated_at = `'${newDateWarehouse}'`;
        warehouseData.pos = true;
        warehouseData.web = false;
        cancelQuery += `INSERT INTO stores_warehouse_entries (${Object.keys(warehouseData)}) VALUES (${Object.values(warehouseData)}); `;
      });
      if (Object.keys(returnsObject).length > 0) {
        Object.values(returnsObject).forEach(function(returnMov){
          cancelQuery += `UPDATE stores_inventories SET quantity = ${returnMov[0].inv_quantity} - ${returnMov[0].quantity}, web = false WHERE product_id = ${returnMov[0].product_id}; `;
          cancelQuery += `UPDATE store_movements SET movement_type = 'cancelado', web = false WHERE id = ${returnMov[0].id}; `;
          let mov = returnMov[0],
              prodQuantity = mov.quantity;
          if (warehousesObject[returnMov[0].product_id].length > 0) {
            warehousesObject[returnMov[0].product_id].forEach(function(warehouse){
              while(prodQuantity > 0) {
                if (prodQuantity < warehouse.quantity) {
                  let thisQ = warehouse.quantity - prodQuantity;
                  cancelQuery += `UPDATE stores_warehouse_entries SET quantity = ${thisQ} WHERE id = ${warehouse.id}; `;
                  prodQuantity = 0;
                } else {
                  prodQuantity -= warehouse.quantity;
                  cancelQuery += `DELETE FROM stores_warehouse_entries WHERE id = ${warehouse.id}; `;
                }
              }
            });
          } else {
            let warehouseData = {
              product_id : mov.product_id,
              quantity : - mov.quantity,
              store_movement_id : mov.id
            };
            let newDateWarehouse = Date().toString().replace(/GMT.*/,'');
            warehouseData.created_at = `'${newDateWarehouse}'`;
            warehouseData.updated_at = `'${newDateWarehouse}'`;
            warehouseData.pos = true;
            warehouseData.web = false;
            cancelQuery += `INSERT INTO stores_warehouse_entries (${Object.keys(warehouseData)}) VALUES (${Object.values(warehouseData)}); `;
          }
        });
      }
      salesObject = null;
      returnsObject = null;
      warehousesObject = null;
      cancelQuery += `UPDATE payments SET payment_type = 'cancelado', web = false WHERE ticket_id = ${ticketId}; `;
      cancelQuery += `UPDATE service_offereds SET service_type = 'cancelado', web = false WHERE ticket_id = ${ticketId}; `;
      cancelQuery += `UPDATE tickets SET ticket_type = 'cancelado', web = false WHERE id = ${ticketId}; `;
      query(cancelQuery).then(() => {
        if (isChild) {
          window.location.href = 'pos_sale.html';
          return false;
        }
        cancelChildrens(ticketId);
        query(getCashRegisterSum()).then(sumObject => {
          cash_balance = sumObject.rows[0].sum;
          query(`UPDATE cash_registers SET balance = ${cash_balance}`).then(() => {});
        });
        alert(`El Ticket ${ticketId} ha sido cancelado.`);
        $('#askForConfirmCancel').modal('hide');
        window.location.href = 'pos_sale.html';
      }); // cancelQuery
    }); // queryMov
  } // function

function cancelChildrens(ticketId){
  getAll('tickets_children', 'children_id', `ticket_id = ${ticketId}`).then(ticketsResults => {
    if (ticketsResults.rowCount === 0) {
      return true;
    }
    ticketsResults.rows.forEach(function(chidTicket){
      cancelarTicket(chidTicket.children_id, true);
    });
  });
}
