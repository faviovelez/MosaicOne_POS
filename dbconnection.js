const { Pool, Client } = require('pg');

const localPool = new Pool({
  user: 'dbuser',
  host: 'database.server.com',
  database: 'mydb',
  password: 'secretpassword',
  port: 3211,
});

const remotePool = new Pool({
  user: 'oscar',
  host: 'localhost',
  database: 'mosaicone007_development',
  password: '12345678',
  port: 5432,
});

function findUser(email, password){
  remotePool.query('SELECT NOW()', (err, res) => {
    console.log(err, res.rows[0].now)
  });
  return false;
}
