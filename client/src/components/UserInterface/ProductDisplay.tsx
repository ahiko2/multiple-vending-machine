import React from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface ProductDisplayProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ products, onSelectProduct }) => {
  return (
    <div className="product-display">
      <h2>Available Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <div 
            key={product.id} 
            className={`product-card ${product.stock === 0 ? 'out-of-stock' : ''}`}
            onClick={() => product.stock > 0 && onSelectProduct(product)}
          >
            <h3>{product.name}</h3>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="stock">Stock: {product.stock}</p>
            <p className="category">{product.category}</p>
            {product.stock === 0 && <p className="out-of-stock-label">Out of Stock</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDisplay;