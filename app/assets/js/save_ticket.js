let json = {};

function iterateInventories(products, call){
  count = 0;
  products.forEach(product => {
    json[product.id].description              = product.description;
    json[product.id].exterior_color_or_design = product.exterior_color_or_design;
    json[product.id].unique_code              = product.unique_code;

    findBy('product_id', product.id, 'stores_inventories').then(inventory => {

      inventory = inventory.rows[0];

      json[inventory.product_id].inventory_id = inventory.id;
      json[inventory.product_id].quantity     = inventory.quantity;

      count++;
      if (count === products.length) {
        return call();
      }

    });
  });

}

function createTicketProductJson(call){
  let idsCollection = [];

  $.each($('#ticketList tr'), function(){
    let id = $(this).attr('id').replace(/\D/g,'');
    idsCollection.push(
      id
    );
    json[id] = {
      sellQuantity : $(this).find($('td input[id^=cuantityTo]')).val(),
      sellTo       : $(this).find('td[id^=totalTo]').html().replace('$ ',''),
      discount     : $(this).find('td a[id^=discount_]').html().replace(/\s|%/g,'')
    };
  });

  getOnly('products', idsCollection).then(products => {
    iterateInventories(products, function(){
      return call();
    });
  });
}

function quantityMessage(call){
  createTicketProductJson(function(){
    let needed = false,
        message = '<h1>Faltante de producto en relacion</h1>';

    for (var productId in json) {

      let actualInventory          = json[productId].quantity,
        trySellQuantity            = json[productId].sellQuantity,
        unique_code                = json[productId].unique_code,
        description                = json[productId].description,
        exterior_color_or_design   = json[productId].exterior_color_or_design;

      if (actualInventory < trySellQuantity) {

        needed = true;
        message += `<p>Solo hay <strong>${actualInventory} </strong>unidades disponibles en inventario` +
          ` para el producto <strong>${unique_code} ${description}</strong>` +
          ` <strong>${exterior_color_or_design}</strong>. Elija una cantidad menor, seleccione` +
          " otro producto o realice un alta en inventario.</p>";
      }

    }

    return call(message, needed);
  });
}

function validateQuantity (call) {

  quantityMessage(
    function(message, openModal){
     $('body').append('<div class="modal fade" id="modalInfo" tabindex="-1" role="dialog" aria-labelledby="modalInfoLabel">' +
      '<div class="modal-dialog" role="document">' +
        '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '<h4 class="modal-title" id="modalInfoLabel">Informacion</h4>' +
          '</div>' +
          '<div class="modal-body">' +
          message +
    '</div>' +
          '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>');

    if (openModal){
      $('#modalInfo').modal('show');
    }
    return call(!openModal);

  });
}

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
    }
  });
}

function loopSales(salesCall) {
  p = 1;
  salesFinish = $('tr[id^=product_]').length;
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
    query('SELECT MAX(id) as id FROM tickets').then(maxId => {
      insert(['ticket_id', 'product_id', 'quantity', 'initial_price', 'final_price', 'subtotal', 'taxes', 'total', 'discount_applied', 'manual_discount', 'movement_type', 'tax_id', 'automatic_discount', 'cost', 'total_cost'],
        [maxId.rows[0].id, prodId, quantity, unitPrice, finalPrice, fixedSubtotal, fixedTaxes, fixedTotal, fixedDiscount, fixedDiscount, 'venta', 2, 0, 0, 0],
        'store_movements'
      ).then(() =>{
        p += 1;
      });
    });
    if (p == salesFinish) {
      return salesCall();
    }
  });
}

function loopPayments(paymentCall) {
  pa = 1;
  paymentFinish = $('tr[id^=paymentMethod_]').length;
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
  }
}

function updateTicket(ticketCall) {
  payed = false;
  if (paymentsAmount == total) {
    payed = true;
  }
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
}

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

}
