const {Pool} = require('pg');
require('dotenv').config();

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

async function insert (columns, data, table, call){
  let localQuery = `INSERT INTO public.${table}(`,
      store;

  store = await initStore();
  localQuery += columns.shift();
  columns.forEach(fieldName => {
    localQuery += `, ${fieldName}`;
  });

  if ($.inArray(table, storeIdsTables) > -1) {
    localQuery += `, created_at, updated_at, store_id) VALUES ( '${data.shift()}'`;
  } else {
    localQuery += `, created_at, updated_at) VALUES ( '${data.shift()}'`;
  }

  data.forEach(data => {
    localQuery += `, '${data}'`;
  });
  let createDate = new Date(),
    updateDate = new Date();

  localQuery += `, '${createDate.toString().replace(' GMT-0600 (CST)','')}',`;
  localQuery += `'${updateDate.toString().replace(' GMT-0600 (CST)','')}'`;
  if ($.inArray(table, storeIdsTables) > -1) {
    let storeId = store.get('store').id;
    localQuery += `, '${storeId}'`;
  }
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
