const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const config = require('../config');
const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRES = config.jwtExpires;

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 default: USER
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 user: { type: object }
 *                 token: { type: string }
 *       400:
 *         description: User already exists or validation error
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'USER' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = await User.create({ name, email, password, role });
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Returns JWT token. Use this token in Authorize for protected endpoints.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful, returns JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 user: { type: object }
 *                 token: { type: string }
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /validate-token:
 *   get:
 *     summary: Validate JWT token
 *     description: Validates token from Authorize. Click Authorize, paste your JWT, then Execute. No parameters needed.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [USER, ADMIN]
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Invalid, expired, or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 */
router.get('/validate-token', async (req, res) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token;
    }

    if (!token || typeof token !== 'string') {
      return res.status(401).json({
        valid: false,
        error: 'No token provided. Use Authorization: Bearer <token> header or ?token= query param',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select('name email role');
    if (!user) {
      return res.status(401).json({
        valid: false,
        error: 'User no longer exists',
      });
    }

    const expiresAt = decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null;

    res.json({
      valid: true,
      user: {
        userId: decoded.userId,
        name: user.name,
        email: decoded.email,
        role: decoded.role,
      },
      expiresAt,
    });
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Token has expired'
        : error.name === 'JsonWebTokenError'
          ? 'Invalid token signature'
          : 'Invalid or expired token';
    res.status(401).json({ valid: false, error: message });
  }
});

module.exports = router;
