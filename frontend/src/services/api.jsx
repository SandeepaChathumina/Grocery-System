// API service for delivery management
const API_BASE = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

export const deliveryApi = {
  // Get all deliveries
  async getDeliveries() {
    const response = await fetch(`${API_BASE}/deliveries`);
    return handleResponse(response);
  },

  // Get single delivery
  async getDelivery(id) {
    const response = await fetch(`${API_BASE}/deliveries/${id}`);
    return handleResponse(response);
  },

  // Create new delivery
  async createDelivery(data) {
    const response = await fetch(`${API_BASE}/deliveries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Update delivery
  async updateDelivery(id, data) {
    const response = await fetch(`${API_BASE}/deliveries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Delete delivery
  async deleteDelivery(id) {
    const response = await fetch(`${API_BASE}/deliveries/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  // Update delivery status
  async updateStatus(id, status) {
    const response = await fetch(`${API_BASE}/deliveries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // Get deliveries by status
  async getDeliveriesByStatus(status) {
    const response = await fetch(`${API_BASE}/deliveries/status/${status}`);
    return handleResponse(response);
  }
};