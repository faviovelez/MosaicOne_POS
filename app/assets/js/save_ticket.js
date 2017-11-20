function validateQuantity () {
  // Validar si hay suficiente para vender, si no, enviar un mensaje dentro de un alert o una modal con un mensaje que contenga el el código de producto (unique_code), descripción, color y  la cantidad disponible en inventario. ejemplo:

  // "Solo hay x unidades disponibles en inventario para el producto 12345 Caja sastre decorada kraft. Elija una cantidad menor, seleccione otro producto o realice un alta en inventario."
};

function assignCost() {
  // Asigna el costo de venta (tomado del store_movement relacionado a el (o los) stores_warehouse_entry)(es) del que se está dando de baja al vender)

   query('SELECT stores_warehouse_entries.id, stores_warehouse_entries.quantity, store_movements.cost FROM stores_warehouse_entries INNER JOIN store_movements ON stores_warehouse_entries.store_movement_id = store_movements.id WHERE stores_warehouse_entries.product_id = #{prodId} ORDER BY stores_warehouse_entries.id ').then(entries => {
     n = 0;
     while (n < entries.rows.length) {
       // Aquí debe ir la lógica para iterar cada store warehouse entry y crear un store_movement con el costo total de los productos vendidos:
       //ejemplo:
       // venta de 30 unidades de producto x, hay 50 unidades en inventario en 2 stores_warehouse_entries:
       // warehouse_entry.id = 1, warehouse_entry.quantity = 20, warehouse_entry.store_movement.cost = 1.00
       // warehouse_entry.id = 2, warehouse_entry.quantity = 30, warehouse_entry.store_movement.cost = 2.00
       // El store_movement de venta debe tener como 'total_cost' = ((20 * 1.00) + (30 * 2.00)), es decir 80.0
       // El campo 'cost' debe tener this.total_cost / this.quantity (80.0 / 50) es decir 1.60

       // Esta lógica se debe integrar a la función loopSales para asignar los campos 'cost' y 'total_cost'
     };
   });
};

function loopSales(salesCall) {
  p = 1;
  salesFinish = $('tr[id^=product_]').length
  $.each($('tr[id^=product_]'), function(){
    prodId = parseInt($(`tr[id^=product_]:nth-child(${p})`).attr('id').replace("product_", ""));
    unitPrice = parseFloat($(`tr[id^=product_]:nth-child(${p})`).children('td:nth-child(4)').text().replace("$ ","").replace(",",""));
    quantity = parseInt($(`tr[id^=product_]:nth-child(${p})`).children('td:nth-child(5)').children().val());
    discPercent = (parseFloat($(`tr[id^=product_]:nth-child(${p})`).children('td:nth-child(6)').children().text().replace(" %", "")) / 100);

    subtotal = (unitPrice * quantity);
    finalPrice = (unitPrice * (1 - discPercent));
    discount = (subtotal * discPercent);
    taxes = ((subtotal - discount) * 0.16);
    total = (subtotal - discount + taxes);
    paymentsAmount = 0;

    fixedSubtotal = parseFloat(subtotal.toFixed(2));
    fixedDiscount = parseFloat(discount.toFixed(2));
    fixedTaxes = parseFloat(taxes.toFixed(2));
    fixedTotal = parseFloat(total.toFixed(2));
    debugger
    query('SELECT MAX(id) as id FROM tickets').then(maxId => {
      insert(['ticket_id', 'product_id', 'quantity', 'initial_price', 'final_price', 'subtotal', 'taxes', 'total', 'discount_applied', 'manual_discount', 'movement_type', 'tax_id', 'automatic_discount', 'cost', 'total_cost'],
              [maxId.rows[0].id, prodId, quantity, unitPrice, finalPrice, fixedSubtotal, fixedTaxes, fixedTotal, fixedDiscount, fixedDiscount, 'venta', 2, 0, 0, 0],
              'store_movements'
            ).then({
              p += 1;
            });
          });
  if (p == salesFinish) {
    return salesCall();
  };
  });
};

function loopPayments(paymentCall) {
  pa = 1;
  paymentFinish = $('tr[id^=paymentMethod_]').length
  $.each($('tr[id^=paymentMethod_]'), function(){
    totalPay = parseFloat($(`tr[id^=paymentMethod_]:nth-child(${pa})`).children('td.right.cuantity').text().replace("$ ", "").replace(",",""));

    paymentsAmount += totalPay;
    desc = $(`tr[id^=paymentMethod_]:nth-child(${pa})`).children().children().text().replace("×", "");

    payFormId = 0;
    if (desc == "VentaaCrédito") {
      payFormId = 21;
    } else if (desc == "Efectivo") {
      payFormId = 1;
    } else if (desc == "Débito") {
      payFormId = 18;
    } else if (desc == "Crédito") {
      payFormId = 4;
    } else if (desc == "Cheque") {
      payFormId = 2;
    } else if (desc == "Transferencia") {
      payFormId = 3;
    } else if (desc == "Otra") {
      payFormId = 21;
    }
    query('SELECT MAX(id) as id FROM tickets').then(maxId => {
      insert(['ticket_id', 'payment_form_id', 'total', 'payment_type'],
           [maxId.rows[0].id, payFormId, totalPay, 'pago'],
           'payments'
         ).then(() => {
           pa += 1;
     });
   });
 });
 if (pa == paymentFinish) {
   return paymentCall();
 };
};

function updateTicket(ticketCall) {
  payed = false;
  if (paymentsAmount == total) {
    payed = true;
  };
  query('SELECT MAX(id) as id FROM tickets').then(maxId => {
    let id = maxId.rows[0].id,
      table = 'tickets',
      condition = `id = ${id}`,
      data = {
        'payments_amount': paymentsAmount,
        'payed': payed,
      };
      findBy('id', id, 'tickets').then(() => {
        updateBy(data, table, condition).then(() =>{
        });
      });
  });
  return ticketCall();
};

function saveTicket(call){
  subtotal = parseFloat($('#savedSubtotal').text().replace(" $ ","").replace(",", ""));
  taxes = parseFloat($('.right.subtotal.iva').text().replace("$ ", "").replace(",", ""));
  total = parseFloat($('.right.bigger.total').text().replace("$ ","").replace(",", ""));
  taxId = 2;
  ticketType = 'venta';
  paymentsAmount = 0;
  cashReturn = parseFloat($('#currencyChange').text().replace("$ ", "").replace(",",""));
  ticketNumber = parseInt($('#ticketNum').text().replace(" ", ""));

  insert(['subtotal', 'taxes', 'total', 'tax_id', 'ticket_type', 'payments_amount',
            'cash_return','ticket_number', 'user_id'],
         [subtotal, taxes, total, taxId, ticketType, paymentsAmount,
            cashReturn, ticketNumber, user],
         'tickets'
       ).then(() => {
         loopPayments(function () {
           updateTicket(function () {
             loopSales(function () {
               printTicket();
               return call();
             });
           });
         });
       });

};
