const {Pool} = require('pg');

const localPool = new Pool({
  user: 'oscar',
  host: 'localhost',
  database: 'local_db',
  password: '12345678',
  port: 5432,
});

const remotePool = new Pool({
  user: 'faviovelez',
  host: 'localhost',
  database: 'mosaicone007_development',
  password: 'bafio44741',
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
  localQuery += `) VALUES ( '${data.shift()}'`;
  data.forEach(data => {
    localQuery += `, '${data}'`;
  });
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
