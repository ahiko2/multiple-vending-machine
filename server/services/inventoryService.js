const Product = require('../models/Product');
const Machine = require('../models/Machine');
const emailService = require('./emailService');

class InventoryService {
  constructor() {
    // Initialize multiple machines with different inventories
    this.machines = {
      'VM001': {
        products: [
          new Product('1', 'Coca Cola', 1.50, 10, 'soda'),
          new Product('2', 'Water', 1.00, 5, 'water'),
          new Product('3', 'Coffee', 2.00, 8, 'beverage'),
          new Product('4', 'Sprite', 1.25, 8, 'soda'),
          new Product('5', 'Orange Juice', 1.75, 3, 'juice')
        ],
        machine: new Machine(0, 0, [], new Date())
      },
      'VM002': {
        products: [
          new Product('1', 'Coca Cola', 1.50, 7, 'soda'),
          new Product('2', 'Water', 1.00, 2, 'water'),
          new Product('3', 'Coffee', 2.00, 0, 'beverage'),
          new Product('6', 'Energy Drink', 2.50, 5, 'beverage')
        ],
        machine: new Machine(0, 0, [], new Date())
      },
      'VM003': {
        products: [
          new Product('1', 'Coca Cola', 1.50, 12, 'soda'),
          new Product('2', 'Water', 1.00, 8, 'water'),
          new Product('4', 'Sprite', 1.25, 6, 'soda'),
          new Product('7', 'Lemonade', 1.75, 4, 'juice'),
          new Product('8', 'Iced Tea', 2.00, 3, 'beverage')
        ],
        machine: new Machine(0, 0, [], new Date())
      }
    };

    // Initialize machine inventories
    Object.keys(this.machines).forEach(machineId => {
      this.machines[machineId].machine.inventory = this.machines[machineId].products;
    });

    // Legacy support - default to VM001
    this.products = this.machines['VM001'].products;
    this.machine = this.machines['VM001'].machine;
  }

  getAllProducts() {
    return this.products;
  }

  getAvailableProducts() {
    return this.products.filter(product => product.isAvailable());
  }

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  purchaseProduct(productId) {
    const product = this.getProductById(productId);
    if (product && product.isAvailable()) {
      product.decrementStock();
      this.checkLowStockAlert();
      return product;
    }
    return null;
  }

  restockProduct(productId, quantity) {
    const product = this.getProductById(productId);
    if (product) {
      product.addStock(quantity);
      this.machine.updateLastRestocked();
      return product;
    }
    return null;
  }

  addNewProduct(productData) {
    const newProduct = new Product(
      this.generateProductId(),
      productData.name,
      productData.price,
      productData.stock,
      productData.category
    );
    this.products.push(newProduct);
    this.machine.inventory = this.products;
    return newProduct;
  }

  generateProductId() {
    return (this.products.length + 1).toString();
  }

  getLowStockProducts(threshold = 3) {
    return this.products.filter(product => product.stock <= threshold);
  }

  getMachineStatus() {
    return this.machine;
  }

  updateMachineRevenue(amount) {
    this.machine.addRevenue(amount);
    this.machine.incrementTransactions();
  }

  checkLowStockAlert() {
    const lowStockItems = this.getLowStockProducts();
    if (lowStockItems.length > 0) {
      emailService.sendLowStockAlert(lowStockItems).catch(error => {
        console.error('Failed to send low stock alert:', error);
      });
    }
  }

  // Machine-specific methods
  getProductsByMachine(machineId) {
    const machine = this.machines[machineId];
    if (!machine) {
      throw new Error(`Machine ${machineId} not found`);
    }
    return machine.products.filter(product => product.isAvailable());
  }

  getProductByIdAndMachine(machineId, productId) {
    const machine = this.machines[machineId];
    if (!machine) {
      throw new Error(`Machine ${machineId} not found`);
    }
    return machine.products.find(product => product.id === productId);
  }

  purchaseProductFromMachine(machineId, productId) {
    const machine = this.machines[machineId];
    if (!machine) {
      throw new Error(`Machine ${machineId} not found`);
    }
    
    const product = machine.products.find(p => p.id === productId);
    if (product && product.isAvailable()) {
      product.decrementStock();
      this.checkLowStockAlertForMachine(machineId);
      return product;
    }
    return null;
  }

  restockProductInMachine(machineId, productId, quantity) {
    const machine = this.machines[machineId];
    if (!machine) {
      throw new Error(`Machine ${machineId} not found`);
    }
    
    const product = machine.products.find(p => p.id === productId);
    if (product) {
      product.addStock(quantity);
      machine.machine.updateLastRestocked();
      return product;
    }
    return null;
  }

  addNewProductToMachine(machineId, productData) {
    const machine = this.machines[machineId];
    if (!machine) {
      throw new Error(`Machine ${machineId} not found`);
    }
    
    const newProduct = new Product(
      this.generateProductIdForMachine(machineId),
      productData.name,
      productData.price,
      productData.stock,
      productData.category
    );
    
    machine.products.push(newProduct);
    machine.machine.inventory = machine.products;
    return newProduct;
  }

  generateProductIdForMachine(machineId) {
    const machine = this.machines[machineId];
    const maxId = Math.max(...machine.products.map(p => parseInt(p.id)), 0);
    return (maxId + 1).toString();
  }

  getLowStockProductsByMachine(machineId, threshold = 3) {
    const machine = this.machines[machineId];
    if (!machine) {
      throw new Error(`Machine ${machineId} not found`);
    }
    return machine.products.filter(product => product.stock <= threshold);
  }

  getMachineStatus(machineId) {
    const machine = this.machines[machineId];
    if (!machine) {
      throw new Error(`Machine ${machineId} not found`);
    }
    return machine.machine;
  }

  updateMachineRevenue(machineId, amount) {
    const machine = this.machines[machineId];
    if (!machine) {
      throw new Error(`Machine ${machineId} not found`);
    }
    machine.machine.addRevenue(amount);
    machine.machine.incrementTransactions();
  }

  checkLowStockAlertForMachine(machineId) {
    const lowStockItems = this.getLowStockProductsByMachine(machineId);
    if (lowStockItems.length > 0) {
      emailService.sendLowStockAlert(lowStockItems, machineId).catch(error => {
        console.error(`Failed to send low stock alert for ${machineId}:`, error);
      });
    }
  }
}

module.exports = new InventoryService();