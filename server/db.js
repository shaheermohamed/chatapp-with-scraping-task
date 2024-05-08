const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  database: "chatapp",
  host: "localhost",
  password: "12345",
  user: "postgres",
  port: "5432",
  //  database: process.env.DATABASE_NAME,
  //  host: process.env.DATABASE_HOST,
  //  password: process.env.DATABASE_PASSWORD,
  //  user: process.env.DATABASE_USER,
  //  port: process.env.DATABASE_PORT
});

module.exports = pool;
