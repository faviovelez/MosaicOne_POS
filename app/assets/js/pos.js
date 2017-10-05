
$(document).ready(function() {

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
  });

  $("#debit").click(function () {
    $(this).addClass('selected');
    $('#cash').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#other').removeClass('selected');
  });

  $("#credit").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#other').removeClass('selected');
  });

  $("#check").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#other').removeClass('selected');
  });

  $("#transfer").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#cash').removeClass('selected');
    $('#other').removeClass('selected');
  });

  $("#other").click(function () {
    $(this).addClass('selected');
    $('#debit').removeClass('selected');
    $('#credit').removeClass('selected');
    $('#check').removeClass('selected');
    $('#transfer').removeClass('selected');
    $('#cash').removeClass('selected');
  });

/* Métodos para cambiar botón de pagos*/
/* Si la cantidad de pagos (sumada) es mayor o igual al total, cambiar al botón completar venta */
  $("#addPayment").click(function () {
    $(this).addClass('hidden');
    $('#completeSale').removeClass('hidden');
  });

});
