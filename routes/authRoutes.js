const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');

// Register ke liye validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name zaroori hai'),
  body('email').isEmail().withMessage('Sahi email daalo').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password kam se kam 6 characters ka ho'),
];

router.post('/register', registerValidation, registerUser);
router.post('/login', loginUser);

module.exports = router;