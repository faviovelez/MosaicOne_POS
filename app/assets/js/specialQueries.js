function getCashRegisterSum(){
  return 'SELECT (SUM((SELECT SUM(deposits.amount) as d FROM deposits)) ' +
      '- SUM((SELECT SUM(withdrawals.amount) as w FROM withdrawals)) + ' +
      'SUM((SELECT (SUM(payments.total) - SUM(tickets.cash_return)) as s ' +
      'FROM payments INNER JOIN tickets ON tickets.id = payments.ticket_id ' +
      "WHERE payment_type = 'pago' AND payment_form_id = 1 AND ticket_type = 'venta'))) as sum";
}
