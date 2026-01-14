const express = require('express');
const router = express.Router();
const inventoryService = require('../services/inventoryService');

router.get('/', (req, res) => {
  try {
    const products = inventoryService.getAvailableProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

router.get('/all', (req, res) => {
  try {
    const products = inventoryService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve all products' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const product = inventoryService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

module.exports = router;