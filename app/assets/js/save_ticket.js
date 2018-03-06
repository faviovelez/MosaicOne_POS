let productsJson  = {},
    servicesJson  = {},
    count        = 0;
    storeMovementArray = [];

function iterateInventories(products, call){
  count = 0;
  products.forEach(product => {
    let jsonId = product.id;
    productsJson[jsonId].description              = product.description;
    productsJson[jsonId].exterior_color_or_design = product.exterior_color_or_design;
    productsJson[jsonId].unique_code              = product.unique_code;
    productsJson[jsonId].supplier_id              = product.supplier_id;

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

function createTicketProductJson(call, selector = 'ticketList', discountSelector = 'a[id^=discount]', priceSelector = 'td[id^=priceTo] a'){
  json = {};
  let idsCollection = [];

  $.each($(`#${selector} tr`), function(){
    let id = $(this).attr('id').replace(/product_|_products|_services|productDevolucion_/g,''),
        table = $(this).find('#infoTableName').html();

    if(table === 'products') {
      productsJson[id] = {
        sellQuantity   : parseInt($(this).find($('td input[id^=cuantityTo]')).val().replace(/_/g,'')),
        sellTo         : parseFloat($(this).find('td[id^=totalTo]').html().replace('$ ','').replace(/,/g,'')),
        discount       : parseFloat($(this).find(discountSelector).html().replace(/\s|%|,/g,'')),
        discountReason : $(this).find('td[id^=discountReasonTo]').html(),
        price          : parseFloat($(this).find(priceSelector).html().replace('$ ','').replace(/,/g,''))
      };

      idsCollection.push(
        id
      );

    } else {
      servicesJson[$(this).attr('id')] = {
        sellQuantity   : parseInt($(this).find($('td input[id^=cuantityTo]')).val().replace(/_/g,'')),
        sellTo         : parseFloat($(this).find('td[id^=totalTo]').html().replace('$ ','').replace(/,/g,'')),
        discount       : parseFloat($(this).find(discountSelector).html().replace(/\s|%|,/g,'')),
        discountReason : $(this).find('td[id^=discountReasonTo]').html(),
        selector       : $(this).attr('id')
      };
    }

  });

  if (idsCollection.length > 0){
    getOnly('products', idsCollection).then(products => {
      iterateInventories(products, function(){
//        debugger
        return call();
      });
    });
  } else {
//    debugger
    return call();
  }

}

function quantityMessage(call){
  productsJson  = {};
  servicesJson  = {};
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
      $('#completeSale').prop( "disabled", false );
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

function createStoreMovement(localData, call, warehouseInfo = {}){
  let storeMovementJson = {};

  let Promise = require("bluebird");
  Promise.each(Object.keys(localData), function(header){
    storeMovementJson[header] = localData[header];
  })
  .then(function(){
    storeMovementArray.push(storeMovementJson);
    if (storeMovementArray.length === Object.keys(productsJson).length){
      aLotInsert(
        Object.keys(storeMovementJson),
        storeMovementArray,
        'store_movements'
      ).then(function(){
        return call(warehouseInfo);
      });
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

function getCashRegisterInfo(call){
  initStore().then(storage => {
    findBy('name', storage.get('cash'), 'cash_registers').then( cashRegisterObject => {
      call(cashRegisterObject.rows[0]);
    });
  });
}

function addPaymentFormData(ticketData, payments, call){
  let limit = payments.length,
      count = 0;

  ticketData.payments = {};
  payments.forEach(payment => {
    ticketData.payments[payment.id] = payment;
    findBy('id', payment.payment_form_id, 'payment_forms', payment.id).then(paymentForm => {
      count++;
      ticketData.payments[paymentForm.lastId].paymentForm = paymentForm.rows[0];
      if (count === limit){
        return call();
      }
    });
  });
}

function devolucionPayment(ticketId, userId, store, call){
  let data = {
    payment_date     : clearDate(new Date()),
    user_id          : userId,
    business_unit_id : store.business_unit_id,
    payment_form_id  : 1,
    payment_type     : 'devolución',
    ticket_id        : ticketId,
    payment_number   : 1,
    total            : $('.bigger.total strong').html().replace('$ ','').replace(/,/g,'')
  };

  insert(
    Object.keys(data),
    Object.values(data),
    'payments'
  ).then(paymentObject => {
      data = null;
      findBy('id', paymentObject.lastId, 'payments').then(function(paymentFullObject){
        return call(paymentFullObject.rows[0]);
      });
  });
}

function processProductToDevolucion(userId, ticketId, call){
  storeMovementArray = [];
  let warehouseInfo = {};
  assignCostcount = 0;
}

function processDevolucion(){
  initStore().then(store => {
    let user      = store.get('current_user').id,
      storeObject = store.get('store');

    ticketData = {
      store : storeObject,
      user  : store.get('current_user'),
      payments : {}
    };
    createTicketProductJson(function(){
      let parentTicket = parseInt($('#ticket-id').html());
      insertTicket(user, function(ticketId, parentTicket){
          store.set('lastTicket', parseInt(
            ticketId
          ));
          ticketData.parentTicket = parentTicket;
          devolucionStoreMovement(parentTicket, ticketId, function(){
            devolucionServiceOffered(parentTicket, ticketId, function(){
              devolucionPayment(ticketId, user, storeObject, function(paymentObject){
                ticketData.payments[paymentObject.id] = paymentObject;
                ticketData.payments[paymentObject.id].paymentForm = 'Efectivo';
                findBy('store_id', storeObject.id, 'cash_registers').then(cashRegisterObject => {
                  ticketData.cashRegister = cashRegisterObject.rows[0];
                  findBy(
                    'id',
                    storeObject.business_unit_id,
                    'business_units'
                  ).then(business_unit => {
                    findBy(
                      'id',
                      business_unit.rows[0].billing_address_id,
                      'billing_addresses'
                    ).then(billing_address => {
                      ticketData.billing_address = billing_address.rows[0];
                      findBy(
                        'id',
                        ticketData.billing_address.tax_regime_id,
                        'tax_regimes'
                      ).then(tax_regime => {

                        ticketData.tax_regime = tax_regime.rows[0];
                        findBy('id', ticketId, 'tickets').then(ticket => {
                          ticketData.ticket = ticket.rows[0];
                          findBy('ticket_id', ticketId, 'payments').then(payments => {
                            addPaymentFormData(ticketData, payments.rows, function(){
                              printTicketDevolucion(ticketData, function(){
                                window.location.href = 'pos_sale.html';
                              })
                            });
                          });
                        });

                      });
                    });
                  });
                });
              });
            });
          });
        }, 'devolución', parentTicket);
    }, 'devolucionTable', 'td[id^=discountToDevolucion_]', 'td[id^=priceTo]')
  });
}

function addPaymentToTicket(){
  initStore().then(store => {
    let user      = store.get('current_user').id,
      storeObject = store.get('store');

    ticketData = {
      store : storeObject,
      user  : store.get('current_user'),
    };

    let parentTicket = parseInt($('#ticket-id').html());
    insertTicket(user, function(ticketId, parentTicket){
        store.set('lastTicket', parseInt(
          ticketId
        ));
        ticketData.parentTicket = parentTicket;
        insertsPayments('venta', ticketId, user, storeObject, function(){
          findBy('store_id', storeObject.id, 'cash_registers').then(cashRegisterObject => {
            ticketData.cashRegister = cashRegisterObject.rows[0];
            findBy(
              'id',
              storeObject.business_unit_id,
              'business_units'
            ).then(business_unit => {
              findBy(
                'id',
                business_unit.rows[0].billing_address_id,
                'billing_addresses'
              ).then(billing_address => {
                ticketData.billing_address = billing_address.rows[0];
                findBy(
                  'id',
                  ticketData.billing_address.tax_regime_id,
                  'tax_regimes'
                ).then(tax_regime => {

                  ticketData.tax_regime = tax_regime.rows[0];
                  findBy('id', ticketId, 'tickets').then(ticket => {
                    ticketData.ticket = ticket.rows[0];
                    findBy('ticket_id', ticketId, 'payments').then(payments => {
                      addPaymentFormData(ticketData, payments.rows, function(){
                        printTicketPayment(ticketData, function(){
                          window.location.href = 'pos_sale.html';
                        })
                      });
                    });
                  });

                });
              });
            });
          });
        });
    }, 'pago', parentTicket);
  });
}

function getCurrentDate(){
  let datetime = new Date();
  let month = datetime.getMonth() + 1,
      date  = datetime.getDate();

  if (month < 10) {
    month = `0${month}`;
  }

  if (date < 10) {
    date = `0${date}`;
  }

  return `${date}/${month}/${datetime.getFullYear()}`;
}

function insertTicket(userId, call, type, parentTicket = null){
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

  if (type === "devolución") {
    data.payments_amount = $('.bigger.total strong').html().replace('$ ','').replace(/,/g,'');
  }

  setPayedLogic(data);

  if (typeof data.cfdi_use_id === 'undefined' || !data.cfdi_use_id) {
    delete data.cfdi_use_id;
  }

  if ($('#prospectList a').length === 1) {
    let prospectId   = $('#prospectList a').attr('data-id');
    data.prospect_id = prospectId;
  }
  getCashRegisterInfo(cashRegister => {
    data.cash_register_id = cashRegister.id;
    if ( parentTicket ){
      data.parent_id = parentTicket;
    }
    insert(
      Object.keys(data),
      Object.values(data),
      'tickets'
    ).then(ticket => {
      if (data.parent_id)
      {
        let childTicketData = {
          children_id: ticket.lastId,
          ticket_id: data.parent_id,
          date: getCurrentDate()
        };

        findBy('id', data.parent_id, 'tickets').then(function(ticketInfoData){
          let ticketInfo = ticketInfoData.rows[0];
          updateBy(
            {
              payed: data.payed,
              payments_amount: parseFloat(data.payments_amount) + ticketInfo.payments_amount,
              cash_return: data.cash_return
            },
            'tickets',
            `id = ${data.parent_id}`
          ).then(function(){
            insert(
              Object.keys(childTicketData),
              Object.values(childTicketData),
              'tickets_children'
            ).then(function(){
              data = null;
              return call(ticket.lastId, childTicketData.ticket_id);
            });
          });
        });
      } else {
        data = null;
        return call(ticket.lastId);
      }
    });
  });

}

function specialQuery(productId){
  return ' SELECT stores_warehouse_entries.product_id' +
    ` as idIs${productId}, store_movements.cost, stores_warehouse_entries.* FROM ` +
    ' stores_warehouse_entries' +
    ' INNER JOIN store_movements ON' +
    ' stores_warehouse_entries.store_movement_id' +
    ' = store_movements.id WHERE ' +
    `stores_warehouse_entries.product_id = ${productId} ` +
    " AND movement_type = 'alta' ORDER BY stores_warehouse_entries.id ";
}

function insertsServiceOffereds(ticketId, call){
  if ($.isEmptyObject(servicesJson)){
    return call();
  }

  let serviceOfferedCount = 0;
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
      subtotal        = parseFloat((unitPrice * sellQuantity).toFixed(2)),
      finalPrice      = parseFloat((unitPrice * (1 - discountPercent)).toFixed(2)),
      discount        = parseFloat((subtotal * discountPercent).toFixed(2)),
      taxes           = parseFloat( ((subtotal - discount) * 0.16).toFixed(2) ),
      total           = parseFloat((subtotal - discount + taxes).toFixed(2)),
      fixedDiscount   = parseFloat(discount.toFixed(2)),
      data = {
        service_id         : serviceId.replace(/product_/,'').replace(/_.*/,''),
        quantity           : sellQuantity,
        service_type       : 'venta',
        ticket_id          : ticketId,
        initial_price      : unitPrice,
        automatic_discount : 0,
        manual_discount    : fixedDiscount,
        discount_applied   : fixedDiscount,
        final_price        : finalPrice,
        tax_id             : 2,
        taxes              : taxes,
        cost               : 0,
        total_cost         : totalCost,
        total              : total,
        subtotal           : subtotal
      };

    if (discountReason){
      data.discount_reason = discountReason;
    }

    if ($('#prospectList a').length === 1) {
      let prospectId   = $('#prospectList a').attr('data-id');
      data.prospect_id = prospectId;
    }

    if (discountType !== 'none'){
      data[`${discountType}_discount`] = fixedDiscount;
    }

    insert(
      Object.keys(data),
      Object.values(data),
      'service_offereds',
      true,
      serviceId
    ).then(serviceOffered => {
      data = null;
      findBy('id', serviceOffered.lastId, 'service_offereds', serviceOffered.extraInfo).then(
        serviceOffered => {

          let element = `#${serviceOffered.lastId} td:last`;
          let deliveryServiceId = $(`#${serviceOffered.lastId}`).find('td[id^=deliveryService]').html();

          if (!deliveryServiceId){
            serviceOfferedCount++;
            if (serviceOfferedCount === Object.keys(servicesJson).length){
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
                data = null;
                serviceOfferedCount++;
                if (serviceOfferedCount === Object.keys(servicesJson).length){
                  return call();
                }

              });
          }
        });
    });

  }
}

function createWareHouseEntry(insertData){
  insert(
    Object.keys(insertData),
    Object.values(insertData),
    'stores_warehouse_entries'
  ).then(function(){});
}

function devolucionServiceOffered(parentTicket, ticketId, call){
  let promises = [];
  if ($.isEmptyObject(servicesJson)){
    return call();
  }

  for (var referenceId in servicesJson){
    let serviceId = referenceId.replace('productDevolucion_','')
    promises.push(
      new Promise(function(localResolve){
        getAll(
          'service_offereds',
          '*',
          `ticket_id = ${parentTicket} AND id = ${serviceId}`
        ).then(function(serviceOfferedObject){
          let data = {};
          serviceOfferedData = serviceOfferedObject.rows[0];
          Object.keys(serviceOfferedData).forEach(function(attr){
            if (serviceOfferedData[attr] !== null) {
              data[attr] = serviceOfferedData[attr];
            }
          });
          data.service_type = 'devolución'
          data.ticket_id = ticketId;
          sellQuantity    = servicesJson[referenceId].sellQuantity,
          discountPercent = parseFloat(servicesJson[referenceId].discount) / 100,
          unitPrice       = parseFloat($(`#${servicesJson[referenceId].selector}`).find(
        'td[id^=priceTo]'
      ).html().replace('$ ','').replace(/,/g,'')),
          subtotal        = Math.round(unitPrice * sellQuantity * 100) / 100,
          finalPrice      = Math.round(unitPrice * (1 - discountPercent) * 100) / 100,
          discount        = Math.round(subtotal * discountPercent * 100 ) / 100,
          taxes           = Math.round((subtotal - discount) * 0.16 * 100) / 100,
          total           = subtotal - discount + taxes;
          data.total = total;
          data.subtotal = subtotal;
          data.taxes = taxes;
          data.discount_applied = discount;
          data.final_price = finalPrice;
          data.quantity = sellQuantity;
          data.total_cost = sellQuantity * data.cost;
          delete data.created_at;
          delete data.updated_at;
          delete data.id;
          delete data.store_id;
          delete data.pos;
          delete data.web;
          insert(
            Object.keys(data),
            Object.values(data),
            'service_offereds'
          ).then(function(){
            localResolve();
          });
        });
      })
    );
  }

  Promise.all(promises).then(function(){
    return call();
  });
}

function devolucionStoreMovement(parentTicket, ticketId, call) {
  let promises = [];
  storeMovementArray = [];
  if ($.isEmptyObject(productsJson)){
    return call();
  }
  for (var productId in productsJson){
    promises.push(
      new Promise(function(localResolve){
        getAll(
          'store_movements',
          '*',
          `ticket_id = ${parentTicket} AND product_id = ${productId}`
        ).then(function(storeMovementObject){
          createWareHouseEntry({
            product_id: productId,
            quantity: storeMovementObject.rows[0].quantity,
            store_movement_id: storeMovementObject.rows[0].id
          });
          return localResolve(storeMovementObject.rows[0]);
        });
      })
    );
  }

  Promise.all(promises).then(function(storesMovements){
    storesMovements.forEach(function(storeMovementData){
      storeMovementData.movement_type = 'devolucion';
      storeMovementData.ticket_id = ticketId;
      let data = {},
      sellQuantity    = productsJson[productId].sellQuantity,
      discountPercent = parseFloat(productsJson[productId].discount) / 100,
      unitPrice       = Math.round(productsJson[productId].price * 100) / 100,
      subtotal        = Math.round(unitPrice * sellQuantity * 100) / 100,
      finalPrice      = Math.round(unitPrice * (1 - discountPercent) * 100) / 100,
      discount        = Math.round(subtotal * discountPercent * 100 ) / 100,
      taxes           = Math.round((subtotal - discount) * 0.16 * 100) / 100,
      total           = subtotal - discount + taxes;
      storeMovementData.total = total;
      storeMovementData.subtotal = subtotal;
      storeMovementData.taxes = taxes;
      storeMovementData.discount_applied = discount;
      storeMovementData.final_price = finalPrice;
      storeMovementData.quantity = sellQuantity;
      storeMovementData.total_cost = sellQuantity * storeMovementData.cost;
      delete storeMovementData.created_at;
      delete storeMovementData.updated_at;
      delete storeMovementData.id;
      delete storeMovementData.store_id;
      delete storeMovementData.pos;
      delete storeMovementData.web;
      findBy(
        'product_id',
         storeMovementData.product_id,
         'stores_inventories',
         storeMovementData.quantity
       ).then(inventory => {
        updateBy(
          {
            quantity: (inventory.rows[0].quantity + inventory.lastId)
          },
          'stores_inventories',
          `id = ${inventory.rows[0].id}`
        ).then(function(){
          Object.keys(storeMovementData).forEach(function(attr){
            if (storeMovementData[attr] !== null) {
              data[attr] = storeMovementData[attr];
            }
          });
          createStoreMovement(data, call);
        });
      });
    });
  });
}

function assignCost(userId, ticketType, ticketId, call) {
  try {
    if ($.isEmptyObject(productsJson)){
      return call();
    }
    storeMovementArray = [];
    let warehouseInfo = {};
    assignCostcount = 0;

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
          unitPrice       = Math.round(productsJson[productId].price * 100) / 100,
          subtotal        = Math.round(unitPrice * sellQuantity * 100) / 100,
          finalPrice      = Math.round(unitPrice * (1 - discountPercent) * 100) / 100,
          discount        = Math.round(subtotal * discountPercent * 100 ) / 100,
          taxes           = Math.round((subtotal - discount) * 0.16 * 100) / 100,
          total           = subtotal - discount + taxes,
          prospectId   = $('#prospectList a').attr('data-id'),
          data = {
            product_id         : productId,
            quantity           : sellQuantity,
            movement_type      : 'venta',
            ticket_id          : ticketId,
            initial_price      : productsJson[productId].price.toFixed(2),
            automatic_discount : 0,
            manual_discount    : discount,
            discount_applied   : discount,
            final_price        : finalPrice,
            tax_id             : 2,
            taxes              : taxes,
            cost               : 0,
            supplier_id        : productsJson[productId].supplier_id,
            total_cost         : totalCost,
            total              : total,
            subtotal           : subtotal,
            user_id            : userId
          };

        if (ticketType === 'venta')
          updateStoreInventories(
            productId, sellQuantity
          );

        if (discountReason){
          data.discount_reason = discountReason;
        }

        if ($('#prospectList a').length === 1) {
          let prospectId   = $('#prospectList a').attr('data-id');
          data.prospect_id = prospectId;
        }

        if (entries.rowCount === 0 || ticketType === 'pending') {
          createStoreMovement(data, call);
          data = null;
        } else {
          let BreakException = {};
          try {
            entries.rows.forEach(entry => {
              let quantity  = entry.quantity,
                cost        = entry.cost,
                entryId     = entry.id;

              if (parseInt(processQuantity) >= quantity) {
                totalCost += (quantity * cost);
                entry.quantity = processQuantity;
                warehouseInfo[productId] = entry;
                deleteBy('stores_warehouse_entries', `id = ${entryId}`);
                processQuantity -= quantity;
              } else {
                totalCost += (processQuantity * cost);
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
            if (err !== BreakException) throw err;
          }

          data.total_cost = totalCost.toFixed(2);
          data.cost       = (totalCost / sellQuantity).toFixed(2);

          if (discountType !== 'none'){
            data[`${discountType}_discount`] = discount;
          }
          createStoreMovement(data, call, warehouseInfo);
          data = null;
        }

      });

    }
  } catch(err) {
    console.log(err);
  }

}

function clearDate(date){
  let strDate = date.toString();
  return strDate.replace(/GMT.*/,'');
}

function saveExpenses(ticket_id, call){
  let localQuery = 'SELECT payments.total, payments.payment_form_id, payments.id, terminals.credit_comission, terminals.debit_comission ' +
      'FROM payments INNER JOIN terminals ON payments.terminal_id = terminals.id ' +
      ` WHERE (payment_form_id = 18 OR payment_form_id = 4) AND ticket_id = ${ticket_id} `

  query(localQuery).then( paymentsObjects => {
    let limit = paymentsObjects.rowCount,
        count = 0;
    if (limit === 0) {
      return call();
    }
    paymentsObjects.rows.forEach(paymentData => {
      let field = paymentData.payment_form_id === 4 ? 'credit_comission' : 'debit_comission',
        subtotal = (paymentData[field] / 100 * paymentData.total).toFixed(2),
        expensesData = {
          "subtotal": subtotal,
          "taxes_rate": (subtotal * 0.16).toFixed(2),
          "total": (subtotal * 1.16).toFixed(2),
          "expense_date": Date().toString().replace(/GMT.*/,''),
          "expense_type": 'comisión',
          "taxes": (subtotal * 0.16).toFixed(2),
          "payment_id" : paymentData.id
        }
        insert(
          Object.keys(expensesData),
          Object.values(expensesData),
          'expenses'
        ).then(() => {
          expensesData = null;
          count++;
          if (count === limit) {
            call();
          }
        });
    });
  });
}

function insertsPayments(ticketType, ticketId, userId, store, call) {
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

    if (type === 'Débito' ) {
      data.terminal_id = $(this).find('td[id^=terminal]').html();
    } else if (type === 'Crédito'){
      data.terminal_id = $(this).find('td[id^=terminal]').html();
    } else if (type === 'Cheque' || type === 'Transferencia') {
      data.operation_number = $(this).find('td[id^=reference]').html();
    } else if (type === 'Venta a Crédito') {
      data.credit_days = $(this).find('td[id^=creditDays]').html();
      data.payment_type = 'crédito';
    } else if (type === 'Efectivo') {
      data.total = data.total - parseFloat($('#currencyChange strong').html().replace(/\s|\$|,/g,'')).toFixed(2);
    }

    insert(
      Object.keys(data),
      Object.values(data),
      'payments'
    ).then(paymentObject => {
        data = null;
        count++;
        if (limit === count){
          return call();
        }
    });

  });
}
