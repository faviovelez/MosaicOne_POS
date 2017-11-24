$(function(){

  function createFullName(user){
    return `${user.first_name} ${user.middle_name} ${user.last_name}`;
  }

  function savedTicketTr(ticket){
      return `<tr ="ticket${ticket.id}"><td> ${ticket.id} </td>` +
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
