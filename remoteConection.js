const {Pool, Client} = require('pg');
require('dotenv').config();

const remotePool = new Pool({
  user: 'ubuntu',
  host: '34.214.130.203',
  database: 'mosaicone',
  password: 'bafio44741',
  port: 5432,
});

const localPool = new Pool({
  user: 'faviovelez',
  host: 'localhost',
  database: 'mosaiconepos',
  password: 'bafio44741',
  port: 5432,
});

function runLocalQuery(q){
  return new Promise(function(resolve){
    let res;

    let client = new Client({
      user: 'faviovelez',
      host: 'localhost',
      database: 'mosaiconepos',
      password: 'bafio44741',
      port: 5432,
    });

    client.connect()
    .then(async function(){
      try {
        await client.query('BEGIN');
        try {
          res = await client.query(q);
          await client.query('COMMIT');
        } catch (err) {
          await client.query('ROLLBACK');
          console.log(err);
        }
      } finally {
        await client.end();
      }
      return resolve(res);
    })
    .catch(function(err){
      client.end();
      runLocalQuery(q);
      return resolve();
    });
  });
}

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

async function insertWebPosIds(table, posId, webId){
  let localQuery = `UPDATE ${table} SET web_id=${webId}, pos_id=${posId}`+
                    ` WHERE id = ${posId}`,
      remoteQuery = `UPDATE ${table} SET web_id=${webId}, pos_id=${posId}`+
                                      ` WHERE id = ${webId}`;
  await query(localQuery, false, table);
  return await query(remoteQuery);
}

async function getToTransfer(table){
  let localQuery = `SELECT * FROM ${table}` +
    ' WHERE web = false';

  if (table === 'tickets') {
    localQuery += ` AND ticket_type = 'venta' OR ticket_type = 'cancelado' OR ticket_type = 'pago'`
  }

  if (table === 'store_movements' || table === 'service_offereds' || table === 'payments'){
    let resultQuery = `SELECT ${table}.id FROM ${table} INNER JOIN ` +
    `tickets ON tickets.id = ${table}.ticket_id WHERE tickets.ticket_type = 'pending'`;
    let ids = await query(resultQuery, false, table);
    if (ids.rowCount > 0){
      localQuery += ` AND id NOT IN (${$.map(ids.rows, function(row){return row.id}).toString()})`;
    }
    return await query(localQuery, false, table);
  } else {
    return await query(localQuery, false, table);
  }
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
          try {
            localQuery += `, '${data.replace(/'/,'\\u0027')}'`;
          } catch (err) {
            localQuery += `, '${data}'`;
          }
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

async function updateBy(dataJson, table, condition){
  let localQuery = `UPDATE ${table} SET`;
  for(var column in dataJson) {
    localQuery += (column === 'group') ? ` "${column}" = ` : ` ${column} = `;

    let data = dataJson[column];
    switch(data){
      case null:
      case true:
      case false:
        localQuery += data;
        localQuery += ', '
        break;
      default:
        if (typeof data === 'object'){
          localQuery += `'${data.toUTCString()}', `;
        } else {
          try {
            localQuery += `'${data.replace(/'/,'\\u0027')}', `;
          } catch (err) {
            localQuery += `'${data}', `;
          }
        }
    }
  }
  localQuery = localQuery.replace(/, $/,'');
  localQuery += ` WHERE ${condition}`;
  return await query(localQuery, false);
}

async function getAll(table, columns = '*', condition = false, remote = false){
  let localQuery = `SELECT ${columns} FROM ${table}`;
  if (condition){
    localQuery += ` WHERE ${condition}`;
  }
  return await query(localQuery, remote);
}
