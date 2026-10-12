// API client service that interacts with the Node.js/Express backend,
// falling back smoothly to local state when backend is offline.

const API_BASE_URL = '/api';

export const api = {
  // Check backend server health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) throw new Error('API server unavailable');
      return await res.json();
    } catch (err) {
      return { status: 'offline', error: err.message };
    }
  },

  // Equipment List
  async getEquipment() {
    try {
      const res = await fetch(`${API_BASE_URL}/equipment`);
      if (!res.ok) throw new Error('Failed to fetch equipment');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API Client] Backend offline, using local store:', err.message);
      return null;
    }
  },

  // Add Equipment (Admin)
  async addEquipment(equipment) {
    try {
      const res = await fetch(`${API_BASE_URL}/equipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipment)
      });
      if (!res.ok) throw new Error('Failed to create equipment');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API Client] Backend offline, saving locally:', err.message);
      return null;
    }
  },

  // Fetch or generate QR Code
  async getQRCode(equipmentId) {
    try {
      const res = await fetch(`${API_BASE_URL}/equipment/${equipmentId}/qrcode`);
      if (!res.ok) throw new Error('Failed to generate QR code');
      return await res.json();
    } catch (err) {
      console.warn('[API Client] QR API fallback:', err.message);
      return null;
    }
  },

  // Borrowing Checkout (Student)
  async checkoutEquipment({ equipmentId, studentId, studentName }) {
    try {
      const res = await fetch(`${API_BASE_URL}/borrowings/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipmentId, studentId, studentName })
      });
      if (!res.ok) throw new Error('Failed to checkout equipment');
      return await res.json();
    } catch (err) {
      console.warn('[API Client] Checkout API offline, recording locally:', err.message);
      return null;
    }
  },

  // Return Equipment
  async returnEquipment(transactionId) {
    try {
      const res = await fetch(`${API_BASE_URL}/borrowings/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId })
      });
      if (!res.ok) throw new Error('Failed to return equipment');
      return await res.json();
    } catch (err) {
      console.warn('[API Client] Return API offline, updating locally:', err.message);
      return null;
    }
  },

  // Admin Request Actions (Approve/Reject)
  async handleRequestAction(requestId, action) {
    try {
      const res = await fetch(`${API_BASE_URL}/requests/${requestId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (!res.ok) throw new Error('Failed to update request');
      return await res.json();
    } catch (err) {
      console.warn('[API Client] Request action offline:', err.message);
      return null;
    }
  },

  // Admin Requests List
  async getRequests() {
    try {
      const res = await fetch(`${API_BASE_URL}/requests`);
      if (!res.ok) throw new Error('Failed to fetch requests');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API Client] Requests API fallback:', err.message);
      return null;
    }
  },

  // Admin Transactions List
  async getTransactions() {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API Client] Transactions API fallback:', err.message);
      return null;
    }
  },

  // Fetch Analytics & KPIs
  async getAnalytics() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return await res.json();
    } catch (err) {
      console.warn('[API Client] Analytics API offline:', err.message);
      return null;
    }
  }
};
