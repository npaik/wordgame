// database.js

const mysql = require("mysql2/promise");

const is_qoddi = process.env.IS_QODDI || false;

const dbConfigQoddi = {
  host: "sql.freedb.tech",
  user: "freedb_npaik",
  password: "C?SmMr$E4aUgH$X",
  database: "freedb_freedb_comp2350_A00567207",
  multipleStatements: false,
  namedPlaceholders: true,
};

const dbConfigLocal = {
  host: "localhost",
  user: "root",
  password: "skrgus84",
  database: "wordgame",
  multipleStatements: false,
  namedPlaceholders: true,
};

if (is_qoddi) {
  var database = mysql.createPool(dbConfigQoddi);
} else {
  var database = mysql.createPool(dbConfigLocal);
}

module.exports = database;
