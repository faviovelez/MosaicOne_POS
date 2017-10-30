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

  function cloneAllTables(id){
    let queries = {
      'stores': `SELECT * FROM stores WHERE id = ${id}`,
      'roles' : 'SELECT * FROM roles WHERE name = '
    };

    window.location.href = 'sign_up.html';
  }

  $('#validateInstall').click(function(){
    let script = `psql -U ${process.env.DB_LOCAL_USER} ${process.env.DB_LOCAL_DB} ` +
      `< ./tmp_files/${process.env.DB_FILE_NAME}`;
    showAlert('Info', 'Proceso de replicacion de base de datos iniciado', cloneAlert());
    exec = require('child_process').exec;

    dbRestore = exec(script,
      function(err, stdout, stderr) {
        if(err){
          showAlert('Error', stderr, cloneAlert());
        }
      });

    dbRestore.on('exit', function (code) {
      let installCode = $('#installCodeId').val();

      if (code ===0){

        findBy('install_code', installCode, 'stores').then(result => {
          cloneAllTables(result.rows[0].id);
        }, err => {
          if(err){
            showAlert('Error', err, cloneAlert());
          }
        });

      }

    });

    return false;
  });

});
