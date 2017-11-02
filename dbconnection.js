const {Pool} = require('pg');
require('dotenv').config();

const localPool = new Pool({
  user: process.env.DB_LOCAL_USER,
  host: 'localhost',
  database: process.env.DB_LOCAL_DB,
  password: process.env.DB_LOCAL_PASS,
  port: 5432,
});

async function query (q) {
  const client = await localPool.connect();
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
  return res;
}

async function insert (columns, data, table){
  let localQuery = `INSERT INTO public.${table}(`;
  localQuery += columns.shift();
  columns.forEach(fieldName => {
    localQuery += `, ${fieldName}`;
  });
  localQuery += `, created_at, updated_at) VALUES ( '${data.shift()}'`;
  data.forEach(data => {
    localQuery += `, '${data}'`;
  });
  let createDate = new Date,
      updateDate = new Date

  localQuery += `, '${createDate.toUTCString()}',`;
  localQuery += `'${createDate.toUTCString()}'`;
  debugger
  return await query(`${localQuery})`);
}

async function findBy(column, data, table){
  let localQuery = `SELECT * FROM ${table} ` +
    `WHERE ${column}='${data}'`;
  return await query(`${localQuery}`);
}

async function getAll(table, columns = '*'){
  let localQuery = `SELECT ${columns} FROM ${table}`;
  return await query(localQuery);
}

async function updateBy(data, table, condition){
  let localQuery = `UPDATE ${table} `;
  for(var column in data) {
    localQuery += `SET ${column} = '${data[column]}',`;
  }
  localQuery = localQuery.replace(/,$/,'');
  localQuery += ` WHERE ${condition}`;
  return await query(localQuery);
}
