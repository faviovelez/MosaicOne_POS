$(function(){
  $('#registerAction').click(function(){

    let params = {
      first_name   : $('#user_first_name').val(),
      middle_name  : $('#user_middle_name').val(),
      last_name    : $('#user_last_name').val(),
      email        : $('#user_email').val(),
      password     : $('#user_password').val(),
      pass_confirm : $('#user_password_confirm').val()
    };


    addUser(params).then(result => {
      debugger
      if (result) {
      } else {
        $('.alert span.title').html('Error type');
        $('.alert')
          .addClass('alert-danger')
          .removeClass('hidden');
      }
    });

    return false;
  });
});
