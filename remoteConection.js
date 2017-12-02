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
      res.err = false;
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      if (err.toString().indexOf('pkey') > -1){
        res = {
          err : true
        };
      } else {
        throw err;
      }
    }
  } finally {
    client.release();
  }  if (lastId !== 0) {
    res.lastId = lastId;
  }
  res.table = table;
  return res;
}

async function insertInWeb(localQuery, table, storeId){
  let lastId   = await query(`SELECT MAX(id) as id FROM ${table}`);
  recordId = (lastId.rows[0].id + 1);

  localQuery = localQuery.replace(`${table}(`, `${table}(id, `);
  localQuery = localQuery.replace('VALUES (',`VALUES (${recordId}, `);

  let queryResult = await query(
    localQuery,
    true,
    table,
    recordId
  );

  while (queryResult.err) {
    let newId = queryResult.lastId + 1;
    localQuery = localQuery.replace(queryResult.lastId, newId);
    queryResult = await query(
      localQuery,
      true,
      table,
      newId
    );
  }

  queryResult.storeId = storeId;
  return queryResult;
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
  let localQuery = `INSERT INTO public.${table}(`;
  localQuery += columns.shift();
  columns.forEach(fieldName => {
    localQuery += `, "${fieldName}"`;
  });
  localQuery += `) VALUES ('${data.shift()}'`;

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
    storeId : storeId
  };
}

async function findByParameters(table, parameters, usedId, referenceId){
  let localQuery = `SELECT id FROM ${table} WHERE`,
      columns    = Object.keys(parameters),
      data       = Object.values(parameters);

  for (var column in parameters){
    let data = parameters[column];
    localQuery += ` ${column} = `;
    switch(data){
      case true:
      case false:
        localQuery += data;
        break;
      case null:
        localQuery = localQuery.replace(
          RegExp(` ${column} =`), ''
        );
        localQuery += ` ${column} IS NULL`;
        break;
      default:
        if (typeof data === 'object'){
          localQuery += `'${data.toUTCString().replace(
          /GMT.*|/g,''
          )}'`;
        } else {
          localQuery += `'${data}'`;
        }
    }
    localQuery += ' AND';
  }

  let result = await query(
    localQuery.replace(/AND$/, ''),
    true,
    table,
    usedId
  );

  return {
    objectResult : result,
    referenceId  : referenceId
  };
}

async function findBy(column, data, table, remote = true, usedId = 0, referenceId = 0){
  let localQuery = `SELECT * FROM ${table} ` +
    `WHERE ${column}='${data}'`;
  let result = await query(`${localQuery}`, remote, table, usedId);

  return {
    objectResult : result,
    referenceId  : referenceId
  };

}
