$(document).ready(function() {

  const Inputmask = require('inputmask');

  function getCashRegisterSum(){
    return 'SELECT (SUM((SELECT COALESCE(SUM(deposits.amount),0) as d FROM deposits)) ' +
      '- SUM((SELECT COALESCE(SUM(withdrawals.amount),0) as w FROM withdrawals)) + ' +
      'SUM((SELECT (COALESCE(SUM(payments.total),0)) as s ' +
      'FROM payments INNER JOIN tickets ON tickets.id = payments.ticket_id ' +
      "WHERE payment_type = 'pago' AND payment_form_id = 1 AND ticket_type = 'venta'))) as sum";
  }

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

  function createFullName(user){
    return `${user.first_name} ${user.middle_name} ${user.last_name}`;
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

      $('#store').html(store.get('store').store_name);
    });
  })();

  function passwordValidation(){
    return equals(
      $('#password').val(),
      $('#password_confirmation').val(),
      false
    );
  }

  $('#changePasswordAction').click(function(){
    let validatePassword = passwordValidation();

    if (!validatePassword.result) {

      showAlert(validatePassword.type, validatePassword.message, cloneAlert());
      return false;

    } else {
      if ($('#password_confirmation').val() !== '') {
        updateBy(
          {
            encrypted_password : createPassword($('#password').val())
          },
          'users',
          `id = ${parseInt($("#usersOptionsList").val())}`
        ).then(() => {
          alert('Contraseña Cambiada');
          window.location.reload(true);
        });
      } else {
        showAlert('Error', 'Favor de llenar todos los campos', cloneAlert());
        return false;
      }
    }
    return false;
  });

  $('#createCashAlert').click(function(){
    initStore().then(storage => {
      let cashName = storage.get('cash');
      updateBy(
      {
        cash_alert : parseFloat($('#register_open_initial_cash').val())
      },
      'cash_registers',
      `name = '${cashName}'`
      ).then(() => {
        window.location.reload(true);
      });
    });
    return false;
  });

  $('#addTerminalSave').click(function(){

    let debitComission = parseFloat($('#debit_comission').val());
    if (isNaN(debitComission)) {
      debitComission = 0;
    }

    let creditComission = parseFloat($('#credit_comission').val());
    if (isNaN(creditComission)) {
      creditComission = 0;
    }

    let data = {
      name             : $('#terminal_name').val(),
      number           : $('#new_terminal_number').val(),
      debit_comission  : debitComission,
      credit_comission : creditComission
    };

    insert(
      Object.keys(data),
      Object.values(data),
      'terminals'
    ).then(() => {
      $('#terminal_name').val('');
      $('#new_terminal_number').val('');
      $('#debit_comission').val('');
      $('#credit_comission').val('');
    });

    return false;
  });

  $("#cashAlert").click(function () {

    let cashAlertOption = document.getElementById("register_open_initial_cash");
    var im = new Inputmask("decimal");
    im.mask(cashAlertOption);

    $(this).addClass('active-list');
    $('#registerColaborator').removeClass('active-list');
    $('#addTerminal').removeClass('active-list');
    $('#registerDeposit').removeClass('active-list');
    $('#registerWithdrawal').removeClass('active-list');
    $('#changePassword').removeClass('active-list');
    $('#createRegister').removeClass('active-list');
    $('#deleteRegister').removeClass('active-list');
    $('.cash-alert').removeClass('hidden');
    $('.register-sign-margin').addClass('hidden');
    $('.add-terminal').addClass('hidden');
    $('.register-withdrawal').addClass('hidden');
    $('.register-deposit').addClass('hidden');
    $('.change-password').addClass('hidden');
    $('.register-colaborator').addClass('hidden');
    $('.delete-cash-register').addClass('hidden');
    $('.create-cash-register').addClass('hidden');
  });

  $('#registerCashDeposit').click(function(){

    let amountToRegister = parseFloat($('#new_cash_deposit_amount').val());
    if (isNaN(amountToRegister)) {
      amountToRegister = 0;
    }

    initStore().then(storage => {
      let data = {
        user_id          : storage.get('current_user').id,
        amount           : amountToRegister,
        cash_register_id : parseInt($('.cashRegisterOptions').val()),
        name             : $('#new_cash_deposit_description').val(),
        pos              : true,
        web              : false
      };

      insert(
        Object.keys(data),
        Object.values(data),
        'deposits',
        false
      ).then(() => {
        window.location.reload(true);
      });
    });
    return false;
  });

  $('#registerCashWithdrawal').click(function(){
    let amountToRegister = parseFloat($('#new_cash_withdrawal_amount').val());
    if (isNaN(amountToRegister)) {
      amountToRegister = 0;
    }

    initStore().then(storage => {
      let data = {
        user_id          : storage.get('current_user').id,
        amount           : amountToRegister,
        cash_register_id : parseInt($('.cashRegisterOptions').val()),
        name             : $('#new_cash_withdrawal_description').val(),
        pos              : true,
        web              : false
      };

      insert(
        Object.keys(data),
        Object.values(data),
        'withdrawals',
        false
      ).then(() => {
        window.location.reload(true);
      });
    });
    return false;
  });

  (function fillSpecialValues(){
    query(getCashRegisterSum(), false).then(resultSum => {
      $('.configCashValue').html(
        `$ ${(resultSum.rows[0].sum || 0).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} `
      );
    });

    getAll('users').then(usersList => {
      $('#usersOptionsList option').remove();
      usersList.rows.forEach(user => {
        $('#usersOptionsList').append(
          `<option value="${user.id}">${createFullName(user)}</option>`
        );
      });
    });

    initStore().then(storage => {
      let storeInfo = storage.get('store');
       findBy('store_id', storeInfo.id, 'cash_registers', false).then(cashRegisterObject => {
        cashRegisterObject.rows.forEach(cashRegister => {
          $('.cashRegisterOptions option').remove();

          $('.cashRegisterOptions').append(
            `  <option value="${cashRegister.id}"> Caja ${cashRegister.name} </option>`
          );

        });
      });
    });
  })();

  $("#registerDeposit").click(function () {

    let deposit = document.getElementById("new_cash_deposit_amount");
    var im = new Inputmask("decimal");
    im.mask(deposit);

    $(this).addClass('active-list');
    $('#registerColaborator').removeClass('active-list');
    $('#addTerminal').removeClass('active-list');
    $('#cashAlert').removeClass('active-list');
    $('#registerWithdrawal').removeClass('active-list');
    $('#changePassword').removeClass('active-list');
    $('#createRegister').removeClass('active-list');
    $('#deleteRegister').removeClass('active-list');
    $('.register-deposit').removeClass('hidden');
    $('.register-sign-margin').addClass('hidden');
    $('.add-terminal').addClass('hidden');
    $('.cash-alert').addClass('hidden');
    $('.register-withdrawal').addClass('hidden');
    $('.change-password').addClass('hidden');
    $('.delete-cash-register').addClass('hidden');
    $('.register-colaborator').addClass('hidden');
    $('.create-cash-register').addClass('hidden');
  });

  $("#registerWithdrawal").click(function () {

    let withdraw = document.getElementById("new_cash_withdrawal_amount");
    var im = new Inputmask("decimal");
    im.mask(withdraw);

    $(this).addClass('active-list');
    $('#registerColaborator').removeClass('active-list');
    $('#addTerminal').removeClass('active-list');
    $('#cashAlert').removeClass('active-list');
    $('#changePassword').removeClass('active-list');
    $('#registerDeposit').removeClass('active-list');
    $('#createRegister').removeClass('active-list');
    $('#deleteRegister').removeClass('active-list');
    $('.register-withdrawal').removeClass('hidden');
    $('.register-sign-margin').addClass('hidden');
    $('.add-terminal').addClass('hidden');
    $('.cash-alert').addClass('hidden');
    $('.change-password').addClass('hidden');
    $('.register-deposit').addClass('hidden');
    $('.register-colaborator').addClass('hidden');
    $('.delete-cash-register').addClass('hidden');
    $('.create-cash-register').addClass('hidden');
  });

  $("#createRegister").click(function () {
    $(this).addClass('active-list');
    $('#registerColaborator').removeClass('active-list');
    $('#addTerminal').removeClass('active-list');
    $('#changePassword').removeClass('active-list');
    $('#cashAlert').removeClass('active-list');
    $('#registerDeposit').removeClass('active-list');
    $('#registerWithdrawal').removeClass('active-list');
    $('#deleteRegister').removeClass('active-list');
    $('.create-cash-register').removeClass('hidden');
    $('.register-sign-margin').addClass('hidden');
    $('.add-terminal').addClass('hidden');
    $('.cash-alert').addClass('hidden');
    $('.change-password').addClass('hidden');
    $('.register-withdrawal').addClass('hidden');
    $('.register-deposit').addClass('hidden');
    $('.register-colaborator').addClass('hidden');
    $('.delete-cash-register').addClass('hidden');
  });

  $("#deleteRegister").click(function () {
    $(this).addClass('active-list');
    $('#registerColaborator').removeClass('active-list');
    $('#changePassword').removeClass('active-list');
    $('#cashAlert').removeClass('active-list');
    $('#addTerminal').removeClass('active-list');
    $('#registerDeposit').removeClass('active-list');
    $('#registerWithdrawal').removeClass('active-list');
    $('#createRegister').removeClass('active-list');
    $('.delete-cash-register').removeClass('hidden');
    $('.register-sign-margin').addClass('hidden');
    $('.add-terminal').addClass('hidden');
    $('.create-cash-register').addClass('hidden');
    $('.change-password').addClass('hidden');
    $('.cash-alert').addClass('hidden');
    $('.register-colaborator').addClass('hidden');
    $('.register-withdrawal').addClass('hidden');
    $('.register-deposit').addClass('hidden');
  });

  $("#addTerminal").click(function () {

    let debitCom = document.getElementById("debit_comission");
    var im = new Inputmask("decimal");
    im.mask(debitCom);


    let creditCom = document.getElementById("credit_comission");
    var im = new Inputmask("decimal");
    im.mask(creditCom);

    $(this).addClass('active-list');
    $('#registerColaborator').removeClass('active-list');
    $('#cashAlert').removeClass('active-list');
    $('#registerDeposit').removeClass('active-list');
    $('#changePassword').removeClass('active-list');
    $('#deleteRegister').removeClass('active-list');
    $('#registerWithdrawal').removeClass('active-list');
    $('#createRegister').removeClass('active-list');
    $('.add-terminal').removeClass('hidden');
    $('.register-sign-margin').addClass('hidden');
    $('.change-password').addClass('hidden');
    $('.delete-cash-register').addClass('hidden');
    $('.create-cash-register').addClass('hidden');
    $('.cash-alert').addClass('hidden');
    $('.register-withdrawal').addClass('hidden');
    $('.register-colaborator').addClass('hidden');
    $('.register-deposit').addClass('hidden');
  });

  $("#registerColaborator").click(function () {
    $(this).addClass('active-list');
    $('#cashAlert').removeClass('active-list');
    $('#addTerminal').removeClass('active-list');
    $('#registerDeposit').removeClass('active-list');
    $('#changePassword').removeClass('active-list');
    $('#deleteRegister').removeClass('active-list');
    $('#registerWithdrawal').removeClass('active-list');
    $('#createRegister').removeClass('active-list');
    $('.register-sign-margin').removeClass('hidden');
    $('.change-password').addClass('hidden');
    $('.add-terminal').addClass('hidden');
    $('.delete-cash-register').addClass('hidden');
    $('.create-cash-register').addClass('hidden');
    $('.cash-alert').addClass('hidden');
    $('.register-withdrawal').addClass('hidden');
    $('.register-deposit').addClass('hidden');
  });

  $('#changePassword').removeClass('active-list');
    $("#changePassword").click(function () {
      $(this).addClass('active-list');
      $('#cashAlert').removeClass('active-list');
      $('#addTerminal').removeClass('active-list');
      $('#registerDeposit').removeClass('active-list');
      $('#deleteRegister').removeClass('active-list');
      $('#registerColaborator').removeClass('active-list');
      $('#registerWithdrawal').removeClass('active-list');
      $('#createRegister').removeClass('active-list');
      $('.change-password').removeClass('hidden');
      $('.register-sign-margin').addClass('hidden');
      $('.add-terminal').addClass('hidden');
      $('.delete-cash-register').addClass('hidden');
      $('.create-cash-register').addClass('hidden');
      $('.cash-alert').addClass('hidden');
      $('.register-withdrawal').addClass('hidden');
      $('.register-colaborator').addClass('hidden');
      $('.register-deposit').addClass('hidden');
    });

});
