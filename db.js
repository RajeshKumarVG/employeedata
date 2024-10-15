const { Pool } = require('pg');

// Configure the PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres', // INPUT_REQUIRED {PostgreSQL database user}
  host: 'localhost',
  database: 'empdata', // INPUT_REQUIRED {PostgreSQL database name}
  password: 'postgres', // INPUT_REQUIRED {PostgreSQL database password}
  port: 5432, // Default PostgreSQL port
});

// Log connection success or failure
pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;