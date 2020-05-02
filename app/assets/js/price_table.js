$(document).ready(function(){

  const Inputmask = require('inputmask');

  (function setOverprice(){

    query("SELECT overprice FROM stores LIMIT 1").then(overprice => {
      ovrPr = Math.round(overprice.rows[0].overprice * 100 / 100).toFixed(1);
      $('.storeOverprice').html(
        `${ovrPr} %`
      );
    });
  })();

  function initDataTables(){
    $('#priceList').DataTable({
      "language": {
        "sProcessing":     "Procesando...",
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sZeroRecords":    "No se encontraron resultados",
        "sEmptyTable":     "Ningún dato disponible en esta tabla",
        "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix":    "",
        "sSearch":         "Buscar:",
        "sUrl":            "",
        "sInfoThousands":  ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
          "sFirst":    "Primero",
          "sLast":     "Último",
          "sNext":     "Siguiente",
          "sPrevious": "Anterior"
        },
        "oAria": {
          "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
          "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
      },
      pageLength: 6,
      responsive: true,
      dom: 'Bfrtip',
      order: [[ 1, "desc" ]]
    });
  }

  $('#changeSinglePrice').on('shown.bs.modal', function(e) {

    let changeSinglePriceOption = document.getElementById("changeSinglePriceInput");
    var im = new Inputmask("decimal");
    im.mask(changeSinglePriceOption);

    $('#changeSinglePriceProductId').html(e.relatedTarget.dataset.id);
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

    $(`a[data-id="${productId}"]`).html(`
      $ ${parseFloat(newPrice).toFixed(2).replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"
        )}
    `);
    $('#changeSinglePrice').modal('hide');
    $('#changeSinglePriceInput').val('');
    $("#changeSinglePriceCheckBox").prop('checked', false);
  });

  function addTr(product){
    return '<tr>' +
      `<td> ${product.value} </td>` +
      `<td> ${product.exterior_color_or_design} </td>` +
      `<td> ${product.only_measure} </td>` +
      `<td> ${product.main_material} </td>` +
      `<td> ${product.resistance_main_material} </td>` +
      `<td> ${product.line} </td>` +
      '<td>' +
        `<a href="#" data-toggle="modal" data-target="#changeSinglePrice" data-id="${product.id}">` +
          `$ ${(product.price).toFixed(2)}` +
        '</a>' +
      '</td>' +
    '</tr>';
  }

  (function fillTable(){
    let specialProductQuery = "SELECT id, CONCAT(unique_code, ' ', description, ' ', only_measure) AS value, " +
                          "COALESCE(exterior_color_or_design, '') AS exterior_color_or_design, " +
                          "COALESCE(only_measure, '') AS only_measure, COALESCE(main_material, '') AS main_material, " +
                          "COALESCE(resistance_main_material, '') AS resistance_main_material, " +
                          "COALESCE(line, '') AS line, price FROM products";
      query(specialProductQuery).then(productsObject => {
        let limit = productsObject.rowCount;
        let count = 0;

        $('#productListPrices tr').remove();
        productsObject.rows.forEach(product => {
          $('#productListPrices').append(addTr(product));
          count ++;
          if (limit === count){
            initDataTables();
          }
        })
      })
  })();

});
