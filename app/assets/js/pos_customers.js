$(function(){

  function createFullName(data){
    return (`${data.contact_first_name} ` +
    `${data.contact_middle_name} ` +
    data.contact_last_name).replace(
      /null/, ''
    );
  }

  function getProspectList(call){
    getAll('prospects').then(prospects => {
      let prospectObtions = [];
      prospects.rows.forEach(prospect => {
        prospectObtions.push(
          {
            value: createFullName(prospect),
            id:    prospect.id
          }
        );
      });

      return call(prospectObtions);

    });
  }

  function cfdiTr(prospect){
     return '<tr>' +
       '<td class="center">' +
         '<strong>' +
           'Nombre o razón social:' +
         '</strong>' +
       '</td>' +
       '<td class="center">' +
         '<strong>' +
           'RFC:' +
         '</strong>' +
       '</td>' +
       '<td class="center">' +
         '<strong>' +
           'Uso de CFDI:' +
         '</strong>' +
       '</td>' +
     '</tr>' +
     '<tr>' +
       '<td class="prospect_name center">' +
         createFullName(prospect) +
       '</td>' +
       '<td class="center">' +
         'MAPE811023JR8' +
       '</td>' +
       '<td colspan="2">' +
         '<select class="prospect_business_type" name="business_type" id="prospect_cfdi_use">' +
           '<option value="persona física">Gastos en general</option>' +
           '<option value="persona moral">Adquisición de mercancías</option>' +
         '</select>' +
       '</td>' +
     '</tr>';
  }
  $('#billCfdiUse').on('shown.bs.modal', function(e) {
    let prospectId = e.relatedTarget.dataset.id;
    findBy('id', prospectId, 'prospects').then(prospect => {
      debugger
      findBy('id',
        prospect.rows[0].billing_address_id, 
        'billing_addresses'
      ).then(billing_adress => {
        debugger
      })
    });
  });

  function addTr(object){
    return '<tr>' +
      '<td class="icon-close-td">' +
        '<div class="close-icon" id="prospectCloseIcon">' +
          '<button type="button" class="close center-close" aria-label="Close">' +
            '<span aria-hidden="true" class="white-light">&times;</span>' +
          '</button>' +
        '</div>' +
      '</td>' +
      '<td class="prospect_name">' +
        object.value +
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

  getProspectList(lista => {
    $('#prospectsList').autocomplete({
      lookup: lista,
      lookupLimit: 10,
      onSelect: function (suggestion) {
        $('#prospectList tr').remove();
        $('#prospectList').append(addTr(suggestion));

        $('#prospectCloseIcon').click(function(){
          $('#prospectList tr').remove();
        });

        $(this).val('');
      }
    });
  });
});
