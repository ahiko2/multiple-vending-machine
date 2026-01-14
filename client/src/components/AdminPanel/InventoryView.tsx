import React from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface InventoryViewProps {
  products: Product[];
  lowStockItems: Product[];
  onRestock: (productId: string, quantity: number) => void;
  machineId?: string;
}

const InventoryView: React.FC<InventoryViewProps> = ({ products, lowStockItems, onRestock }) => {
  const handleRestock = (productId: string) => {
    const quantity = prompt('Enter quantity to restock:');
    if (quantity && !isNaN(Number(quantity))) {
      onRestock(productId, parseInt(quantity));
    }
  };

  return (
    <div className="inventory-view">
      <h2>Inventory Management</h2>
      
      {lowStockItems.length > 0 && (
        <div className="low-stock-alert">
          <h3>⚠️ Low Stock Alert</h3>
          <ul>
            {lowStockItems.map(item => (
              <li key={item.id}>
                {item.name} - Only {item.stock} left
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className={product.stock <= 3 ? 'low-stock-row' : ''}>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>{product.category}</td>
                <td>
                  <button onClick={() => handleRestock(product.id)}>
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryView;