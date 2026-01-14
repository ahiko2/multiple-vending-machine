class Product {
  constructor(id, name, price, stock, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.category = category;
  }

  static fromJSON(data) {
    return new Product(data.id, data.name, data.price, data.stock, data.category);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      stock: this.stock,
      category: this.category
    };
  }

  isAvailable() {
    return this.stock > 0;
  }

  decrementStock() {
    if (this.stock > 0) {
      this.stock--;
      return true;
    }
    return false;
  }

  addStock(quantity) {
    this.stock += quantity;
  }
}

module.exports = Product;