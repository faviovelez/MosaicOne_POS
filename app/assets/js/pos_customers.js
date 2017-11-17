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

  function clearData(data){
    return data === null ? '' : data;
  }

  function prospectInfoForm(prospect, billing_address){
    $('#legal_or_business_name').val(prospect.business_type);
    return '<h4> Datos generales </h4>' +
      '<table class="prospect-details-table">' +
      '<thead>' +
      '<tr>' +
      '<th>' +
      '<label for="prospect_name">Nombre</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_sender_name">Giro</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_sender_zipcode">Tipo de persona</label><br>' +
      '</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      '<tr>' +
      '<td>' +
      '<input placeholder="Nombre o Razón social" class="form-control round-form transparent-field" type="text" value="' +
        clearData(prospect.legal_or_business_name) +
      `" name="prospect[legal_or_business_name]" id="prospect_legal_or_business_name" />` +
      '</td>' +
      '<td>' +
      '<input placeholder="Giro comercial" class="form-control round-form transparent-field" type="text" value="' +
      clearData(prospect.business_type) +
      '" name="prospect[prospect_type]" id="prospect_prospect_type" />' +
      '</td>' +
      '<td>' +
      '<select class="prospect_business_type" name="business_type" id="prospect_business_type">' +
      '<option value="persona física">Persona física</option>' +
      '<option value="persona moral">Persona moral</option>' +
      '</select>' +
      '</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '<h4 class="title-margin-modal"> Datos de contacto </h4>' +
      '<table class="prospect-details-table">' +
      '<thead>' +
      '<tr>' +
      '<th>' +
      '<label for="prospect_contact_first_name"> Primer nombre </label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_contact_middle_name"> Segundo nombre </label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_contact_last_name">Apellido paterno</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_second_last_name">Apellido materno</label><br>' +
      '</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      '<tr>' +
      '<td>' +
      '<input placeholder="Nombre" class="form-control round-form transparent-field" type="text" value="' +
      clearData(prospect.contact_first_name) +
      '" name="prospect[contact_first_name]" id="prospect_contact_first_name" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="Segundo nombre" class="form-control round-form transparent-field" type="text" value="' +
      clearData(prospect.contact_middle_name) +
      '" name="prospect[contact_middle_name]" id="prospect_contact_middle_name" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="Apellido paterno" class="form-control round-form transparent-field" type="text" value="' +
      clearData(prospect.contact_last_name) +
      '" name="prospect[contact_last_name]" id="prospect_contact_last_name" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="Apellido materno" class="form-control round-form transparent-field" type="text" value="' +
      clearData(prospect.second_last_name) +
      '" name="prospect[second_last_name]" id="prospect_second_last_name" />' +
      '</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '<table class="table-margin-modal prospect-details-table">' +
      '<thead>' +
      '<tr>' +
      '<th>' +
      '<label for="prospect_contact_position">Puesto</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_email">Email</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_direct_phone">Teléfono fijo</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_direct_phone">Ext.</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_cell_phone">Celular</label><br>' +
      '</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      '<tr>' +
      '<td>' +
      '<input placeholder="Puesto" class="form-control round-form transparent-field" type="text" value="' +
      clearData(prospect.contact_position) +
      '" name="prospect[contact_position]" id="prospect_contact_position" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="ejemplo@ejemplo.com" class="form-control round-form transparent-field" type="text" value="' +
      clearData(prospect.email) +
      '" name="prospect[email]" id="prospect_email" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="Teléfono fijo" class="form-control round-form transparent-field" type="text" value="' +
      clearData(prospect.direct_phone) +
      '" name="prospect[direct_phone]" id="prospect_direct_phone" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="Ext." class="form-control round-form transparent-field" type="text" value="' +
      clearData(prospect.extension) +
      '" name="prospect[extension]" id="prospect_extension" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="Celular" class="form-control round-form transparent-field" type="text" value="' +
      clearData(prospect.cell_phone) +
      '" name="prospect[cell_phone]" id="prospect_cell_phone" />' +
      '</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '<h4 class="title-margin-modal"> Datos de facturación </h4>' +
      '<table class="table-margin-modal prospect-details-table">' +
      '<thead>' +
      '<tr>' +
      '<th>' +
      '<label for="prospect_billing_address_rfc">RFC</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_billing_address_street">Calle</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_billing_address_exterior_number">No. Exterior</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_billing_address_interior_number">No. Interior</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_billing_address_zipcode">Código Postal</label><br>' +
      '</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      '<tr>' +
      '<td>' +
      '<input placeholder="RFC" class="form-control round-form transparent-field" type="text" value="' +
      clearData(billing_address.rfc) +
      '" name="prospect[billing_address_rfc]" id="prospect_billing_address_rfc" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="Calle" class="form-control round-form transparent-field" type="text" value="' +
      clearData(billing_address.street) +
      '" name="prospect[billing_address_street]" id="prospect_billing_address_street" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="No. Ext." class="form-control round-form transparent-field" type="text" value="' +
      clearData(billing_address.exterior_number) +
      '" name="prospect[billing_address_exterior_number]" id="prospect_billing_address_exterior_number" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="No. Int." class="form-control round-form transparent-field" type="text" value="' +
      clearData(billing_address.interior_number) +
      '" name="prospect[billing_address_interior_number]" id="prospect_billing_address_interior_number" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="Código postal." class="form-control round-form transparent-field" type="text" value="' +
      clearData(billing_address.zipcode) +
      '" name="prospect[billing_address_zipcode]" id="prospect_billing_address_zipcode" />' +
      '</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '<table class="prospect-details-table">' +
      '<thead>' +
      '<tr>' +
      '<th>' +
      '<label for="prospect_billing_address_neighborhood">Colonia</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_billing_address_city">Ciudad</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_billing_address_state">Estado</label><br>' +
      '</th>' +
      '<th>' +
      '<label for="prospect_billing_address_country">País</label><br>' +
      '</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      '<tr>' +
      '<td>' +
      '<input placeholder="Colonia" class="form-control round-form transparent-field" type="text" value="' +
      clearData(billing_address.neighborhood) +
      '" name="prospect[billing_address_neighborhood]" id="prospect_billing_address_neighborhood" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="Ciudad" class="form-control round-form transparent-field" type="text" value="' +
      clearData(billing_address.city) +
      '" name="prospect[billing_address_city]" id="prospect_billing_address_city" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="Estado" class="form-control round-form transparent-field" type="text" value="' +
      clearData(billing_address.state) +
      '" name="prospect[billing_address_state]" id="prospect_billing_address_state" />' +
      '</td>' +
      '<td>' +
      '<input placeholder="País" class="form-control round-form transparent-field" type="text" value="' +
      clearData(billing_address.country) +
      '" name="prospect[billing_address_country]" id="prospect_billing_address_country" />' +
      '</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>';
  }

  $('#newProspect').on('shown.bs.modal', function(e) {
    let prospectId = e.relatedTarget.dataset.id;
    if (prospectId){

      findBy('id', prospectId, 'prospects').then(prospect => {
        prospectInfo = prospect.rows[0];
        if (prospect.rows[0].billing_address_id) {
          findBy('id',
            prospect.rows[0].billing_address_id,
            'billing_addresses'
          ).then(billing_address => {
            $('#prospectForm').html(
              prospectInfoForm(prospectInfo, billing_address.rows[0])
            );
          });
        }
      });

    }
  });

  $('#prospectSave').click(function(){
    if ($('#prospectList tr').length === 0) {

      let object = {
        value: createFullName({
          contact_first_name:  $('#prospect_contact_first_name').val(),
          contact_middle_name: $('#prospect_contact_middle_name').val(),
          contact_last_name:   $('#prospect_contact_last_name').val()
        }),
        id: 100
      };

      $('#prospectList').append(addTr(object));

      $('#prospectCloseIcon').click(function(){
        $('#prospectList tr').remove();
      });

    }
    $('#newProspect').modal('toggle');
    return false;
  });

  $('#confirmProspectData').click(function(){
    $('#billCfdiUse').modal('toggle');
    return false;
  });

  $('#initAddNewProspect').click(function(){
    $('#prospectList tr').remove();

    newRegister('prospects').then(prospect => {
      prospectInfo = prospect;

      newRegister('billing_addresses').then(billing_address => {
        $('#prospectForm').html(
          prospectInfoForm(prospectInfo, billing_address)
        );
      });

    });
  });

  function cfdiTr(billing_address){
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
        billing_address.business_name +
       '</td>' +
       '<td class="center">' +
         billing_address.rfc +
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
      if (prospect.rows[0].billing_address_id) {
        findBy('id',
          prospect.rows[0].billing_address_id,
          'billing_addresses'
        ).then(billing_address => {
          $('#cfdiProspectData tr').remove();
          $('#cfdiProspectData').append(cfdiTr(
            billing_address.rows[0]
          ));
        });

      } else {
        let dummyInfo = {
          business_name: 'Sin data',
          rfc          : 'AAAA999999AAA'
        };
        $('#cfdiProspectData tr').remove();
        $('#cfdiProspectData').append(cfdiTr(dummyInfo));
      }

      $('#openNewProspectModal').attr('data-id', prospect.rows[0].id);
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
