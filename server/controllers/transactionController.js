const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const inventoryService = require('../services/inventoryService');
const { validatePurchase } = require('../middleware/validation');

router.post('/', validatePurchase, (req, res) => {
  try {
    const { productId, payment } = req.body;

    if (!productId || !payment) {
      return res.status(400).json({ error: 'Product ID and payment amount are required' });
    }

    if (!paymentService.validatePayment(payment)) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }

    const product = inventoryService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.isAvailable()) {
      return res.status(400).json({ error: 'Product out of stock' });
    }

    if (payment < product.price) {
      return res.status(400).json({ error: 'Insufficient payment' });
    }

    const purchasedProduct = inventoryService.purchaseProduct(productId);
    if (!purchasedProduct) {
      return res.status(500).json({ error: 'Failed to process purchase' });
    }

    const transaction = paymentService.processPayment(productId, product.price, payment);
    inventoryService.updateMachineRevenue(product.price);

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

router.post('/refund', (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    const refund = paymentService.processRefund(transactionId);
    res.json({
      success: true,
      refund: refund
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;