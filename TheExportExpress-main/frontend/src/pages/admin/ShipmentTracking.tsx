import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  TruckIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { getApiUrl } from '../../config';
import {
  IShipment,
  IShipmentAnalytics,
  IShipmentFilters,
  ShipmentPhase,
  ShipmentStatus,
  TransportMode
} from '../../types/shipment';
import ShipmentDetails from '../../components/admin/ShipmentDetails';
import ShipmentForm from '../../components/admin/ShipmentForm';
import TrackingUpdate from '../../components/admin/TrackingUpdate';

const ShipmentTracking: React.FC = () => {
  const [shipments, setShipments] = useState<IShipment[]>([]);
  const [analytics, setAnalytics] = useState<IShipmentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentApiUrl, setCurrentApiUrl] = useState('');
  const [filters, setFilters] = useState<IShipmentFilters>({
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [showShipmentDetails, setShowShipmentDetails] = useState(false);
  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [showTrackingUpdate, setShowTrackingUpdate] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<IShipment | null>(null);

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
      fetchShipments();
      fetchAnalytics();
    }
  }, [currentApiUrl, filters]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${currentApiUrl}/api/shipments`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });

      setShipments(response.data.data || []);
      setPagination(response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
      });
    } catch (error: any) {
      console.error('Error fetching shipments:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch shipments');
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${currentApiUrl}/api/shipments/analytics`, {
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

  const handleFilterChange = (key: keyof IShipmentFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleViewShipmentDetails = (shipment: IShipment) => {
    setSelectedShipment(shipment);
    setShowShipmentDetails(true);
  };

  const handleUpdateTracking = (shipment: IShipment) => {
    setSelectedShipment(shipment);
    setShowTrackingUpdate(true);
  };

  const handleCloseModals = () => {
    setShowShipmentDetails(false);
    setShowShipmentForm(false);
    setShowTrackingUpdate(false);
    setSelectedShipment(null);
  };

  const getPhaseIcon = (phase: ShipmentPhase) => {
    switch (phase) {
      case ShipmentPhase.VENDOR_TO_HOST:
        return <BuildingOfficeIcon className="w-4 h-4" />;
      case ShipmentPhase.HOST_TO_PORT:
        return <TruckIcon className="w-4 h-4" />;
      case ShipmentPhase.PORT_TO_PORT:
        return <GlobeAltIcon className="w-4 h-4" />;
      case ShipmentPhase.IMPORT_PROCESSING:
        return <DocumentTextIcon className="w-4 h-4" />;
      case ShipmentPhase.PORT_TO_CLIENT:
        return <HomeIcon className="w-4 h-4" />;
      default:
        return <TruckIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ShipmentStatus) => {
    if (status.includes('pending') || status.includes('submitted')) {
      return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
    } else if (status.includes('transit') || status.includes('progress') || status.includes('picked')) {
      return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
    } else if (status.includes('delivered') || status.includes('confirmed') || status.includes('cleared')) {
      return 'bg-green-600/20 text-green-400 border-green-500/30';
    } else if (status.includes('failed') || status.includes('exception') || status.includes('lost')) {
      return 'bg-red-600/20 text-red-400 border-red-500/30';
    } else if (status.includes('delayed') || status.includes('attempted')) {
      return 'bg-orange-600/20 text-orange-400 border-orange-500/30';
    }
    return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
  };

  const getStatusIcon = (status: ShipmentStatus) => {
    if (status.includes('pending') || status.includes('submitted')) {
      return <ClockIcon className="w-4 h-4" />;
    } else if (status.includes('transit') || status.includes('progress')) {
      return <TruckIcon className="w-4 h-4" />;
    } else if (status.includes('delivered') || status.includes('confirmed') || status.includes('cleared')) {
      return <CheckCircleIcon className="w-4 h-4" />;
    } else if (status.includes('failed') || status.includes('exception') || status.includes('lost')) {
      return <XCircleIcon className="w-4 h-4" />;
    } else if (status.includes('delayed') || status.includes('attempted')) {
      return <ExclamationTriangleIcon className="w-4 h-4" />;
    }
    return <ClockIcon className="w-4 h-4" />;
  };

  const getTransportModeIcon = (mode: TransportMode) => {
    switch (mode) {
      case TransportMode.SEA_FREIGHT:
        return <GlobeAltIcon className="w-4 h-4" />;
      case TransportMode.AIR_FREIGHT:
        return <PaperAirplaneIcon className="w-4 h-4" />;
      case TransportMode.ROAD_TRANSPORT:
        return <TruckIcon className="w-4 h-4" />;
      case TransportMode.RAIL_TRANSPORT:
        return <TruckIcon className="w-4 h-4" />;
      case TransportMode.MULTIMODAL:
        return <GlobeAltIcon className="w-4 h-4" />;
      default:
        return <TruckIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Advanced Shipment Tracking
            </h1>
            <p className="text-gray-300 mt-1">
              India Export Flow: Vendor → Host → Port → International → Import → Delivery
            </p>
          </div>
          <button
            onClick={() => setShowShipmentForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Create Shipment
          </button>
        </div>
      </div>

      {/* Export Flow Visualization */}
      <div className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
          <GlobeAltIcon className="w-5 h-5 mr-2" />
          International Export Flow Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-lg text-center">
            <BuildingOfficeIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-blue-400 font-medium">Phase 1</div>
            <div className="text-sm text-gray-300">Vendor → Host</div>
            <div className="text-xs text-gray-400">India Collection</div>
          </div>
          <div className="bg-emerald-600/20 border border-emerald-500/30 p-4 rounded-lg text-center">
            <TruckIcon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-emerald-400 font-medium">Phase 2</div>
            <div className="text-sm text-gray-300">Host → Port</div>
            <div className="text-xs text-gray-400">Export Processing</div>
          </div>
          <div className="bg-purple-600/20 border border-purple-500/30 p-4 rounded-lg text-center">
            <GlobeAltIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-purple-400 font-medium">Phase 3</div>
            <div className="text-sm text-gray-300">Port → Port</div>
            <div className="text-xs text-gray-400">International Transit</div>
          </div>
          <div className="bg-orange-600/20 border border-orange-500/30 p-4 rounded-lg text-center">
            <DocumentTextIcon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-orange-400 font-medium">Phase 4</div>
            <div className="text-sm text-gray-300">Import Processing</div>
            <div className="text-xs text-gray-400">Customs & Clearance</div>
          </div>
          <div className="bg-green-600/20 border border-green-500/30 p-4 rounded-lg text-center">
            <HomeIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-green-400 font-medium">Phase 5</div>
            <div className="text-sm text-gray-300">Port → Client</div>
            <div className="text-xs text-gray-400">Final Delivery</div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-800/50 border border-blue-500/20 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Shipments</p>
                <p className="text-2xl font-bold text-blue-400">{analytics.totalShipments}</p>
              </div>
              <div className="bg-blue-600/20 p-3 rounded-lg">
                <TruckIcon className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-green-500/20 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Delivery</p>
                <p className="text-2xl font-bold text-green-400">
                  {Math.round(analytics.averageDeliveryTime / (1000 * 60 * 60 * 24))}d
                </p>
              </div>
              <div className="bg-green-600/20 p-3 rounded-lg">
                <ClockIcon className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-orange-500/20 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Delayed</p>
                <p className="text-2xl font-bold text-orange-400">{analytics.delayedShipments}</p>
              </div>
              <div className="bg-orange-600/20 p-3 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-red-500/20 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Exceptions</p>
                <p className="text-2xl font-bold text-red-400">{analytics.exceptionShipments}</p>
              </div>
              <div className="bg-red-600/20 p-3 rounded-lg">
                <XCircleIcon className="w-6 h-6 text-red-400" />
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
              placeholder="Shipment ID, order number..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phase</label>
            <select
              value={filters.phase || ''}
              onChange={(e) => handleFilterChange('phase', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Phases</option>
              {Object.values(ShipmentPhase).map(phase => (
                <option key={phase} value={phase}>{phase.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {Object.values(ShipmentStatus).map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Transport Mode</label>
            <select
              value={filters.transportMode || ''}
              onChange={(e) => handleFilterChange('transportMode', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Modes</option>
              {Object.values(TransportMode).map(mode => (
                <option key={mode} value={mode}>{mode.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="bg-gray-700/30 px-6 py-4 border-b border-gray-700/50">
          <h3 className="text-lg font-medium text-gray-200">Shipments</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-700/50">
            <thead className="bg-gray-700/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Shipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Phase & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Mode & Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Delivery
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
                    Loading shipments...
                  </td>
                </tr>
              ) : shipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    No shipments found
                  </td>
                </tr>
              ) : (
                shipments.map((shipment) => (
                  <tr key={shipment._id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-200">{shipment.shipmentId}</div>
                        <div className="text-sm text-gray-400">Order: {shipment.orderNumber}</div>
                        <div className="text-xs text-gray-500">{shipment.numberOfPackages} packages</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 text-blue-400 mr-1" />
                        <div>
                          <div className="text-sm text-gray-200">
                            {shipment.originLocation.city}, {shipment.originLocation.country}
                          </div>
                          <div className="text-xs text-gray-400">to</div>
                          <div className="text-sm text-gray-300">
                            {shipment.destinationLocation.city}, {shipment.destinationLocation.country}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center mb-2">
                        {getPhaseIcon(shipment.currentPhase)}
                        <span className="ml-2 text-sm text-gray-300">
                          {shipment.currentPhase.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(shipment.currentStatus)}`}>
                        {getStatusIcon(shipment.currentStatus)}
                        <span className="ml-1">{shipment.currentStatus.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center mb-2">
                        {getTransportModeIcon(shipment.transportMode)}
                        <span className="ml-2 text-sm text-gray-300">
                          {shipment.transportMode.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-200">
                        {formatCurrency(shipment.totalCost)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-200">
                        Est: {formatDate(shipment.estimatedDeliveryDate)}
                      </div>
                      {shipment.actualDeliveryDate && (
                        <div className="text-sm text-green-400">
                          Act: {formatDate(shipment.actualDeliveryDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewShipmentDetails(shipment)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 p-1 rounded"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateTracking(shipment)}
                          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-600/20 p-1 rounded"
                          title="Update Tracking"
                        >
                          <PencilIcon className="w-4 h-4" />
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
      {showShipmentDetails && selectedShipment && (
        <ShipmentDetails
          shipment={selectedShipment}
          onClose={handleCloseModals}
          onRefresh={fetchShipments}
        />
      )}

      {showShipmentForm && (
        <ShipmentForm
          onClose={handleCloseModals}
          onSuccess={() => {
            fetchShipments();
            handleCloseModals();
          }}
        />
      )}

      {showTrackingUpdate && selectedShipment && (
        <TrackingUpdate
          shipment={selectedShipment}
          onClose={handleCloseModals}
          onSuccess={() => {
            fetchShipments();
            handleCloseModals();
          }}
        />
      )}
    </div>
  );
};

export default ShipmentTracking;