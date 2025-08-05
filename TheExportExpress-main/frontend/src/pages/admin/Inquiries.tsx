import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getApiUrl, INITIAL_API_URL } from '../../config';
import { InquiryStatus } from '../../../../backend/src/models/Inquiry';
import AdminLayout from '../../components/admin/AdminLayout';

interface Product {
  _id: string;
  name: string;
}

interface Inquiry {
  _id: string;
  product: Product | string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  message: string;
  status: InquiryStatus;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface FetchInquiriesResponse {
  data: Inquiry[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentApiUrl, setCurrentApiUrl] = useState(INITIAL_API_URL);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<InquiryStatus>(InquiryStatus.PENDING);
  const [editPriority, setEditPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const fetchInquiries = useCallback(async (apiUrlToUse: string, page: number, currentLimit: number, currentStatus: string, currentPriority: string, currentSearch: string) => {
    setLoading(true);
    try {
      const params: any = { page, limit: currentLimit, sort: '-createdAt' };
      if (currentStatus) {
        params.status = currentStatus;
      }
      if (currentPriority) {
        params.priority = currentPriority;
      }
      if (currentSearch) {
        params.search = currentSearch;
      }
      const response = await axios.get<FetchInquiriesResponse>(`${apiUrlToUse}/api/inquiries`, { params });
      setInquiries(response.data.data || []);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching inquiries:', err);
      setError(err.response?.data?.message || 'Failed to fetch inquiries');
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeUrlAndFetch = async () => {
      try {
        const apiUrl = await getApiUrl();
        setCurrentApiUrl(apiUrl);
        fetchInquiries(apiUrl, currentPage, limit, statusFilter, priorityFilter, searchTerm);
      } catch (e) {
        console.error("Error initializing API URL for Admin Inquiries:", e);
        setError('Failed to initialize API settings. Please try again later.');
        setLoading(false);
      }
    };
    initializeUrlAndFetch();
  }, [fetchInquiries, currentPage, limit, statusFilter, priorityFilter, searchTerm]);

  const handleUpdateInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    try {
      const payload = { status: editStatus, notes: editNotes, priority: editPriority };
      const response = await axios.patch(`${currentApiUrl}/api/inquiries/${selectedInquiry._id}`, payload);
      toast.success('Inquiry updated successfully');
      setInquiries(prev => prev.map(inq => inq._id === selectedInquiry._id ? response.data.data : inq));
      setIsEditModalOpen(false);
      setSelectedInquiry(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update inquiry');
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await axios.delete(`${currentApiUrl}/api/inquiries/${inquiryId}`);
      toast.success('Inquiry deleted successfully');
      setInquiries(prev => prev.filter(inq => inq._id !== inquiryId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete inquiry');
    }
  };

  const openViewModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsViewModalOpen(true);
  };

  const openEditModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setEditStatus(inquiry.status);
    setEditNotes(inquiry.notes || '');
    setEditPriority(inquiry.priority || 'medium');
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: InquiryStatus) => {
    switch (status) {
      case InquiryStatus.PENDING:
        return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
      case InquiryStatus.CONTACTED:
        return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      case InquiryStatus.RESOLVED:
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case InquiryStatus.SPAM:
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'medium':
        return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
      case 'low':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getProductName = (product: Product | string): string => {
    if (typeof product === 'object' && product !== null && 'name' in product) {
      return product.name;
    }
    return 'N/A';
  };
  
  const getProductId = (product: Product | string): string | null => {
    if (typeof product === 'object' && product !== null && '_id' in product) {
      return product._id;
    }
    if (typeof product === 'string') return product;
    return null;
  };

  if (loading && inquiries.length === 0) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error && inquiries.length === 0) {
    return (
      <AdminLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/20 border border-red-500/30 rounded-lg p-6"
        >
          <div className="flex items-center text-red-400">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="font-medium">{error}</p>
              <button 
                onClick={() => fetchInquiries(currentApiUrl, currentPage, limit, statusFilter, priorityFilter, searchTerm)} 
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </motion.div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>📧</span>
              Manage Inquiries
            </h1>
            <p className="text-gray-400 mt-1">Track and manage B2B customer inquiries</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Total: {inquiries.length} inquiries
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as InquiryStatus | '');
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {Object.values(InquiryStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Items per page */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Per Page</label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading inquiries...</p>
          </div>
        )}

        {inquiries.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-300 text-lg mb-2">No inquiries found</p>
            <p className="text-gray-400 mb-4">
              {statusFilter || priorityFilter || searchTerm 
                ? 'Try adjusting your search or filter criteria'
                : 'No inquiries have been received yet'
              }
            </p>
            {(statusFilter || priorityFilter || searchTerm) && (
              <button 
                onClick={() => {
                  setStatusFilter('');
                  setPriorityFilter('');
                  setSearchTerm('');
                }} 
                className="text-blue-400 hover:text-blue-300"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        )}

        {inquiries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Message
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {inquiries.map((inquiry, index) => (
                    <motion.tr
                      key={inquiry._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          to={`/products/${getProductId(inquiry.product)}`} 
                          className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {getProductName(inquiry.product)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{inquiry.name}</div>
                        <div className="text-sm text-gray-400">{inquiry.email}</div>
                        {inquiry.companyName && (
                          <div className="text-xs text-gray-500">{inquiry.companyName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 truncate max-w-xs" title={inquiry.message}>
                          {inquiry.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-sm rounded-full border ${getPriorityColor(inquiry.priority)}`}>
                          {inquiry.priority || 'medium'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => openViewModal(inquiry)} 
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => openEditModal(inquiry)} 
                            className="text-green-400 hover:text-green-300 transition-colors"
                            title="Edit Inquiry"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteInquiry(inquiry._id)} 
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Inquiry"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center bg-gray-800/50 rounded-lg border border-gray-700 p-4">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-300">Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* View Inquiry Modal */}
        {isViewModalOpen && selectedInquiry && (
          <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-gray-800 border-gray-700"
            >
              <div className="flex justify-between items-center pb-3 border-b border-gray-700 mb-4">
                <h3 className="text-xl font-semibold text-white">Inquiry Details</h3>
                <button 
                  onClick={() => setIsViewModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Product:</p>
                    <p className="text-white font-medium">{getProductName(selectedInquiry.product)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Status:</p>
                    <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(selectedInquiry.status)}`}>
                      {selectedInquiry.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Customer:</p>
                    <p className="text-white font-medium">{selectedInquiry.name}</p>
                    <p className="text-gray-300">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Priority:</p>
                    <span className={`px-3 py-1 text-sm rounded-full border ${getPriorityColor(selectedInquiry.priority)}`}>
                      {selectedInquiry.priority || 'medium'}
                    </span>
                  </div>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <p className="text-gray-400">Phone:</p>
                    <p className="text-white">{selectedInquiry.phone}</p>
                  </div>
                )}
                {selectedInquiry.companyName && (
                  <div>
                    <p className="text-gray-400">Company:</p>
                    <p className="text-white">{selectedInquiry.companyName}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400">Date:</p>
                  <p className="text-white">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium mb-2">Message:</p>
                  <div className="bg-gray-700 p-4 rounded-lg text-white whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>
                {selectedInquiry.notes && (
                  <div>
                    <p className="text-gray-400 font-medium mb-2">Admin Notes:</p>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg text-yellow-200 whitespace-pre-wrap">
                      {selectedInquiry.notes}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button 
                  onClick={() => { setIsViewModalOpen(false); openEditModal(selectedInquiry); }} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => setIsViewModalOpen(false)} 
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Inquiry Modal */}
        {isEditModalOpen && selectedInquiry && (
          <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mx-auto p-6 border w-full max-w-lg shadow-lg rounded-lg bg-gray-800 border-gray-700"
            >
              <div className="flex justify-between items-center pb-3 border-b border-gray-700 mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Update Inquiry: {getProductName(selectedInquiry.product)}
                </h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdateInquiry} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select 
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as InquiryStatus)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(InquiryStatus).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select 
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Admin Notes</label>
                  <textarea 
                    rows={4} 
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add internal notes about this inquiry..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)} 
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminInquiries; 