let json          = {},
    count         = 0;

function iterateInventories(products, call){
  count = 0;
  products.forEach(product => {
    json[product.id].description              = product.description;
    json[product.id].exterior_color_or_design = product.exterior_color_or_design;
    json[product.id].unique_code              = product.unique_code;
    json[product.id].supplier_id              = product.supplier_id;
    json[product.id].price                    = product.price;

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
      sellQuantity   : $(this).find($('td input[id^=cuantityTo]')).val(),
      sellTo         : $(this).find('td[id^=totalTo]').html().replace('$ ','').replace(/,/g,''),
      discount       : $(this).find('td a[id^=discount_]').html().replace(/\s|%|,/g,''),
      discountReason : $(this).find('td[id^=discountReasonTo]').html()
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
  json = {};
  $('#modalInfo').remove();
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

function updateStoreInventories(productId, quantity){
  quantity = quantity;

  findBy('product_id', productId, 'stores_inventories').then(inventory => {
    updateBy(
      {
        quantity: (inventory.rows[0].quantity - quantity)
      },
      'stores_inventories',
      `id = ${inventory.rows[0].id}`
    );
  });

}

function createStoreMovement(data, productId, call){
  json[productId].storeMovement = data;
  productId = productId;
  insert(
    Object.keys(data),
    Object.values(data),
    'store_movements'
  ).then(storeMovement => {
    count++;
    if (count === Object.keys(json).length){
      call();
    }
  });
}

function setPayedLogic(data){
  let creditPaymentSelector = 'tr[id^=paymentMethod][data-type="Venta a Crédito"]';
  if ($(creditPaymentSelector).length > 0){
    let creditPaymentQuantity = $(creditPaymentSelector).find('td.cuantity').html().replace(/\s|\$|,/g,''),
        realPayment           =  data.payments_amount - creditPaymentQuantity;
    if (realPayment <= data.total) {
      data.payed = false;
      data.payments_amount = realPayment;
    }
  }
}

function insertTicket(userId, call){
  let data = {
    user_id       : userId,
    subtotal      : $('#savedSubtotal').html().replace(/\s|\$|,/g,''),
    tax_id        : 2,
    taxes         : $('.subtotal.iva').html().replace(/\s|\$|,/g,''),
    total         : $('.bigger.total').html().replace(/\s|\$|,/g,''),
    ticket_type   : 'venta',
    payed         : true,
    ticket_number : parseInt($('#ticketNum').html()),
    comments      : $('input[placeholder=Comentarios]').val(),
    payments_amount : $('#sumPayments').html(),
    cash_return     : $('#currencyChange strong').html().replace(/\s|\$|,/g,''),
    cfdi_use_id     : $('#prospect_cfdi_use').val()
  };

  setPayedLogic(data);

  if (typeof data.cfdi_use_id === 'undefined') {
    delete data.cfdi_use_id;
  }

  if ($('#prospectList a').length === 1) {
    let prospectId   = $('#prospectList a').attr('data-id');
    data.prospect_id = prospectId;
  }

  insert(
    Object.keys(data),
    Object.values(data),
    'tickets'
  ).then(ticket => {
    call(ticket.lastId);
  });
}

function assignCost(ticketId, call) {
  count = 0;
  for (var productId in json){
    let localQuery = ' SELECT stores_warehouse_entries.product_id' +
                     ` as idIs${productId}, stores_warehouse_entries.id,` +
                     ' stores_warehouse_entries.quantity,' +
                     ' store_movements.cost FROM ' +
                     ' stores_warehouse_entries' +
                     ' INNER JOIN store_movements ON' +
                     ' stores_warehouse_entries.store_movement_id' + 
                     ' = store_movements.id WHERE ' +
                     `stores_warehouse_entries.product_id = ${productId} ` +
                     ' ORDER BY stores_warehouse_entries.id ';
    query(localQuery).then(entries => {
      let productId       = entries.fields[0].name.replace(/\D/g,''),
          discountReason  = json[productId].discountReason,
          sellQuantity    = json[productId].sellQuantity,
          inventory       = json[productId].quantity,
          totalCost       = 0,
          processQuantity = sellQuantity,
          discountType    = $('.discounts-form-wrapper button.selected')
                            .attr('id'),
          discountPercent = parseFloat(json[productId].discount) / 100,
          unitPrice       = json[productId].price,
          subtotal        = (unitPrice * sellQuantity),
          finalPrice      = (unitPrice * (1 - discountPercent)),
          discount        = (subtotal * discountPercent),
          taxes           = ((subtotal - discount) * 0.16),
          total           = (subtotal - discount + taxes),
          fixedDiscount   = parseFloat(discount.toFixed(2)),
          data = {
            product_id         : productId,
            quantity           : sellQuantity,
            movement_type      : 'venta',
            ticket_id          : ticketId,
            initial_price      : json[productId].price.toFixed(2),
            automatic_discount : 0,
            manual_discount    : fixedDiscount,
            discount_applied   : fixedDiscount,
            final_price        : finalPrice.toFixed(2),
            tax_id             : 2,
            taxes              : taxes.toFixed(2),
            cost               : 0,
            supplier_id        : json[productId].supplier_id,
            total_cost         : totalCost,
            total              : total.toFixed(2),
            subtotal           : subtotal.toFixed(2)
          };

      if (discountReason){
        data.discount_reason = discountReason;
      }

      if (entries.rowCount === 0) {
        createStoreMovement(data, productId, call);
      } else {
        let BreakException = {};
        try {
          entries.rows.forEach(entry => {
            let quantity  = entry.quantity,
              cost        = entry.cost,
              entryId     = entry.id;

            if (processQuantity >= quantity) {
              totalCost += (quantity * cost);
              deleteBy('stores_warehouse_entries', entryId);
              updateStoreInventories(
                productId, quantity
              );
              processQuantity -= quantity;
            } else {
              totalCost += (processQuantity * cost);
              updateStoreInventories(
                productId, processQuantity
              );
              updateBy(
                {
                  quantity: (quantity - processQuantity)
                },
                'stores_warehouse_entries',
                `id = ${entryId}`
              );
              throw BreakException;
            }
          });
        } catch (err){
          if (err !== BreakException) throw e;
        }

        data.total_cost = totalCost.toFixed(2);
        data.cost       = (totalCost / sellQuantity).toFixed(2);

        if (discountType !== 'none'){
          data[`${discountType}_discount`] = fixedDiscount;
        }
        createStoreMovement(data, productId, call);
      }

    });

  }
}

function clearDate(date){
  let strDate = date.toString();
  return strDate.replace(' GMT-0600 (CST)','');
}

function insertsPayments(ticketId, userId, store, call) {
  limit = $('tr[id^=paymentMethod_]').length;
  count = 0;

  $.each($('tr[id^=paymentMethod_]'), function(index){

    let type        = $(this).attr('data-type'),
        terminal    = $('#select_terminal').val(),
        paymentJson = {
          'Efectivo'        : 1,
          'Débito'          : 18,
          'Crédito'         : 4,
          'Cheque'          : 2,
          'Transferencia'   : 3,
          'Venta a Crédito' : 21,
          'Otra'            : 21
        },
        data = {
          payment_date     : clearDate(new Date()),
          user_id          : userId,
          business_unit_id : store.business_unit_id,
          payment_form_id  : paymentJson[type],
          payment_type     : 'pago',
          ticket_id        : ticketId,
          payment_number   : (index + 1),
          total            : $(this).find('td.cuantity').html().replace('$ ','').replace(/,/g,'')
        };

    if (type === 'Débito' || type === 'Crédito'){
      data.terminal_id = $(this).find('td[id^=terminal]').html();
    } else if (type === 'Cheque' || type === 'Transferencia') {
      data.operation_number = $(this).find('td[id^=reference]').html();
    } else if (type === 'Venta a Crédito') {
      data.credit_days = $(this).find('td[id^=creditDays]').html();
      data.payment_type = 'crédito';
    }

    insert(
      Object.keys(data),
      Object.values(data),
      'payments'
    ).then(() => {
      count++;
      if (limit === count){
        return call();
      }
    });

  });
}
