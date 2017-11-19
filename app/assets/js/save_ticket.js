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
         printTicket();
         return call();
       });

};
