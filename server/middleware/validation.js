const validatePurchase = (req, res, next) => {
  const { productId, payment } = req.body;
  
  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ error: 'Valid product ID is required' });
  }
  
  if (!payment || typeof payment !== 'number' || payment <= 0) {
    return res.status(400).json({ error: 'Valid payment amount is required' });
  }
  
  const isValidPayment = (amount) => {
    // Allow any combination of valid denominations
    // Round to 2 decimal places to handle floating point precision
    const rounded = Math.round(amount * 100) / 100;
    return rounded >= 0.25 && rounded % 0.25 === 0 && rounded <= 100;
  };
  
  if (!isValidPayment(payment)) {
    return res.status(400).json({ error: 'Invalid payment amount - must be combinations of valid denominations' });
  }
  
  next();
};

const validateRestock = (req, res, next) => {
  const { productId, quantity } = req.body;
  
  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ error: 'Valid product ID is required' });
  }
  
  if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ error: 'Valid quantity is required' });
  }
  
  if (quantity > 100) {
    return res.status(400).json({ error: 'Quantity cannot exceed 100' });
  }
  
  next();
};

const validateNewProduct = (req, res, next) => {
  const { name, price, stock, category } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Valid product name is required' });
  }
  
  if (!price || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Valid price is required' });
  }
  
  if (price > 50) {
    return res.status(400).json({ error: 'Price cannot exceed $50' });
  }
  
  if (stock === undefined || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: 'Valid stock quantity is required' });
  }
  
  if (stock > 100) {
    return res.status(400).json({ error: 'Stock cannot exceed 100' });
  }
  
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return res.status(400).json({ error: 'Valid category is required' });
  }
  
  next();
};

module.exports = {
  validatePurchase,
  validateRestock,
  validateNewProduct
};