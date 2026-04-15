const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL  // Railway provides this; ignores other keys if uri present
});

module.exports = pool;