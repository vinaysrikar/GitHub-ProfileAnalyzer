import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'github_analyzer',
    waitForConnections: true,
    connectionLimit: 10,
});

export default pool.promise();