const {Pool} = require('pg');
require('dotenv').config();

const remotePool = new Pool({
  user: process.env.DB_REMOTE_USER,
  host: process.env.DB_REMOTE_HOST,
  database: process.env.DB_REMOTE_DB,
  password: process.env.DB_REMOTE_PASS,
  port: 5432,
});

const localPool = new Pool({
  user: process.env.DB_LOCAL_USER,
  host: process.env.DB_LOCAL_HOST,
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

async function toWebDatabase(){
  let rows,
    tablesListQuery = "SELECT table_name" +
    " FROM information_schema.tables" +
    " WHERE table_schema='public'" +
    " AND table_type='BASE TABLE'";
      tablesList = await query(tablesListQuery, false);
  tablesList.rows.forEach(async table => {

    try {

      let rows = await toDayRows(table.table_name);
      rows.rows.forEach(async register => {

        delete register.id;
        let insertQuery = await createInsert(
          Object.keys(register),
          Object.values(register),
          table.table_name
        );

        try {
          await query(insertQuery);
        } catch (err) {
          console.log(table);
        }

      });

    } catch(err) {
      console.log(table);
    }


  });
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

async function findBy(column, data, table){
  let localQuery = `SELECT * FROM ${table} ` +
    `WHERE ${column}='${data}'`;
  return await query(`${localQuery}`);
}
