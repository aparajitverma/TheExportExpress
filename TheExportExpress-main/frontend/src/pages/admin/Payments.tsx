import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  ArrowPathIcon,
  FunnelIcon,
  ChartBarIcon,
  UserIcon,
  BuildingOfficeIcon,
  TruckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { getApiUrl } from '../../config';
import {
  IPayment,
  IPaymentAnalytics,
  IPaymentFilters,
  PaymentStatus,
  PaymentType,
  PaymentMethod
} from '../../types/payment';
import PaymentDetails from '../../components/admin/PaymentDetails';
import PaymentFlow from '../../components/admin/PaymentFlow';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [analytics, setAnalytics] = useState<IPaymentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentApiUrl, setCurrentApiUrl] = useState('');
  const [filters, setFilters] = useState<IPaymentFilters>({
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
  const [bulkStatus, setBulkStatus] = useState('');

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
      fetchPayments();
      fetchAnalytics();
    }
  }, [currentApiUrl, filters]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${currentApiUrl}/api/payments`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });

      setPayments(response.data.data || []);
      setPagination(response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
      });
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch payments');
      setPayments([]);
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

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${currentApiUrl}/api/payments/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate
        }
      });
      setAnalytics(response.data.data);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleFilterChange = (key: keyof IPaymentFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === payments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(payments.map(payment => payment._id));
    }
  };

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedPayments.length === 0) {
      toast.error('Please select payments and choose a status');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${currentApiUrl}/api/payments/bulk/process`, {
        paymentIds: selectedPayments,
        action: 'update_status',
        status: bulkStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Payments updated successfully');
      setSelectedPayments([]);
      setBulkStatus('');
      fetchPayments();
    } catch (error: any) {
      console.error('Error updating payments:', error);
      toast.error(error.response?.data?.message || 'Failed to update payments');
    }
  };

  const handleViewPaymentDetails = (payment: IPayment) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  const handleClosePaymentDetails = () => {
    setShowPaymentDetails(false);
    setSelectedPayment(null);
  };

  const handleCreatePaymentFlow = () => {
    setShowPaymentFlow(true);
  };

  const handleClosePaymentFlow = () => {
    setShowPaymentFlow(false);
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case PaymentStatus.PROCESSING:
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case PaymentStatus.COMPLETED:
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      case PaymentStatus.FAILED:
        return 'bg-red-600/20 text-red-400 border-red-500/30';
      case PaymentStatus.REFUNDED:
        return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
      case PaymentStatus.DISPUTED:
        return 'bg-orange-600/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return <ClockIcon className="w-4 h-4" />;
      case PaymentStatus.PROCESSING:
        return <ArrowPathIcon className="w-4 h-4 animate-spin" />;
      case PaymentStatus.COMPLETED:
        return <CheckCircleIcon className="w-4 h-4" />;
      case PaymentStatus.FAILED:
        return <XCircleIcon className="w-4 h-4" />;
      case PaymentStatus.REFUNDED:
        return <ArrowPathIcon className="w-4 h-4" />;
      case PaymentStatus.DISPUTED:
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: PaymentType) => {
    switch (type) {
      case PaymentType.CUSTOMER_TO_PLATFORM:
        return <UserIcon className="w-4 h-4" />;
      case PaymentType.PLATFORM_TO_VENDOR:
        return <BuildingOfficeIcon className="w-4 h-4" />;
      case PaymentType.PLATFORM_TO_SHIPPING:
        return <TruckIcon className="w-4 h-4" />;
      case PaymentType.REFUND:
        return <ArrowPathIcon className="w-4 h-4" />;
      default:
        return <CurrencyDollarIcon className="w-4 h-4" />;
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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Payment Management
            </h1>
            <p className="text-gray-300 mt-1">
              Manage payments between customers, vendors, and shipping companies
            </p>
          </div>
          <button
            onClick={handleCreatePaymentFlow}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2"
          >
            <CurrencyDollarIcon className="w-5 h-5" />
            Create Payment Flow
          </button>
        </div>
      </div>

      {/* Payment Flow Overview */}
      <div className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
          <BanknotesIcon className="w-5 h-5 mr-2" />
          Payment Ecosystem
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-lg text-center">
            <UserIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-blue-400 font-medium">Customer</div>
            <div className="text-xs text-gray-400">Pays for orders</div>
          </div>
          <div className="bg-green-600/20 border border-green-500/30 p-4 rounded-lg text-center">
            <ShieldCheckIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-green-400 font-medium">Platform</div>
            <div className="text-xs text-gray-400">Manages payments</div>
          </div>
          <div className="bg-purple-600/20 border border-purple-500/30 p-4 rounded-lg text-center">
            <BuildingOfficeIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-purple-400 font-medium">Vendor</div>
            <div className="text-xs text-gray-400">Receives payments</div>
          </div>
          <div className="bg-orange-600/20 border border-orange-500/30 p-4 rounded-lg text-center">
            <TruckIcon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-orange-400 font-medium">Shipping</div>
            <div className="text-xs text-gray-400">Delivery payments</div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-800/50 border border-blue-500/20 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Payments</p>
                <p className="text-2xl font-bold text-blue-400">{analytics.totalPayments}</p>
              </div>
              <div className="bg-blue-600/20 p-3 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-green-500/20 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Volume</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(analytics.totalVolume)}</p>
              </div>
              <div className="bg-green-600/20 p-3 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-purple-500/20 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Escrow Holdings</p>
                <p className="text-2xl font-bold text-purple-400">{formatCurrency(analytics.escrowStats.escrowVolume)}</p>
              </div>
              <div className="bg-purple-600/20 p-3 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-emerald-500/20 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Processing</p>
                <p className="text-2xl font-bold text-emerald-400">{Math.round(analytics.averageProcessingTime / (1000 * 60))}m</p>
              </div>
              <div className="bg-emerald-600/20 p-3 rounded-lg">
                <ClockIcon className="w-6 h-6 text-emerald-400" />
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
              placeholder="Payment ID, order number..."
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
              {Object.values(PaymentStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <select
              value={filters.paymentType || ''}
              onChange={(e) => handleFilterChange('paymentType', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {Object.values(PaymentType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Method</label>
            <select
              value={filters.paymentMethod || ''}
              onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Methods</option>
              {Object.values(PaymentMethod).map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPayments.length > 0 && (
        <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-blue-400 font-medium">
                {selectedPayments.length} payment(s) selected
              </span>
              <button
                onClick={() => setSelectedPayments([])}
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
                {Object.values(PaymentStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
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

      {/* Payments Table */}
      <div className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="bg-gray-700/30 px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-200">Payments</h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPayments.length === payments.length && payments.length > 0}
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
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Flow
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
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
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPayments.includes(payment._id)}
                          onChange={() => handleSelectPayment(payment._id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-200">{payment.paymentId}</div>
                          <div className="text-sm text-gray-400">Order: {payment.orderNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(payment.paymentType)}
                        <div className="ml-2">
                          <div className="text-sm text-gray-200">{payment.payer.name}</div>
                          <div className="text-xs text-gray-400">to {payment.payee.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-200">
                        {formatCurrency(payment.breakdown.total)}
                      </div>
                      <div className="text-xs text-gray-400">{payment.currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{payment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewPaymentDetails(payment)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 p-1 rounded"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
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
      {showPaymentDetails && selectedPayment && (
        <PaymentDetails
          payment={selectedPayment}
          onClose={handleClosePaymentDetails}
          onRefresh={fetchPayments}
        />
      )}

      {showPaymentFlow && (
        <PaymentFlow
          onClose={handleClosePaymentFlow}
          onSuccess={fetchPayments}
        />
      )}
    </div>
  );
};

export default Payments;