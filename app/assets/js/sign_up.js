$(function(){
  function cloneAlert(){
    $('.container-sign-up').prepend(
      '<div class="alert" hidden>' +
      `${$('.alert').html()} </div>`
    );
  }

  function showAlert(type, message){
    $('.alert span.title').html(`${type}: ${message}`);
    $('.alert:last')
      .show()
      .addClass('alert-danger')
      .removeClass('hidden');
  }

  $('#registerAction').click(function(){

    let params = {
      first_name   : $('#user_first_name').val(),
      middle_name  : $('#user_middle_name').val(),
      last_name    : $('#user_last_name').val(),
      email        : $('#user_email').val(),
      password     : $('#user_password').val(),
      pass_confirm : $('#user_password_confirm').val()
    };

    cloneAlert();

    addUser(params).then(result => {
      showAlert('Success', 'Usuario creado correctamente');
    }, err => {
      showAlert('Error', err.detail);
    });

    return false;
  });
});
