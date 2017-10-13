$(function(){
  $('#loginAction').click(function(){
    let user = $('#user_email').val(),
        pass = $('#user_password').val();

    if (findUser(user, pass)){

    } else {
      $('.alert').removeClass('hidden');
    }

    return false;
  });
});
