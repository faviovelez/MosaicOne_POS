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
        sellQuantity   : parseInt($(this).find($('td input[id^=cuantityTo]')).val()),
        sellTo         : parseFloat($(this).find('td[id^=totalTo]').html().replace('$ ','').replace(/,/g,'')),
        discount       : parseFloat($(this).find('td a[id^=discount_]').html().replace(/\s|%|,/g,'')),
        discountReason : $(this).find('td[id^=discountReasonTo]').html(),
        price          : parseFloat($(this).find('td[id^=priceTo] a').html().replace('$ ','').replace(/,/g,''))
      };

      idsCollection.push(
        id
      );

    } else {
      servicesJson[id] = {
        sellQuantity   : parseInt($(this).find($('td input[id^=cuantityTo]')).val()),
        sellTo         : parseFloat($(this).find('td[id^=totalTo]').html().replace('$ ','').replace(/,/g,'')),
        discount       : parseFloat($(this).find('td a[id^=discount_]').html().replace(/\s|%|,/g,'')),
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
  insert(
    Object.keys(localData),
    Object.values(localData),
    'store_movements'
  ).then(storeMovement => {
    assignCostcount++;
    localData = null;
    if (assignCostcount === Object.keys(productsJson).length){
      return call(warehouseInfo);
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

function addPaymentToTicket(){
  initStore().then(store => {
    let user      = store.get('current_user').id,
      storeObject = store.get('store');

    ticketData = {
      store : storeObject,
      user  : store.get('current_user'),
    };

    let parentTicket = parseInt($('#ticket-id').html());
    insertTicket(user, function(ticketId){
        insertsPayments('venta', ticketId, user, storeObject, function(){
          window.location.href = 'pos_sale.html';
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

  setPayedLogic(data);

  if (typeof data.cfdi_use_id === 'undefined') {
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

        updateBy(
          {
            payed: data.payed
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
            return call(ticket.lastId);
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
        service_id         : serviceId.replace(/_.*/,''),
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
      'service_offereds'
    ).then(serviceOffered => {
      data = null;
      findBy('id', serviceOffered.lastId, 'service_offereds' ).then(
        serviceOffered => {
          let deliveryServiceId = $(
            `#deliveryServiceId${serviceOffered.rows[0].service_id}`
          ).html();

          if (typeof deliveryServiceId === 'undefined'){
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

function assignCost(ticketType, ticketId, call) {
  try {
    if ($.isEmptyObject(productsJson)){
      return call();
    }
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
          unitPrice       = parseFloat(parseFloat((productsJson[productId].price).toFixed(3)).toFixed(2)),
          subtotal        = parseFloat(parseFloat((unitPrice * sellQuantity).toFixed(3)).toFixed(2)),
          finalPrice      = parseFloat(parseFloat((unitPrice * (1 - discountPercent)).toFixed(3)).toFixed(2)),
          discount        = parseFloat(parseFloat((subtotal * discountPercent).toFixed(3)).toFixed(2)),
          taxes           = parseFloat(parseFloat(((subtotal - discount) * 0.16).toFixed(3)).toFixed(2)),
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
            subtotal           : subtotal
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
  balanceSum = 0;

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
