$(document).ready(function() {

  $('#changeSinglePrice').on('shown.bs.modal', function(e) {

    let changeSinglePriceOption = document.getElementById("changeSinglePriceInput");
    var im = new Inputmask("decimal");
    im.mask(changeSinglePriceOption);

    $('#changeSinglePriceProductId').html(e.relatedTarget.dataset.id.replace(/_products/, '').replace(/_.*/,''));
  });

  $('#saveNewPrice').click(function(){
    let productId = $('#changeSinglePriceProductId').html();
    let newPrice = parseFloat($('#changeSinglePriceInput').val());
    if (isNaN(newPrice)) {
      newPrice = 0;
    }
    updateBy(
      {
        price: newPrice
      },
      'products',
      `id = ${productId}`
    ).then(() => {});

    updateBy(
      {
        manual_price: newPrice,
        manual_price_update: !!$("#changeSinglePriceCheckBox").is(':checked')
      },
      'stores_inventories',
      `product_id = ${productId}`
    ).then(() => {});

    $(`td[id^=priceTo_${productId}] a`).html(`
      $ ${parseFloat(newPrice).toFixed(2).replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
        )}
    `);
    $('#changeSinglePriceInput').val('');
    $('#changeSinglePrice').modal('hide');
    $("#changeSinglePriceCheckBox").prop('checked', false);
    let elementCount = $(`tr[id^=product_${productId}`).length;
    let mainSelector = `#product_${productId}_products[data-child-count=${elementCount}]`;
    let total = createTotal(`${productId}_products`, mainSelector);

    $(`#totalTo_${productId}_products`).html(
      `$ ${(total.total * 1.16).toFixed(2).replace(
    /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
  )}`
    );

    $(`#totalSinTo_${productId}_products`).html(
      `$ ${total.totalNoDesc.toFixed(2).replace(
    /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
  )}`
    );
    bigTotal();
    resumePayment();
  });

  function getCashRegisterSum(){
    return 'SELECT (SUM((SELECT COALESCE(SUM(deposits.amount),0) as d FROM deposits)) ' +
          '- SUM((SELECT COALESCE(SUM(withdrawals.amount),0) as w FROM withdrawals)) + ' +
          'SUM((SELECT (COALESCE(SUM(' +
          "CASE WHEN payments.payment_type = 'pago' AND payments.payment_form_id = 1 THEN payments.total " +
          "WHEN payments.payment_type = 'devolución' AND payments.payment_form_id = 1 THEN -payments.total " +
          'ELSE 0 ' +
          'END ' +
          '),0)) as s ' +
          'FROM payments INNER JOIN tickets ON tickets.id = payments.ticket_id ' +
          "WHERE (tickets.ticket_type != 'pending' AND payments.payment_form_id = 1)))) as sum";
  }

  const Inputmask = require('inputmask');
  const Promise = require("bluebird");

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
    return `<tr id="addProduct_${product.productid}">` +
      '<td class="left">' +
      product.value +
      '</td>' +
      `<td> ${product.color} </td>` +
      '<td><input type="text" class="form-control" id="addProductInput" smaller-form" placeholder="1"></td>' +
      '<td><input type="text" class="form-control" id="addReason" smaller-form" placeholder="Motivo">' +
      '</td></tr>';
  }

  function getCostPrice(price, overprice, discount){
    return (
        price /  (1 + (overprice / 100)) * (1 - discount / 100 )
      ).toFixed(2);
  }

  function createStoreMovementData(productId, quantity, action, call){
    findBy('id', productId, 'products').then(product => {
      productDetails = Object.assign(product.rows[0]);
      if (productDetails.discount_for_franchises == null) {
        productDetails.discount_for_franchises = 0;
      }
      if (productDetails.discount_for_stores == null) {
        productDetails.discount_for_stores = 0;
      }
      store_product = !(productDetails.store_id == null);
      storeMovementData = {
        product_id    : productDetails.id,
        quantity      : quantity,
        movement_type : action,
        reason        : $("#addReason").val(),
        initial_price : productDetails.price.toFixed(2),
        supplier_id   : productDetails.supplier_id,
      };

      initStore().then(storage => {

        let store = storage.get('store');
        let user = storage.get('current_user');

        if (store_product) {
          if (productDetails.cost == null) {
            storeMovementData.cost = 0;
            storeMovementData.total_cost  = storeMovementData.cost * quantity;
            storeMovementData.final_price = storeMovementData.cost;
          } else {
            storeMovementData.cost = productDetails.cost;
            storeMovementData.total_cost  = storeMovementData.cost * quantity;
            storeMovementData.final_price = storeMovementData.cost;
          }
        } else {
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
        }

        storeMovementData.user_id = user.id;

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

  function localUpdateStoreInventories(productId, quantityUpdate){

    findBy('product_id', productId, 'stores_inventories').then(inventory => {
      updateBy(
        {
          quantity: (inventory.rows[0].quantity - quantityUpdate)
        },
        'stores_inventories',
        `id = ${inventory.rows[0].id}`
      );
    });

  }

  function destroyProcess(productId, totalQuantity){
    let localQuery      =  specialQuery(productId),
        processQuantity =  totalQuantity;
    localUpdateStoreInventories(
      productId, totalQuantity
    );
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
    });
  }

  $('#warehouseEntry').on('hidden.bs.modal', function () {
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
    $('#addProductSearch').val('');
  })

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
    downUpField = $('#addProductInput').val();
    if ( isNaN(parseInt(downUpField.replace(/_/g,''))) || parseInt(downUpField.replace(/_/g,'')) == 0 ) {
      downUpField = 0;
      alert('No seleccionó ninguna cantidad válida');
      $('#confirmAddProduct').prop('disabled', false);
    } else {
      downUpField = parseInt(downUpField.replace(/_/g,''));
      let id = $('tr[id^=addProduct_]').attr(
        'id'
      ).replace(/\D/g,''),
        action = $('#addProductDetails').hasClass('head-blue') ? 'alta' : 'baja',
        table = 'stores_inventories',
        condition = `product_id = ${id}`,
        data = {
          'quantity': downUpField
        };

      findBy('product_id', id, table).then(inventory => {
        inventoryObject = inventory.rows[0];
        if (action == 'baja' && inventory.rows[0].quantity < data.quantity) {
          alert(`No puede dar de baja ${data.quantity} piezas, el inventario actual es de solo ${inventory.rows[0].quantity}, seleccione otra cantidad.`);
          $('#confirmAddProduct').prop('disabled', false);
        } else {
          createStoreMovementData(id, data.quantity, action, function(storeMovementId){
            if (!storeMovementId){
              $('#warehouseEntry').modal('hide');
              alert('Proceso no concluido, por favor realice la entrada/salida de nuevo');
            }

            if ( action === 'alta') {
              createWarehouseEntry(id, storeMovementId);
            } else {
              destroyProcess(id, $('#addProductInput').val().replace(/_/g,''));
            }

            $('#warehouseEntry').modal('hide');
          });
        }

        if (action === 'alta'){
          data.quantity += inventory.rows[0].quantity;
          updateBy(data, table, condition).then(() => {
          }, err => {
          });
        }
      });
    }
  });

  function toggleProductAction(type){
    $('#confirmAddProduct').prop('disabled', false);
    $('#addProductQuantity tr[id^=addProduct_]').remove();
    if (type === 'Baja'){

      $('#addProductDetails')
        .removeClass('head-blue')
        .addClass('head-red');
      $('#modalTitleAltaBaja').html('Salida de mercancías');
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
    let productsQuery = `SELECT CONCAT(unique_code, ' ', description, ' ', only_measure) AS value,` +
      'id AS productId, price,' +
      `COALESCE(exterior_color_or_design, 'Sin diseño') AS color,` +
      `description, 'products' AS table FROM products`;

    query(productsQuery).then(products => {
      if (!products){
        window.location.href = 'pos_sale.html';
        return 0;
      }
      options = products.rows;
      let serviceQuery = `SELECT concat(unique_code, ' ', description) AS value,` +
        'id AS productId ,' +
        `COALESCE(delivery_company, '') as company,` +
        `description, 'services' AS table FROM services`;
        query(serviceQuery).then(services => {
          if (!services){
            window.location.href = 'pos_sale.html';
            return 0;
          }
          return call(options.concat(services.rows));
        })
        .catch(function(err){
          window.location.href = 'pos_sale.html';
          return 0;
        });
      });
  }

  $('[id^=quantity_]').on('keyup', function(){
    let id = $(this).attr('id').replace('quantity_', '');
    let limitValue = parseInt($(this).parent().parent().find('#totalInventory_' + id).html());
    let tryValue = parseInt($(this).val());
    if ( tryValue > limitValue ){
      $(this).val(limitValue);
    }
  });

  function validateTotalPayment(){
    let type  = $('.payment-form-wrapper .selected')
      .html().replace(/\s/g,'').replace(/.*<\/i>/,'');
    let paymentRest = parseFloat($('#paymentRest').text().replace("$ ","").replace(/,/g,""));
    let currentPayment = parseFloat($('#paymentMethodCuantity').val());
    if (type != 'Efectivo' && currentPayment > paymentRest) {
      $('#paymentMethodCuantity').val(paymentRest);
    }
  }

  $('#paymentMethodCuantity').on('keyup', function(){
    validateTotalPayment();
  });

  function addPaymentTr(total, count){
    let type  = $('.payment-form-wrapper .selected')
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
      `${convertToPrice(total)}` +
      '</td>' +
      '</tr>';
  }

  function convertToPosPrice(price){
    return `$ ${price.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`;
  }

  function sumaPayment(total, paymentType){
    let actualAmount = $(paymentType).find(
      'td[class*=cuantity]'
    ).html().replace(/\s|\$|,/g,'');
    let roundValue = Math.round(actualAmount * 100) / 100;
      $(paymentType).find('td[class*=cuantity]').html(convertToPosPrice(roundValue + total));
  }

  $('#addPayment').click(function(){
    paymentsJson = {};

    let paymentsTable = $('.payments-received-on-ticket').length;
    if ($('#ticketList tr').length === 0 && paymentsTable === 0){
      return false;
    }
    let type = $('.payment-form-wrapper .selected')
      .html().replace(/\s/g,'').replace(/.*<\/i>/,'');
    if (type == 'VentaaCrédito') {
      type = "'Venta a Crédito'"
    }

    $.each($("[id^=paymentMethod_]"), function(){
      thisId = parseInt($(this).attr('id').replace('paymentMethod_', ''));
      payForm = $(this).attr('data-type');
      paymentsJson[payForm] = thisId;
    });
    let count = $('#paymentMethodList tr').length - 2,
      referenceSelector  = 'input[type=text][placeholder="Referencia bancaria"]',
      creditDaysSelector = 'input[type=text][placeholder="Ejemplo: 30 (solo número)"]';
      paymentTypeSelector = $(`tr[data-type=${type}]`);

    if (paymentsJson[type] == undefined) {
      if (type == "'Venta a Crédito'") {
        type = 'Venta a Crédito';
        if (paymentsJson[type] == undefined) {
          paymentsJson[type] = Object.keys(paymentsJson).length;
        }
      } else {
        paymentsJson[type] = Object.keys(paymentsJson).length;
      }
    }

    if ( isNaN(parseFloat( $('#paymentMethodCuantity').val() )) ) {
      paymentAmountTotal = 0;
      alert('Por favor seleccione una cantidad válida: sin espacios, letras o caracteres especiales');
    } else {
      paymentAmountTotal = parseFloat($('#paymentMethodCuantity').val());
    }

    if (paymentTypeSelector.length === 0){
      $('#paymentMethodList').prepend(addPaymentTr(paymentAmountTotal, paymentsJson[type]));
    } else {
      sumaPayment(paymentAmountTotal, paymentTypeSelector);
    }

    if (type === 'Débito' || type === 'Crédito'){
      $(`tr[id=paymentMethod_${paymentsJson[type]}]`).append(
        `<td id="terminal_${paymentsJson[type]}" class="hidden">${$('#select_terminal').val()}</td>`
      );
    }

    if (type === 'Cheque' || type === 'Transferencia') {
          referencia  = $(referenceSelector).val();
      $(`tr[id=paymentMethod_${paymentsJson[type]}]`).append(
        `<td id="reference_${paymentsJson[type]}" class="hidden">${referencia}</td>`
      );
    }
    if (type === 'Venta a Crédito') {
      let creditDays = parseInt($(creditDaysSelector).val().replace(/_/g,''));
      if (creditDays.toString() === 'NaN') {
        creditDays = 0;
      }
      if ($(`#creditDays_${paymentsJson[type]}`).length == 0) {
        $(`tr[id=paymentMethod_${paymentsJson[type]}]`).append(
          `<td id="creditDays_${paymentsJson[type]}" class="hidden">${creditDays}</td>`
        );
      } else {
        $(`#creditDays_${paymentsJson[type]}`).remove();
        $(`tr[id=paymentMethod_${paymentsJson[type]}]`).append(
          `<td id="creditDays_${paymentsJson[type]}" class="hidden">${creditDays}</td>`
        );
      }
    }
    $('#paymentMethodCuantity').val('');
    $(referenceSelector).val('');
    $(creditDaysSelector).val('');

    $(`#closeTr_${paymentsJson[type]}`).click(function(){
      $(`tr[id=paymentMethod_${paymentsJson[type]}]`).remove();
      resumePayment();
    });

    resumePayment();
  });

  $('#ticketDiscountChange .confirm').click(function(){
    $('#discountRow').removeClass('hidden');
    $('#SubtotalRow').removeClass('hidden');
    $('#manualDiscountQuantity').parent().addClass('hidden')
    ticketDiscInput = $('#globalDiscount input:first').val();
    if (isNaN(parseFloat(ticketDiscInput))) {
      ticketDiscInput = 0;
    }
    $.each($('a[id^=discount]'), function(){
      $(this).html(
        ticketDiscInput + ' %'
      );
      let id = $(this).parents('tr').attr('id').replace('product_',''),
          elementCount = $(this).parents('tr').attr('data-child-count'),
          mainSelector = `#product_${id}[data-child-count=${elementCount}]`;
          total = createTotal(id, mainSelector);
      $(`${mainSelector} td[id^=totalTo_${id}]`).html(
        `$ ${(total.total * 1.16).toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`
      );

    });
    bigTotal();
    resumePayment();
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

  function updateTicketSaved(ticketId){
    updateBy(
      {
        ticket_type: 'guardado / cobrado'
      },
      'tickets',
      `id = ${ticketId}`
    ).then(() => {});
  }

  $('#completeSale').click(function(){

    if (isPago()){
      addPaymentToTicket();
      return false;
    }

    if (isDevolucion()) {
      processDevolucion();
      return false;
    }

    let restoreTicketId = window.location.href.replace(/.*ticket_id=/,'');

    if (!isNaN(parseInt(restoreTicketId))){
      updateTicketSaved(restoreTicketId);
    }

    if (validateAllServiceOfferedFill()){

      if (!validateAllInputsFill()) {
        alert('Favor de llenar todos los campos');
        return false;
      }

      $(this).prop( "disabled", true );
      validateQuantity(function(hasInventory){

        if (hasInventory){

          initStore().then(store => {
            let user      = store.get('current_user').id,
              storeObject = store.get('store');

            ticketData = {
              store : storeObject,
              user  : store.get('current_user'),
            };
            let ticketId = null;
            insertTicket(user, function(ticketId){
              assignCost(user, 'venta', ticketId, function(warehouseInfo){
                ticketData.storeWarehouseInfo = warehouseInfo;
                insertsServiceOffereds(ticketId, 'venta', function(){

                  insertsPayments('venta', ticketId, user, storeObject, null, function(){

                    store.set('lastTicket', parseInt(
                      ticketId
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
                                            alert(`La caja tiene un saldo de ${translatePrice(ticketData.cashRegister.balance)} ` +
                                              'pesos. Realice un retiro.');
                                          }
                                          $(this).prop( "disabled", false );
                                           window.location.href = 'pos_sale.html';

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
      $('#completeSale').prop( "disabled", false );
    }

  });

  function createTotal(id, mainSelector){
    totalObject = {};
    first = mainSelector.slice(0, mainSelector.indexOf("[")).replace("#","");
    second = mainSelector.substring(mainSelector.indexOf("["));
    manualDiscount = !$('#manual-discount').hasClass('hidden');
    cuantity = $(`[id="${first}"]${second}`).children().find(`#cuantityTo_${id}`).val().replace(/_/g,'');
    if (isNaN(parseInt(cuantity))) {
      cuantity = 0;
    } else {
      cuantity = parseInt(cuantity)
    }
    price = 0;
    priceElement = $(`[id="${first}"]${second}`).children().find(`[data-id=${id}][data-target="#changeSinglePrice"]`);
    if (!$(priceElement).html()){
      price = $(`[id="${first}"]${second}`).children().find(`#priceToServiceTo_${id}`).val();
    } else {
      price    = parseFloat(
        $(priceElement).html().replace(' $ ','').replace(/,/g,'')
      );
    }
    let total =  parseFloat( (price * cuantity).toFixed(2) ),
        discount = $(`[id="${first}"]${second}`).children().find(`#discount_${id}`)
      .html().replace(' %',''),
      discountVal = parseFloat(parseFloat ( (parseFloat(discount) / 100 * total).toFixed(3) ).toFixed(2)),
      productTotal    = total - discountVal;
      totaWithoutDisc = total;
      totalObject["total"] = productTotal;
      totalObject["totalNoDesc"] = totaWithoutDisc;

    if (manualDiscount){
      let globalManual = parseFloat(
        $('#manualDiscountQuantity').html().replace(' $ ','').replace(/,/g,'')
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

    return totalObject;
  }

  function cleanRows(){
    $("tr[id*='product_'").each(function() {
      $(this).remove();
    });
    bigTotal();
    resumePayment();
  }

  function addEvents(id, elementCount){
    let mainSelector = `#product_${id}[data-child-count=${elementCount}]`;
    $(`${mainSelector} button[id=delete_${id}]`)
    .click(function(){
      $(`${mainSelector}`).remove();
      bigTotal();
      resumePayment();
    });

    $(`${mainSelector} #cuantityTo_${id}, ${mainSelector} #priceToServiceTo_${id}`).keyup(function(){
      let total = createTotal(id, mainSelector);
      $(`${mainSelector} td[id=totalTo_${id}]`).html(
        `$ ${(total.total * 1.16).toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`
      );

      $(`${mainSelector} td[id=totalSinTo_${id}]`).html(
        `$ ${total.totalNoDesc.toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`
      );
      bigTotal();
      resumePayment();
    });
  }

  $('#deliveryService').on('shown.bs.modal', function(e) {
    let elementCount = $(e.relatedTarget).parents('tr').attr('data-child-count');
    let id = $(e.relatedTarget).parents('tr').attr('id').replace('product_','');
    let selector = `a[data-id=${id}][data-child-count=${elementCount}]`;
    let delivery_id = $(e.relatedTarget).parents('tr').find('[id^=deliveryServiceId]').html();

    if (delivery_id != null) {
      findBy('id', delivery_id, 'delivery_services').then(deliveryService => {
        let deliveryInfo = deliveryService.rows[0];
        $('#delivery_service_sender_name').val(deliveryInfo.sender_name);
        $('#delivery_service_sender_zipcode').val(deliveryInfo.sender_zipcode);
        $('#delivery_service_tracking_number').val(deliveryInfo.tracking_number);
        $('#delivery_service_receivers_name').val(deliveryInfo.receivers_name);
        $('#delivery_service_contact_name').val(deliveryInfo.contact_name);
        $('#delivery_service_street').val(deliveryInfo.street);
        $('#delivery_service_exterior_number').val(deliveryInfo.exterior_number);
        $('#delivery_service_interior_number').val(deliveryInfo.interior_number);
        $('#delivery_service_neighborhood').val(deliveryInfo.neighborhood);
        $('#delivery_service_city').val(deliveryInfo.city);
        $('#delivery_service_state').val(deliveryInfo.state);
        $('#delivery_service_country').val(deliveryInfo.country);
        $('#delivery_service_phone').val(deliveryInfo.phone);
        $('#delivery_service_cellphone').val(deliveryInfo.cellphone);
        $('#delivery_service_email').val(deliveryInfo.email);
        $('#delivery_service_receivers_zipcode').val(deliveryInfo.receivers_zipcode);
        $('#delivery_service_weight').val(deliveryInfo.weight);
        $('#delivery_service_length').val(deliveryInfo.length);
        $('#delivery_service_width').val(deliveryInfo.width);
        $('#delivery_service_height').val(deliveryInfo.height);
      });
    } else {
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
      $('#delivery_service_weight').val('');
      $('#delivery_service_length').val('');
      $('#delivery_service_width').val('');
      $('#delivery_service_height').val('');
    }

    $('#secretServiceId').val(selector);

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
      receivers_zipcode : $('#delivery_service_receivers_zipcode').val(),
      weight            : $('#delivery_service_weight').val(),
      length            : $('#delivery_service_length').val(),
      width             : $('#delivery_service_width').val(),
      height            : $('#delivery_service_height').val()
    };

    validateDeliveryService(function(validate){
      if (validate){
        let sendElement = $('#secretServiceId').val();
        let id = $(sendElement).parents('tr').attr('id').replace('product_','');

        findBy('id', $('#secretServiceId').val().match(/\d+/)[0], 'services').then(service => {

          data.company = service.rows[0].delivery_company;

          insert(
            Object.keys(data),
            Object.values(data),
            'delivery_services'
          ).then(deliveryServices => {
            let elementId = $($('#secretServiceId').val()).parents('tr').attr('id').replace('product_','');
            $($('#secretServiceId').val()).parents('tr').append(
              `<td id="deliveryServiceId${elementId}" class="hidden">` +
              `${deliveryServices.lastId}</td>`
            );
            $($('#secretServiceId').val()).parents('tr').find('#service_1').addClass('green-truck');
            $('#deliveryService').modal('hide');
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
          });
        });
      }
    });
    return false;
  });

// Todavía necesita modificaciones el proceso de cambio de ubicación //
  $('#productShow').on('shown.bs.modal', function(e) {

    $("#rackSave").val("");
    $("#levelSave").val("");
    $("#modifyLocation").html("Modificar ubicación");
    $("#modifyLocation").removeClass("confirmChangeLocation");
    let relatedObject = e.relatedTarget.dataset,
        productId     = relatedObject.id.replace(/_.*/,'');

    $('#product_id_modal').html(productId);

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
          let rack = inventory.rows[0].rack;

          let level = inventory.rows[0].level;

        if (level == null) {
          level = "";
        } else {
          level = inventory.rows[0].level;
        }

        if (rack == null) {
          rack = "";
        } else {
          rack = inventory.rows[0].rack;
        }

        if (rack == '') {
          $('.stores_inventory_rack').html(
            ""
          );
        } else {
          $('.stores_inventory_rack').html(
            `Anaquel: ${rack},`
          );
        }

        if (level == '') {
          $('.stores_inventory_level').html(
            ""
          );
        } else {
          $('.stores_inventory_level').html(
            `Nivel: ${level}`
          );
        }
      });
    });
  });

  $("#modifyLocation").click(function(){
    let code = $("#unique_code").html();
    let prod_id = $('#product_id_modal').html();
    findBy('product_id', prod_id, 'stores_inventories').then(inventory => {

      $(".input-group.flex-div").removeClass("hidden");
      $(".stores_inventory_rack").addClass("hidden");
      $(".stores_inventory_level").addClass("hidden");
      $("#modifyLocation").addClass("hidden");
      $("#confirmChangeLocation").removeClass("hidden");

      $("#rackSave").val(
        inventory.rows[0].rack
      );
      $("#levelSave").val(
        inventory.rows[0].level
      );

    });
  });

  $("#confirmChangeLocation").click(function(){
    let code = $("#unique_code").html();
    let prod_id = $('#product_id_modal').html();
    updateBy(
      {
        rack: $("#rackSave").val(),
        level: $("#levelSave").val()
      },
      'stores_inventories',
      `product_id = ${prod_id}`
    ).then(() => {
      $(".input-group.flex-div").addClass("hidden");
      $(".stores_inventory_rack").removeClass("hidden");
      $(".stores_inventory_level").removeClass("hidden");
      $("#modifyLocation").removeClass("hidden");
      $("#confirmChangeLocation").addClass("hidden");
      $('#productShow').modal('toggle');
    });
  });


  $('#productShow').on('hide.bs.modal', function (e) {
    $(".input-group.flex-div").addClass("hidden");
    $(".stores_inventory_rack").removeClass("hidden");
    $(".stores_inventory_level").removeClass("hidden");
  });


  $('#closeDiscount').click(function(e){
    let modalBody = $(this).parent().parent().find(
      '.modal-body'),
        id  = $(modalBody).attr('id').replace('discountTo_',''),
        elementCount = $(modalBody).attr('data-child-count'),
        tr = `#product_${id}[data-child-count=${elementCount}]`;
        discountReason = $(tr).find('td[id^=discountReasonTo]');

    if (discountReason) {
      $(discountReason).remove();
    }
    $(`${tr} td:last`).parent().append(
      `<td class='hidden' id="discountReasonTo_${id}">` +
        $(modalBody).find('#discountMotive').val() +
      '</td>'
    );
    discountInput = `${$(modalBody).find('#discountCount').val()}`;
    if (isNaN(parseFloat(discountInput))) {
      discountInput = 0;
    }
    $(`${tr} a[id^=discount]`).html(`${discountInput} %`);
    let total = createTotal(id, tr);
    $(`${tr} td[id=totalTo_${id}]`).html(
      `$ ${(total.total * 1.16).toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`
    );

    $(`${tr} id[id=totalSinTo_${id}]`).html(
      `$ ${total.totalNoDesc.toFixed(2).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`
    );

    bigTotal();
    $('#discountRow').removeClass('hidden');
    $('#SubtotalRow').removeClass('hidden');
  });

  $('#discountChange').on('shown.bs.modal', function(e) {

    let individualDiscount = document.getElementById("discountCount");
    var im = new Inputmask("decimal");
    im.mask(individualDiscount);

    let relatedObject = e.relatedTarget.dataset,
        productId     = relatedObject.id;
    $(this).find('.modal-body').attr('id',
      `discountTo_${productId}`
    );

    $(this).find('.modal-body').attr('data-child-count', relatedObject.childCount);

    $('#discountMotive, #discountCount').val('');
  });

  function carIcon(id, company, childCount){
    if (company === '') {
      return '';
    }

    return '<a href="#" data-toggle="modal"' +
      'data-target="#deliveryService"' +
      `id="service_1" data-child-count="${childCount}" data-id=${id}>` +
      '<i class="fa fa-truck" aria-hidden="true"></i>' +
      '</a>';
  }

  function addTr(product){
    product.id = product.productid
    if ($(`#product_${product.id}_products`).length > 0 && product.table === 'products')
      return false;

    let description = product.table === 'products' ? '<a href="#" data-toggle="modal" ' +
      ` data-target="#productShow" data-id="${product.id}" data-table="${product.table}" >` +
      ` ${product.value} </a>` : product.value,
      productInList = $(`tr[id^=product_${product.id}_services]`);

    if (productInList.length === 1)
        product.id = `${product.id}_${product.id}`;

    product.id = `${product.id}_${product.table}`;
    let childCount = $(`tr[id^=product_${product.id}`).length + 1;

    let price = product.table === 'products' ? stringPrice(product.price, product.id) :
      '<input type="text" class="form-control ' +
      `smaller-form" id="priceToServiceTo_${product.id}" placeholder="$ 100.00">`,
      color = product.table === 'services' ? carIcon(product.id, product.company, childCount) :
        product.color

    return `<tr id="product_${product.id}" data-child-count="${childCount}"><td id="infoTableName" class="hidden">${product.table}</td><td>` +
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
      `<td id="priceTo_${product.id}">` +
       price +
      '</td><td>' +
      '<input type="text" class="form-control smaller-form" ' +
      `placeholder="1" id="cuantityTo_${product.id}"></td>` +
      '<td> <a href="#" data-toggle="modal"' +
      'data-target="#discountChange" ' +
      `id="discount_${product.id}" data-id="${product.id}" data-child-count="${childCount}" ` +
      `data-table="${product.table}" > 0% </a> </td>` +
      `<td class="right" id="totalTo_${product.id}"> $ </td>` +
      `<td class="right hidden" id="totalSinTo_${product.id}"> $ </td>` +
      '</tr>';
  }

  function formatSelection(state){
    return '';
  }

  (function priceMask(){
    let paymentQuantity = document.getElementById("paymentMethodCuantity");
    let im = new Inputmask("decimal");
    im.mask(paymentQuantity);
  })();

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

      let lastTicket = 0;

      query("SELECT COALESCE(MAX(id), 0) FROM tickets").then(ticket_number => {
        lastTicket = ticket_number.rows[0].coalesce;
        $('#ticketNum').html(
          ` ${lastTicket + 1} `
        );
      });

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
      $('#addProductSearch').prop('disabled', true);
      getProductsAndServices(list => {
        $('#addProductSearch').prop('disabled', false);
        $('#addProductSearch').autocomplete({
            lookup: list,
            onSelect: function (suggestion) {
              $('#addProductQuantity tr[id^=addProduct_]').remove();
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
          onSelect: function (suggestion) {
            $('#ticketList').append(addTr(suggestion));
            let childCount = $(`tr[id^=product_${suggestion.id}`).length;
            addEvents(suggestion.id, childCount);
            let selector = $(`input[id^=cuantityTo_${suggestion.id}]`);
            var im = new Inputmask("99999999");
            im.mask(selector);
            $(this).val('');
          }
        });
      });

    });
  })();

  /* Métodos para descuentos*/

  $("#manual").click(function () {
    let ticketDiscountField = document.getElementById("allTicketDiscount");
    var im = new Inputmask("decimal");
    im.mask(ticketDiscountField);

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


/* Métodos para cambiar botón de tipo de ventas*/
  $("#change-option").click(function () {
    $('#mainProductSearch').val('');
    $('#completeSale').addClass('hidden');
    $('#completeSale').html('Completar cambio');
    $('.discount-group').removeClass('hidden');
    $('.pay-dev-group').addClass('hidden');
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
    bigTotal();
    resumePayment();
    $('#prospectSearch').addClass('hidden');
    $('#productSearch').addClass('hidden');
  });

  $("#sale-option").click(function () {
    window.location = 'pos_sale.html';
    cleanRows();
    $('#mainProductSearch').val('');
    $('.discount-group').removeClass('hidden');
    $('.pay-dev-group').addClass('hidden');
    $('#completeSale').addClass('hidden');
    $('#completeSale').html('Completar venta');
    $('.items-returns').addClass('hidden');
    $('#devolucionTable tr').remove();
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
    bigTotal();
    resumePayment();
  });

  $("#estimate-option").click(function () {
    cleanRows();
    $('#mainProductSearch').val('');
    $('.discount-group').removeClass('hidden');
    $('.pay-dev-group').addClass('hidden');
    $('#completeSale').addClass('hidden');
    $('#completeSale').html('Completar venta');
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
    bigTotal();
    resumePayment();
    $("[placeholder=Comentarios]").addClass("hidden");
    $(".payment-form-wrapper").addClass("hidden");
    $("#manual").click();
  });


/* Métodos para los buscadores de productos / tickets / clientes (mostrar tabla de resultados) */
$("#searchProducts").click(function () {
//  $('.ticket-results').removeClass('hidden');
});

$("#searchProspects").click(function () {
//  $('.ticket-results').removeClass('hidden');
});

$("#searchTickets").click(function () {
//  $('.ticket-results').removeClass('hidden');
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
    validateTotalPayment();
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
    validateTotalPayment();
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
    validateTotalPayment();
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
    validateTotalPayment();
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
    validateTotalPayment();
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
    validateTotalPayment();
    $('.credit-days-container').addClass('hidden');
    $('.operation-number-container').addClass('hidden');
    $('.select-register-container').addClass('hidden');
  });

  $("#creditSale").click(function () {
    let selectorDays = document.getElementById("creditDaysNumber");
    var imc = new Inputmask("99999999");
    imc.mask(selectorDays);
    $(this).addClass('selected');
    $('.credit-days-container').removeClass('hidden');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#other').removeClass('selected');
    $('#returnCash').removeClass('selected');
    validateTotalPayment();
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
    validateTotalPayment();
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
