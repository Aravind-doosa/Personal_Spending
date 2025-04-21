const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Personal_Spending',
    password: 'Aravind@1',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};