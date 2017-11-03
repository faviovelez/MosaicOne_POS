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

  function passwordValidation(){
    return equals(
      $('#user_password').val(),
      $('#user_password_confirm').val(),
      false
    );
  }

  $('#registerAction').click(function(){
    let validatePassword = passwordValidation();

    if (!validatePassword.result) {

      showAlert(validatePassword.type, validatePassword.message, cloneAlert());
      return false;

    }

    let params = {
      first_name            : $('#user_first_name').val(),
      last_name             : $('#user_last_name').val(),
      email                 : $('#user_email').val(),
      encrypted_password    : $('#user_password').val(),
      pass_confirm          : $('#user_password_confirm').val()
    };

    checkFillAll(params).then(error => {

      if (!error) {

        params.middle_name = $('#user_middle_name').val();

        addUser(params).then(result => {
          showAlert('Éxito', 'Usuario creado correctamente', cloneAlert());

          findBy('email', $('#user_email').val(), 'users').then(user => {
            setTimeout(function(){
              loginUser(user.rows[0]).then({});
            }, 1000);

          });
        }, err => {
          showAlert('Error', err.detail, cloneAlert());
        });

      }

    });

    return false;
  });
});
