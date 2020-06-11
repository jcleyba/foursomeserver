const { Pool } = require('pg')

export const { query } = new Pool({
  host: process.env.DBHOST, // Postgres ip address or domain name
  port: 5432, // Postgres server port
  database: process.env.DBNAME, // Name of database to connect to
  user: process.env.DBUSER, // Username of database user
  password: process.env.DBPASS, // Password of database user
})
