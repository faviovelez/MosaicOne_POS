$(document).ready(function() {

  function getCashRegisterSum(){
    return 'SELECT (SUM((SELECT COALESCE(SUM(deposits.amount),0) as d FROM deposits)) ' +
      '- SUM((SELECT COALESCE(SUM(withdrawals.amount),0) as w FROM withdrawals)) + ' +
      'SUM((SELECT (COALESCE(SUM(payments.total),0)) as s ' +
      'FROM payments INNER JOIN tickets ON tickets.id = payments.ticket_id ' +
      "WHERE payment_type = 'pago' AND payment_form_id = 1 AND ticket_type = 'venta'))) as sum";
  }

  const Inputmask = require('inputmask');
  function cloneAlert(){
    let alerts = $('.alert').length + 1;
    $('.alerts-container').prepend(
      `<div class="alert" id="alertNo_${alerts}" hidden>` +
      `${$('.alert').html()} </div>`
    );
    return $('.alert:first').attr('id');
  }

  function showAlert(type, message, alertId){
    $(`#${alertId} span.title`).html(`${type}: ${message}`);
    $(`#${alertId}`)
      .show()
      .addClass('alert-danger')
      .removeClass('hidden');
  }

  async function initStore(){

    const store = new Store({
      configName: 'user-localStore',
      defaults: {
        windowBounds: { width: 1024, height: 768 }
      }
    });

    return store;
  }

  function productAddChange(product){
    return `<tr id="addProduct_${product.id}">` +
      '<td class="left">' +
      product.description +
      '</td>' +
      `<td> ${product.color} </td><td>` +
      '<input type="text" class="form-control" id="addProductInput" smaller-form" placeholder="1">' +
      '</td></tr>';
  }
  function getCostPrice(price, overprice, discount){
    return (
        price /  (1 + overprice / 100) * (1 - discount / 100 )
      ).toFixed(2);
  }

  function createStoreMovementData(productId, quantity, action, call){
    findBy('id', productId, 'products').then(product => {
      productDetails = product.rows[0];

      storeMovementData = {
        product_id    : productDetails.id,
        quantity      : quantity,
        movement_type : action,
        initial_price : productDetails.price.toFixed(2),
        supplier_id   : productDetails.supplier_id,
      };

      initStore().then(storage => {

        let store = storage.get('store');
        if (store.store_type_id === 4) {
          storeMovementData.cost       = getCostPrice(
            productDetails.price, store.overprice, productDetails.discount_for_franchises
          );
          storeMovementData.total_cost  = storeMovementData.cost * quantity;
          storeMovementData.final_price = storeMovementData.cost;
        } else if(store.store_type_id === 1) {
          storeMovementData.cost       = getCostPrice(
            productDetails.price, store.overprice, productDetails.discount_for_stores
          );
          storeMovementData.total_cost  = storeMovementData.cost * quantity;
          storeMovementData.final_price = storeMovementData.cost;
        }

        insert(
          Object.keys(storeMovementData),
          Object.values(storeMovementData),
          'store_movements'
        ).then(storeMovementObject => {
          return call(storeMovementObject.lastId);
        });

      });

    });
  }

  function destroyProcess(productId){
    let localQuery      =  specialQuery(productId),
        processQuantity =  storeMovementData.quantity;
    query(localQuery).then(entries => {
      let BreakException = {},
          totalCost      = 0;
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
        if (err !== BreakException) throw err;
      }
    });
  }

  function createWarehouseEntry(productId, storeMovementId){
    warehouseEntryData = {
      product_id : productId,
      quantity   : storeMovementData.quantity,
      store_movement_id : storeMovementId
    };

    findBy('id', productId, 'products').then(product => {
      let average = product.rows[0].average;
      if (average) {
        warehouseEntryData.retail_units_per_unit = average;
      }

      insert(
        Object.keys(warehouseEntryData),
        Object.values(warehouseEntryData),
        'stores_warehouse_entries'
      ).then(() => {});
    });
  }

  $('#confirmAddProduct').click(function(){
    $('#confirmAddProduct').prop('disabled', true);
    let id = $('tr[id^=addProduct_]').attr(
      'id'
    ).replace(/\D/g,''),
      action = $('#addProductDetails').hasClass('head-blue') ? 'alta' : 'baja',
      table = 'stores_inventories',
      condition = `product_id = ${id}`,
      data = {
        'quantity': parseInt(
          $('#addProductInput').val().replace(/_/g,'')
        )
      };
    findBy('product_id', id, table).then(inventory => {
      inventoryObject = inventory.rows[0];
      createStoreMovementData(id, data.quantity, action, function(storeMovementId){

        if ( action === 'alta') {
          createWarehouseEntry(id, storeMovementId);
        } else {
          destroyProcess(id);
        }

        $('#addProductDetails')
          .removeClass('head-red')
          .addClass('head-blue');

        $('#modalTitleAltaBaja').html('Entrada de mercancías');
        $('#confirmAddProduct')
          .addClass('main-button')
          .val('Confirmar alta')
          .removeClass('third-button');

        $('input[type=radio][name=processProduct]').prop('checked', false);
        $('#addProductSearch').addClass('hidden');
        $('#addProductQuantity tr[id^=addProduct_]').remove();
        $('#confirmAddProduct').prop('disabled', false);
        $('#warehouseEntry').modal('hide');

      });

      if (action === 'alta'){
        data.quantity += inventory.rows[0].quantity;
        updateBy(data, table, condition).then(() => {
        }, err => {
        });
      }

    });
  });

  function toggleProductAction(type){
    if (type === 'Baja'){

      $('#addProductDetails')
        .removeClass('head-blue')
        .addClass('head-red');
      $('#modalTitleAltaBaja').html('Baja de mercancías');
      $('#confirmAddProduct')
      .removeClass('main-button')
      .val('Confirmar baja')
      .addClass('third-button');

    } else {

      $('#addProductDetails')
        .removeClass('head-red')
        .addClass('head-blue');

      $('#modalTitleAltaBaja').html('Entrada de mercancías');
      $('#confirmAddProduct')
      .addClass('main-button')
      .val('Confirmar alta')
      .removeClass('third-button');
    }
  }

  $('input[type=radio][name=processProduct]').change(function(){
    $('#addProductSearch').removeClass('hidden');
    toggleProductAction($(this).val());
  });


  $('#addProductSearch')
  .addClass('hidden');

  function createFullName(user){
    return `${user.first_name} ${user.middle_name} ${user.last_name}`;
  }

  function getProductsAndServices(call){
    getAll('products').then(products => {
      options = [];
      products.rows.forEach(product => {
        options.push(
          {
            value: `${product.unique_code} ${product.description}`,
            id:    product.id,
            price: product.price,
            color: product.exterior_color_or_design || 'Sin Diseno',
            description: product.description,
            table: 'products'
          }
        );
      });
      getAll('services').then(services => {
        services.rows.forEach(service => {
          options.push(
            {
              value: `${service.unique_code} ${service.description}`,
              id:    service.id,
              table:  'services',
              company: service.delivery_company ? service.delivery_company
                                                : '',
              description: service.description
            }
          );

        });
        return call(options);
      });
    });
  }

  function addPaymentTr(){
    let count = $('#paymentMethodList tr').length - 2,
        type  = $('.payment-form-wrapper .selected')
      .html().replace(/\s/g,'').replace(/.*<\/i>/,'');
    if (type === 'VentaaCrédito') {
      type = 'Venta a Crédito';
    }
    return `<tr id="paymentMethod_${count}" data-type="${type}">` +
      '<td class="flex">' +
      '<div class="close-icon">' +
      '<button type="button" class="close center-close"' +
      `aria-label="Close" id="closeTr_${count}">` +
      '<span aria-hidden="true" class="white-light">&times;</span>' +
      '</button></div>' +
      `${type}</td>` +
      '<td class="right cuantity" >' +
      `$ ${$('#paymentMethodCuantity').val().replace(
         /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
       )}` +
      '</td>' +
      '</tr>';
  }

  function resumePayment(){
    let sum = 0;
    $.each($('tr[id^=paymentMethod_]'), function(){
      let currency = $(this).find('.cuantity').html().replace(
        '$ ', ''
      ).replace(',', '');
      sum += parseFloat(currency);
    });
    let total = $('table.subtotal td.total strong').html().replace(
      '$ ', ''
    ).replace(',',''),
       rest = (parseFloat(total) - sum).toFixed(2);
    $('#sumPayments').html(sum);
    let products = $('#ticketList tr[id^=product_]').length;
    if (parseFloat(rest) <= 0 && products > 0){
      $('#paymentRest').html(
        '<strong>$ 0</strong>'
      );
      $('#currencyChange').html(
        `<strong>$ ${(rest * -1).toFixed(2).replace(
            /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
          )}</strong>`
      );
      $('.paymentProcess').addClass('hidden');
      $('#completeSale').removeClass('hidden');
    } else {
      $('#currencyChange').html(
        '<strong> $0.00 </strong>'
      );
      $('#paymentRest').html(
        `<strong>$ ${rest.replace(
            /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
         )}</strong>`
      );
      $('#completeSale').addClass('hidden');
      $('.paymentProcess').removeClass('hidden');
      $('.payment-form-wrapper.paymentProcess button.selected').click();
    }
  }

  $('#addPayment').click(function(){
    if ($('#ticketList tr').length === 0){
      return false;
    }
    let count = $('#paymentMethodList tr').length - 2,
        type  = $('.payment-form-wrapper .selected')
      .html().replace(/\s/g,'').replace(/.*<\/i>/,''),
      referenceSelector  = 'input[type=text][placeholder="Referencia bancaria"]',
      creditDaysSelector = 'input[type=text][placeholder="Ejemplo: 30 (solo número)"]';

    $('#paymentMethodList').prepend(addPaymentTr());

    if (type === 'Débito' || type === 'Crédito'){
      $(`tr[id=paymentMethod_${count}]`).append(
        `<td id="terminal_${count}" class="hidden">${$('#select_terminal').val()}</td>`
      );
    }
    if (type === 'Cheque' || type === 'Transferencia') {
          referencia  = $(referenceSelector).val();
      $(`tr[id=paymentMethod_${count}]`).append(
        `<td id="reference_${count}" class="hidden">${referencia}</td>`
      );
    }
    if (type === 'VentaaCrédito') {
      let creditDays = parseInt($(creditDaysSelector).val());
      if (creditDays.toString() === 'NaN') {
        creditDays = 0;
      }

      $(`tr[id=paymentMethod_${count}]`).append(
        `<td id="creditDays_${count}" class="hidden">${creditDays}</td>`
      );
    }
    $('#paymentMethodCuantity').val('');
    $(referenceSelector).val('');
    $(creditDaysSelector).val('');

    $(`#closeTr_${count}`).click(function(){
      $(`tr[id=paymentMethod_${count}]`).remove();
      resumePayment();
    });

    resumePayment();
  });

  $('#ticketDiscountChange .confirm').click(function(){
    $.each($('a[id^=discount]'), function(){
      $(this).html(
        $('#globalDiscount input:first').val() + ' %'
      );
      let id = $(this).attr('id').replace(/discount_/,''),
          total = createTotal(id, true);
      $(`td[id^=totalTo_${id}]`).html(
        `$ ${(total * 1.16).toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`
      );
      $(`td[id^=totalSinTo_${id}]`).html(
        `$ ${total.toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`
      );
    });
    $('#ticketDiscountChange').modal('toggle');
  });

  function validateAllServiceOfferedFill(){
    if ($('tr[id$=services').length > 0){
      let error = false;
      $.each($('tr[id$=services]'), function(){
        if ($(this).find('a[data-target="#deliveryService"]').length === 1){
          if ($(this).find('td[id^=deliveryServiceId]').length === 0){
            error = true;
          }
        }
      });
      return !error;
    }
    return true;
  }

  function deleteTicket(ticketId){
    deleteBy('store_movements', `ticket_id = ${ticketId}`).then(() => {});
    deleteBy('payments', `ticket_id = ${ticketId}`).then(() => {});
    deleteBy('service_offereds', `ticket_id = ${ticketId}`).then(() => {});
    deleteBy('tickets', `id = ${ticketId}`).then(() => {});
    $(`#ticket${ticketId}`).remove();
    $('#cancelTicket').modal('hide');
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

  function restoreStoreInventories(productId, quantity){
    findBy('product_id', productId, 'stores_inventories').then(inventory => {
      updateBy(
        {
          quantity: (inventory.rows[0].quantity + quantity)
        },
        'stores_inventories',
        `id = ${inventory.rows[0].id}`
      );
    });
  }

  function rollBackData(ticketData, call){
    deleteBy('tickets', `id = ${ticketData.ticket.id}`).then(() => {
      let rollbackLimit = Object.keys(ticketData.payments).length;
      let count = 0;

      for (var paymentId in ticketData.payments) {
        deleteBy('payments', `id = ${paymentId}`).then(() => {
          count++;
          if (rollbackLimit === count){
            rollbackLimit = ticketData.products.storeMovements.length;
            count = 0;

            for (var storeMovement in ticketData.products.storeMovements) {
              let productId = storeMovement.produc_id;
              let localQuery = specialQuery(productId);
              query(localQuery).then(entries => {
                let entry = entries.rows[0];
                if (typeof entry === 'undefined') {
                  let warehouseEntry = ticketData.storeWarehouseInfo[productId];
                  delete warehouseEntry.id;
                  delete warehouseEntry[`idis${productId}`];
                  insert(
                    Object.keys(warehouseEntry),
                    Object.values(warehouseEntry),
                    'stores_warehouse_entries'
                  )
                } else {
                  updateBy(
                    {
                      quantity: (quantity + storeMovement.quantity)
                    },
                    'stores_warehouse_entries',
                    `id = ${entry.id}`
                  );
                }
              });
              restoreStoreInventories(
                storeMovement.product_id, storeMovement.quantity
              );
              deleteBy('store_movements', `id = ${storeMovement.id}`).then(() => {
                count++;
                if (rollbackLimit === count){
                  call();
                }
              });
            }
          }
        });
      }

    });
  }

  $('#completeSale').click(function() {
    $(this).prop( "disabled", true );
    let ticketId = window.location.href.replace(/.*ticket_id=/,'');
    let timmer = new Promise((resolve, reject) => {
      setTimeout(function(){
          rollBackData(ticketData, function(){
            resolve();
          });
        }, 10000);
    });

    timmer.then(function(){
      window.location.href = 'pos_sale.html';
    });

    if (!isNaN(parseInt(ticketId))){
      deleteTicket(ticketId);
    }

    if (validateAllServiceOfferedFill()){

      validateQuantity(function(hasInventory){

        if (hasInventory){

          initStore().then(store => {
            let user      = store.get('current_user').id,
              storeObject = store.get('store');

            ticketData = {
              store : storeObject,
              user  : store.get('current_user'),
            };

            insertTicket(user, function(ticketId){

              assignCost('venta', ticketId, function(warehouseInfo){
                ticketData.storeWarehouseInfo = warehouseInfo;
                insertsServiceOffereds(ticketId, function(){

                  insertsPayments('venta', ticketId, user, storeObject, function(){

                    store.set('lastTicket', parseInt(
                      $('#ticketNum').html()
                    ));

                    saveExpenses(ticketId, function() {

                      query(getCashRegisterSum()).then(sumObject => {
                        updateBy(
                          {
                            balance : sumObject.rows[0].sum
                          },
                          'cash_registers',
                          `name = '${store.get("cash")}'`
                        ).then(() => {

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
                                        printTicket(ticketData, function(){

                                          if (ticketData.cashRegister.balance >= ticketData.cashRegister.cash_alert) {
                                            alert(`La caja tiene un saldo de ${ticketData.cashRegister.balance} ` +
                                              'pesos. Realice un retiro.');
                                          }

                                          //window.location.href = 'pos_sale.html';

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

                    });

                  });

                });

              });

            }, 'venta');

          });

        }
      });
    } else {
      alert('Favor de llenar toda la informacion de envios');
    }

  });

  function translateInfo(info){
    if (info === " NaN"){
      return 0;
    }
    return info;
  }

  function createRealSubtotal(){
    let discount = 0;
    $.each($(`td[id^=priceTo]`), function(){
      let price       = parseFloat($(this).html().replace(/\$|,/g,'')).toString() === 'NaN' ?
                        $(this).find('input').val() :
                        parseFloat($(this).html().replace(/\$|,/g,'')),
          tr          = $(this).parent(),
          cuantity    = parseInt($(tr).find(
            'input[id^=cuantityTo]'
          ).val()),
          total       = price * cuantity,
          discountval = parseFloat($(tr.find(
            'a[id^=discount]'
          ))
          .html().replace(' %',''));
      if (total.toString() === 'NaN'){
        total = 0;
      }

      discount += (parseFloat(discountval) / 100 * total);
    });
    $('#discountSum').html(
      ` $ ${discount.toFixed(
          2
        ).replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
        )}`
    );

    $('#savedSubtotal').html(
      ` $ ${(
        parseFloat($('#SubtotalSum').html().replace(
          "$ ", ""
        ).replace(/,/g,'')
        ) + parseFloat(
          translateInfo(
            $('#discountSum').html().replace(
              '$ ', ''
            ).replace(/,/g,'')
          )
        )).toFixed(
          2
        ).replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
        )}`
    );

  }

  function bigTotal(){
    let subTotalInput = $('table.subtotal #SubtotalSum'),
        subtotal      = 0;
    $.each($(`td[id^=totalSinTo_]`), function(){
      let productTotal = parseFloat(
        $(this).html().replace('$ ', '').replace(/,/g,'')
      );
      subtotal += productTotal.toString() === 'NaN' ? 0 : productTotal;
    });
    $(subTotalInput).html(`$ ${subtotal.toFixed(
      2
    ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`);

    let iva = subtotal * 0.16;
    $('table.subtotal td.subtotal.iva').html(
      `$ ${iva.toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`
    );
    $('table.subtotal td.total, #paymentRest').html(
      `<strong>$ ${(subtotal + parseFloat(iva)).toFixed(
        2
      ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</strong>`
    );

    createRealSubtotal();
  }

  function createTotal(id){
    let cuantity = $(`input[id^=cuantityTo_${id}]`).val(),
      manualDiscount = !$('#manual-discount').hasClass('hidden'),
      price    = parseFloat(
        $(`td[id^=priceTo_${id}]`).html().replace(' $ ','')
      );
    if (!price){
      price = $(`td[id^=priceTo_${id}] input`).val();
    }
    let total =  price * cuantity,
        discount = $(`a[id^=discount_${id}]`)
      .html().replace(' %',''),
      discountVal = parseFloat(discount) / 100 * total,
      productTotal    = total - discountVal;

    if (manualDiscount){
      let globalManual = parseFloat(
        $('#manualDiscountQuantity').html().replace(' $ ','')
      );

      if (globalManual.toString() === 'NaN'){
        globalManual = 0;
      }

      $('#manualDiscountQuantity').html(
        ` $ ${(globalManual += discountVal).toFixed(
          2
        ).replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
        )}`
      );
    }

    return productTotal;
  }

  function addEvents(id){
    $(`button[id=delete_${id}]`).click(function(){
      $(`tr[id=product_${id}]`).remove();
      bigTotal();
      resumePayment();
    });

    $(`#cuantityTo_${id}`).keyup(function(){
      let total = createTotal(id);
      $(`#totalTo_${id}`).html(
        `$ ${(total * 1.16).toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`
      );

      $(`#totalSinTo_${id}`).html(
        `$ ${total.toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`
      );
      bigTotal();
      resumePayment();
    });

    $(`#priceToServiceTo_${id}`).keyup(function(){
      let total = createTotal(id);

      $(`#totalTo_${id}`).html(
        `$ ${(total * 1.16).toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`
      );

      $(`#totalSinTo_${id}`).html(
        `$ ${total.toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`
      );
      bigTotal();
      resumePayment();
    });
  }

  $('#deliveryService').on('shown.bs.modal', function(e) {
    let serviceId = e.relatedTarget.dataset.id;

    $('#delivery_service_sender_name').val('');
    $('#delivery_service_sender_zipcode').val('');
    $('#delivery_service_tracking_number').val('');
    $('#delivery_service_receivers_name').val('');
    $('#delivery_service_contact_name').val('');
    $('#delivery_service_street').val('');
    $('#delivery_service_exterior_number').val('');
    $('#delivery_service_interior_number').val('');
    $('#delivery_service_neighborhood').val('');
    $('#delivery_service_city').val('');
    $('#delivery_service_state').val('');
    $('#delivery_service_country').val('');
    $('#delivery_service_phone').val('');
    $('#delivery_service_cellphone').val('');
    $('#delivery_service_email').val('');
    $('#delivery_service_company').val('');
    $('#delivery_service_receivers_zipcode').val('');
    $('#secretServiceId').val(serviceId);

  });

  async function checkFillAll(objects){
    let error = false;
    for (var key in objects) {
      let validation = notNull(objects[key], key);
      if (!validation.result){
        error = true;
        showAlert(validation.type, validation.message, cloneAlert());
      }
    }
    return error;
  }

  function validateDeliveryService(call){
    let params = {
      sender_name       : $('#delivery_service_sender_name').val(),
      sender_zipcode    : $('#delivery_service_sender_zipcode').val(),
      tracking_number   : $('#delivery_service_tracking_number').val(),
      receivers_name    : $('#delivery_service_receivers_name').val(),
      contact_name      : $('#delivery_service_contact_name').val(),
      receivers_zipcode : $('#delivery_service_receivers_zipcode').val()
    };

    checkFillAll(params).then(error => {

      if (!error) {
        let thisOrThatFill = thisOrThat(
          '#delivery_service_phone',
          '#delivery_service_cellphone'
        );

        if (!thisOrThatFill.result) {
          showAlert(thisOrThatFill.type, thisOrThatFill.message, cloneAlert());
          return call(false);
        }
        return call(true);
      }
      return call(false);
    });
  }

  $('#deliveryServiceSave').click(function(){
    data = {
      sender_name       : $('#delivery_service_sender_name').val(),
      sender_zipcode    : $('#delivery_service_sender_zipcode').val(),
      tracking_number   : $('#delivery_service_tracking_number').val(),
      receivers_name    : $('#delivery_service_receivers_name').val(),
      contact_name      : $('#delivery_service_contact_name').val(),
      street            : $('#delivery_service_street').val(),
      exterior_number   : $('#delivery_service_exterior_number').val(),
      interior_number   : $('#delivery_service_interior_number').val(),
      neighborhood      : $('#delivery_service_neighborhood').val(),
      city              : $('#delivery_service_city').val(),
      state             : $('#delivery_service_state').val(),
      country           : $('#delivery_service_country').val(),
      phone             : $('#delivery_service_phone').val(),
      cellphone         : $('#delivery_service_cellphone').val(),
      email             : $('#delivery_service_email').val(),
      receivers_zipcode : $('#delivery_service_receivers_zipcode').val()
    };

    validateDeliveryService(function(validate){
      if (validate){

        findBy('id', $('#secretServiceId').val(), 'services').then(service => {

          data.company = service.rows[0].delivery_company;

          insert(
            Object.keys(data),
            Object.values(data),
            'delivery_services'
          ).then(deliveryServices => {

            let secretId = $('#secretServiceId').val();
            $(`#product_${secretId}_services`).append(
              `<td id="deliveryServiceId${secretId}" class="hidden">` +
              `${deliveryServices.lastId}</td>`
            );
            $('#deliveryService').modal('hide');

          });

        });
      }
    });

    return false;
  });

  $('#productShow').on('shown.bs.modal', function(e) {
    let relatedObject = e.relatedTarget.dataset,
        productId     = relatedObject.id.replace(/_.*/,'');

    findBy('id', productId, relatedObject.table).then(product => {
      let productData = product.rows[0];
      $('.product_description').html(
        productData.description
      );
      $('.product_unique_code').html(
        productData.unique_code
      );
      $('#product_measures').html(
        productData.only_measure
      );
      $('.product_main_material').html(
        productData.main_material
      );
      $('.product_resistance_main_material').html(
        productData.resistance_main_material
      );
      findBy('product_id', productId, 'stores_inventories').then(inventory => {
        $('.stores_inventory_quantity').html(
          inventory.rows[0].quantity
        );
        $('.stores_inventory_rack').html(
          inventory.rows[0].rack
        );
        $('.stores_inventory_level').html(
          inventory.rows[0].level
        );
      });
    });
  });

  $('#closeDiscount').click(function(e){
    let modalBody = $(this).parent().parent().find(
      '.modal-body'),
        id  = $(modalBody).attr('id').replace('discountTo_',''),
        tr = $(`#product_${id}`),
        discountReason = $(tr).find('td[id^=discountReasonTo]');

    if (discountReason) {
      $(discountReason).remove();
    }
    $(tr).append(
      `<td class='hidden' id="discountReasonTo_${id}">` +
        $(modalBody).find('#discountMotive').val() +
      '</td>'
    );
    $(tr).find('a[id^=discount]').html(
      `${$(modalBody).find('#discountCount').val()} %`
    );
    let total = createTotal(id);
    $(`#totalTo_${id}`).html(
      `$ ${(total * 1.16).toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`
    );

    $(`#totalSinTo_${id}`).html(
      `$ ${total.toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`
    );

    bigTotal();
    $('#discountRow').removeClass('hidden');
    $('#SubtotalRow').removeClass('hidden');
  });

  $('#discountChange').on('shown.bs.modal', function(e) {
    let relatedObject = e.relatedTarget.dataset,
        productId     = relatedObject.id;
    $(this).find('.modal-body').attr('id',
      `discountTo_${productId}`
    );

    $('#discountMotive, #discountCount').val('');
  });

  function carIcon(id, company){
    if (company === '') {
      return '';
    }

    return '<a href="#" data-toggle="modal"' +
      'data-target="#deliveryService"' +
      `id="service_1" data-id=${id}>` +
      '<i class="fa fa-truck" aria-hidden="true"></i>' +
      '</a>';
  }

  function translatePrice(price){
    let convertPrice =  parseFloat(
            price.replace(' $ ','')
          ).toFixed(2);

    if (convertPrice === "NaN") {
      return price;
    }
    return ` $ ${convertPrice.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`;
  }

  function addTr(product){
    let color = product.table === 'services' ? carIcon(product.id, product.company) :
      product.color,
      description = product.table === 'products' ? '<a href="#" data-toggle="modal" ' +
      ` data-target="#productShow" data-id="${product.id}" data-table="${product.table}" >` +
      ` ${product.description} </a>` : product.description,
      productInList = $(`#product_${product.id}`);

    if (productInList.length === 1) {
      if (product.table === 'products'){
        return '';
      } else {
        product.id = `${product.id}_${product.id}`;
      }
    }

    product.id = `${product.id}_${product.table}`;

    let price = product.table === 'products' ? ` $ ${product.price}` :
      '<input type="text" class="form-control ' +
      `smaller-form" id="priceToServiceTo_${product.id}" placeholder="$ 100.00">`;

    return `<tr id="product_${product.id}"><td>` +
      '<div class="close-icon">' +
      `<button id="delete_${product.id}" type="button"` +
      'class="close center-close" aria-label="Close">' +
      '<span aria-hidden="true" class="white-light">&times;</span>' +
      '</button>' +
      '</div>' +
      '</td>' +
      '<td class="left">' +
      description +
      '</td>' +
      `<td> ${color} </td>` +
      `<td id="priceTo_${product.id}">${translatePrice(price)}` +
      '</td><td>' +
      '<input type="text" class="form-control smaller-form" ' +
      `placeholder="1" id="cuantityTo_${product.id}"></td>` +
      '<td> <a href="#" data-toggle="modal"' +
      'data-target="#discountChange" ' +
      `id="discount_${product.id}" data-id="${product.id}" ` +
      `data-table="${product.table}" > 0% </a> </td>` +
      `<td class="right" id="totalTo_${product.id}"> $ </td>` +
      `<td class="right hidden" id="totalSinTo_${product.id}"> $ </td>` +
      '</tr>';
  }

  function formatSelection(state){
    return '';
  }

 (function setInitialValues(){
    initStore().then(store => {
      $('#username').html(
        '<i class="fa fa-user-circle-o bigger-icon"' +
        'aria-hidden="true"></i> ' +
        'Bienvenido, ' +
        createFullName(
          store.get('current_user')
        )
      );

      let lastTicket = store.get('lastTicket') ? store.get('lastTicket')
                       : 0;

      $('#ticketNum').html(
        ` ${lastTicket + 1} `
      );

      $('#cashName').html(
        ` ${store.get('cash')} `
      );

      $('#store').html(store.get('store').store_name);

      getAll('terminals').then(terminals => {
        if (terminals.rows.length === 0) {
          $('#credit, #debit, #select_terminal').addClass('hidden');
        } else {
          $('#credit, #debit, #select_terminal').removeClass('hidden');
          terminals.rows.forEach(terminal => {
            $('#select_terminal').append(
              `<option value="${terminal.id}">${terminal.name}</option>`
            );
          });
        }
      });

      setTimeout(function(){
        if ($('#mainProductSearch').attr('autocomplete') === 'undefined'){
          $('#pos').click();
        }
      }, 2000);

      getProductsAndServices(list => {
        $('#addProductSearch').autocomplete({
            lookup: list,
//            lookupLimit: 10,
            onSelect: function (suggestion) {
              $('#addProductQuantity').append(
                productAddChange(suggestion)
              );

              let selector = document.getElementById("addProductInput");
              var im = new Inputmask("99999999");
              im.mask(selector);
              $(this).val('');
            }
          });

        $('#mainProductSearch').autocomplete({
          lookup: list,
//          lookupLimit: 10,
          onSelect: function (suggestion) {
            $('#ticketList').append(addTr(suggestion));
            addEvents(suggestion.id);
            $(this).val('');
          }
        });
      });

    });
  })();

/* Métodos para cambiar botón de tipo de ventas*/
  $("#change-option").click(function () {

    /*Oculta las formas de pago no necesarias en esta sección*/
    $('#creditSale').removeClass('hidden');
    $('#returnCash').removeClass('hidden');
    /*Oculta la barra de búsqueda de productos y muestra las barras de navegación secundarias*/
    $('.extra-search').removeClass('hidden');
    $('.main-search').addClass('hidden');
    /*Oculta la tabla para agregar artículos al ticket*/
    $('.items-sales').addClass('hidden');
    /*Oculta la tabla de resultados para la búsqueda de tickets */
    $('.ticket-results').addClass('hidden');
    /*Oculta la tabla que muestra el detalle del ticket seleccionado */
    $('.ticket-selected').addClass('hidden');
    /*Oculta la tabla que muestra los artículos del ticket de devolución */
    $('.items-returns').addClass('hidden');
    /*Oculta la tabla que muestra los artículos del ticket de cambio */
    $('.items-changes').addClass('hidden');
    /*Oculta la tabla que muestra los artículos del ticket de venta */
    $('.items-sales').addClass('hidden');
    /* Muestra una parte de la sección lateral derecha no necesaria para cotización */
    $('.pay-forms-table').removeClass('hidden');
    $('.payment-form-wrapper').removeClass('hidden');
    $('.process-sale').removeClass('hidden');
    $('.pause-stop').removeClass('hidden');

    /*Esta sección muestra el botón elegido de la barra de navegación y oculta los demás botones*/
    $('#change').removeClass('hidden');
    $('#sale').addClass('hidden');
    $('#return').addClass('hidden');
    $('#advance').addClass('hidden');
    $('#estimate').addClass('hidden');
    $('#change').addClass('active-sale-option');
    $('#return').removeClass('active-sale-option');
    $('#sale').removeClass('active-sale-option');
    $('#advance').removeClass('active-sale-option');
    $('#estimate').removeClass('active-sale-option');

    /*Esta sección oculta la opción elegida y muestra las demás*/
    $("#change-option").addClass('hidden');
    $("#sale-option").removeClass('hidden');
    $("#return-option").removeClass('hidden');
    $("#advance-option").removeClass('hidden');
    $("#estimate-option").removeClass('hidden');
    $('.payments-received-on-ticket').addClass('hidden');

    $('.second-search').addClass('hidden');
  });

  $("#return-option").click(function () {
    $('#creditSale').addClass('hidden');
    $('#returnCash').removeClass('hidden');
    $('.items-sales').addClass('hidden');
    $('.ticket-results').addClass('hidden');
    $('.ticket-selected').addClass('hidden');
    $('.items-returns').addClass('hidden');
    $('.items-changes').addClass('hidden');
    $('.extra-search').removeClass('hidden');
    $('.main-search').addClass('hidden');
    $('.items-sales').addClass('hidden');
    /* Muestra una parte de la sección lateral derecha no necesaria para cotización */
    $('.pay-forms-table').removeClass('hidden');
    $('.payment-form-wrapper').removeClass('hidden');
    $('.process-sale').removeClass('hidden');
    $('.pause-stop').removeClass('hidden');

    /*Esta sección muestra el botón elegido de la barra de navegación (también le da estilo) y oculta los demás botones*/
    $('#return').removeClass('hidden');
    $('#sale').addClass('hidden');
    $('#change').addClass('hidden');
    $('#advance').addClass('hidden');
    $('#estimate').addClass('hidden');
    $('#return').addClass('active-sale-option');
    $('#sale').removeClass('active-sale-option');
    $('#advance').removeClass('active-sale-option');
    $('#change').removeClass('active-sale-option');
    $('#estimate').removeClass('active-sale-option');

    /*Esta sección oculta la opción elegida y muestra las demás*/
    $("#return-option").addClass('hidden');
    $("#sale-option").removeClass('hidden');
    $("#change-option").removeClass('hidden');
    $("#advance-option").removeClass('hidden');
    $("#estimate-option").removeClass('hidden');
    $('.payments-received-on-ticket').addClass('hidden');

    $('.second-search').addClass('hidden');
  });

  $("#sale-option").click(function () {
    $('#creditSale').removeClass('hidden');
    $('#returnCash').addClass('hidden');

    $('.extra-search').addClass('hidden');
    $('.main-search').removeClass('hidden');
    $('.items-sales').removeClass('hidden');
    $('.ticket-selected').addClass('hidden');
    $('.items-changes').addClass('hidden');
    $('.items-returns').addClass('hidden');
    /* Muestra una parte de la sección lateral derecha no necesaria para cotización */
    $('.pay-forms-table').removeClass('hidden');
    $('.payment-form-wrapper').removeClass('hidden');
    $('.process-sale').removeClass('hidden');
    $('.pause-stop').removeClass('hidden');

    /*Esta sección muestra el botón elegido de la barra de navegación y oculta los demás botones*/
    $('#sale').removeClass('hidden');
    $('#return').addClass('hidden');
    $('#change').addClass('hidden');
    $('#advance').addClass('hidden');
    $('#estimate').addClass('hidden');
    $('#sale').addClass('active-sale-option');
    $('#advance').removeClass('active-sale-option');
    $('#change').removeClass('active-sale-option');
    $('#return').removeClass('active-sale-option');
    $('#estimate').removeClass('active-sale-option');

    /*Esta sección oculta la opción elegida y muestra las demás*/
    $("#sale-option").addClass('hidden');
    $("#return-option").removeClass('hidden');
    $("#change-option").removeClass('hidden');
    $("#advance-option").removeClass('hidden');
    $("#estimate-option").removeClass('hidden');
    $('.payments-received-on-ticket').addClass('hidden');

    $('.second-search').addClass('hidden');
  });

  $("#advance-option").click(function () {
    $('#creditSale').addClass('hidden');
    $('#returnCash').addClass('hidden');
    $('.items-sales').removeClass('hidden');
    $('.ticket-results').addClass('hidden');
    $('.ticket-selected').addClass('hidden');
    $('.items-returns').addClass('hidden');
    $('.items-changes').addClass('hidden');
    $('.extra-search').removeClass('hidden');
    $('.main-search').addClass('hidden');
    $('.items-sales').addClass('hidden');
    /* Muestra una parte de la sección lateral derecha no necesaria para cotización */
    $('.pay-forms-table').removeClass('hidden');
    $('.payment-form-wrapper').removeClass('hidden');
    $('.process-sale').removeClass('hidden');
    $('.pause-stop').removeClass('hidden');


    /*Esta sección muestra el botón elegido de la barra de navegación y oculta los demás botones*/
    $('#advance').removeClass('hidden');
    $('#change').addClass('hidden');
    $('#sale').addClass('hidden');
    $('#return').addClass('hidden');
    $('#estimate').addClass('hidden');
    $('#advance').addClass('active-sale-option');
    $('#sale').removeClass('active-sale-option');
    $('#change').removeClass('active-sale-option');
    $('#return').removeClass('active-sale-option');
    $('#estimate').removeClass('active-sale-option');

    /*Esta sección oculta la opción elegida y muestra las demás*/
    $("#advance-option").addClass('hidden');
    $("#change-option").removeClass('hidden');
    $("#sale-option").removeClass('hidden');
    $("#return-option").removeClass('hidden');
    $("#estimate-option").removeClass('hidden');

    $('.second-search').addClass('hidden');
  });

  $("#estimate-option").click(function () {
    /*Oculta las formas de pago no necesarias en esta sección*/
    $('#creditSale').removeClass('hidden');
    $('#returnCash').addClass('hidden');
    /*Oculta la barra de búsqueda de productos y muestra las barras de navegación secundarias*/
    $('.extra-search').addClass('hidden');
    $('.main-search').removeClass('hidden');

    $('.items-sales').removeClass('hidden');
    $('.ticket-selected').addClass('hidden');
    $('.items-changes').addClass('hidden');
    $('.items-returns').addClass('hidden');

    /* Oculta una parte de la sección lateral derecha no necesaria para cotización */
    $('.pay-forms-table').addClass('hidden');
    $('.payment-form-wrapper').addClass('hidden');
    $('.process-sale').addClass('hidden');
    $('.pause-stop').addClass('hidden');

    /*Esta sección muestra el botón elegido de la barra de navegación y oculta los demás botones*/
    $('#estimate').removeClass('hidden');
    $('#sale').addClass('hidden');
    $('#return').addClass('hidden');
    $('#change').addClass('hidden');
    $('#advance').addClass('hidden');
    $('#estimate').addClass('active-sale-option');
    $('#advance').removeClass('active-sale-option');
    $('#change').removeClass('active-sale-option');
    $('#return').removeClass('active-sale-option');
    $('#sale').removeClass('active-sale-option');

    /*Esta sección oculta la opción elegida del dropdown y muestra las demás*/
    $("#sale-option").removeClass('hidden');
    $("#return-option").removeClass('hidden');
    $("#change-option").removeClass('hidden');
    $("#advance-option").removeClass('hidden');
    $("#estimate-option").addClass('hidden');
    $('.payments-received-on-ticket').addClass('hidden');

    $('.second-search').addClass('hidden');
  });


/* Métodos para los buscadores de productos / tickets / clientes (mostrar tabla de resultados) */
$("#searchProducts").click(function () {
  $('.ticket-results').removeClass('hidden');
});

$("#searchProspects").click(function () {
  $('.ticket-results').removeClass('hidden');
});

$("#searchTickets").click(function () {
  $('.ticket-results').removeClass('hidden');
});

/* Método para ocultar tabla de resultados ymostrar tablas y buscadores pagos / cambios / devoluciones */
$(".hide-results").click(function () {
  $('.ticket-results').addClass('hidden');
  $('.ticket-selected').removeClass('hidden');
  $('.payments-received-on-ticket').addClass('hidden');

  if ($("#return").hasClass('active-sale-option')) {
    $('.items-returns').removeClass('hidden');
    $('.payments-received-on-ticket').addClass('hidden');
    $('.second-search').addClass('hidden');

  } else if ($("#change").hasClass('active-sale-option')) {
    $('.items-changes').removeClass('hidden');
    $('.second-search').removeClass('hidden');
    $('.payments-received-on-ticket').addClass('hidden');

  } else if ($("#advance").hasClass('active-sale-option')) {
    $('.payments-received-on-ticket').removeClass('hidden');
    $('.second-search').addClass('hidden');
  };

});

/* Métodos para descuentos*/
  $("#manual").click(function () {
    $(this).addClass('selected');
    $('#automatic-discount').addClass('hidden');
    $('#manual-discount').removeClass('hidden');
    $('#automatic').removeClass('selected');
    $('#none').removeClass('selected');
  });

  $("#none").click(function () {
    $(this).addClass('selected');
    $('#automatic-discount').addClass('hidden');
    $('#manual-discount').addClass('hidden');
    $('#automatic').removeClass('selected');
    $('#manual').removeClass('selected');
  });

  $("#automatic").click(function () {
    $(this).addClass('selected');
    $('#automatic-discount').removeClass('hidden');
    $('#manual-discount').addClass('hidden');
    $('#manual').removeClass('selected');
    $('#none').removeClass('selected');
  });

/* Métodos para tipo de forma de pago*/
  $("#cash").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#other').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').addClass('hidden');
    $('.select-register-container').addClass('hidden');
  });

  $("#debit").click(function () {
    $(this).addClass('selected');
    $('#cash').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#other').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').addClass('hidden');
    $('.select-register-container').removeClass('hidden');
  });

  $("#credit").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#other').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').addClass('hidden');
    $('.select-register-container').removeClass('hidden');
  });

  $("#check").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#other').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').removeClass('hidden');
    $('.select-register-container').addClass('hidden');
  });

  $("#transfer").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#other').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').removeClass('hidden');
    $('.select-register-container').addClass('hidden');
  });

  $("#other").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').addClass('hidden');
    $('.select-register-container').addClass('hidden');
  });

  $("#creditSale").click(function () {
    $(this).addClass('selected');
    $('.credit-days-container').removeClass('hidden');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#other').removeClass('selected');
    $('#returnCash').removeClass('selected');
    $('.credit-days-container').removeClass('hidden');
    $('.operation-number-container').addClass('hidden');
    $('.select-register-container').addClass('hidden');
  });

  $("#returnCash").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#other').removeClass('selected');
    $('#creditSale').removeClass('selected');
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').addClass('hidden');
    $('.select-register-container').addClass('hidden');
  });

  $(".show-payments").click(function () {
    $('.payments-received-on-ticket-two').removeClass('hidden');
    $(".show-payments").addClass('hidden');
    $(".hide-payments").removeClass('hidden');
  });

  $(".hide-payments").click(function () {
    $('.payments-received-on-ticket-two').addClass('hidden');
    $(".hide-payments").addClass('hidden');
    $(".show-payments").removeClass('hidden');
  });

});
