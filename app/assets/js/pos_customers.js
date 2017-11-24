$(function(){
  let cfdiUseSelect = '';

  async function initStore(){

    const store = new Store({
      configName: 'user-localStore',
      defaults: {
        windowBounds: { width: 1024, height: 768 }
      }
    });

    return store;
  }

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
            value:    prospect.legal_or_business_name,
            showInfo: prospect.legal_or_business_name,
            id:       prospect.id
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
      clearData(prospect.prospect_type) +
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
            $('#prospectForm').attr('data-id', prospectInfo.id);
            $('#prospectForm').attr('data-billing_address-id', billing_address.rows[0].id);

            $('#prospectForm').html(
              prospectInfoForm(prospectInfo, billing_address.rows[0])
            );
            $('#prospect_business_type').val(prospectInfo.business_type);
          });
        } else {
          newRegister('billing_addresses').then(billing_address => {
            $('#prospectForm').attr('data-id', prospectInfo.id);
            $('#prospectForm').attr('data-billing_address-id', billing_address.id);

            $('#prospectForm').html(
              prospectInfoForm(prospectInfo, billing_address)
            );
          });
        }
      });

    }
  });

  function removeEmpty(object){
    for (var key in object){
      if (object[key] === ''){
        delete object[key];
      }
    }
    return object;
  }

  function getProspectData() {
    return removeEmpty({
      legal_or_business_name: $('#prospect_legal_or_business_name').val(),
      prospect_type:          $('#prospect_prospect_type').val(),
      business_type:          $('#prospect_business_type').val(),
      contact_first_name:     $('#prospect_contact_first_name').val(),
      contact_middle_name:    $('#prospect_contact_middle_name').val(),
      contact_last_name:      $('#prospect_contact_last_name').val(),
      second_last_name:       $('#prospect_second_last_name').val(),
      contact_position:       $('#prospect_contact_position').val(),
      email:                  $('#prospect_email').val(),
      direct_phone:           $('#prospect_direct_phone').val(),
      extension:              $('#prospect_extension').val(),
      cell_phone:             $('#prospect_cell_phone').val(),
    });
  }

  function getBillingAddressData(){
    return removeEmpty({
      business_name:   $('#prospect_legal_or_business_name').val(),
      type_of_person:  $('#prospect_business_type').val(),
      rfc:             $('#prospect_billing_address_rfc').val(),
      street:          $('#prospect_billing_address_street').val(),
      exterior_number: $('#prospect_billing_address_exterior_number').val(),
      interior_number: $('#prospect_billing_address_interior_number').val(),
      zipcode:         $('#prospect_billing_address_zipcode').val(),
      neighborhood:    $('#prospect_billing_address_neighborhood').val(),
      city:            $('#prospect_billing_address_city').val(),
      state:           $('#prospect_billing_address_state').val(),
      country:         $('#prospect_billing_address_country').val()
    });
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

  async function checkFillAll(objects){
    let error = false;
    for (var key in objects) {
      let validation = notNull(objects[key], key);
      if (!validation.result){
        error = true;
        showAlert(validation.type, validation.message, cloneAlert());
      }
    }
    return error;
  }

  function validateBillingAddress(call){
    let params = {
      type_of_person: $('#prospect_business_type').val(),
      business_name:  $('#prospect_legal_or_business_name').val(),
      rfc:            $('#prospect_billing_address_rfc').val(),
    };
    checkFillAll(params).then(error => {

      return call(!error);

    });
  }

  function validateProspect(call){
    let params = {
      business_type:          $('#prospect_business_type').val(),
      contact_first_name:     $('#prospect_contact_first_name').val(),
      contact_last_name:      $('#prospect_contact_last_name').val(),
      legal_or_business_name: $('#prospect_legal_or_business_name').val(),
    };
    checkFillAll(params).then(error => {

      if (!error) {
        let thisOrThatFill = thisOrThat(
          '#prospect_direct_phone',
          '#prospect_cell_phone'
        );

        if (!thisOrThatFill.result) {
          showAlert(thisOrThatFill.type, thisOrThatFill.message, cloneAlert());
          return call(false);
        }
        return call(true);
      }
      return call(false);
    });
  }

  function createBillingAddress(prospectId){
    validateBillingAddress(function(validate){
      if (validate){

        let billingAddressData = getBillingAddressData();

        query('SELECT MAX(id) FROM billing_addresses').then(maxId => {
          let columns = Object.keys(billingAddressData),
            values  = Object.values(billingAddressData);

          billingAddressId = maxId.rows[0].max + 1;

          $('#prospectForm').attr('data-billing_address-id', billingAddressId);

          insert(
            columns,
            values,
            'billing_addresses'
          ).then(billingAddress => {
            updateBy(
              {
                billing_address_id: billingAddressId
              },
              'prospects',
              `id = ${prospectId}`
            );
          });

        });
      } else {
        showAlert('Error', 'Es posible que el prospecto no tenga datos de facturacion', cloneAlert());
      }
    });
  }

  function loadTr(object){
    if ($('#prospectList tr').length === 0) {

      $('#prospectList').append(addTr(object));

      $('#prospectCloseIcon').click(function(){
        $('#prospectList tr').remove();
      });

    }
    $('#newProspect').modal('toggle');
  }

  $('#openNewProspectModal').click(function(){
    $('#billCfdiUse').modal('toggle');
  });

  $('#prospectSave').click(function(){
    let prospectId        = $('#prospectForm').attr('data-id'),
        billing_addressId = $('#prospectForm').attr('data-billing_address-id');

    validateProspect(function(validate){

      if (validate){

        let prospectData = getProspectData();

        if (prospectId){

          updateBy(prospectData, 'prospects', `id = ${prospectId}`).then(() => {});
          if (billing_addressId) {
            updateBy(getBillingAddressData(), 'billing_addresses', `id = ${billing_addressId}`).then(() => {});
          } else {
            createBillingAddress(prospectId);
          }
          prospectData.id = prospectId;
          loadTr(
            {
              showInfo: prospectData.legal_or_business_name,
              id:       prospectData.id
            }
          );

          $('#billCfdiUse').modal('toggle');
        } else {
          query('SELECT MAX(id) FROM prospects').then(maxId => {
            initStore().then(store => {

              let columns = Object.keys(prospectData),
                values  = Object.values(prospectData);

              columns.push('business_unit_id');
              columns.push('business_group_id');
              prospectLastId = maxId.rows[0].max + 1;

              values.push(store.get('store').business_unit_id);
              values.push(store.get('store').business_group_id);

              $('#prospectForm').attr('data-id', prospectLastId);

              insert(
                columns,
                values,
                'prospects'
              ).then(() => {

                createBillingAddress(prospectLastId);
                findBy(
                  'id',
                  prospectLastId,
                  'prospects'
                ).then(prospect => {
                  createProspectList();
                  loadTr(
                    {
                      showInfo: prospect.rows[0].legal_or_business_name,
                      id:       prospect.rows[0].id
                    }
                  );
                });

              });

            });
          });
        }

      }

    });

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
        $('#prospectForm').attr('data-id', prospectInfo.id);
        $('#prospectForm').attr('data-billing_address-id', billing_address.id);

        $('#prospectForm').html(
          prospectInfoForm(prospectInfo, billing_address)
        );
      });

    });
  });

  function fillCfdiUses(call){
    getAll('cfdi_uses').then(cfdiUses => {
      let html = '';

      cfdiUses.rows.forEach(cfdiUse => {
        html += `<option value="${cfdiUse.id}">${cfdiUse.description}</option>`;
      });

      return call(html);
    });
  }

  function cfdiTr(billing_address, call){
    fillCfdiUses(function(cfdiUsesOptions){
      return call('<tr>' +
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
        '<select class="prospect_business_type" style="width: 200px;" name="business_type" id="prospect_cfdi_use">' +
        cfdiUsesOptions +
        '</select>' +
        '</td>' +
        '</tr>');
    });
  }

  $('#billCfdiUse').on('shown.bs.modal', function(e) {
    let prospectId = $('a[data-target="#billCfdiUse"]').attr('data-id');
    findBy('id', prospectId, 'prospects').then(prospect => {
      if (prospect.rows[0].billing_address_id) {
        findBy('id',
          prospect.rows[0].billing_address_id,
          'billing_addresses'
        ).then(billing_address => {
          $('#cfdiProspectData tr').remove();
          cfdiTr(
            billing_address.rows[0],
            function(tr){
              loadCfdiTr(tr);
            }
          );
        });

      } else {
        let dummyInfo = {
          business_name: 'Sin data',
          rfc          : 'AAAA999999AAA'
        };
        $('#cfdiProspectData tr').remove();
          cfdiTr(
            dummyInfo,
            function(tr){
              loadCfdiTr(tr);
            }
          );
      }

      $('#openNewProspectModal').attr('data-id', prospect.rows[0].id);
    });
  });

  function loadCfdiTr(tr){
    $('#cfdiProspectData').append(tr);
    $('#prospect_cfdi_use').val(cfdiUseSelect);
    $('#prospect_cfdi_use').change(function(){
      cfdiUseSelect = $(this).val();
    });
  }

  function addTr(object){
    cfdiUseSelect = '';
    return '<tr>' +
      '<td class="icon-close-td">' +
        '<div class="close-icon" id="prospectCloseIcon">' +
          '<button type="button" class="close center-close" aria-label="Close">' +
            '<span aria-hidden="true" class="white-light">&times;</span>' +
          '</button>' +
        '</div>' +
      '</td>' +
      '<td class="prospect_name">' +
        object.showInfo +
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

  function createProspectList() {
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
  }

  createProspectList();
});
