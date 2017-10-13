$(document).ready(function() {

  $("#cashAlert").click(function () {
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

  $("#registerDeposit").click(function () {
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
