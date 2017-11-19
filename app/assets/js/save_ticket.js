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
       ).then({});

  p = 1;
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
            ).then({});
    });
    p += 1;
  });
  pa = 1;
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
         ).then(payment => {
       });
     });
    pa += 1;
    });
    payed = false;
    if (paymentsAmount == total) {
      payed = true;
    };
    query('SELECT MAX(id) as id FROM tickets').then(maxId => {
      insert(
              ['payments_amount', 'payed'],
              [maxId.rows[0].id, payed],
              'tickets'
            ).then(() => {
              printTicket();
              return call();
            });
    });


};