import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TruckIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  TagIcon,
  CalendarIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  StarIcon,
  FireIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getApiUrl } from '../../config';
import { IOrder, IOrderStats, IOrderFilters } from '../../types/order';
import OrderForm from '../../components/admin/OrderForm';
import OrderDetails from '../../components/admin/OrderDetails';
import ShipmentForm from '../../components/admin/ShipmentForm';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [stats, setStats] = useState<IOrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentApiUrl, setCurrentApiUrl] = useState('');
  const [filters, setFilters] = useState<IOrderFilters>({
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<IOrder | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkNotes, setBulkNotes] = useState('');

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
      fetchStats();
    }
  }, [currentApiUrl, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${currentApiUrl}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });

      setOrders(response.data.data || []);
      setPagination(response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
      });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
      setOrders([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${currentApiUrl}/api/orders/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate
        }
      });
      setStats(response.data.data);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (key: keyof IOrderFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order._id));
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedOrders.length === 0) {
      toast.error('Please select orders and choose a status');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${currentApiUrl}/api/orders/bulk/status`, {
        orderIds: selectedOrders,
        orderStatus: bulkStatus,
        notes: bulkNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Orders updated successfully');
      setSelectedOrders([]);
      setBulkStatus('');
      setBulkNotes('');
      setShowBulkActions(false);
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating orders:', error);
      toast.error(error.response?.data?.message || 'Failed to update orders');
    }
  };

  const handleAddOrder = () => {
    setFormMode('create');
    setEditingOrder(null);
    setShowOrderForm(true);
  };

  const handleEditOrder = (order: IOrder) => {
    setFormMode('edit');
    setEditingOrder(order);
    setShowOrderForm(true);
  };

  const handleViewOrderDetails = (order: IOrder) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleAddShipment = (order: IOrder) => {
    setSelectedOrder(order);
    setShowShipmentForm(true);
  };

  const handleOrderFormSuccess = () => {
    setShowOrderForm(false);
    setEditingOrder(null);
    fetchOrders();
    toast.success(`Order ${formMode === 'create' ? 'created' : 'updated'} successfully`);
  };

  const handleCloseOrderForm = () => {
    setShowOrderForm(false);
    setEditingOrder(null);
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const handleCloseShipmentForm = () => {
    setShowShipmentForm(false);
    setSelectedOrder(null);
  };

  const handleShipmentSuccess = () => {
    setShowShipmentForm(false);
    setSelectedOrder(null);
    fetchOrders();
    toast.success('Shipment added successfully');
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
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Order Management
            </h1>
            <p className="text-gray-300 mt-1">
              Manage orders, track shipments, and monitor order status
            </p>
          </div>
          <button
            onClick={handleAddOrder}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Order
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-800/50 border border-blue-500/20 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalOrders}</p>
              </div>
              <div className="bg-blue-600/20 p-3 rounded-lg">
                <ShoppingCartIcon className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-green-500/20 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="bg-green-600/20 p-3 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-purple-500/20 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Orders</p>
                <p className="text-2xl font-bold text-purple-400">{stats.pendingOrders}</p>
              </div>
              <div className="bg-purple-600/20 p-3 rounded-lg">
                <ClockIcon className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-emerald-500/20 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Order Value</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.averageOrderValue)}</p>
              </div>
              <div className="bg-emerald-600/20 p-3 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
          <FunnelIcon className="w-5 h-5 mr-2" />
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Order number, customer name..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Payment Status</label>
            <select
              value={filters.paymentStatus || ''}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Payment Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
            <select
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-blue-400 font-medium">
                {selectedOrders.length} order(s) selected
              </span>
              <button
                onClick={() => setSelectedOrders([])}
                className="text-blue-300 hover:text-blue-200 text-sm"
              >
                Clear Selection
              </button>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleBulkStatusUpdate}
                disabled={!bulkStatus}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="bg-gray-700/30 px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-200">Orders</h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedOrders.length === orders.length && orders.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-400">Select All</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-700/50">
            <thead className="bg-gray-700/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800/30 divide-y divide-gray-700/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-200">{order.orderNumber}</div>
                          <div className="text-sm text-gray-400">{order.paymentStatus}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-200">{order.customerName}</div>
                        <div className="text-sm text-gray-400">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-200">
                        {order.items.length} item(s)
                      </div>
                      <div className="text-sm text-gray-400">
                        {order.items.map(item => item.product.name).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-200">
                        {formatCurrency(order.finalAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="ml-1">{order.orderStatus}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                        {getPriorityIcon(order.priority)}
                        <span className="ml-1">{order.priority}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewOrderDetails(order)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 p-1 rounded"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="text-green-400 hover:text-green-300 hover:bg-green-600/20 p-1 rounded"
                          title="Edit Order"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAddShipment(order)}
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/20 p-1 rounded"
                          title="Add Shipment"
                        >
                          <TruckIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-gray-800/50 border-t border-gray-700/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-300">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-2 border border-gray-600/50 text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border rounded-md ${
                      page === pagination.currentPage
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                        : 'border-gray-600/50 text-gray-300 bg-gray-700/50 hover:bg-gray-600/50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-2 border border-gray-600/50 text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showOrderForm && (
        <OrderForm
          order={editingOrder}
          onClose={handleCloseOrderForm}
          onSuccess={handleOrderFormSuccess}
          mode={formMode}
        />
      )}

      {showOrderDetails && selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={handleCloseOrderDetails}
          onRefresh={fetchOrders}
        />
      )}

      {showShipmentForm && selectedOrder && (
        <ShipmentForm
          order={selectedOrder}
          onClose={handleCloseShipmentForm}
          onSuccess={handleShipmentSuccess}
        />
      )}
    </div>
  );
};

export default Orders; 