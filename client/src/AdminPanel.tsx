import React, { useState, useEffect } from 'react';
import InventoryView from './components/AdminPanel/InventoryView';
import SalesReport from './components/AdminPanel/SalesReport';
import { apiService } from './services/api';
import './AdminPanel.css';

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
}

interface MachineStatus {
  id: string;
  isOnline: boolean;
  lastSeen: string;
  temperature: number;
  cashLevel: number;
}

const AdminPanel: React.FC = () => {
  const [machines, setMachines] = useState<string[]>(['VM001', 'VM002', 'VM003']);
  const [selectedMachine, setSelectedMachine] = useState<string>('VM001');
  const [machineStatuses, setMachineStatuses] = useState<Record<string, MachineStatus>>({
    'VM001': { id: 'VM001', isOnline: true, lastSeen: new Date().toISOString(), temperature: 4.2, cashLevel: 350 },
    'VM002': { id: 'VM002', isOnline: false, lastSeen: new Date(Date.now() - 3600000).toISOString(), temperature: 5.1, cashLevel: 120 },
    'VM003': { id: 'VM003', isOnline: true, lastSeen: new Date().toISOString(), temperature: 3.8, cashLevel: 280 }
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [salesData, setSalesData] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  useEffect(() => {
    loadAdminData();
  }, [selectedMachine]);

  const loadAdminData = async () => {
    try {
      const [inventoryData, salesData] = await Promise.all([
        apiService.getInventory(selectedMachine),
        apiService.getSalesReport(selectedMachine)
      ]);
      setProducts(inventoryData.products);
      setLowStockItems(inventoryData.lowStockItems);
      setSalesData(salesData);
    } catch (error) {
      setStatusMessage({
        message: 'Failed to load admin data',
        type: 'error'
      });
    }
  };

  const handleRestock = async (productId: string, quantity: number) => {
    try {
      await apiService.restockProduct(selectedMachine, productId, quantity);
      setStatusMessage({
        message: `Successfully restocked ${quantity} units!`,
        type: 'success'
      });
      loadAdminData();
    } catch (error: any) {
      setStatusMessage({
        message: error.message,
        type: 'error'
      });
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      await apiService.addProduct(selectedMachine, productData);
      setStatusMessage({
        message: 'Product added successfully!',
        type: 'success'
      });
      loadAdminData();
    } catch (error: any) {
      setStatusMessage({
        message: error.message,
        type: 'error'
      });
    }
  };

  const handleToggleMachine = async (machineId: string, turnOn: boolean) => {
    try {
      // Simulate API call
      setMachineStatuses(prev => ({
        ...prev,
        [machineId]: {
          ...prev[machineId],
          isOnline: turnOn,
          lastSeen: new Date().toISOString()
        }
      }));
      setStatusMessage({
        message: `Machine ${machineId} ${turnOn ? 'turned ON' : 'turned OFF'} successfully!`,
        type: 'success'
      });
    } catch (error: any) {
      setStatusMessage({
        message: error.message,
        type: 'error'
      });
    }
  };

  const handleEmergencyStop = async (machineId: string) => {
    try {
      setMachineStatuses(prev => ({
        ...prev,
        [machineId]: {
          ...prev[machineId],
          isOnline: false,
          lastSeen: new Date().toISOString()
        }
      }));
      setStatusMessage({
        message: `Emergency stop activated for machine ${machineId}!`,
        type: 'error'
      });
    } catch (error: any) {
      setStatusMessage({
        message: error.message,
        type: 'error'
      });
    }
  };

  const currentMachineStatus = machineStatuses[selectedMachine];

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>🔧 Vending Machine Admin Panel</h1>
        <div className="machine-selector">
          <label htmlFor="machine-select">Select Machine:</label>
          <select 
            id="machine-select"
            value={selectedMachine} 
            onChange={(e) => setSelectedMachine(e.target.value)}
          >
            {machines.map(machineId => (
              <option key={machineId} value={machineId}>
                {machineId} {machineStatuses[machineId]?.isOnline ? '🟢' : '🔴'}
              </option>
            ))}
          </select>
        </div>
        
        <div className="machine-controls">
          <div className="machine-status">
            <span>Status:</span>
            <div className={`status-dot ${currentMachineStatus?.isOnline ? 'online' : 'offline'}`}></div>
            <span>{currentMachineStatus?.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
          
          <button 
            className="control-button turn-on"
            onClick={() => handleToggleMachine(selectedMachine, true)}
            disabled={currentMachineStatus?.isOnline}
          >
            Turn ON
          </button>
          
          <button 
            className="control-button turn-off"
            onClick={() => handleToggleMachine(selectedMachine, false)}
            disabled={!currentMachineStatus?.isOnline}
          >
            Turn OFF
          </button>
          
          <button 
            className="control-button emergency"
            onClick={() => handleEmergencyStop(selectedMachine)}
          >
            🚨 EMERGENCY STOP
          </button>
          
          <div className="machine-info">
            <small>
              Temp: {currentMachineStatus?.temperature}°C | 
              Cash: ${currentMachineStatus?.cashLevel} | 
              Last seen: {new Date(currentMachineStatus?.lastSeen || '').toLocaleTimeString()}
            </small>
          </div>
        </div>
      </header>

      {statusMessage && (
        <div className={`admin-alert ${statusMessage.type}`}>
          <p>{statusMessage.message}</p>
          <button onClick={() => setStatusMessage(null)}>×</button>
        </div>
      )}

      <main className="admin-main">
        <div className="admin-section">
          <InventoryView
            products={products}
            lowStockItems={lowStockItems}
            onRestock={handleRestock}
            machineId={selectedMachine}
          />
        </div>

        <div className="admin-section">
          {salesData && (
            <SalesReport
              transactions={salesData.transactions}
              totalRevenue={salesData.totalRevenue}
              totalTransactions={salesData.totalTransactions}
              machineId={selectedMachine}
            />
          )}
        </div>

        <div className="admin-section">
          <div className="add-product-form">
            <h3>Add New Product</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleAddProduct({
                name: formData.get('name'),
                price: parseFloat(formData.get('price') as string),
                stock: parseInt(formData.get('stock') as string),
                category: formData.get('category')
              });
              (e.target as HTMLFormElement).reset();
            }}>
              <input name="name" placeholder="Product name" required />
              <input name="price" type="number" step="0.01" placeholder="Price" required />
              <input name="stock" type="number" placeholder="Initial stock" required />
              <input name="category" placeholder="Category" required />
              <button type="submit">Add Product</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;