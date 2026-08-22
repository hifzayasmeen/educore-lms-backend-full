// Ye file PostgreSQL se connection banati hai
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER?.trim(),
  password: process.env.DB_PASSWORD?.trim(),
  host: process.env.DB_HOST?.trim(),
  port: process.env.DB_PORT?.trim(),
  database: process.env.DB_NAME?.trim(),
  ssl: {
    rejectUnauthorized: false
  }
});

// Test karo connection chal raha hai ya nahi
pool.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully');
  }
});

module.exports = pool;