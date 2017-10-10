$(document).ready(function() {

  $("#cashAlert").click(function () {
    $(this).addClass('active-list');
    $('#registerDeposit').removeClass('active-list');
    $('#registerWithdrawal').removeClass('active-list');
    $('#createRegister').removeClass('active-list');
    $('#deleteRegister').removeClass('active-list');
    $('.cash-alert').removeClass('hidden');
    $('.register-withdrawal').addClass('hidden');
    $('.register-deposit').addClass('hidden');
    $('.delete-cash-register').addClass('hidden');
    $('.create-cash-register').addClass('hidden');
  });

  $("#registerDeposit").click(function () {
    $(this).addClass('active-list');
    $('#cashAlert').removeClass('active-list');
    $('#registerWithdrawal').removeClass('active-list');
    $('#createRegister').removeClass('active-list');
    $('#deleteRegister').removeClass('active-list');
    $('.register-deposit').removeClass('hidden');
    $('.cash-alert').addClass('hidden');
    $('.register-withdrawal').addClass('hidden');
    $('.delete-cash-register').addClass('hidden');
    $('.create-cash-register').addClass('hidden');
  });

  $("#registerWithdrawal").click(function () {
    $(this).addClass('active-list');
    $('#cashAlert').removeClass('active-list');
    $('#registerDeposit').removeClass('active-list');
    $('#createRegister').removeClass('active-list');
    $('#deleteRegister').removeClass('active-list');
    $('.register-withdrawal').removeClass('hidden');
    $('.cash-alert').addClass('hidden');
    $('.register-deposit').addClass('hidden');
    $('.delete-cash-register').addClass('hidden');
    $('.create-cash-register').addClass('hidden');
  });

  $("#createRegister").click(function () {
    $(this).addClass('active-list');
    $('#cashAlert').removeClass('active-list');
    $('#registerDeposit').removeClass('active-list');
    $('#registerWithdrawal').removeClass('active-list');
    $('#deleteRegister').removeClass('active-list');
    $('.create-cash-register').removeClass('hidden');
    $('.cash-alert').addClass('hidden');
    $('.register-withdrawal').addClass('hidden');
    $('.register-deposit').addClass('hidden');
    $('.delete-cash-register').addClass('hidden');
  });

  $("#deleteRegister").click(function () {
    $(this).addClass('active-list');
    $('#cashAlert').removeClass('active-list');
    $('#registerDeposit').removeClass('active-list');
    $('#registerWithdrawal').removeClass('active-list');
    $('#createRegister').removeClass('active-list');
    $('.delete-cash-register').removeClass('hidden');
    $('.create-cash-register').addClass('hidden');
    $('.cash-alert').addClass('hidden');
    $('.register-withdrawal').addClass('hidden');
    $('.register-deposit').addClass('hidden');
  });

});
