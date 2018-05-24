$(function(){

  function addProspectTr(object){
    cfdiUseSelect = '';
    return '<tr>' +
      '<td class="icon-close-td">' +
        '<div class="close-icon" id="prospectCloseIcon">' +
          '<button type="button" class="close center-close" aria-label="Close">' +
            '<span aria-hidden="true" class="white-light">&times;</span>' +
          '</button>' +
        '</div>' +
      '</td>' +
      '<td class="prospect_name">' +
        object.legal_or_business_name +
      '</td>' +
      '<td>' +
        '<select name="bill_tag" class="myfield" id="prospect_bill_tag">' +
          '<option value="1">Sin factura</option>' +
          '<option value="2">Facturar</option>' +
        '</select>' +
      '</td>' +
      '<td>' +
        `<a href="#" data-toggle="modal" data-id='${object.id}' data-target="#billCfdiUse">` +
          'Detalles' +
        '</a>' +
      '</td>' +
    '</tr>';
  }

  function carIcon(id, company, childCount, isComplete){
    if (company === null) {
      return '';
    }

    if (isComplete) {
      return '<a href="#" data-toggle="modal"' +
      'data-target="#deliveryService"' +
      `id="service_1" data-child-count="${childCount}" data-id=${id} class="green-truck">` +
      '<i class="fa fa-truck" aria-hidden="true"></i>' +
      '</a>';
    } else {
      return '<a href="#" data-toggle="modal"' +
      'data-target="#deliveryService"' +
      `id="service_1" data-child-count="${childCount}" data-id=${id}>` +
      '<i class="fa fa-truck" aria-hidden="true"></i>' +
      '</a>';
    }
  }

  function translatePrice(price){
    let convertPrice =  parseFloat(
            price
          ).toFixed(2);

    if (convertPrice === "NaN") {
      return price;
    }
    return ` $ ${convertPrice.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`;
  }

  function createRealSubtotal(discountSelector = 'a[id^=discount]'){
    let discount = 0;
    $.each($(`td[id^=priceTo]`), function(){
      let price = 0;
      if (!$(this).find('a').html()) {
        price = $(this).find('input').val();
      } else {
        price = parseFloat($(this).find('a').html().replace(/\$|,/g,''));
      }
      let tr    = $(this).parent();
      let cuantity    = parseInt($(tr).find(
            'input[id^=cuantityTo]'
          ).val().replace(/_/g,'')),
          total       = price * cuantity,
          discountval = parseFloat($(tr.find(
            discountSelector
          )).html().replace(' %',''));
      if (total.toString() === 'NaN'){
        total = 0;
      }
      discount += parseFloat( ( parseFloat(discountval) / 100 * total).toFixed(2) );
    });

    $('#discountSum').html(
      ` $ ${discount.toFixed(
          2
        ).replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
        )}`
    );

    $('#SubtotalSum').html(
      ` $ ${(
        parseFloat($('#savedSubtotal').html().replace(
          "$ ", ""
        ).replace(/,/g,'')
      ) - parseFloat(
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

    realTax = (parseFloat(
      $('#SubtotalSum').html().replace("$ ", "").replace(/,/g,'')
      ) * 0.16)
    .toFixed(2);

    realSubtot = parseFloat(
      $('#SubtotalSum').html().replace("$ ", "").replace(/,/g,'')
      )
    .toFixed(2);

    $('table.subtotal td.subtotal.iva').html(
      ` $ ${realTax.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`
    );

    realTot = (parseFloat(realTax) + parseFloat(realSubtot)).toFixed(2);

    $('table.subtotal td.total, #paymentRest').html(
      `<strong>$ ${realTot.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </strong>`
    );

  }

  function addDeliveryServiceId(service){
    if (service.deliveryId) {
        return `<td id="deliveryServiceId${service.id}" class="hidden">` +
        `${service.deliveryId}</td>`;
    }
    return '';
  }

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


  function stringPrice(price, id){
    return `<a href="#" data-toggle="modal" data-target="#changeSinglePrice" data-id="${id}">` +
      `${translatePrice(price)}` +
    '</a>';
  }

  function addTr(product){
    product.id = product.productId
    if ($(`#product_${product.id}_products`).length > 0 && product.table === 'products')
      return false;

      let description = product.table === 'products' ? '<a href="#" data-toggle="modal" ' +
        ` data-target="#productShow" data-id="${product.id}" data-table="${product.table}" >` +
        `${product.unique_code} ${product.description}  </a>` : `${product.unique_code} ${product.description}`

    let percent = recalculateDiscount(product),
        total = recalculateTotForSavedTicket(product, percent, product.table),
        price = '',
        productInList = $(`tr[id^=product_${product.id}_services]`);
    if (productInList.length === 1)
      product.id = `${product.id}_${product.id}`;

    product.id = `${product.id}_${product.table}`;

    let childCount = $(`tr[id^=product_${product.id}`).length + 1;

    if (product.table === 'services') {
      deliveryTd = addDeliveryServiceId(product);
      if (deliveryTd == '') {
        completedDelivery = false;
      } else {
        completedDelivery = true;
      }
      color = carIcon(product.id, product.delivery_company, childCount, completedDelivery);
      price ='<input type="text" class="form-control ' +
      `smaller-form" id="priceToServiceTo_${product.id}" value="${product.initial_price}">`;
    } else {
      deliveryTd = '';
      color = product.exterior_color_or_design;
      price = stringPrice(product.price, product.id);
    }

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
      `<td id="priceTo_${product.id}"> ${translatePrice(price)}` +
      '</td><td>' +
      '<input type="text" class="form-control smaller-form" ' +
      `placeholder="1" id="cuantityTo_${product.id}" ` +
      '</td>' +
      '<td> <a href="#" data-toggle="modal"' +
      'data-target="#discountChange" ' +
      `id="discount_${product.id}" data-id="${product.id}" data-child-count="${childCount}" ` +
      `data-table="${product.table}" > ${percent}% </a> </td>` +
      `<td class="right" id="totalTo_${product.id}">` +
      `$ ${(total.total * 1.16).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
      `<td class="right hidden" id="totalSinTo_${product.id}">` +
      `$ ${total.totalNoDesc.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </td>` +
      deliveryTd +
      '</tr>';
  }

  function bigTotal(discountSelector = 'a[id^=discount]'){
    let subTotalInput = $('#savedSubtotal'),
        taxSum        = 0,
        subtotal      = 0;
    $.each($(`td[id^=totalSinTo_]`), function(){
      let productTotal = parseFloat(
        $(this).html().replace('$ ', '').replace(/,/g,'')
      );
      productTotal = productTotal.toString() === 'NaN' ? 0 : productTotal;
      subtotal += productTotal;
      taxSum += Math.round(productTotal * 0.16 * 100) / 100;

    });
    $(subTotalInput).html(`$ ${subtotal.toFixed(
      2
    ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`);

    $('table.subtotal td.subtotal.iva').html(
      `$ ${taxSum.toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`
    );

    createRealSubtotal(discountSelector);
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


  function fillDiscountFields(ticketInfo){

    $('.subtotal tr.hidden').removeClass('hidden');
    $('#discountSum').html(
      ` $ ${ticketInfo.discount_applied.toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`);

    let subtotal = ticketInfo.subtotal - ticketInfo.discount_applied;

    $('#SubtotalSum').html(
      ` $ ${ticketInfo.subtotal.toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
    )}`);
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
    ).replace(/,/g,''),
       rest = (parseFloat(total) - sum).toFixed(2);
    $('#sumPayments').html(sum);
    if (parseFloat(rest) <= 0){
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

  function findDeliveryServices(service){
    return new Promise(function(resolve, reject){
      findBy('service_offered_id', service.service_offered_id, 'delivery_services')
        .then(function(deliveryServiceObject){
          service.deliveryId = deliveryServiceObject.rowCount === 0 ? false :
                          deliveryServiceObject.rows[0].id;

          resolve(service);
      });
    });
  }

  function addPaymentTr(payment){
    let count = payment.payment_number,
        type  = payment.type;

    return `<tr id="paymentMethod_${count}" data-type="${type}">` +
      '<td class="flex">' +
      '<div class="close-icon">' +
      '<button type="button" class="close center-close"' +
      `aria-label="Close" id="closeTr_${count}">` +
      '<span aria-hidden="true" class="white-light">&times;</span>' +
      '</button></div>' +
      `${type}</td>` +
      '<td class="right cuantity" >' +
      `$ ${payment.total}` +
      '</td>' +
      '</tr>';
  }

  if (window.location.href.indexOf('ticket_id') > -1){
    let ticketId = window.location.href.replace(/.*ticket_id=/,'');

    let localQuery = 'SELECT products.*, store_movements.* FROM(SELECT id, ticket_type, ' +
      "(date_trunc('day', created_at) + interval '1 day' " +
      "- interval '1 second' - interval '1 day') as start_date, " +
      "(date_trunc('day', created_at) + interval '1 day') as end_date " +
      `FROM tickets WHERE id = ${ticketId}) AS results_tickets ` +
      'INNER JOIN store_movements ON store_movements.ticket_id = results_tickets.id ' +
      'INNER JOIN products ON products.id = store_movements.product_id ' +
      'WHERE (store_movements.created_at > results_tickets.start_date ' +
      'AND store_movements.created_at < results_tickets.end_date)';

    query(localQuery).then(storeMovementProducts => {
      storeMovementProducts.rows.forEach(product => {
        product.table = 'products';
        product.productId    = product.product_id;

        $('#ticketList').append(addTr(product));
        $(`#cuantityTo_${product.id}`).val(Math.abs(product.quantity));
        let childCount = $(`tr[id^=product_${product.id}`).length;
        addEvents(product.id, childCount);

      });
    });

    localQuery = 'SELECT *, service_offereds.id as service_offered_id FROM services INNER JOIN' +
      ' service_offereds ON services.id = ' +
      ' service_offereds.service_id WHERE' +
      ` ticket_id = ${ticketId}`;
    query(localQuery).then(serviceOffereds => {
      serviceOffereds.rows.forEach(service => {

        service.table = 'services';
        service.productId    = service.service_id;
        serviceId     = service.id;
        findDeliveryServices(service).then(function(processService){
          $('#ticketList').append(addTr(processService));
          $(`#cuantityTo_${processService.id}`).val(Math.abs(processService.quantity));
          let childCount = $(`tr[id^=product_${processService.id}`).length;
          addEvents(processService.id, childCount);
        });

      });
    });

    findBy('id', ticketId, 'tickets').then(ticket => {
      let ticketInfo = ticket.rows[0];

      $('#ticketNum').html(` ${ticketInfo.ticket_number}`);

      if (ticketInfo.prospect_id){

        findBy('id', ticketInfo.prospect_id, 'prospects').then(prospect => {

          $('#prospectList').append(addProspectTr(prospect.rows[0]));

          $('#prospectCloseIcon').click(function(){
            $('#prospectList tr').remove();
          });

        });

      }

      if (ticketInfo.discount_applied) {
        fillDiscountFields(ticketInfo);
      }

      $('.bigger.total strong').html(
        ` $ ${ticketInfo.total.toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`);

      $('.subtotal.iva').html(
        ` $ ${ticketInfo.taxes.toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`);

      $('#savedSubtotal').html(
        ` $ ${ticketInfo.subtotal.toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`);

      $('#currencyChange strong').html(
        ` $ ${ticketInfo.cash_return.toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`);

      $('#sumPayments').html(
        ` $ ${ticketInfo.payments_amount.toFixed(2).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
      )}`);

      findBy('ticket_id', ticketInfo.id, 'payments').then(payments => {
        payments.rows.forEach(payment => {
          payment.type = {
            1  : 'Efectivo',
            18 : 'Débito',
            4  : 'Crédito',
            2  : 'Cheque',
            3  : 'Transferencia',
            21 : 'Venta a Crédito'
          }[payment.payment_form_id];

          $('#paymentMethodList').prepend(addPaymentTr(payment));

          let type  = payment.type,
              count = payment.payment_number;

          if (type === 'Débito' || type === 'Crédito'){
            $(`tr[id=paymentMethod_${count}]`).append(
              `<td id="terminal_${count}" class="hidden">${payment.terminal_id}</td>`
            );
          }
          if (type === 'Cheque' || type === 'Transferencia') {
            $(`tr[id=paymentMethod_${count}]`).append(
              `<td id="reference_${count}" class="hidden">${payment.operation_number}</td>`
            );
          }
          if (type === 'VentaaCrédito') {
            $(`tr[id=paymentMethod_${count}]`).append(
              `<td id="creditDays_${count}" class="hidden">${payment.credit_days}</td>`
            );
          }

          $(`#closeTr_${count}`).click(function(){
            $(`tr[id=paymentMethod_${count}]`).remove();
            resumePayment();
          });

          resumePayment();
        });
      });

    });

  }

  $('#activateTicket').on('shown.bs.modal', function(e) {
    let ticketId = e.relatedTarget.dataset.id;
    $('#ticketConfirmButton').attr('data-id', ticketId);
  });

  $('#ticketConfirmButton').click(function(){
    let ticketId = $(this).attr('data-id');
    window.location.href = `pos_sale.html?ticket_id=${ticketId}`;
  });

  $('#cancelTicket').on('shown.bs.modal', function(e) {
    let ticketId = e.relatedTarget.dataset.id;
    $('#ticketCancelConfirm').attr('data-id', ticketId);
  });

  function deleteTicket(ticketId){
    deleteBy('store_movements', `ticket_id = ${ticketId}`).then(() => {});
    deleteBy('payments', `ticket_id = ${ticketId}`).then(() => {});
    deleteBy('service_offereds', `ticket_id = ${ticketId}`).then(() => {});
    deleteBy('tickets', `id = ${ticketId}`).then(() => {});
    $(`#ticket${ticketId}`).remove();
    $('#cancelTicket').modal('hide');
  }

  $('#ticketCancel').one( "click", function() {
    let ticketId = window.location.href.replace(/.*ticket_id=/,'');

    if (!isNaN(parseInt(ticketId))) {
      updateBy(
        {
          ticket_type: 'guardado / cancelado'
        },
        'tickets',
        `id = ${ticketId}`
      ).then(() => {});
    }
    window.location.href = 'pos_sale.html';
  });

  $('#ticketCancelConfirm').one( "click", function() {
    let ticketId = $(this).attr('data-id');
    updateBy(
      {
        ticket_type: 'guardado / cancelado'
      },
      'tickets',
      `id = ${ticketId}`
    ).then(() => {});
  });

  function createFullName(user){
    return `${user.first_name} ${user.middle_name} ${user.last_name}`;
  }

  function savedTicketTr(ticket){
      return `<tr id="ticket${ticket.id}"><td> ${ticket.id} </td>` +
      `'<td> ${ticket.date} </td>` +
      `<td> ${ticket.time} </td>` +
      `<td> ${ticket.products} </td>` +
      `<td> ${ticket.pieces} </td>` +
      `<td> ${ticket.prospect} </td>` +
      `<td class="right"> $ ${
        ticket.total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
      } </td>` +
      `<td> ${ticket.user} </td>` +
      `<td> ${ticket.comments} </td>` +
      '<td>' +
        '<span class="input-group-btn">' +
          '<button class="btn btn-default space-left pos-main-btn right-edge green-btn" type="button" ' +
      `data-id="${ticket.id}" data-toggle="modal" ` +
      'data-placement="left" title="Reactivar ticket" data-target="#activateTicket">' +
            '<i class="fa fa-play" aria-hidden="true"></i>' +
          '</button>' +
        '</span>' +
        '<span class="input-group-btn">' +
          '<button class="btn btn-default pos-main-btn left-edge red-btn" type="button" data-toggle="modal" ' +
      `data-id="${ticket.id}"` +
      'data-placement="left" title="Cancelar ticket" data-target="#cancelTicket">' +
            '<i class="fa fa-stop" aria-hidden="true"></i>' +
          '</button>' +
        '</span>' +
      '</td>' +
    '</tr>';
  }

  function getDate(datetime){
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

  function getTime(datetime){
    let hour    = datetime.getHours(),
        minute  = datetime.getMinutes(),
        seconds = datetime.getSeconds();

    if (hour < 10){
      hour = `0${hour}`;
    }

    if (minute < 10){
      minute = `0${minute}`;
    }

    if (seconds < 10){
      seconds = `0${seconds}`;
    }

    return `${hour}:${minute}:${seconds}`;
  }

  function setStoreMovementsData(ticketId, call){
    findBy(
      'ticket_id',
      ticketId,
      'store_movements'
    ).then(storeMovements => {
      json[
        ticketId
      ].products = storeMovements.rowCount;
      json[
        ticketId
      ].pieces = 0;

      storeMovements.rows.forEach(storeMovement => {
        json[
          ticketId
        ].pieces += storeMovement.quantity;
      });

      return call();

    });
  }

  function setProspectData(prospectId, ticketId, call) {

    if (prospectId){

      findBy(
        'id',
        prospectId,
        'prospects'
      ).then(prospect => {
        json[
          ticketId
        ].prospect = prospect.rows[
          0
        ].legal_or_business_name;

        call();
      });
    } else {
      return call();
    }
  }

  function setUserData(userId, ticketId, call){
    if (userId){

      findBy(
        'id',
        userId,
        'users'
      ).then(user => {
        json[
          ticketId
        ].user = createFullName(user.rows[0]);
        call();
      });
    } else {
      return call();
    }
  }

  if ($('#savedTicketsList').length === 1) {

    (function loadTickets(call){
      count = 0;
      json = {};
      getAll('tickets', '*', "ticket_type = 'pending'").then(tickets => {
        limit = tickets.rowCount;
        tickets.rows.forEach(ticket => {
          let ticketId = ticket.id;
          initStore().then(store => {

            json[ticketId] = {
              id       : ticket.id,
              date     : getDate(ticket.updated_at),
              time     : getTime(ticket.updated_at),
              total    : ticket.total,
              comments : ticket.comments,
              prospect : '',
            };

            setStoreMovementsData(ticketId, function(){
              setProspectData(ticket.prospect_id, ticketId, function(){
                setUserData(ticket.user_id, ticketId, function(){

                  count++;
                  if (limit === count){
                    call();
                  }

                });
              });
            });

          });

        });

      });
    })(function(){
      for (var key in json){
        $('#savedTicketsList').append(savedTicketTr(json[key]));
      }
    });

  }

  $('#ticketSave').one( "click", function() {
    let ticketId = window.location.href.replace(/.*ticket_id=/,'');

    if (!validateAllInputsFill()) {
      alert('Favor de llenar todos los campos');
      return false;
    }

    if (!isNaN(parseInt(ticketId))){
      deleteTicket(ticketId);
    }

    createTicketProductJson(function(){

      initStore().then(store => {
        let user        = store.get('current_user').id,
          storeObject = store.get('store'),
          storeId     = store.id;

        insertTicket(user, function(ticketId){

          assignCost(user, 'pending', ticketId, function(){

            insertsServiceOffereds(ticketId, 'pending', function(){

              insertsPayments('pending', ticketId, user, storeObject, null, function(){

                store.set('lastTicket', parseInt(
                  $('#ticketNum').html()
                ));

                window.location.href = 'pos_sale.html';

              });

            });

          });

        }, 'pending');

      });
    });
  });

});
