const {Pool} = require('pg');
require('dotenv').config();

const remotePool = new Pool({
  user: 'oscar',
  host: 'localhost',
  database: 'mosaicone',
  password: '12345678"',
  port: 5432,
});

const localPool = new Pool({
  user: 'oscar',
  host: 'localhost',
  database: 'local_db',
  password: '12345678"',
  port: 5432,
});

async function query (q, remote = true, table = '', lastId = 0) {
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
  if (lastId !== 0) {
    res.lastId = lastId;
  }
  res.table = table;
  return res;
}

async function getToTransfer(table){
  let localQuery = `SELECT * FROM ${table}` +
    ' WHERE web = false';

  return await query(localQuery, false, table);
}

async function toDayRows(table){
  let today = new Date(),
    day   = today.getDate(),
    month = today.getMonth() + 1,
    year  = today.getFullYear();
  localQuery = `SELECT * FROM ${table}` +
    ` WHERE created_at >= '${year}-${month}-${day}'` +
    ` AND created_at < '${year}-${month}-${day + 1}'`;
  return await query(localQuery, false);
}

async function createInsert (columns, data, table){
  let localQuery = `INSERT INTO public.${table}(`;
  localQuery += columns.shift();
  columns.forEach(fieldName => {
    localQuery += `, "${fieldName}"`;
  });
  localQuery += `) VALUES ( '${data.shift()}'`;
  data.forEach(data => {
    switch(data){
      case null:
      case true:
      case false:
        localQuery += ', ';
        localQuery += data;
        break;
      default:
        if (typeof data === 'object'){
          localQuery += `, '${data.toUTCString()}'`;
        } else {
          localQuery += `, '${data}'`;
        }
    }
  });
  return `${localQuery})`;
}

async function findBy(column, data, table, remote = true, lastId = 0){
  let localQuery = `SELECT * FROM ${table} ` +
    `WHERE ${column}='${data}'`;
  return await query(`${localQuery}`, remote, table, lastId);
}

async function updateBy(data, table, condition){
  let localQuery = `UPDATE ${table} SET`;
  for(var column in data) {
    localQuery += ` ${column} = '${data[column]}',`;
  }
  localQuery = localQuery.replace(/,$/,'');
  localQuery += ` WHERE ${condition}`;
  return await query(localQuery, false);
}

async function updatePosData(table, id){
  let localQuery = `UPDATE ${table} SET ` +
    ` web = true WHERE id = ${id}`;

  return query(localQuery, false);
}
