$(function(){

  function recalculateTotal(product, percent){
    let total = product.price.toFixed(2) * product.quantity;

    return total * (1 - percent / 100);
  }

  function recalculateDescount(product){
    let realTotal = product.total - product.taxes,
        percentPayment = realTotal * 100 / product.subtotal;

    return 100 - parseInt(percentPayment.toFixed(0));
  }

  function addTr(product){
    let percent = recalculateDescount(product),
      total = recalculateTotal(product, percent),
      color = product.table === 'services' ? carIcon(product.id) :
      product.exterior_color_or_design,
      price = product.table === 'products' ? ` $ ${product.price}` :
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
      '<a href="#" data-toggle="modal" data-target="#productShow"' +
      `data-id="${product.id}" data-table="${product.table}" >` +
      product.description +
      '</a>' +
      '</td>' +
      `<td> ${color} </td>` +
      `<td id="priceTo_${product.id}">${parseFloat(
        price.replace(' $ ','')
      ).toFixed(2)}</td>` +
      '<td>' +
      '<input type="text" class="form-control smaller-form" ' +
      `placeholder="1" id="cuantityTo_${product.id}" ` +
      `value="${product.quantity}"></td>` +
      '<td> <a href="#" data-toggle="modal"' +
      'data-target="#discountChange" ' +
      `id="discount_${product.id}" data-id="${product.id}" ` +
      `data-table="${product.table}" > ${percent}% </a> </td>` +
      `<td class="right" id="totalTo_${product.id}">` +
      `$ ${total.toFixed(2)} </td>` +
      '</tr>';
  }

  function addEvents(id){
    $(`button[id=delete_${id}]`).click(function(){
      $(`tr[id=product_${id}]`).remove();
      bigTotal();
    });

    $(`#cuantityTo_${id}`).keyup(function(){
      $(`#totalTo_${id}`).html(
        `$ ${createTotal(id)}`
      );
      bigTotal();
    });

    $(`#priceToServiceTo_${id}`).keyup(function(){
      $(`#totalTo_${id}`).html(
        `$ ${createTotal(id)}`
      );
      bigTotal();
    });
  }

  if (window.location.href.indexOf('ticket_id') > -1){
    let ticketId = window.location.href.replace(/.*ticket_id=/,'');
        localQuery = 'SELECT * FROM products INNER JOIN' +
                     ' store_movements ON products.id = ' +
                     ' store_movements.product_id WHERE' + 
                     ` ticket_id = ${ticketId}`;
    query(localQuery).then(storeMovementProducts => {
      storeMovementProducts.rows.forEach(product => {
        product.table = 'products';

        $('#ticketList').append(addTr(product));
        addEvents(product.id);
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

  $('#ticketCancelConfirm').click(function(){
    let ticketId = $(this).attr('data-id');

    deleteBy('store_movements', `ticket_id = ${ticketId}`).then(() => {});
    deleteBy('payments', `ticket_id = ${ticketId}`).then(() => {});
    deleteBy('tickets', `id = ${ticketId}`).then(() => {});
    $(`#ticket${ticketId}`).remove();
    $('#cancelTicket').modal('hide');
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
              user     : createFullName(
                store.get('current_user')
              )
            };

            setStoreMovementsData(ticketId, function(){
              setProspectData(ticket.prospect_id, ticketId, function(){
                count++;
                if (limit === count){
                  call();
                }
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

  $('#ticketCancel').click(function(){
    window.location.reload(true);
  });

  $('#ticketSave').click(function(){
    createTicketProductJson(function(){

      initStore().then(store => {
        let user        = store.get('current_user').id,
          storeObject = store.get('store'),
          storeId     = store.id;

        insertTicket(user, function(ticketId){

          assignCost(ticketId, function(){

            insertsPayments(ticketId, user, storeObject, function(){

              store.set('lastTicket', parseInt(
                $('#ticketNum').html()
              ));

              window.location.reload(true);

            });

          });

        }, 'pending');

      });
    });
  });

});
