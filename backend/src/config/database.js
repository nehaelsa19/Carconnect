const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', err => {
  console.error('❌ Unexpected error on idle client', err.message);
  // Don't exit - server keeps running; next query will try again or fail then
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
