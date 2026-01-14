const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productController = require('./controllers/productController');
const transactionController = require('./controllers/transactionController');
const adminController = require('./controllers/adminController');
const machineController = require('./controllers/machineController');
const machineAdminController = require('./controllers/machineAdminController');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Legacy routes (for backward compatibility)
app.use('/api/products', productController);
app.use('/api/purchase', transactionController);
app.use('/api/refund', transactionController);
app.use('/api/admin', adminController);

// New machine-specific routes
app.use('/api/machines', machineController);
app.use('/api/admin/machines', machineAdminController);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});