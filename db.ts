const { Pool } = require('pg')

export const pool = new Pool({
  host: process.env.DBHOST, // Postgres ip address or domain name
  port: 5432, // Postgres server port
  database: process.env.DBNAME, // Name of database to connect to
  user: process.env.DBUSER, // Username of database user
  password: process.env.DBPASS, // Password of database user
})

export const query = (text: string, params?: any[], callback?: () => void) => {
  return pool.query(text, params, callback)
}
