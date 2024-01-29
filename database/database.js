const mysql = require("mysql2")

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Moizarif1234",
    database: "cqi_fyp",
    port: "3306"
}).promise();


module.exports = pool;
