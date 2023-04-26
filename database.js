require("dotenv").config();

const mysql = require("mysql2/promise");

const is_qoddi = process.env.IS_QODDI || false;

const dbConfigQoddi = {
  host: process.env.QODDI_HOST,
  user: process.env.QODDI_USER,
  password: process.env.QODDI_PASSWORD,
  database: process.env.QODDI_DATABASE,
  multipleStatements: false,
  namedPlaceholders: true,
};

const dbConfigLocal = {
  host: process.env.LOCAL_HOST,
  user: process.env.LOCAL_USER,
  password: process.env.LOCAL_PASSWORD,
  database: process.env.LOCAL_DATABASE,
  multipleStatements: false,
  namedPlaceholders: true,
};

if (is_qoddi) {
  var database = mysql.createPool(dbConfigQoddi);
} else {
  var database = mysql.createPool(dbConfigLocal);
}

module.exports = database;
