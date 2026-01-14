# Vending Machine Application - Setup & Usage Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment** (optional):
   ```bash
   cp .env.example .env
   ```

3. **Start the application**:
   ```bash
   # Start backend server
   npm run dev

   # In another terminal, start frontend
   npm run client
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Application Features

### User Interface
- **Product Display**: View available drinks with prices and stock
- **Payment System**: Insert money using denomination buttons ($0.25, $0.50, $1.00, $5.00, $10.00, $20.00)
- **Purchase Flow**: Select product → Insert money → Complete purchase → Receive change
- **Transaction Status**: Clear feedback for successful/failed transactions

### Admin Interface
- **Inventory Management**: Monitor all products and stock levels
- **Low Stock Alerts**: Visual warnings for items below threshold (3 units)
- **Restocking**: Add inventory to existing products
- **Sales Analytics**: View revenue, transaction count, and sales history
- **Product Management**: Add new products to the machine

## Default Products

The application comes pre-loaded with:
- Coca Cola - $1.50 (10 in stock)
- Water - $1.00 (5 in stock)
- Coffee - $2.00 (0 in stock - out of stock)
- Sprite - $1.25 (8 in stock)
- Orange Juice - $1.75 (3 in stock - low stock)

## API Usage Examples

### Get Available Products
```bash
curl http://localhost:3001/api/products
```

### Make a Purchase
```bash
curl -X POST http://localhost:3001/api/purchase \
  -H "Content-Type: application/json" \
  -d '{"productId": "1", "payment": 2.00}'
```

### Get Inventory (Admin)
```bash
curl http://localhost:3001/api/admin/inventory
```

### Restock Product (Admin)
```bash
curl -X POST http://localhost:3001/api/admin/restock \
  -H "Content-Type: application/json" \
  -d '{"productId": "1", "quantity": 5}'
```

## Architecture

```
Frontend (React) ←→ Backend (Express) ←→ Services (Inventory, Payment, Email)
     ↓                    ↓                         ↓
   Components         Controllers              Data Models
```

## Testing the Application

1. **User Flow**:
   - Select "Water" ($1.00)
   - Insert $1.00 or more
   - Click "Purchase"
   - Observe transaction success and change

2. **Admin Flow**:
   - Click "Switch to Admin Mode"
   - View low stock alert for "Orange Juice"
   - Restock "Coffee" (currently out of stock)
   - Switch back to user mode and verify Coffee is available

3. **Error Handling**:
   - Try purchasing with insufficient funds
   - Try purchasing an out-of-stock item
   - Test with invalid payment amounts

## Email Notifications

The application includes email service for low stock alerts:
- Configure email settings in `.env`
- Low stock alerts are sent when inventory drops below threshold
- Email service gracefully degrades if not configured

## Development

### Project Structure
```
vending-machine/
├── server/
│   ├── controllers/     # API endpoints
│   ├── models/         # Data structures
│   ├── services/       # Business logic
│   └── middleware/     # Validation & error handling
├── client/src/
│   ├── components/     # React components
│   └── services/       # API client
└── package.json
```

### Available Scripts
- `npm start` - Production server
- `npm run dev` - Development server with auto-reload
- `npm run client` - React development server
- `npm run build` - Build for production

The application is ready to use with mock data and full functionality!