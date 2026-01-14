const express = require('express');
const router = express.Router();
const inventoryService = require('../services/inventoryService');
const paymentService = require('../services/paymentService');
const { validateRestock, validateNewProduct } = require('../middleware/validation');

router.get('/inventory', (req, res) => {
  try {
    const products = inventoryService.getAllProducts();
    const lowStockItems = inventoryService.getLowStockProducts();
    const machineStatus = inventoryService.getMachineStatus();
    
    res.json({
      products: products,
      lowStockItems: lowStockItems,
      machineStatus: machineStatus
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve inventory' });
  }
});

router.post('/restock', validateRestock, (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Product ID and valid quantity are required' });
    }

    const product = inventoryService.restockProduct(productId, quantity);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      product: product,
      message: `Successfully restocked ${quantity} units`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products', validateNewProduct, (req, res) => {
  try {
    const { name, price, stock, category } = req.body;

    if (!name || !price || stock === undefined || !category) {
      return res.status(400).json({ error: 'Name, price, stock, and category are required' });
    }

    if (price <= 0 || stock < 0) {
      return res.status(400).json({ error: 'Price must be positive and stock must be non-negative' });
    }

    const newProduct = inventoryService.addNewProduct({
      name,
      price,
      stock,
      category
    });

    res.json({
      success: true,
      product: newProduct,
      message: 'Product added successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reports', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const allTransactions = paymentService.getAllTransactions();
    const machineStatus = inventoryService.getMachineStatus();
    
    let transactions = allTransactions;
    if (startDate && endDate) {
      transactions = paymentService.getTransactionsByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
    }

    const totalRevenue = paymentService.getTotalRevenue();
    const lowStockItems = inventoryService.getLowStockProducts();

    res.json({
      transactions: transactions,
      totalRevenue: totalRevenue,
      totalTransactions: transactions.length,
      lowStockItems: lowStockItems,
      machineStatus: machineStatus
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate reports' });
  }
});

router.get('/low-stock', (req, res) => {
  try {
    const threshold = req.query.threshold ? parseInt(req.query.threshold) : 3;
    const lowStockItems = inventoryService.getLowStockProducts(threshold);
    
    res.json({
      lowStockItems: lowStockItems,
      threshold: threshold,
      alertRequired: lowStockItems.length > 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve low stock items' });
  }
});

module.exports = router;