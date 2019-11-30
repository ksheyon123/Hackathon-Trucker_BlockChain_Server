const mysql = require('mysql2/promise');

var dbConfig = {
    host: '127.0.0.1',
    port: 33306,
    user: 'root',
    password: '1234',
    database: 'trucker',
};

const pool = mysql.createPool(dbConfig);
module.exports = pool;
