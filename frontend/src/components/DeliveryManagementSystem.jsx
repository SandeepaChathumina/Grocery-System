import React, { useState, useEffect } from 'react';
import { Plus, Package, Search, Filter, RefreshCw } from 'lucide-react';
import { deliveryApi } from '../services/api';
import DeliveryForm from './DeliveryForm';
import DeliveryCard from './DeliveryCard';
import DeliveryDetails from './DeliveryDetails';

const DeliveryManagementSystem = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [viewDelivery, setViewDelivery] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await deliveryApi.getDeliveries();
      setDeliveries(data);
    } catch (error) {
      console.error('Error loading deliveries:', error);
      setError('Failed to load deliveries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (deliveryData) => {
    try {
      if (selectedDelivery) {
        await deliveryApi.updateDelivery(selectedDelivery._id, deliveryData);
      } else {
        await deliveryApi.createDelivery(deliveryData);
      }
      await loadDeliveries();
      setShowForm(false);
      setSelectedDelivery(null);
      setError(null);
    } catch (error) {
      console.error('Error saving delivery:', error);
      setError('Failed to save delivery. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      try {
        await deliveryApi.deleteDelivery(id);
        await loadDeliveries();
        setError(null);
      } catch (error) {
        console.error('Error deleting delivery:', error);
        setError('Failed to delete delivery. Please try again.');
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await deliveryApi.updateStatus(id, status);
      await loadDeliveries();
      setError(null);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update delivery status. Please try again.');
    }
  };

  // Filter and search deliveries
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesStatus = !filterStatus || delivery.deliveryStatus === filterStatus;
    const matchesSearch = !searchTerm || 
      delivery.deliveryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer.phone.includes(searchTerm) ||
      delivery.route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.route.to.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: deliveries.length,
    pending: deliveries.filter(d => d.deliveryStatus === 'Pending').length,
    confirmed: deliveries.filter(d => d.deliveryStatus === 'Confirmed').length,
    completed: deliveries.filter(d => d.deliveryStatus === 'Completed').length,
    cancelled: deliveries.filter(d => d.deliveryStatus === 'Cancelled').length,
    totalRevenue: deliveries
      .filter(d => d.paymentStatus === 'Paid')
      .reduce((sum, d) => sum + d.totalAmount, 0),
    pendingPayments: deliveries
      .filter(d => d.paymentStatus === 'Pending')
      .reduce((sum, d) => sum + d.totalAmount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
                <p className="text-gray-600">Manage your delivery operations efficiently</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadDeliveries}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => {
                  setSelectedDelivery(null);
                  setShowForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>New Delivery</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-red-800">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Confirmed</h3>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.confirmed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completed</h3>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cancelled</h3>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Revenue</h3>
            <p className="text-xl font-bold text-green-600 mt-1">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending Pay</h3>
            <p className="text-xl font-bold text-orange-600 mt-1">${stats.pendingPayments.toFixed(2)}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by delivery ID, customer name, phone, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          {/* Search Results Summary */}
          {(searchTerm || filterStatus) && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredDeliveries.length} of {deliveries.length} deliveries
                {searchTerm && ` matching "${searchTerm}"`}
                {filterStatus && ` with status "${filterStatus}"`}
              </p>
            </div>
          )}
        </div>

        {/* Deliveries Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading deliveries...</p>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Package size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {deliveries.length === 0 ? 'No deliveries yet' : 'No deliveries found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {deliveries.length === 0 
                ? 'Get started by creating your first delivery.' 
                : 'Try adjusting your search criteria or filters.'}
            </p>
            {deliveries.length === 0 && (
              <button
                onClick={() => {
                  setSelectedDelivery(null);
                  setShowForm(true);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Create First Delivery</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDeliveries.map((delivery) => (
              <DeliveryCard
                key={delivery._id}
                delivery={delivery}
                onEdit={(delivery) => {
                  setSelectedDelivery(delivery);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
                onUpdateStatus={handleUpdateStatus}
                onView={setViewDelivery}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <DeliveryForm
          delivery={selectedDelivery}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedDelivery(null);
          }}
        />
      )}

      {viewDelivery && (
        <DeliveryDetails
          delivery={viewDelivery}
          onClose={() => setViewDelivery(null)}
        />
      )}
    </div>
  );
};

export default DeliveryManagementSystem;