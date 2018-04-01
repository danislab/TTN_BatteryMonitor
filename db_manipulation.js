/*
const { Pool } = require('pg')

const pool = new Pool({
  host: '172.16.1.88',
  port: 5432,
  user: 'dani',
  password: 'SD4muell',
  database: 'ttn_database',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('CREATE TABLE IF NOT EXISTS raw_data(id SERIAL PRIMARY KEY, json_string VARCHAR(700) not null)');
  client.query('INSERT INTO raw_data (json_string) VALUES($1)', ['BBBB'], function( queryError, result ) {
    console.log('queried',queryError);
  });
})
*/
const pg_db = require('./db')
/*
pg_db.query('CREATE TABLE IF NOT EXISTS testtable(id SERIAL PRIMARY KEY, deviceid TEXT, counter INTEGER, time TIMESTAMPTZ, humidity REAL, temperature REAL)', (err, res) => {
  if (err) {
    return err
  }
});
*/
//pg_db.query('INSERT INTO testtable(deviceid, counter, time, humidity, temperature) VALUES($1, $2, $3, $4, $5)', ['battery002',5,'2018-03-30T17:04:39.156194462Z',10,27.1], (err, res) => { });

/*
pg_db.query('CREATE TABLE IF NOT EXISTS raw_data(id SERIAL PRIMARY KEY, json_string TEXT)', function( queryError, result ) {
  console.log('queried',queryError);
});

pg_db.query('INSERT INTO raw_data (json_string) VALUES($1)', ['BBBB'], function( queryError, result ) {
  console.log('queried',queryError);
});
*/
/*
pg_db.query('INSERT INTO raw_data (json_string) VALUES($1)', ['TESTTEST'], (err, res) => { });
pg_db.query('INSERT INTO measurements(deviceid, counter, time, humidity, temperature) VALUES($1, $2, $3, $4, $5)', ['battery001',1,'2018-03-30T17:04:35.156194462Z',100,25.1], (err, res) => { });
pg_db.query('INSERT INTO measurements(deviceid, counter, time, humidity, temperature) VALUES($1, $2, $3, $4, $5)', ['battery001',2,'2018-03-30T17:04:36.156194462Z',91,26.1], (err, res) => { });
pg_db.query('INSERT INTO measurements(deviceid, counter, time, humidity, temperature) VALUES($1, $2, $3, $4, $5)', ['battery001',3,'2018-03-30T17:04:37.156194462Z',78,25.1], (err, res) => { });
pg_db.query('INSERT INTO measurements(deviceid, counter, time, humidity, temperature) VALUES($1, $2, $3, $4, $5)', ['battery002',4,'2018-03-30T17:04:38.156194462Z',17,24.1], (err, res) => { });
pg_db.query('INSERT INTO measurements(deviceid, counter, time, humidity, temperature) VALUES($1, $2, $3, $4, $5)', ['battery002',5,'2018-03-30T17:04:39.156194462Z',10,27.1], (err, res) => { });
*/
//pg_db.query('SELECT * FROM measurements', (err, res) => { console.log('queried',res); });
/*
SELECT DISTINCT ON (deviceid)
 deviceid, counter, time
FROM
 measurements
ORDER BY
 deviceid;
 */

/*
var time = '2018-03-30T18:43:02.242987091Z';
console.log(time);
*/
pg_db.query('SELECT * FROM measurements', (err, res) => {
  //console.log('queried',res.rows);
  console.log(JSON.stringify(res.rows[1]))
});

/*
app.get('/:id', (req, res, next) => {
  db.query('INSERT INTO raw_data (json_string) VALUES($1)', ['BBBB'], function( queryError, result ) {
    console.log('queried',queryError);
  });
})
*/
