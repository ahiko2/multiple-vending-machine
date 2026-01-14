## Simple Vending Machine App: System Design Sheet

### 1. **Overview**
A minimal vending machine system for testing, supporting basic user transactions (insert money, select drink, dispense, return/keep change) and operator features (stock monitoring, email alerts, add new drink types).

### 2. **Actors**
- **User:** Purchases drinks via the vending machine interface.
- **Operator:** Manages inventory, receives alerts, and adds new drink types.

### 3. **Core Features**

#### **User Functions**
- Insert money (input amount)
- Select drink (choose from available options)
- Dispense drink (system decrements stock)
- Return/keep change (system calculates and processes change)

#### **Operator Functions**
- Monitor machine (view current inventory)
- Receive low stock email alerts (when stock falls below threshold)
- Add new drink types to inventory
- Restock existing drinks
- View sales reports and revenue analytics

### 4. **System Architecture**
```
[User Interface] ↔ [Vending Machine Controller] ↔ [Payment Processor]
                                   ↓
                            [Inventory Manager] ↔ [Database]
                                   ↓
                            [Notification Service] → [Email Service]
```

### 5. **Data Models**

#### **Product**
```json
{
  "id": "string",
  "name": "string",
  "price": "number",
  "stock": "number",
  "category": "string"
}
```

#### **Transaction**
```json
{
  "id": "string",
  "productId": "string",
  "amount": "number",
  "payment": "number",
  "change": "number",
  "timestamp": "datetime"
}
```

#### **Machine Status**
```json
{
  "totalRevenue": "number",
  "totalTransactions": "number",
  "inventory": "Product[]",
  "lastRestocked": "datetime"
}
```

### 6. **User Stories**

#### **As a User:**
- I want to see available drinks and prices so I can make a selection
- I want to insert money and receive change so I can complete my purchase
- I want clear feedback when a drink is out of stock
- I want my money returned if the transaction fails

#### **As an Operator:**
- I want to receive alerts when inventory is low so I can restock
- I want to view sales reports to track performance
- I want to easily add new drink types to expand offerings
- I want to monitor machine status remotely

### 7. **API Endpoints**

#### **User Operations**
- `GET /api/products` - Get available products
- `POST /api/purchase` - Process purchase transaction
- `POST /api/refund` - Process refund request

#### **Operator Operations**
- `GET /api/admin/inventory` - Get current inventory
- `POST /api/admin/restock` - Restock products
- `POST /api/admin/products` - Add new product
- `GET /api/admin/reports` - Get sales reports

### 8. **Implementation Patterns**

#### **Frontend Structure**
```
src/
├── components/
│   ├── UserInterface/
│   │   ├── ProductDisplay.js
│   │   ├── PaymentInput.js
│   │   └── TransactionStatus.js
│   └── AdminPanel/
│       ├── InventoryView.js
│       ├── RestockForm.js
│       └── SalesReport.js
├── services/
│   ├── api.js
│   ├── payment.js
│   └── notifications.js
└── utils/
    ├── validation.js
    └── formatters.js
```

#### **Backend Structure**
```
server/
├── controllers/
│   ├── productController.js
│   ├── transactionController.js
│   └── adminController.js
├── models/
│   ├── Product.js
│   ├── Transaction.js
│   └── Machine.js
├── services/
│   ├── paymentService.js
│   ├── inventoryService.js
│   └── emailService.js
└── middleware/
    ├── auth.js
    └── validation.js
```

### 9. **Non-Functional Requirements**
- **Usability:** Simple, intuitive UI for both users and operators
- **Reliability:** 99.9% uptime for core transaction processing
- **Performance:** Response time < 2 seconds for all operations
- **Security:** Admin functions require authentication
- **Maintainability:** Modular code structure for easy updates
- **Scalability:** Support for multiple machine instances

### 10. **Testing Strategy**

#### **Unit Tests**
- Payment processing logic
- Inventory management functions
- Change calculation algorithms
- Email notification service

#### **Integration Tests**
- User purchase flow end-to-end
- Admin operations workflow
- Database transaction integrity
- API endpoint responses

#### **Mock Data**
```json
{
  "testProducts": [
    {"id": "1", "name": "Coca Cola", "price": 1.50, "stock": 10},
    {"id": "2", "name": "Water", "price": 1.00, "stock": 5},
    {"id": "3", "name": "Coffee", "price": 2.00, "stock": 0}
  ],
  "testPayments": [0.25, 0.50, 1.00, 5.00, 10.00, 20.00]
}
```

### 11. **Deployment Requirements**

#### **Environment Variables**
```bash
DATABASE_URL=mongodb://localhost:27017/vending # use json type since database is not ready yet
EMAIL_SERVICE_API_KEY=your_api_key #email is still regesiting so only did outline and todo
ADMIN_PASSWORD=secure_password
LOW_STOCK_THRESHOLD=3
```

#### **Dependencies**
- Node.js 16+
- MongoDB 4.4+
- Email service (SendGrid/Mailgun)
- Frontend framework (React/Vue)

### 12. **Error Handling**

#### **User Errors**
- Insufficient payment → Return money, display error
- Out of stock → Display message, suggest alternatives
- Invalid selection → Prompt for valid choice

#### **System Errors**
- Database connection failure → Graceful degradation
- Email service down → Log alerts, continue operations
- Payment processor error → Secure transaction rollback

### 13. **Security Considerations**
- Input validation for all user inputs
- SQL injection prevention
- Admin authentication with session management
- Secure storage of sensitive configuration
- Transaction logging for audit trails

This comprehensive design provides a robust foundation for your vending machine application with clear implementation guidelines and testing strategies.