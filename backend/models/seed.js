const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function seed() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role_id)
       VALUES ($1, $2, $3, 4)
       ON CONFLICT (email) DO NOTHING`,
      ['Admin User', 'admin@educore.com', hashedPassword]
    );

    console.log('✅ Seed data inserted — default admin created (admin@educore.com / admin123).');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    pool.end();
  }
}

seed();