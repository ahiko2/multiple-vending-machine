class Transaction {
  constructor(id, productId, amount, payment, change, timestamp = new Date()) {
    this.id = id;
    this.productId = productId;
    this.amount = amount;
    this.payment = payment;
    this.change = change;
    this.timestamp = timestamp;
  }

  static fromJSON(data) {
    return new Transaction(
      data.id,
      data.productId,
      data.amount,
      data.payment,
      data.change,
      new Date(data.timestamp)
    );
  }

  toJSON() {
    return {
      id: this.id,
      productId: this.productId,
      amount: this.amount,
      payment: this.payment,
      change: this.change,
      timestamp: this.timestamp.toISOString()
    };
  }

  static calculateChange(payment, price) {
    return payment - price;
  }

  static generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = Transaction;