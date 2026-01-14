const Transaction = require('../models/Transaction');

class PaymentService {
  constructor() {
    this.transactions = [];
  }

  processPayment(productId, productPrice, paymentAmount, machineId = null) {
    if (paymentAmount < productPrice) {
      throw new Error('Insufficient payment');
    }

    const change = Transaction.calculateChange(paymentAmount, productPrice);
    const transaction = new Transaction(
      Transaction.generateId(),
      productId,
      productPrice,
      paymentAmount,
      change
    );

    // Add machine ID to transaction
    if (machineId) {
      transaction.machineId = machineId;
    }

    this.transactions.push(transaction);
    return transaction;
  }

  processRefund(transactionId) {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return {
      refundAmount: transaction.payment,
      originalTransaction: transaction
    };
  }

  getAllTransactions() {
    return this.transactions;
  }

  getTransactionById(id) {
    return this.transactions.find(t => t.id === id);
  }

  getTotalRevenue() {
    return this.transactions.reduce((total, transaction) => total + transaction.amount, 0);
  }

  getTransactionsByDateRange(startDate, endDate) {
    return this.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.timestamp);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  validatePayment(amount) {
    const validAmounts = [0.25, 0.50, 1.00, 5.00, 10.00, 20.00];
    return validAmounts.includes(amount);
  }

  getTransactionsByMachine(machineId) {
    return this.transactions.filter(t => t.machineId === machineId);
  }
}

module.exports = new PaymentService();