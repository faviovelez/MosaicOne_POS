$(function(){
  const remote = require('electron').remote;

  $('#closeDay').click(function(){
    toWebDatabase().then(() => {
      setTimeout(function(){
        remote.getCurrentWindow().close();
      }, 3000);
    });
    return false;
  });
});
