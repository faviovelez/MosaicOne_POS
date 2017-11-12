async function initStore(){

  const store = new Store({
    configName: 'user-localStore',
    defaults: {
      windowBounds: { width: 1024, height: 768 }
    }
  });

  return store;
}

function createPassword(pass){
  let bcrypt = require('bcryptjs'),
      salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pass, salt);
}

async function addUser(params){
  params.encrypted_password = createPassword(params.encrypted_password);
  let columns = ['email', 'first_name', 'middle_name', 
    'last_name', 'encrypted_password'],
      data = [];
  columns.forEach(attr => {
    data.push(params[attr]);
  });
  return insert(columns, data, 'users');
}

async function hasUser(){
  try {
    const { rows } = await query('SELECT * FROM users');
    return rows.length > 0;
  } catch (err) {
    return false;
  }
}

async function loginUser(user, goTo = 'pos_sale.html'){
  initStore().then(store => {
    window.location.href = goTo;
    store.set('current_user', user);
  });
}
