const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003';

export const apiService = {
  async getProducts(machineId?: string) {
    const url = machineId 
      ? `${API_BASE_URL}/api/machines/${machineId}/products`
      : `${API_BASE_URL}/api/products`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async purchaseProduct(machineId: string, productId: string, payment: number) {
    const response = await fetch(`${API_BASE_URL}/api/machines/${machineId}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, payment }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Purchase failed');
    }
    
    return response.json();
  },

  async getInventory(machineId?: string) {
    const url = machineId 
      ? `${API_BASE_URL}/api/admin/machines/${machineId}/inventory`
      : `${API_BASE_URL}/api/admin/inventory`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch inventory');
    return response.json();
  },

  async restockProduct(machineId: string, productId: string, quantity: number) {
    const response = await fetch(`${API_BASE_URL}/api/admin/machines/${machineId}/restock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Restock failed');
    }
    
    return response.json();
  },

  async addProduct(machineId: string, productData: any) {
    const response = await fetch(`${API_BASE_URL}/api/admin/machines/${machineId}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add product');
    }
    
    return response.json();
  },

  async getSalesReport(machineId?: string) {
    const url = machineId 
      ? `${API_BASE_URL}/api/admin/machines/${machineId}/reports`
      : `${API_BASE_URL}/api/admin/reports`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch sales report');
    return response.json();
  },

  async getLowStockItems(machineId?: string, threshold: number = 3) {
    const url = machineId 
      ? `${API_BASE_URL}/api/admin/machines/${machineId}/low-stock?threshold=${threshold}`
      : `${API_BASE_URL}/api/admin/low-stock?threshold=${threshold}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch low stock items');
    return response.json();
  }
};