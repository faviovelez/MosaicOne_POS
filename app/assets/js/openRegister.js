$(function(){
  const remote = require('electron').remote;

  $('#datetimepicker1 #datetimepicker2').datetimepicker({
    locale: 'es'
  });

  $('#closeDay').click(function(){
    toWebDatabase().then(() => {
      setTimeout(function(){
        remote.getCurrentWindow().close();
      }, 3000);
    });
    return false;
  });
});
