import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const DeliveryForm = ({ delivery, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customer: { name: '', phone: '', email: '' },
    items: [{ name: '', quantity: 1, price: 0, description: '' }],
    route: { from: '', to: '', distance: 0, estimatedDuration: '' },
    deliveryDate: '',
    paymentStatus: 'Pending',
    deliveryStatus: 'Pending',
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (delivery) {
      setFormData({
        ...delivery,
        deliveryDate: delivery.deliveryDate ? delivery.deliveryDate.split('T')[0] : ''
      });
    }
  }, [delivery]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customer.name.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.customer.phone.trim()) {
      newErrors.customerPhone = 'Customer phone is required';
    }
    
    if (!formData.route.from.trim()) {
      newErrors.routeFrom = 'From location is required';
    }
    
    if (!formData.route.to.trim()) {
      newErrors.routeTo = 'To location is required';
    }
    
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    }
    
    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors[`item${index}Name`] = 'Item name is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item${index}Quantity`] = 'Quantity must be greater than 0';
      }
      if (item.price < 0) {
        newErrors[`item${index}Price`] = 'Price cannot be negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value, index = null, subField = null) => {
    setFormData(prev => {
      if (field === 'items' && index !== null) {
        const newItems = [...prev.items];
        newItems[index] = { ...newItems[index], [subField]: value };
        const totalAmount = newItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        return { ...prev, items: newItems, totalAmount };
      } else if (subField) {
        return {
          ...prev,
          [field]: { ...prev[field], [subField]: value }
        };
      } else {
        return { ...prev, [field]: value };
      }
    });

    // Clear related errors
    if (errors[field] || (subField && errors[`${field}${subField}`])) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        if (subField) delete newErrors[`${field}${subField}`];
        return newErrors;
      });
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0, description: '' }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => {
        const newItems = prev.items.filter((_, i) => i !== index);
        const totalAmount = newItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        return { ...prev, items: newItems, totalAmount };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const totalAmount = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      onSave({ ...formData, totalAmount });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{delivery ? 'Edit' : 'Create'} Delivery</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={formData.customer.name}
                  onChange={(e) => handleInputChange('customer', e.target.value, null, 'name')}
                  className={`w-full p-2 border rounded-lg ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter customer name"
                />
                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="text"
                  value={formData.customer.phone}
                  onChange={(e) => handleInputChange('customer', e.target.value, null, 'phone')}
                  className={`w-full p-2 border rounded-lg ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter phone number"
                />
                {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.customer.email}
                  onChange={(e) => handleInputChange('customer', e.target.value, null, 'email')}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-green-600"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>
            
            {formData.items.map((item, index) => (
              <div key={index} className="bg-white p-3 rounded-lg mb-3 border">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Item Name *</label>
                    <input
                      type="text"
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => handleInputChange('items', e.target.value, index, 'name')}
                      className={`w-full p-2 border rounded ${errors[`item${index}Name`] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors[`item${index}Name`] && <p className="text-red-500 text-xs mt-1">{errors[`item${index}Name`]}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Quantity *</label>
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleInputChange('items', parseInt(e.target.value) || 1, index, 'quantity')}
                      className={`w-full p-2 border rounded ${errors[`item${index}Quantity`] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors[`item${index}Quantity`] && <p className="text-red-500 text-xs mt-1">{errors[`item${index}Quantity`]}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Price *</label>
                    <input
                      type="number"
                      placeholder="Price"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleInputChange('items', parseFloat(e.target.value) || 0, index, 'price')}
                      className={`w-full p-2 border rounded ${errors[`item${index}Price`] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors[`item${index}Price`] && <p className="text-red-500 text-xs mt-1">{errors[`item${index}Price`]}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleInputChange('items', e.target.value, index, 'description')}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                      disabled={formData.items.length === 1}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-sm font-medium">Subtotal: ${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Route Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Route Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">From *</label>
                <input
                  type="text"
                  value={formData.route.from}
                  onChange={(e) => handleInputChange('route', e.target.value, null, 'from')}
                  className={`w-full p-2 border rounded-lg ${errors.routeFrom ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Pickup location"
                />
                {errors.routeFrom && <p className="text-red-500 text-sm mt-1">{errors.routeFrom}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">To *</label>
                <input
                  type="text"
                  value={formData.route.to}
                  onChange={(e) => handleInputChange('route', e.target.value, null, 'to')}
                  className={`w-full p-2 border rounded-lg ${errors.routeTo ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Delivery location"
                />
                {errors.routeTo && <p className="text-red-500 text-sm mt-1">{errors.routeTo}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Distance (km)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.route.distance}
                  onChange={(e) => handleInputChange('route', parseFloat(e.target.value) || 0, null, 'distance')}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Est. Duration</label>
                <input
                  type="text"
                  value={formData.route.estimatedDuration}
                  onChange={(e) => handleInputChange('route', e.target.value, null, 'estimatedDuration')}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., 2 hours"
                />
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Delivery Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Date *</label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  className={`w-full p-2 border rounded-lg ${errors.deliveryDate ? 'border-red-500' : 'border-gray-300'}`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.deliveryDate && <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Status</label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Status</label>
                <select
                  value={formData.deliveryStatus}
                  onChange={(e) => handleInputChange('deliveryStatus', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Special Requests</label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows="3"
              placeholder="Any special instructions or requests..."
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg text-right">
            <p className="text-xl font-bold text-blue-800">
              Total Amount: ${formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {delivery ? 'Update' : 'Create'} Delivery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryForm;