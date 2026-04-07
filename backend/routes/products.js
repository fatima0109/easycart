import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get all products (with optional category filter)
router.get('/', async (req, res) => {
  const filter = req.query.category ? { category: req.query.category } : {};
  const products = await Product.find(filter);
  res.json(products);
});

// Get single product
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
});

// Admin: create product
router.post('/', protect, admin, async (req, res) => {
  const product = new Product(req.body);
  const created = await product.save();
  res.status(201).json(created);
});

// Admin: update product
router.put('/:id', protect, admin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } else res.status(404).json({ message: 'Product not found' });
});

// Admin: delete product
router.delete('/:id', protect, admin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else res.status(404).json({ message: 'Product not found' });
});

export default router;