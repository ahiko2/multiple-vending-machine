import React, { useState, useEffect } from 'react';
import ProductDisplay from './components/UserInterface/ProductDisplay';
import PaymentInput from './components/UserInterface/PaymentInput';
import TransactionStatus from './components/UserInterface/TransactionStatus';
import { apiService } from './services/api';
import './VendingMachine.css';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface StatusMessage {
  message: string;
  type: 'success' | 'error' | 'info';
  change?: number;
}

interface VendingMachineProps {
  machineId: string;
}

const VendingMachine: React.FC<VendingMachineProps> = ({ machineId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [machineInfo, setMachineInfo] = useState<any>(null);

  useEffect(() => {
    loadProducts();
    checkMachineStatus();
  }, [machineId]);

  const checkMachineStatus = () => {
    // Simulate machine status check
    const mockStatuses: Record<string, boolean> = {
      'VM001': true,
      'VM002': false, // This machine is offline
      'VM003': true
    };
    setIsOnline(mockStatuses[machineId] ?? true);
  };

  const loadProducts = async () => {
    try {
      if (!isOnline) return;
      const data = await apiService.getProducts(machineId);
      setProducts(data);
    } catch (error) {
      setStatusMessage({
        message: 'Failed to load products. Please try again.',
        type: 'error'
      });
    }
  };

  const handleSelectProduct = (product: Product) => {
    if (product.stock > 0) {
      setSelectedProduct(product);
    } else {
      setStatusMessage({
        message: `${product.name} is out of stock. Please select another item.`,
        type: 'error'
      });
    }
  };

  const handlePayment = async (amount: number) => {
    if (!selectedProduct) return;

    try {
      const result = await apiService.purchaseProduct(machineId, selectedProduct.id, amount);
      setStatusMessage({
        message: `Successfully purchased ${selectedProduct.name}!`,
        type: 'success',
        change: result.change
      });
      setSelectedProduct(null);
      loadProducts();
    } catch (error: any) {
      setStatusMessage({
        message: error.message,
        type: 'error'
      });
    }
  };

  const handleCancel = () => {
    setSelectedProduct(null);
  };

  const handleCloseStatus = () => {
    setStatusMessage(null);
  };

  if (!isOnline) {
    return (
      <div className="vending-machine offline">
        <header className="vending-machine-header">
          <h1>Vending Machine</h1>
          <p className="machine-id">
            Machine ID: {machineId}
            <span className="status-indicator offline"></span>
          </p>
        </header>
        <div className="offline-message">
          <h2>⚠️ Machine Offline</h2>
          <p>This vending machine is currently offline for maintenance.</p>
          <p>Please try another machine or contact support.</p>
          <small>Machine ID: {machineId}</small>
        </div>
      </div>
    );
  }

  return (
    <div className="vending-machine">
      <header className="vending-machine-header">
        <h1>Vending Machine</h1>
        <p className="machine-id">
          Machine ID: {machineId}
          <span className="status-indicator online"></span>
        </p>
      </header>

      <main className="vending-machine-main">
        {statusMessage && (
          <TransactionStatus
            message={statusMessage.message}
            type={statusMessage.type}
            change={statusMessage.change}
            onClose={handleCloseStatus}
          />
        )}

        {!selectedProduct ? (
          <ProductDisplay
            products={products}
            onSelectProduct={handleSelectProduct}
          />
        ) : (
          <PaymentInput
            selectedProduct={selectedProduct}
            onPayment={handlePayment}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  );
};

export default VendingMachine;