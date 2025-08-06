import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  XMarkIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { getApiUrl } from '../../config';
import { IOrder } from '../../types/order';
import { PaymentMethod } from '../../types/payment';

interface PaymentFlowProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentFlow: React.FC<PaymentFlowProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [currentApiUrl, setCurrentApiUrl] = useState('');
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [escrowEnabled, setEscrowEnabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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

  useEffect(() => {
    if (currentApiUrl) {
      fetchOrders();
    }
  }, [currentApiUrl, searchTerm]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${currentApiUrl}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchTerm,
          limit: 10
        }
      });
      setOrders(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    }
  };

  const handleCreatePaymentFlow = async () => {
    if (!selectedOrder) {
      toast.error('Please select an order');
      return;
    }

    if (!currentApiUrl) {
      toast.error('API URL not initialized');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${currentApiUrl}/api/payments/orders/${selectedOrder._id}/flow`,
        {
          paymentMethod,
          escrowEnabled
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Payment flow created successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating payment flow:', error);
      toast.error(error.response?.data?.message || 'Failed to create payment flow');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
        className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Create Payment Flow
            </h2>
            <p className="text-sm text-gray-300">
              Set up payments for an order including customer, vendor, and shipping payments
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-200 mb-4">Select Order</h3>
            
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by number or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedOrder?._id === order._id
                      ? 'bg-blue-600/20 border-blue-500/50'
                      : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-200">{order.orderNumber}</div>
                      <div className="text-sm text-gray-400">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.items.length} items</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-200">
                        {formatCurrency(order.finalAmount)}
                      </div>
                      <div className="text-xs text-gray-400">{order.currency}</div>
                    </div>
                    {selectedOrder?._id === order._id && (
                      <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  No orders found
                </div>
              )}
            </div>
          </div>

          {/* Payment Configuration */}
          {selectedOrder && (
            <div className="border-t border-gray-700/50 pt-6">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Payment Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.values(PaymentMethod).map(method => (
                      <option key={method} value={method}>
                        {method.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={escrowEnabled}
                      onChange={(e) => setEscrowEnabled(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-300 flex items-center">
                      <ShieldCheckIcon className="w-4 h-4 mr-1" />
                      Enable Escrow Protection
                    </span>
                  </label>
                  <p className="text-xs text-gray-400 mt-1">
                    Funds will be held in escrow until order is delivered and confirmed
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-6 bg-gray-700/30 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-200 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order Number:</span>
                    <span className="text-gray-200">{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Customer:</span>
                    <span className="text-gray-200">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Items:</span>
                    <span className="text-gray-200">{selectedOrder.items.length} item(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vendors:</span>
                    <span className="text-gray-200">
                      {[...new Set(selectedOrder.items.map(item => item.vendor.companyName))].length} vendor(s)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-gray-200">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax:</span>
                    <span className="text-gray-200">{formatCurrency(selectedOrder.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping:</span>
                    <span className="text-gray-200">{formatCurrency(selectedOrder.shippingAmount)}</span>
                  </div>
                  <div className="border-t border-gray-600/50 pt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-200 font-medium">Total:</span>
                      <span className="text-gray-200 font-bold">{formatCurrency(selectedOrder.finalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Flow Preview */}
              <div className="mt-6 bg-gray-700/30 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-200 mb-3">Payment Flow Preview</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-600/20 border border-blue-500/30 rounded">
                    <div>
                      <div className="text-sm font-medium text-blue-400">Customer → Platform</div>
                      <div className="text-xs text-gray-400">Customer pays for order</div>
                    </div>
                    <div className="text-blue-400 font-medium">
                      {formatCurrency(selectedOrder.finalAmount)}
                    </div>
                  </div>
                  
                  {[...new Set(selectedOrder.items.map(item => item.vendor._id))].map((vendorId, index) => {
                    const vendor = selectedOrder.items.find(item => item.vendor._id === vendorId)?.vendor;
                    const vendorTotal = selectedOrder.items
                      .filter(item => item.vendor._id === vendorId)
                      .reduce((sum, item) => sum + item.totalPrice, 0);
                    
                    return (
                      <div key={vendorId} className="flex items-center justify-between p-3 bg-purple-600/20 border border-purple-500/30 rounded">
                        <div>
                          <div className="text-sm font-medium text-purple-400">Platform → {vendor?.companyName}</div>
                          <div className="text-xs text-gray-400">Vendor payment (85% of order value)</div>
                        </div>
                        <div className="text-purple-400 font-medium">
                          {formatCurrency(vendorTotal * 0.85)}
                        </div>
                      </div>
                    );
                  })}
                  
                  {selectedOrder.shippingAmount > 0 && (
                    <div className="flex items-center justify-between p-3 bg-orange-600/20 border border-orange-500/30 rounded">
                      <div>
                        <div className="text-sm font-medium text-orange-400">Platform → Shipping Company</div>
                        <div className="text-xs text-gray-400">Shipping payment</div>
                      </div>
                      <div className="text-orange-400 font-medium">
                        {formatCurrency(selectedOrder.shippingAmount)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-700/50">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-md hover:bg-gray-600/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePaymentFlow}
              disabled={loading || !selectedOrder}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            >
              {loading ? (
                'Creating...'
              ) : (
                <>
                  <CurrencyDollarIcon className="w-4 h-4" />
                  Create Payment Flow
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentFlow;