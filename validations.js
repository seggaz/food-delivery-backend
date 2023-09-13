const { body } = require('express-validator');

module.exports.loginValidation = [
  body('username', 'Invalid email format').isEmail(),
  body('password', 'Password is required').notEmpty(),
];

module.exports.registerValidation = [
  body('username', 'Invalid email format').isEmail(),
  body('password', 'Password is required and should be at least 5 characters long').isLength({ min: 5 }),
];

