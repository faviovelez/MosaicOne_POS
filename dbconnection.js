const {Pool} = require('pg');

const localPool = new Pool({
  user: 'faviovelez',
  host: 'localhost',
  database: 'mosaicOnePOS_000',
  password: 'bafio44741',
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
  let localQuery = `SELECT * FROM ${table} WHERE ${column}='${data}'`;
  return await query(`${localQuery}`);
}
