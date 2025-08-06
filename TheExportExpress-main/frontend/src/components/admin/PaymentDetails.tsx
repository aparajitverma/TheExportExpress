import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  XMarkIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  UserIcon,
  BuildingOfficeIcon,
  TruckIcon,
  CalendarIcon,
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { getApiUrl } from '../../config';
import {
  IPayment,
  IPaymentStatusUpdate,
  IRefundRequest,
  IEscrowRelease,
  PaymentStatus,
  PaymentType
} from '../../types/payment';

interface PaymentDetailsProps {
  payment: IPayment;
  onClose: () => void;
  onRefresh: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [currentApiUrl, setCurrentApiUrl] = useState('');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [showEscrowRelease, setShowEscrowRelease] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<IPaymentStatusUpdate>({
    status: payment.status,
    notes: ''
  });
  const [refundRequest, setRefundRequest] = useState<IRefundRequest>({
    refundAmount: payment.breakdown.total,
    refundReason: ''
  });
  const [escrowRelease, setEscrowRelease] = useState<IEscrowRelease>({
    releaseNotes: ''
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
      await axios.patch(`${currentApiUrl}/api/payments/${payment._id}/status`, statusUpdate, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Payment status updated successfully');
      setShowStatusUpdate(false);
      onRefresh();
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast.error(error.response?.data?.message || 'Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!currentApiUrl) {
      toast.error('API URL not initialized');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${currentApiUrl}/api/payments/${payment._id}/refund`, refundRequest, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Refund processed successfully');
      setShowRefundForm(false);
      onRefresh();
    } catch (error: any) {
      console.error('Error processing refund:', error);
      toast.error(error.response?.data?.message || 'Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  const handleEscrowRelease = async () => {
    if (!currentApiUrl) {
      toast.error('API URL not initialized');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${currentApiUrl}/api/payments/${payment._id}/escrow/release`, escrowRelease, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Escrow released successfully');
      setShowEscrowRelease(false);
      onRefresh();
    } catch (error: any) {
      console.error('Error releasing escrow:', error);
      toast.error(error.response?.data?.message || 'Failed to release escrow');
    } finally {
      setLoading(false);
    }
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
              Payment Details
            </h2>
            <p className="text-sm text-gray-300">
              Payment #{payment.paymentId} - Order #{payment.orderNumber}
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
          {/* Payment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                Payment Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment ID:</span>
                  <span className="text-gray-200 font-medium">{payment.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <div className="flex items-center">
                    {getTypeIcon(payment.paymentType)}
                    <span className="text-gray-200 ml-1">{payment.paymentType}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    <span className="ml-1">{payment.status}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Method:</span>
                  <span className="text-gray-200">{payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Currency:</span>
                  <span className="text-gray-200">{payment.currency}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <BanknotesIcon className="w-5 h-5 mr-2" />
                Payment Flow
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">From (Payer)</div>
                  <div className="text-gray-200 font-medium">{payment.payer.name}</div>
                  <div className="text-sm text-gray-400">{payment.payer.email}</div>
                  <div className="text-xs text-blue-400">{payment.payer.type}</div>
                </div>
                <div className="flex justify-center">
                  <ArrowPathIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">To (Payee)</div>
                  <div className="text-gray-200 font-medium">{payment.payee.name}</div>
                  <div className="text-sm text-gray-400">{payment.payee.email}</div>
                  <div className="text-xs text-blue-400">{payment.payee.type}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Timeline
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Initiated:</span>
                  <span className="text-gray-200">{formatDate(payment.initiatedAt)}</span>
                </div>
                {payment.processedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Processed:</span>
                    <span className="text-gray-200">{formatDate(payment.processedAt)}</span>
                  </div>
                )}
                {payment.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Completed:</span>
                    <span className="text-gray-200">{formatDate(payment.completedAt)}</span>
                  </div>
                )}
                {payment.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Due Date:</span>
                    <span className="text-gray-200">{formatDate(payment.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-gray-700/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <BanknotesIcon className="w-5 h-5 mr-2" />
              Financial Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-gray-200">{formatCurrency(payment.breakdown.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax:</span>
                  <span className="text-gray-200">{formatCurrency(payment.breakdown.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping:</span>
                  <span className="text-gray-200">{formatCurrency(payment.breakdown.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Discount:</span>
                  <span className="text-gray-200">-{formatCurrency(payment.breakdown.discount)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform Fee:</span>
                  <span className="text-gray-200">{formatCurrency(payment.breakdown.platformFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vendor Commission:</span>
                  <span className="text-gray-200">{formatCurrency(payment.breakdown.vendorCommission)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Processing Fee:</span>
                  <span className="text-gray-200">{formatCurrency(payment.breakdown.processingFee)}</span>
                </div>
                <div className="border-t border-gray-600/50 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-200 font-medium">Total:</span>
                    <span className="text-gray-200 font-bold text-lg">{formatCurrency(payment.breakdown.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Escrow Information */}
          {payment.escrow.isEscrow && (
            <div className="bg-gray-700/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                Escrow Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Provider:</span>
                    <span className="text-gray-200">{payment.escrow.escrowProvider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Escrow ID:</span>
                    <span className="text-gray-200">{payment.escrow.escrowId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={payment.escrow.releasedAt ? 'text-green-400' : 'text-yellow-400'}>
                      {payment.escrow.releasedAt ? 'Released' : 'Held in Escrow'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Release Conditions:</div>
                  <ul className="text-sm text-gray-200 space-y-1">
                    {payment.escrow.releaseConditions?.map((condition, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 text-green-400 mr-2" />
                        {condition}
                      </li>
                    ))}
                  </ul>
                  {!payment.escrow.releasedAt && (
                    <button
                      onClick={() => setShowEscrowRelease(true)}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-all duration-200"
                    >
                      Release Escrow
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Transaction History */}
          {payment.statusHistory.length > 0 && (
            <div className="bg-gray-700/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Status History
              </h3>
              <div className="space-y-3">
                {payment.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-600/50">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(history.status)}
                      <div>
                        <div className="text-sm text-gray-200">{history.status}</div>
                        {history.notes && (
                          <div className="text-xs text-gray-400">{history.notes}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">{formatDate(history.timestamp)}</div>
                      <div className="text-xs text-gray-500">{history.updatedBy.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            {payment.status === PaymentStatus.COMPLETED && (
              <button
                onClick={() => setShowRefundForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-all duration-200"
              >
                Process Refund
              </button>
            )}
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
              <h3 className="text-lg font-medium text-gray-200 mb-4">Update Payment Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Status
                  </label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value as PaymentStatus }))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.values(PaymentStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
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

        {/* Refund Form Modal */}
        {showRefundForm && (
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
              <h3 className="text-lg font-medium text-gray-200 mb-4">Process Refund</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Refund Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    max={payment.breakdown.total}
                    value={refundRequest.refundAmount}
                    onChange={(e) => setRefundRequest(prev => ({ ...prev, refundAmount: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Refund Reason
                  </label>
                  <textarea
                    value={refundRequest.refundReason}
                    onChange={(e) => setRefundRequest(prev => ({ ...prev, refundReason: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    placeholder="Reason for refund..."
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowRefundForm(false)}
                  className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-md hover:bg-gray-600/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefund}
                  disabled={loading || !refundRequest.refundReason}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Processing...' : 'Process Refund'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Escrow Release Modal */}
        {showEscrowRelease && (
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
              <h3 className="text-lg font-medium text-gray-200 mb-4">Release Escrow</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Release Notes
                  </label>
                  <textarea
                    value={escrowRelease.releaseNotes}
                    onChange={(e) => setEscrowRelease(prev => ({ ...prev, releaseNotes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    placeholder="Notes about escrow release..."
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowEscrowRelease(false)}
                  className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-md hover:bg-gray-600/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEscrowRelease}
                  disabled={loading || !escrowRelease.releaseNotes}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Releasing...' : 'Release Escrow'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PaymentDetails;