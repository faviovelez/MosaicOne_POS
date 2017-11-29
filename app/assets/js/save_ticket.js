let productsJson  = {},
    servicesJson  = {},
    count        = 0;

function iterateInventories(products, call){
  count = 0;
  products.forEach(product => {
    let jsonId = product.id;
    productsJson[jsonId].description              = product.description;
    productsJson[jsonId].exterior_color_or_design = product.exterior_color_or_design;
    productsJson[jsonId].unique_code              = product.unique_code;
    productsJson[jsonId].supplier_id              = product.supplier_id;
    productsJson[jsonId].price                    = product.price;

    findBy('product_id', product.id, 'stores_inventories').then(inventory => {

      let inventoryObject = inventory.rows[0],
          jsonId = inventoryObject.product_id;

      productsJson[jsonId].inventory_id = inventoryObject.id;
      productsJson[jsonId].quantity     = inventoryObject.quantity;

      count++;
      if (count === products.length) {
        return call();
      }

    });
  });

}

function createTicketProductJson(call){
  json = {};
  let idsCollection = [];

  $.each($('#ticketList tr'), function(){
    let id = $(this).attr('id').replace(/product_|_products|_services/g,''),
        regex = new RegExp(`.*${id}_`),
        table = $(this).attr('id').replace(regex, '');

    if(table === 'products') {

      productsJson[id] = {
        sellQuantity   : $(this).find($('td input[id^=cuantityTo]')).val(),
        sellTo         : $(this).find('td[id^=totalTo]').html().replace('$ ','').replace(/,/g,''),
        discount       : $(this).find('td a[id^=discount_]').html().replace(/\s|%|,/g,''),
        discountReason : $(this).find('td[id^=discountReasonTo]').html()
      };

      idsCollection.push(
        id
      );

    } else {
      servicesJson[id] = {
        sellQuantity   : $(this).find($('td input[id^=cuantityTo]')).val(),
        sellTo         : $(this).find('td[id^=totalTo]').html().replace('$ ','').replace(/,/g,''),
        discount       : $(this).find('td a[id^=discount_]').html().replace(/\s|%|,/g,''),
        discountReason : $(this).find('td[id^=discountReasonTo]').html(),
        selector       : $(this).attr('id')
      };
    }

  });

  if (idsCollection.length > 0){
    getOnly('products', idsCollection).then(products => {
      iterateInventories(products, function(){
        return call();
      });
    });
  } else {
    return call();
  }

}

function quantityMessage(call){
  createTicketProductJson(function(){
    if ($.isEmptyObject(productsJson)){
      return call('', false);
    }

    let needed = false,
        message = '<h1>Faltante de producto en relacion</h1>';

    for (var productId in productsJson) {

      let actualInventory          = productsJson[productId].quantity,
        trySellQuantity            = productsJson[productId].sellQuantity,
        unique_code                = productsJson[productId].unique_code,
        description                = productsJson[productId].description,
        exterior_color_or_design   = productsJson[productId].exterior_color_or_design;

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

function createStoreMovement(data, call){
  insert(
    Object.keys(data),
    Object.values(data),
    'store_movements'
  ).then(storeMovement => {
    count++;
    if (count === Object.keys(productsJson).length){
      return call();
    }
  });
}

function setPayedLogic(data){
  let creditPaymentSelector = 'tr[id^=paymentMethod][data-type="Venta a Crédito"]';
  if ($(creditPaymentSelector).length > 0){
    let creditPaymentQuantity = $(creditPaymentSelector).find('td.cuantity').html().replace(/\s|\$|,/g,''),
        realPayment           =  data.payments_amount - creditPaymentQuantity;
    if (realPayment <= parseFloat(data.total)) {
      data.payed = false;
      data.payments_amount = realPayment;
    }
  }
}

function insertTicket(userId, call, type){
  let paymentsAmount = $('#sumPayments').html() === "" ? 0 
                       : $('#sumPayments').html(),
      data = {
        user_id          : userId,
        subtotal         : $('#savedSubtotal').html().replace(/\s|\$|,/g,''),
        discount_applied : $('#discountSum').html().replace(/\s|\$|,/g,''),
        tax_id           : 2,
        taxes            : $('.subtotal.iva').html().replace(/\s|\$|,/g,''),
        total            : $('.bigger.total strong').html().replace(/\s|\$|,/g,''),
        ticket_type      : type,
        payed            : true,
        ticket_number    : parseInt($('#ticketNum').html()),
        comments         : $('input[placeholder=Comentarios]').val(),
        payments_amount  : paymentsAmount.toString().replace(/\s|\$|,/g,''),
        cash_return      : $('#currencyChange strong').html().replace(/\s|\$|,/g,''),
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

function specialQuery(productId){
  return ' SELECT stores_warehouse_entries.product_id' +
    ` as idIs${productId}, stores_warehouse_entries.id,` +
    ' stores_warehouse_entries.quantity,' +
    ' store_movements.cost FROM ' +
    ' stores_warehouse_entries' +
    ' INNER JOIN store_movements ON' +
    ' stores_warehouse_entries.store_movement_id' + 
    ' = store_movements.id WHERE ' +
    `stores_warehouse_entries.product_id = ${productId} ` +
    ' ORDER BY stores_warehouse_entries.id ';
}

function insertsServiceOffereds(ticketId, call){
  if ($.isEmptyObject(servicesJson)){
    return call();
  }

  count = 0;
  for (var serviceId in servicesJson){

    let discountReason  = servicesJson[serviceId].discountReason,
      sellQuantity    = servicesJson[serviceId].sellQuantity,
      totalCost       = 0,
      processQuantity = sellQuantity,
      discountType    = $('.discounts-form-wrapper button.selected')
      .attr('id'),
      discountPercent = parseFloat(servicesJson[serviceId].discount) / 100,
      unitPrice       = $(`#${servicesJson[serviceId].selector}`).find(
        'td[id^=priceTo] input'
      ).val(),
      subtotal        = (unitPrice * sellQuantity),
      finalPrice      = (unitPrice * (1 - discountPercent)),
      discount        = (subtotal * discountPercent),
      taxes           = ((subtotal - discount) * 0.16),
      total           = (subtotal - discount + taxes),
      fixedDiscount   = parseFloat(discount.toFixed(2)),
      data = {
        service_id         : serviceId.replace(/_.*/,''),
        quantity           : sellQuantity,
        service_type       : 'venta',
        ticket_id          : ticketId,
        initial_price      : unitPrice,
        automatic_discount : 0,
        manual_discount    : fixedDiscount,
        discount_applied   : fixedDiscount,
        final_price        : finalPrice.toFixed(2),
        tax_id             : 2,
        taxes              : taxes.toFixed(2),
        cost               : 0,
        total_cost         : totalCost,
        total              : total.toFixed(2),
        subtotal           : subtotal.toFixed(2)
      };

    if (discountReason){
      data.discount_reason = discountReason;
    }

    if (discountType !== 'none'){
      data[`${discountType}_discount`] = fixedDiscount;
    }

    insert(
      Object.keys(data),
      Object.values(data),
      'service_offereds'
    ).then(serviceOffered => {
      findBy('id', serviceOffered.lastId, 'service_offereds' ).then(
        serviceOffered => {
          let deliveryServiceId = $(
            `#deliveryServiceId${serviceOffered.rows[0].service_id}`
          ).html();

          if (typeof deliveryServiceId === 'undefined'){
            count++;
            if (count === Object.keys(servicesJson).length){
              return call();
            }
          } else {
            let data = {
              service_offered_id: serviceOffered.rows[0].id
            };

            updateBy(
              data,
              'delivery_services',
              `id = ${deliveryServiceId}`).then(() => {

                count++;
                if (count === Object.keys(servicesJson).length){
                  return call();
                }

              });
          }
        });
    });

  }
}

function assignCost(ticketId, call) {
  if ($.isEmptyObject(productsJson)){
    return call();
  }

  count = 0;
  for (var productId in productsJson){
    let localQuery = specialQuery(productId);

    query(localQuery).then(entries => {
      let productId     = entries.fields[0].name.replace(/\D/g,''),
        discountReason  = productsJson[productId].discountReason,
        sellQuantity    = productsJson[productId].sellQuantity,
        inventory       = productsJson[productId].quantity,
        totalCost       = 0,
        processQuantity = sellQuantity,
        discountType    = $('.discounts-form-wrapper button.selected')
        .attr('id'),
        discountPercent = parseFloat(productsJson[productId].discount) / 100,
        unitPrice       = productsJson[productId].price,
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
          initial_price      : productsJson[productId].price.toFixed(2),
          automatic_discount : 0,
          manual_discount    : fixedDiscount,
          discount_applied   : fixedDiscount,
          final_price        : finalPrice.toFixed(2),
          tax_id             : 2,
          taxes              : taxes.toFixed(2),
          cost               : 0,
          supplier_id        : productsJson[productId].supplier_id,
          total_cost         : totalCost,
          total              : total.toFixed(2),
          subtotal           : subtotal.toFixed(2)
        };

      if (discountReason){
        data.discount_reason = discountReason;
      }

      if (entries.rowCount === 0) {
        createStoreMovement(data, call);
      } else {
        let BreakException = {};
        try {
          entries.rows.forEach(entry => {
            let quantity  = entry.quantity,
              cost        = entry.cost,
              entryId     = entry.id;

            if (processQuantity >= quantity) {
              totalCost += (quantity * cost);
              deleteBy('stores_warehouse_entries', `id = ${entryId}`);
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
        createStoreMovement(data, call);
      }

    });

  }

}

function clearDate(date){
  let strDate = date.toString();
  return strDate.replace(/GMT.*/,'');
}

function insertsPayments(ticketId, userId, store, call) {
  limit = $('tr[id^=paymentMethod_]').length;
  count = 0;

  if (limit === 0){
    return call();
  }

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
