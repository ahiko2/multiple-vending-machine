class Machine {
  constructor(totalRevenue = 0, totalTransactions = 0, inventory = [], lastRestocked = new Date()) {
    this.totalRevenue = totalRevenue;
    this.totalTransactions = totalTransactions;
    this.inventory = inventory;
    this.lastRestocked = lastRestocked;
  }

  static fromJSON(data) {
    return new Machine(
      data.totalRevenue,
      data.totalTransactions,
      data.inventory,
      new Date(data.lastRestocked)
    );
  }

  toJSON() {
    return {
      totalRevenue: this.totalRevenue,
      totalTransactions: this.totalTransactions,
      inventory: this.inventory,
      lastRestocked: this.lastRestocked.toISOString()
    };
  }

  addRevenue(amount) {
    this.totalRevenue += amount;
  }

  incrementTransactions() {
    this.totalTransactions++;
  }

  updateLastRestocked() {
    this.lastRestocked = new Date();
  }

  getLowStockItems(threshold = 3) {
    return this.inventory.filter(product => product.stock <= threshold);
  }

  getTotalInventoryValue() {
    return this.inventory.reduce((total, product) => total + (product.price * product.stock), 0);
  }
}

module.exports = Machine;