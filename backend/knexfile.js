require('dotenv').config()
const fs = require('fs')
const path = require('path')

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const mysqlConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.DEV ? process.env.SQL_DEV_HOST : process.env.SQL_HOST,
    user: process.env.DEV ? process.env.SQL_DEV_USER : process.env.SQL_USER,
    password: process.env.DEV ? process.env.SQL_DEV_PASS : process.env.SQL_PASS,
    database: process.env.DEV ? process.env.SQL_DEV_DB : process.env.SQL_DB,
    ssl: process.env.DEV
      ? undefined
      : {
          ca: fs.readFileSync(path.join(__dirname, 'mysql_ca_cert.pem')),
        },
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
}

const mssqlConfig = {
  client: 'mssql',
  connection: {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB,
    options: { encrypt: true },
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
}

module.exports = mysqlConfig
