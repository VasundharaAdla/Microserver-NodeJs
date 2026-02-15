const express = require('express');
const Product = require('../models/Product');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (auth required)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Unauthorized
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const createdBy = req.userId;

    const { name, description, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const product = await Product.create({ name, description: description || '', price, createdBy });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products (public)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID (public)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product (auth required)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', requireAuth, async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { name, description, price } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;

    await product.save();
    res.json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product (ADMIN role only)
 *     description: Only users with ADMIN role can delete products. Role is fetched from JWT or X-User-Role header.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *       403:
 *         description: Admin access required
 */
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', product });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
