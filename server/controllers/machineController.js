const express = require('express');
const router = express.Router();
const inventoryService = require('../services/inventoryService');
const paymentService = require('../services/paymentService');
const { validatePurchase } = require('../middleware/validation');

// Get products for a specific machine
router.get('/:machineId/products', (req, res) => {
  try {
    const { machineId } = req.params;
    const products = inventoryService.getProductsByMachine(machineId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Purchase from a specific machine
router.post('/:machineId/purchase', validatePurchase, (req, res) => {
  try {
    const { machineId } = req.params;
    const { productId, payment } = req.body;

    const product = inventoryService.getProductByIdAndMachine(machineId, productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.isAvailable()) {
      return res.status(400).json({ error: 'Product out of stock' });
    }

    if (payment < product.price) {
      return res.status(400).json({ error: 'Insufficient payment' });
    }

    const purchasedProduct = inventoryService.purchaseProductFromMachine(machineId, productId);
    if (!purchasedProduct) {
      return res.status(500).json({ error: 'Failed to process purchase' });
    }

    const transaction = paymentService.processPayment(productId, product.price, payment, machineId);
    inventoryService.updateMachineRevenue(machineId, product.price);

    res.json({
      success: true,
      transaction: transaction,
      product: purchasedProduct,
      change: transaction.change
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;