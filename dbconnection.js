const { Pool, Client } = require('pg')
require('dotenv').config();

const localPool = new Pool({
  user: 'faviovelez',
  host: 'localhost',
  database: 'mosaiconepos',
  password: 'bafio44741',
  port: 5432,
});

localPool.on('error', function (err) {
  console.log('Database error!', err);
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

async function initStore(){

  const store = new Store({
    configName: 'user-localStore',
    defaults: {
      windowBounds: { width: 1024, height: 768 }
    }
  });

  return store;
}

async function runQuery(q, client, lastId, table){
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

async function query(q, lastId = 0, table = '') {
  //let timmer = setInterval(async function(){
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

    let res = await runQuery(q, client, lastId, table)
    //clearInterval(timmer);
    await client.end();
    return res;
  //}, 2000);
  //let client = await localPool.connect();
  //let res = await runQuery(q, client, lastId, table)
  //clearInterval(timmer);
  //return res;
}

function integrateDataToQuery(data, localQuery, table, extras){
  return new Promise(function(resolve, reject){
    data.forEach(data => {
      switch(data){
        case null:
        case true:
        case false:
          localQuery += ', ';
          localQuery += data;
          break;
        default:
          localQuery += `, '${data}'`;
      }
    });
    let createDate = new Date(),
      updateDate = new Date();

    localQuery += `, '${createDate.toString().replace(/GMT.*/,'')}',`;
    localQuery += `'${updateDate.toString().replace(/GMT.*/,'')}'`;
    initStore().then(store => {
      if ($.inArray(table, storeIdsTables) > -1) {
        let storeId = store.get('store').id;
        localQuery += `, '${storeId}'`;
      }
      extrasData = extras ? ', true, false)' : ')';
      resolve(`${localQuery}${extrasData}`);
    });
  });
}

function getLastId(localQuery){
  return new Promise(function(resolve, reject){
    query(localQuery).then(queryResult => {
      resolve(queryResult);
    });
  })
}

async function validateValidId(queryResult, localQuery){
  while (queryResult.err){
    let newId = queryResult.lastId + 1;
    localQuery = localQuery.replace(queryResult.lastId, newId);
    queryResult = await query(localQuery, newId);
  }
  return queryResult;
}

function completeInsertProcess(localQuery, columns, table, data, extras){
  return new Promise(function(resolve, reject){
    if ($.inArray(columns, 'id') === -1) {
      getLastId(`SELECT MAX(id) as id FROM ${table}`).then(lastId => {
        recordId = (lastId.rows[0].id + 1);
        localQuery += ` VALUES ('${recordId}', '${data.shift()}'`;
        integrateDataToQuery(data, localQuery, table, extras).then(async dataString => {
          let queryResult = await query(dataString, recordId);
          resolve(await validateValidId(queryResult, dataString));
        });
      });
    } else {
      localQuery += ` VALUES ('${data.shift()}'`;
      integrateDataToQuery(data, localQuery, table, extras).then(async dataString => {
        let queryResult = await query(dataString, recordId);
        resolve(await validateValidId(queryResult, dataString));
      });
    }
  });
}

async function aLotInsert(columns, datas, table, extras = true){
  let Promise = require("bluebird");

  let storeMovQuery = `INSERT INTO public.${table}(`,
    store,
    extrasData = extras ? ', pos, web)' : ')',
    recordId;

  if ($.inArray(columns, 'id') === -1) {
    storeMovQuery += 'id, ';
  }

  let lastId = await query(`SELECT MAX(id) as id FROM ${table}`);
  store = await initStore();

  storeMovQuery += columns.shift();
  columns.forEach(fieldName => {
    storeMovQuery += `, ${fieldName}`;
  });

  if ($.inArray(table, storeIdsTables) > -1) {
    storeMovQuery += `, created_at, updated_at, store_id${extrasData}`;
  } else {
    storeMovQuery += `, created_at, updated_at${extrasData}`;
  }

  let countId = lastId.rows[0].id;
  Promise.each(datas, function(objectData){
    let data = Object.values(objectData);
    countId++;
    if (storeMovQuery.indexOf('VALUES') === -1) {
      storeMovQuery += ' VALUES ';
    }
    storeMovQuery += `('${countId}', '${data.shift()}'`;
    data.forEach(data => {
      storeMovQuery += `, '${data}'`;
    });
    let createDate = new Date(),
      updateDate = new Date();

    storeMovQuery += `, '${createDate.toString().replace(/GMT.*/,'')}',`;
    storeMovQuery += `'${updateDate.toString().replace(/GMT.*/,'')}'`;
    if ($.inArray(table, storeIdsTables) > -1) {
      let storeId = store.get('store').id;
      storeMovQuery += `, '${storeId}'`;
    }
    extrasData = extras ? ', true, false),' : '),';
    storeMovQuery += extrasData
  })
  .then(async function(){
    storeMovQuery = storeMovQuery.replace(/,$/,'');
    return await query(`${storeMovQuery}`, recordId);
  });

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
  let queryResult = await query(`${localQuery}${extrasData}`, recordId);

  while (queryResult.err) {
    let newId = queryResult.lastId + 1;
    localQuery = localQuery.replace(queryResult.lastId, newId);
    queryResult = await query(`${localQuery}${extrasData}`, newId);
  }
  queryResult.extraInfo = extraInfo;
  return queryResult;
}

async function findBy(column, data, table, lastId = 0, refTable = ''){
  let localQuery = `SELECT * FROM ${table} ` +
    `WHERE ${column}='${data}'`;
  return await query(`${localQuery}`, lastId, refTable);
}

async function specialFindBy(column, data, table){
  let specialQuery = `SELECT ${table}.* FROM (SELECT id, ticket_type, ` +
  "(date_trunc('day', created_at) + interval '1 day' " +
  "- interval '1 second' - interval '1 day') AS start_date, " +
  "(date_trunc('day', created_at) + interval '1 day') AS end_date " +
  `FROM tickets WHERE ${column} = ${data}) AS results_tickets ` +
  `INNER JOIN ${table} ON ${table}.ticket_id = results_tickets.id ` +
  `WHERE (${table}.created_at > results_tickets.start_date ` +
  `AND ${table}.created_at < results_tickets.end_date)`;
  return await query(specialQuery);
}

async function getOnly(table, ids){
  let localQuery = `SELECT * FROM ${table}` +
      ` WHERE id IN (${ids})`;

  result = await query(localQuery);
  return result.rows;
}

async function getAll(table, columns = '*', condition = false, lastId){
  let localQuery = `SELECT ${columns} FROM ${table}`;
  if (condition){
    localQuery += ` WHERE ${condition}`;
  }
  return await query(localQuery, lastId);
}

async function updateBy(data, table, condition){
  let localQuery = `UPDATE ${table} SET web = false, `;
  for(var column in data) {
    localQuery += ` ${column} = '${data[column]}',`;
  }
  localQuery = localQuery.replace(/,$/,'');
  localQuery += ` WHERE ${condition}`;
  return await query(localQuery);
}

async function deleteBy(table, condition) {
  let localQuery = `DELETE FROM ${table}` +
                   ` WHERE ${condition}`;
  return await query(localQuery);
}

async function newRegister(table){
  let localQuery = 'SELECT column_name FROM information_schema.columns' +
  " WHERE table_schema = 'public'" +
  `  AND table_name   = '${table}'`;
  let fields = await query(localQuery);
  let fieldsArray = fields.rows.map(field => {
    return field.column_name;
  });
  object = {};
  fieldsArray.forEach(field => {
    object[field] = '';
  });
  return object;
}
