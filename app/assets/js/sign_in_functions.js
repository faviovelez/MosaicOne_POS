$(function(){
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

  function tablesToCheck(){
    return ['products', 'services', 'prospects', 'billing_addresses', 'stores'];
  }

  function checkNewData(){

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

  $('#loginAction').click(function(){
    let email = $('#user_email').val();
    findBy('email', email, 'users').then(user => {
      let bcrypt = require('bcryptjs'),
          pass   = $('#user_password').val();
          resultPass = user.rows.length > 0 ? user.rows[0].encrypted_password
                                            : '';

      if (bcrypt.compareSync(
        pass,
        resultPass
      ) ){
        loginUser(user.rows[0]);
      } else {
        showAlert('Error', 'Datos incorrectos validar nuevamente' , cloneAlert());
      }
    });
    return false;
  });
});
