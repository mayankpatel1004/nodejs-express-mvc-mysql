const { createPool } = require("mysql");

const pool = createPool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,
    connectionLimit: 10
});
//console.log(process.env.DB_PORT,"===",process.env.DB_HOST,"====",process.env.DB_USER,"====",process.env.DB_PASS,"====",process.env.MYSQL_DB);
// const pool = createPool({
//     port: 3306,
//     host: "localhost",
//     user: "admin",
//     password: "admin",
//     database: "node_js_jwt",
//     connectionLimit: 10
// });

module.exports = pool;