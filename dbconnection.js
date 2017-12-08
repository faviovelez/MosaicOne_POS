const {Pool} = require('pg');
require('dotenv').config();

const localPool = new Pool({
  user: 'oscar',
  host: 'localhost',
  database: 'local_db',
  password: '12345678"',
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
  "withdrawals"
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

async function query (q, lastId = 0, table = '') {
  const client = await localPool.connect();
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
  }
  if (lastId !== 0) {
    res.lastId = lastId;
  }
  res.table = table;
  return res;
}

async function insert (columns, data, table, extras = true){
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

  return queryResult;
}

async function findBy(column, data, table, lastId = 0, refTable = ''){
  let localQuery = `SELECT * FROM ${table} ` +
    `WHERE ${column}='${data}'`;
  return await query(`${localQuery}`, lastId, refTable);
}

async function getOnly(table, ids){
  let localQuery = `SELECT * FROM ${table}` +
      ` WHERE id IN (${ids})`;

  result = await query(localQuery);
  return result.rows;
}

async function getAll(table, columns = '*', condition = false){
  let localQuery = `SELECT ${columns} FROM ${table}`;
  if (condition){
    localQuery += ` WHERE ${condition}`;
  }
  return await query(localQuery);
}

async function updateBy(data, table, condition){
  let localQuery = `UPDATE ${table} SET`;
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
