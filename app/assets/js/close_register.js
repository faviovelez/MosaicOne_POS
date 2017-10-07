
$(document).ready(function() {

/* Métodos para tabla de cierres*/

  $("#sales-hide").click(function () {
    $(this).addClass('hidden');
    $('#sales-show').removeClass('hidden');
    $('.sales-hide').addClass('hidden');
  });

  $("#sales-show").click(function () {
    $(this).addClass('hidden');
    $('#sales-hide').removeClass('hidden');
    $('.sales-hide').removeClass('hidden');
  });

  $("#payment-hide").click(function () {
    $(this).addClass('hidden');
    $('#payment-show').removeClass('hidden');
    $('.payment-hide').addClass('hidden');
  });

  $("#payment-show").click(function () {
    $(this).addClass('hidden');
    $('#payment-hide').removeClass('hidden');
    $('.payment-hide').removeClass('hidden');
  });

});
