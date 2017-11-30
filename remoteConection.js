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

async function getLastTime(table){
  let localQuery = `SELECT updated_at as time FROM ${table}` +
               ' ORDER BY updated_at DESC LIMIT 1';

  let row = await query(localQuery);

  return row.rows[0];
}

async function getToTransfer(table){
  let localQuery = `SELECT * FROM ${table}` +
                   ' WHERE updated_at > ',
      lastTimeObject = { time: '' };

      lastTimeObject = await getLastTime(table);
  try {
    timeString = lastTimeObject.time.toString().replace(/GMT.*/,'');
    localQuery += `'${timeString}'`;
  } catch (err) {
    localQuery = `SELECT * FROM ${table}`;
  }

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

async function createInsert (columns, data, table, storeId = 0){
  let localQuery = `INSERT INTO public.${table}(id, `;
  localQuery += columns.shift();
  columns.forEach(fieldName => {
    localQuery += `, "${fieldName}"`;
  });
  let lastId = await query(`SELECT MAX(id) as id FROM ${table}`);
  recordId = (lastId.rows[0].id + 1);
  localQuery += ` VALUES ('${recordId}', '${data.shift()}'`;

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
          localQuery += `, '${data.toUTCString().replace(
          /GMT.*|/g,''
          )}'`;
        } else {
          localQuery += `, '${data}'`;
        }
    }
  });

  return {
    query   : `${localQuery})`,
    lastId  : recordId,
    table   : table,
    storeId : storeId
  };
}

async function findBy(column, data, table){
  let localQuery = `SELECT * FROM ${table} ` +
    `WHERE ${column}='${data}'`;
  return await query(`${localQuery}`);
}
