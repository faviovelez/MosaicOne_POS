function createPassword(pass){
  var bcrypt = require('bcryptjs');
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pass, salt);
}

async function addUser(params){
  params.password = createPassword(params.password);
  let columns = ['email', 'first_name', 'middle_name', 
    'last_name', 'password'],
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
