const {Pool, Client} = require('pg');
require('dotenv').config();

const remotePool = new Pool({
  user:'faviovelez',
  host: 'localhost',
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

const storeIdsTables = [
  "bill_receiveds",
  "bills",
  "cash_registers",
  "change_tickets",
  "deposits",
  "discount_rules",
  "estimate_docs",
  "expenses",
  "inventory_configurations",
  "movements",
  "orders",
  "payments",
  "products",
  "prospects",
  "requests",
  "return_tickets",
  "service_offereds",
  "services",
  "store_movements",
  "stores_inventories",
  "stores_suppliers",
  "stores_warehouse_entries",
  "suppliers",
  "terminals",
  "tickets",
  "users",
  "warehouses",
  "withdrawals",
  "billing_addresses",
  "tickets_children",
  'delivery_services'
];

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
          console.log(q);
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

async function query(q, remote = true, table = '', lastId = 0) {
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
      if (err.toString().indexOf('pkey') > -1){
        res = {
          err : true
        };
      } else {
        console.log('Database error!', err);
        console.log(q);
        return false;
      }
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

async function alterRunQuery(q, client, lastId, table){
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
        console.log('Database error!', err);
        console.log(q);
        return false;
      }
    }
  } finally {
    if (client.release)
      client.release(true);
  }
  if (lastId !== 0) {
    res.lastId = lastId;
  }
  res.table = table;
  return res;
}

async function alterQuery(q, lastId = 0, table = '') {
  let client = new Client({
    user: 'faviovelez',
    host: 'localhost',
    database: 'mosaiconepos',
    password: 'bafio44741',
    port: 5432,
  });

  client.on('error', function (err) {
    console.log('Database error!', err);
    console.log(q);
    return false;
  });
  await client.connect();

  let res = await alterRunQuery(q, client, lastId, table)
  await client.end();
  return res;
}

async function insertWebPosIds(table, posId, webId){
  let localQuery = `UPDATE ${table} SET web_id=${webId}, pos_id=${posId}`+
                    ` pos = true, web = true WHERE id = ${posId}`,
      remoteQuery = `UPDATE ${table} SET web_id=${webId}, pos_id=${posId}`+
                                      ` WHERE id = ${webId}`;
  await query(localQuery, false, table);
  return await query(remoteQuery);
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

async function insert (columns, data, table, extras = true, extraInfo = ''){
  let localQuery = `INSERT INTO public.${table}(`,
    store,
    extrasData = extras ? ', pos, web)' : ')',
    recordId;

  if ($.inArray(columns, 'id') === -1) {
    localQuery += 'id, ';
  }
  store = await initStore();
  localQuery += columns.shift();
  columns.forEach(fieldName => {
    localQuery += `, ${fieldName}`;
  });

  if ($.inArray(table, storeIdsTables) > -1) {
    localQuery += `, created_at, updated_at, store_id${extrasData}`;
  } else {
    localQuery += `, created_at, updated_at${extrasData}`;
  }

  if ($.inArray(columns, 'id') === -1) {
    let lastId   = await query(`SELECT MAX(id) as id FROM ${table}`);
    recordId = (lastId.rows[0].id + 1);
    localQuery += ` VALUES ('${recordId}', '${data.shift()}'`;
  } else {
    localQuery += ` VALUES ('${data.shift()}'`;
  }

  data.forEach(data => {
    localQuery += `, '${data}'`;
  });
  let createDate = new Date(),
    updateDate = new Date();

  localQuery += `, '${createDate.toString().replace(/GMT.*/,'')}',`;
  localQuery += `'${updateDate.toString().replace(/GMT.*/,'')}'`;
  if ($.inArray(table, storeIdsTables) > -1) {
    let storeId = store.get('store').id;
    localQuery += `, '${storeId}'`;
  }
  extrasData = extras ? ', true, false)' : ')';
  let queryResult = await query(`${localQuery}${extrasData}`, false, table, recordId);

  while (queryResult.err) {
    let newId = queryResult.lastId + 1;
    localQuery = localQuery.replace(queryResult.lastId, newId);
    queryResult = await query(`${localQuery}${extrasData}`, false, table, newId);
  }
  queryResult.extraInfo = extraInfo;
  return queryResult;
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

async function storeInvFindBy(product_id, store_id, table, remote = true, lastId = 0){
  let localQuery = `SELECT * FROM ${table} ` +
    `WHERE product_id = '${product_id}' AND store_id = '${store_id}'`;
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
