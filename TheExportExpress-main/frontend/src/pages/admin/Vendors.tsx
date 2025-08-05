import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  TrophyIcon,
  DocumentTextIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/admin/AdminLayout';
import { getApiUrl } from '../../config';
import { 
  IVendor, 
  VendorFormData, 
  VendorFilters, 
  VendorListResponse, 
  VendorStatsResponse 
} from '../../types/vendor';

const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    overview: {
      totalVendors: 0,
      activeVendors: 0,
      pendingVendors: 0,
      verifiedVendors: 0,
      avgRating: 0,
      avgReliabilityScore: 0,
      avgQualityScore: 0,
      avgDeliveryScore: 0
    }
  });
  const [filters, setFilters] = useState<VendorFilters>({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalVendors: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentApiUrl, setCurrentApiUrl] = useState('');

  useEffect(() => {
    const initializeApiUrl = async () => {
      try {
        const apiUrl = await getApiUrl();
        setCurrentApiUrl(apiUrl);
        await fetchVendors(apiUrl);
        await fetchStats(apiUrl);
      } catch (error) {
        console.error('Failed to initialize API URL:', error);
        toast.error('Failed to connect to server');
      }
    };
    initializeApiUrl();
  }, []);

  const fetchVendors = async (apiUrl: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: '10',
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.status && { status: filters.status }),
        ...(filters.businessType && { businessType: filters.businessType }),
        ...(filters.industry && { industry: filters.industry }),
        ...(filters.country && { country: filters.country }),
        ...(filters.verified !== undefined && { verified: filters.verified.toString() })
      });

      const response = await axios.get<VendorListResponse>(`${apiUrl}/api/vendors?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setVendors(response.data.vendors);
      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error('Error fetching vendors:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (apiUrl: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<VendorStatsResponse>(`${apiUrl}/api/vendors/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error: any) {
      console.error('Error fetching vendor stats:', error);
    }
  };

  const handleFilterChange = (key: keyof VendorFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleSearch = () => {
    if (currentApiUrl) {
      fetchVendors(currentApiUrl);
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    if (selectedVendors.length === 0) {
      toast.error('Please select vendors to update');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const promises = selectedVendors.map(id =>
        axios.patch(`${currentApiUrl}/api/vendors/${id}/status`, 
          { status }, 
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );

      await Promise.all(promises);
      toast.success(`Updated ${selectedVendors.length} vendor(s) status`);
      setSelectedVendors([]);
      setShowBulkActions(false);
      if (currentApiUrl) {
        fetchVendors(currentApiUrl);
      }
    } catch (error: any) {
      console.error('Error updating vendor status:', error);
      toast.error('Failed to update vendor status');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVendors.length === 0) {
      toast.error('Please select vendors to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedVendors.length} vendor(s)?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const promises = selectedVendors.map(id =>
        axios.delete(`${currentApiUrl}/api/vendors/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      await Promise.all(promises);
      toast.success(`Deleted ${selectedVendors.length} vendor(s)`);
      setSelectedVendors([]);
      setShowBulkActions(false);
      if (currentApiUrl) {
        fetchVendors(currentApiUrl);
      }
    } catch (error: any) {
      console.error('Error deleting vendors:', error);
      toast.error('Failed to delete vendors');
    }
  };

  const handleSelectAll = () => {
    if (selectedVendors.length === vendors.length) {
      setSelectedVendors([]);
      setShowBulkActions(false);
    } else {
      setSelectedVendors(vendors.map(v => v._id));
      setShowBulkActions(true);
    }
  };

  const handleSelectVendor = (vendorId: string) => {
    setSelectedVendors(prev => {
      const newSelection = prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="w-4 h-4" />;
      case 'inactive': return <XCircleIcon className="w-4 h-4" />;
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      case 'suspended': return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getOverallScore = (vendor: IVendor) => {
    return Math.round((vendor.reliabilityScore + vendor.qualityScore + vendor.deliveryScore) / 3);
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
            <p className="text-gray-600">Manage your product suppliers and vendors</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary">
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export
            </button>
            <button className="btn-primary">
              <PlusIcon className="w-4 h-4" />
              Add Vendor
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && stats.overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overview.totalVendors || 0}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                  <p className="text-2xl font-bold text-green-600">{stats.overview.activeVendors || 0}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified Vendors</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.overview.verifiedVendors || 0}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{(stats.overview.avgRating || 0).toFixed(1)}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <StarIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
              <select
                value={filters.businessType || ''}
                onChange={(e) => handleFilterChange('businessType', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="wholesaler">Wholesaler</option>
                <option value="distributor">Distributor</option>
                <option value="exporter">Exporter</option>
                <option value="supplier">Supplier</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder as 'asc' | 'desc');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="rating-desc">Rating High-Low</option>
                <option value="rating-asc">Rating Low-High</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSearch}
              className="btn-primary"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              Search
            </button>
            <button
              onClick={() => {
                setFilters({
                  search: '',
                  sortBy: 'createdAt',
                  sortOrder: 'desc'
                });
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedVendors.length} vendor(s) selected
                </span>
                <button
                  onClick={() => setSelectedVendors([])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear Selection
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusChange('active')}
                  className="btn-secondary text-sm"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  Activate
                </button>
                <button
                  onClick={() => handleBulkStatusChange('inactive')}
                  className="btn-secondary text-sm"
                >
                  <XCircleIcon className="w-4 h-4" />
                  Deactivate
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="btn-danger text-sm"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Vendors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedVendors.length === vendors.length && vendors.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading vendors...</span>
                      </div>
                    </td>
                  </tr>
                ) : vendors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No vendors found
                    </td>
                  </tr>
                ) : (
                  vendors.map((vendor) => (
                    <motion.tr
                      key={vendor._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedVendors.includes(vendor._id)}
                          onChange={() => handleSelectVendor(vendor._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {vendor.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {vendor.companyName}
                            </div>
                            <div className="text-xs text-gray-400">
                              Code: {vendor.vendorCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <EnvelopeIcon className="w-3 h-3 text-gray-400" />
                            {vendor.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <PhoneIcon className="w-3 h-3 text-gray-400" />
                            {vendor.phone}
                          </div>
                          {vendor.website && (
                            <div className="flex items-center gap-1">
                              <GlobeAltIcon className="w-3 h-3 text-gray-400" />
                              {vendor.website}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <BuildingOfficeIcon className="w-3 h-3 text-gray-400" />
                            {vendor.businessType}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="w-3 h-3 text-gray-400" />
                            {vendor.address.country}
                          </div>
                          <div className="flex items-center gap-1">
                            <UsersIcon className="w-3 h-3 text-gray-400" />
                            {vendor.employeeCount} employees
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3 text-gray-400" />
                            Est. {vendor.yearEstablished}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-3 h-3 text-yellow-500" />
                            {vendor.rating.toFixed(1)}/5
                          </div>
                          <div className="text-xs text-gray-500">
                            Overall: {getOverallScore(vendor)}%
                          </div>
                          <div className="text-xs text-gray-500">
                            Reliability: {vendor.reliabilityScore}%
                          </div>
                          <div className="text-xs text-gray-500">
                            Quality: {vendor.qualityScore}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                            {getStatusIcon(vendor.status)}
                            <span className="ml-1 capitalize">{vendor.status}</span>
                          </span>
                          {vendor.verified && (
                            <ShieldCheckIcon className="w-4 h-4 text-green-600" title="Verified" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(pagination.currentPage - 1) * 10 + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * 10, pagination.totalVendors)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{pagination.totalVendors}</span>
                  {' '}results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default Vendors; 