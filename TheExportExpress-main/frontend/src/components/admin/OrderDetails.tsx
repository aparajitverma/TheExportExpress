import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  TagIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  FireIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { getApiUrl } from '../../config';
import { IOrder, IOrderStatusUpdate, IItemStatusUpdate } from '../../types/order';

interface OrderDetailsProps {
  order: IOrder;
  onClose: () => void;
  onRefresh: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [currentApiUrl, setCurrentApiUrl] = useState('');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<IOrderStatusUpdate>({
    orderStatus: order.orderStatus,
    notes: ''
  });

  React.useEffect(() => {
    const initializeApiUrl = async () => {
      try {
        const apiUrl = await getApiUrl();
        setCurrentApiUrl(apiUrl);
      } catch (error) {
        console.error('Failed to initialize API URL:', error);
        toast.error('Failed to connect to server');
      }
    };
    initializeApiUrl();
  }, []);

  const handleStatusUpdate = async () => {
    if (!currentApiUrl) {
      toast.error('API URL not initialized');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${currentApiUrl}/api/orders/${order._id}/status`, statusUpdate, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Order status updated successfully');
      setShowStatusUpdate(false);
      onRefresh();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
      case 'delivered':
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-600/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      case 'processing':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'shipped':
        return <TruckIcon className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-600/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-600/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <FireIcon className="w-4 h-4" />;
      case 'high':
        return <ArrowUpIcon className="w-4 h-4" />;
      case 'medium':
        return <StarIcon className="w-4 h-4" />;
      case 'low':
        return <ArrowDownIcon className="w-4 h-4" />;
      default:
        return <StarIcon className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-700/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Order Details
            </h2>
            <p className="text-sm text-gray-300">
              Order #{order.orderNumber} - {order.customerName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStatusUpdate(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2"
            >
              <PencilIcon className="w-4 h-4" />
              Update Status
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                Order Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Number:</span>
                  <span className="text-gray-200 font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span className="ml-1">{order.orderStatus}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Priority:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                    {getPriorityIcon(order.priority)}
                    <span className="ml-1">{order.priority}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Status:</span>
                  <span className="text-gray-200">{order.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-gray-200">{formatDate(order.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-200">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-200">{order.customerEmail}</span>
                </div>
                {order.customerPhone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-200">{order.customerPhone}</span>
                  </div>
                )}
                <div className="flex items-start gap-2 mt-2">
                  <MapPinIcon className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="text-gray-200 text-sm">
                    <div>{order.customerAddress.street}</div>
                    <div>{order.customerAddress.city}, {order.customerAddress.state}</div>
                    <div>{order.customerAddress.country} {order.customerAddress.postalCode}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                Financial Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-gray-200">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax:</span>
                  <span className="text-gray-200">{formatCurrency(order.taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping:</span>
                  <span className="text-gray-200">{formatCurrency(order.shippingAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Discount:</span>
                  <span className="text-gray-200">-{formatCurrency(order.discountAmount)}</span>
                </div>
                <div className="border-t border-gray-600/50 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-200 font-medium">Total:</span>
                    <span className="text-gray-200 font-bold">{formatCurrency(order.finalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-700/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <ShoppingCartIcon className="w-5 h-5 mr-2" />
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Product</div>
                      <div className="text-gray-200 font-medium">{item.product.name}</div>
                      <div className="text-xs text-gray-500">ID: {item.product._id.slice(-6)}</div>
                      {item.product.image && (
                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded mt-2" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 flex items-center">
                        <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                        Vendor Source
                      </div>
                      <div className="text-blue-400 font-medium">{item.vendor.companyName}</div>
                      <div className="text-sm text-gray-400">{item.vendor.name}</div>
                      {item.vendor.email && (
                        <div className="text-xs text-gray-500">{item.vendor.email}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Quantity & Price</div>
                      <div className="text-gray-200">{item.quantity} × {formatCurrency(item.unitPrice)}</div>
                      <div className="text-gray-200 font-medium">{formatCurrency(item.totalPrice)}</div>
                      <div className="text-xs text-gray-500">From vendor source</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Status & Tracking</div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1">{item.status}</span>
                      </span>
                      {item.trackingNumber && (
                        <div className="text-sm text-gray-400 mt-1">
                          Tracking: {item.trackingNumber}
                        </div>
                      )}
                      {item.shippingCarrier && (
                        <div className="text-xs text-gray-500 mt-1">
                          Carrier: {item.shippingCarrier}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipments */}
          {order.shipments.length > 0 && (
            <div className="bg-gray-700/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <TruckIcon className="w-5 h-5 mr-2" />
                Shipments ({order.shipments.length})
              </h3>
              <div className="space-y-4">
                {order.shipments.map((shipment, index) => (
                  <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">Tracking</div>
                        <div className="text-gray-200 font-medium">{shipment.trackingNumber}</div>
                        <div className="text-sm text-gray-400">{shipment.carrier}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Status</div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                          {getStatusIcon(shipment.status)}
                          <span className="ml-1">{shipment.status}</span>
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Dates</div>
                        {shipment.shippedAt && (
                          <div className="text-gray-200 text-sm">Shipped: {formatDate(shipment.shippedAt)}</div>
                        )}
                        {shipment.estimatedDelivery && (
                          <div className="text-gray-200 text-sm">Est. Delivery: {formatDate(shipment.estimatedDelivery)}</div>
                        )}
                        {shipment.deliveredAt && (
                          <div className="text-gray-200 text-sm">Delivered: {formatDate(shipment.deliveredAt)}</div>
                        )}
                      </div>
                    </div>
                    {shipment.notes && (
                      <div className="mt-2 text-sm text-gray-400">
                        Notes: {shipment.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Additional Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="text-gray-200">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Currency:</span>
                  <span className="text-gray-200">{order.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Source:</span>
                  <span className="text-gray-200">{order.source}</span>
                </div>
                {order.assignedTo && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assigned To:</span>
                    <span className="text-gray-200">{order.assignedTo.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Created By:</span>
                  <span className="text-gray-200">{order.createdBy.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-gray-200">{formatDate(order.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <TagIcon className="w-5 h-5 mr-2" />
                Notes & Tags
              </h3>
              <div className="space-y-4">
                {order.notes && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Notes:</div>
                    <div className="text-gray-200 text-sm bg-gray-800/50 p-3 rounded">
                      {order.notes}
                    </div>
                  </div>
                )}
                {order.tags.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Tags:</div>
                    <div className="flex flex-wrap gap-2">
                      {order.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-600/20 text-blue-300 border border-blue-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Modal */}
        {showStatusUpdate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-md p-6 border border-gray-700/50"
            >
              <h3 className="text-lg font-medium text-gray-200 mb-4">Update Order Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Status
                  </label>
                  <select
                    value={statusUpdate.orderStatus}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, orderStatus: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={statusUpdate.notes}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    placeholder="Add notes about the status change..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowStatusUpdate(false)}
                  className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-md hover:bg-gray-600/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default OrderDetails; 