import React from 'react';
import { X, MapPin, Calendar, Phone, Mail, Package, CreditCard, FileText } from 'lucide-react';

const DeliveryDetails = ({ delivery, onClose }) => {
  if (!delivery) return null;

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Delivery Details</h2>
            <p className="text-gray-600">#{delivery.deliveryId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-600 mb-2">Delivery Status</div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[delivery.deliveryStatus]}`}>
                {delivery.deliveryStatus}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-600 mb-2">Payment Status</div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${paymentColors[delivery.paymentStatus]}`}>
                {delivery.paymentStatus}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-600 mb-2">Total Amount</div>
              <div className="text-2xl font-bold text-green-600">
                ${delivery.totalAmount.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-600 mb-2">Items Count</div>
              <div className="text-2xl font-bold text-blue-600">
                {delivery.items.length}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Phone className="text-blue-600 mr-2" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <p className="text-gray-900 font-medium">{delivery.customer.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Phone:</span>
                  <p className="text-gray-900">{delivery.customer.phone}</p>
                </div>
                {delivery.customer.email && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-500 mr-1" />
                      <p className="text-gray-900">{delivery.customer.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="text-green-600 mr-2" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Delivery Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Delivery Date:</span>
                  <p className="text-gray-900 font-medium">{formatDateOnly(delivery.deliveryDate)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Created:</span>
                  <p className="text-gray-900">{formatDate(delivery.createdAt)}</p>
                </div>
                {delivery.updatedAt && delivery.updatedAt !== delivery.createdAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                    <p className="text-gray-900">{formatDate(delivery.updatedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <MapPin className="text-red-600 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Route Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Pickup Location:</span>
                  <p className="text-gray-900 font-medium break-words">{delivery.route.from}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Delivery Location:</span>
                  <p className="text-gray-900 font-medium break-words">{delivery.route.to}</p>
                </div>
              </div>
              <div className="space-y-3">
                {delivery.route.distance && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Distance:</span>
                    <p className="text-gray-900">{delivery.route.distance} km</p>
                  </div>
                )}
                {delivery.route.estimatedDuration && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Estimated Duration:</span>
                    <p className="text-gray-900">{delivery.route.estimatedDuration}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Package className="text-purple-600 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Items ({delivery.items.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-600">Item Name</th>
                    <th className="text-center p-3 font-medium text-gray-600">Quantity</th>
                    <th className="text-right p-3 font-medium text-gray-600">Price</th>
                    <th className="text-right p-3 font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {delivery.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center text-gray-900">{item.quantity}</td>
                      <td className="p-3 text-right text-gray-900">${item.price.toFixed(2)}</td>
                      <td className="p-3 text-right font-medium text-gray-900">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="p-3 text-right font-semibold text-gray-900">
                      Total Amount:
                    </td>
                    <td className="p-3 text-right font-bold text-xl text-green-600">
                      ${delivery.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Special Requests */}
          {delivery.specialRequests && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="text-orange-600 mr-2" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Special Requests</h3>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{delivery.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="text-indigo-600 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-1">Payment Status</div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${paymentColors[delivery.paymentStatus]}`}>
                  {delivery.paymentStatus}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-1">Total Amount</div>
                <div className="text-xl font-bold text-gray-900">
                  ${delivery.totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-1">Items Total</div>
                <div className="text-lg font-medium text-gray-700">
                  {delivery.items.reduce((sum, item) => sum + item.quantity, 0)} items
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;