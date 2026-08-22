const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { validationResult } = require('express-validator');

// Register User
const registerUser = async (req, res) => {
  try {

    const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
  const { name, email, password, role_id } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email aur password zaroori hain' });
    }
    

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email',
[name, email, hashedPassword, role_id]
    );

    res.status(201).json({ message: 'User register ho gaya', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Kuch masla hua', error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'User nahi mila' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Password galat hai' });
    }

    res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.full_name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Kuch masla hua', error: error.message });
  }
};

module.exports = { registerUser, loginUser };