const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { registerValidation } = require('../validations');
const db = require('../db');
const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (userId) => {
  const payload = { userId };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
};

const registerUser = async (req, res) => {
  try {
	await Promise.all(registerValidation.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
	}

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createUser(username, hashedPassword);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const authToken = generateToken(user.id);

    res.status(200).json({ token: authToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to login' });
  }
};

module.exports = { registerUser, loginUser };
