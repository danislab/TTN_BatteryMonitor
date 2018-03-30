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

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res.rowCount })
      callback(err, res)
    })
  }
}
