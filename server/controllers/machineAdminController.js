const express = require('express');
const router = express.Router();
const inventoryService = require('../services/inventoryService');
const paymentService = require('../services/paymentService');
const { validateRestock, validateNewProduct } = require('../middleware/validation');

// Get inventory for a specific machine
router.get('/:machineId/inventory', (req, res) => {
  try {
    const { machineId } = req.params;
    const products = inventoryService.getProductsByMachine(machineId);
    const lowStockItems = inventoryService.getLowStockProductsByMachine(machineId);
    const machineStatus = inventoryService.getMachineStatus(machineId);
    
    res.json({
      products: products,
      lowStockItems: lowStockItems,
      machineStatus: machineStatus
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve inventory' });
  }
});

// Restock product in a specific machine
router.post('/:machineId/restock', validateRestock, (req, res) => {
  try {
    const { machineId } = req.params;
    const { productId, quantity } = req.body;

    const product = inventoryService.restockProductInMachine(machineId, productId, quantity);
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

// Add product to a specific machine
router.post('/:machineId/products', validateNewProduct, (req, res) => {
  try {
    const { machineId } = req.params;
    const { name, price, stock, category } = req.body;

    const newProduct = inventoryService.addNewProductToMachine(machineId, {
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

// Get sales report for a specific machine
router.get('/:machineId/reports', (req, res) => {
  try {
    const { machineId } = req.params;
    const { startDate, endDate } = req.query;
    
    const allTransactions = paymentService.getTransactionsByMachine(machineId);
    const machineStatus = inventoryService.getMachineStatus(machineId);
    
    let transactions = allTransactions;
    if (startDate && endDate) {
      transactions = paymentService.getTransactionsByDateRange(
        new Date(startDate),
        new Date(endDate)
      ).filter(t => t.machineId === machineId);
    }

    const totalRevenue = transactions.reduce((total, t) => total + t.amount, 0);
    const lowStockItems = inventoryService.getLowStockProductsByMachine(machineId);

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

// Get low stock items for a specific machine
router.get('/:machineId/low-stock', (req, res) => {
  try {
    const { machineId } = req.params;
    const threshold = req.query.threshold ? parseInt(req.query.threshold) : 3;
    const lowStockItems = inventoryService.getLowStockProductsByMachine(machineId, threshold);
    
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