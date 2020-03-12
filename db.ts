const postgres = require('postgres')

export default postgres({
  host: process.env.DBHOST, // Postgres ip address or domain name
  port: 5432, // Postgres server port
  database: process.env.DBNAME, // Name of database to connect to
  username: process.env.DBUSER, // Username of database user
  password: process.env.DBPASS, // Password of database user
  ssl: false, // True, or options for tls.connect
  max: 10, // Max number of connections
  timeout: 0, // Idle connection timeout in seconds
}) // will default to the same as psql
