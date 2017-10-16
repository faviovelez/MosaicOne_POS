const {Pool} = require('pg');

const localPool = new Pool({
  user: 'oscar',
  host: 'localhost',
  database: 'local_db',
  password: '12345678',
  port: 5432,
});

const remotePool = new Pool({
  user: 'oscar',
  host: 'localhost',
  database: 'mosaicone007_development',
  password: '12345678',
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
