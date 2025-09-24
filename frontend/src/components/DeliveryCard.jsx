import React from 'react';
import { Edit, Trash2, Eye, MapPin, Package, Calendar, Phone } from 'lucide-react';

const DeliveryCard = ({ delivery, onEdit, onDelete, onUpdateStatus, onView }) => {
  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    Completed: 'bg-green-100 text-green-800 border-green-200',
    Cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  const paymentColors = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Paid: 'bg-green-100 text-green-800 border-green-200',
    Failed: 'bg-red-100 text-red-800 border-red-200',
    Refunded: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      onDelete(delivery._id);
    }
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    onUpdateStatus(delivery._id, e.target.value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">#{delivery.deliveryId}</h3>
          <div className="flex items-center text-gray-600 mb-1">
            <Phone size={14} className="mr-1" />
            <span className="font-semibold">{delivery.customer.name}</span>
          </div>
          <div className="text-sm text-gray-500">
            {delivery.customer.phone}
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(delivery);
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(delivery);
            }}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Edit Delivery"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            title="Delete Delivery"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Route Information */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start space-x-2">
          <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-sm">
              <span className="font-medium text-gray-700">From:</span>
              <span className="ml-1 text-gray-600 break-words">{delivery.route.from}</span>
            </div>
            <div className="text-sm mt-1">
              <span className="font-medium text-gray-700">To:</span>
              <span className="ml-1 text-gray-600 break-words">{delivery.route.to}</span>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-1">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-gray-600">{formatDate(delivery.deliveryDate)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Package size={14} className="text-gray-500" />
            <span className="text-gray-600">{delivery.items.length} item{delivery.items.length > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Route Details */}
        {(delivery.route.distance || delivery.route.estimatedDuration) && (
          <div className="flex space-x-4 text-xs text-gray-500">
            {delivery.route.distance && (
              <span>{delivery.route.distance} km</span>
            )}
            {delivery.route.estimatedDuration && (
              <span>{delivery.route.estimatedDuration}</span>
            )}
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-green-600">
          ${delivery.totalAmount.toFixed(2)}
        </div>
      </div>

      {/* Status Badges and Actions */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[delivery.deliveryStatus]}`}>
              {delivery.deliveryStatus}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${paymentColors[delivery.paymentStatus]}`}>
              {delivery.paymentStatus}
            </span>
          </div>
          
          {delivery.specialRequests && (
            <div className="text-xs text-gray-500 italic">
              Special requests included
            </div>
          )}
        </div>
        
        <div className="ml-4">
          <select
            value={delivery.deliveryStatus}
            onChange={handleStatusChange}
            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Items Preview (first 2 items) */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 mb-2">Items:</div>
        <div className="space-y-1">
          {delivery.items.slice(0, 2).map((item, index) => (
            <div key={index} className="flex justify-between text-xs text-gray-600">
              <span className="truncate mr-2">
                {item.quantity}x {item.name}
              </span>
              <span className="font-medium">${(item.quantity * item.price).toFixed(2)}</span>
            </div>
          ))}
          {delivery.items.length > 2 && (
            <div className="text-xs text-gray-500 italic">
              +{delivery.items.length - 2} more item{delivery.items.length - 2 > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryCard;