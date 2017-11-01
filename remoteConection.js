const {Pool} = require('pg');
require('dotenv').config();

const remotePool = new Pool({
  user: process.env.DB_REMOTE_USER,
  host: 'localhost',
  database: process.env.DB_REMOTE_DB,
  password: process.env.DB_REMOTE_PASS,
  port: 5432,
});

const localPool = new Pool({
  user: process.env.DB_LOCAL_USER,
  host: 'localhost',
  database: process.env.DB_LOCAL_DB,
  password: process.env.DB_LOCAL_PASS,
  port: 5432,
});

async function query (q, remote = true, table = '') {
  let client = null;
  if (remote){
    client = await remotePool.connect();
  } else {
    client = await localPool.connect();
  }
  let res;
  try {
    await client.query('BEGIN');
    try {
      res = await client.query(q);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  } finally {
    client.release();
  }
  res.table = table;
  return res;
}

async function createInsert (columns, data, table){
  let localQuery = `INSERT INTO public.${table}(`;
  localQuery += columns.shift();
  columns.forEach(fieldName => {
    localQuery += `, ${fieldName}`;
  });
  localQuery += `) VALUES ( '${data.shift()}'`;
  data.forEach(data => {
    if (typeof data === 'boolean'){
      localQuery += ', ';
      localQuery += data;
    }
    if (typeof data === 'object' && data !== null){
      localQuery += `, '${data.toUTCString()}'`;
    } else {
      localQuery += `, '${data}'`;
    }
  });
  return `${localQuery})`;
}

async function findBy(column, data, table){
  let localQuery = `SELECT * FROM ${table} ` +
    `WHERE ${column}='${data}'`;
  return await query(`${localQuery}`);
}
