import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  MapPinIcon,
  TruckIcon,
  PaperAirplaneIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { getApiUrl } from '../../config';
import {
  IShipmentFormData,
  TransportMode,
  ILocation
} from '../../types/shipment';
import { IOrder } from '../../types/order';

interface ShipmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ShipmentForm: React.FC<ShipmentFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [currentApiUrl, setCurrentApiUrl] = useState('');
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<IShipmentFormData>({
    orderId: '',
    originLocation: {
      address: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      facilityType: 'warehouse'
    },
    destinationLocation: {
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      facilityType: 'warehouse'
    },
    transitPorts: [],
    transportMode: TransportMode.SEA_FREIGHT,
    totalWeight: 0,
    totalVolume: 0,
    numberOfPackages: 1,
    cargoDescription: '',
    hsCode: '',
    insuranceValue: 0,
    shippingCost: 0,
    specialInstructions: '',
    dangerousGoods: false,
    temperatureControlled: false,
    fragile: false
  });

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
          limit: 20
        }
      });
      setOrders(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    }
  };

  const handleInputChange = (field: keyof IShipmentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (
    locationType: 'originLocation' | 'destinationLocation',
    field: keyof ILocation,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [locationType]: {
        ...prev[locationType],
        [field]: value
      }
    }));
  };

  const addTransitPort = () => {
    setFormData(prev => ({
      ...prev,
      transitPorts: [
        ...prev.transitPorts,
        {
          address: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          portCode: '',
          facilityType: 'port'
        }
      ]
    }));
  };

  const removeTransitPort = (index: number) => {
    setFormData(prev => ({
      ...prev,
      transitPorts: prev.transitPorts.filter((_, i) => i !== index)
    }));
  };

  const updateTransitPort = (index: number, field: keyof ILocation, value: any) => {
    setFormData(prev => ({
      ...prev,
      transitPorts: prev.transitPorts.map((port, i) =>
        i === index ? { ...port, [field]: value } : port
      )
    }));
  };

  const handleOrderSelect = (orderId: string) => {
    const selectedOrder = orders.find(order => order._id === orderId);
    if (selectedOrder) {
      // Auto-populate some fields from order
      setFormData(prev => ({
        ...prev,
        orderId,
        destinationLocation: {
          ...prev.destinationLocation,
          address: selectedOrder.customerAddress.street,
          city: selectedOrder.customerAddress.city,
          state: selectedOrder.customerAddress.state,
          country: selectedOrder.customerAddress.country,
          postalCode: selectedOrder.customerAddress.postalCode
        },
        insuranceValue: selectedOrder.finalAmount
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.orderId) {
      toast.error('Please select an order');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${currentApiUrl}/api/shipments/orders/${formData.orderId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Shipment created successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Error creating shipment:', error);
      toast.error(error.response?.data?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
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
        className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-700/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Create New Shipment
            </h2>
            <p className="text-sm text-gray-300">
              Set up shipment tracking for international export
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Order Selection */}
          <div className="border-b border-gray-700/50 pb-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Select Order</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search orders by number or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => handleOrderSelect(order._id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    formData.orderId === order._id
                      ? 'bg-blue-600/20 border-blue-500/50'
                      : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-200">{order.orderNumber}</div>
                      <div className="text-sm text-gray-400">{order.customerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-200">
                        {formatCurrency(order.finalAmount)}
                      </div>
                      <div className="text-xs text-gray-400">{order.items.length} items</div>
                    </div>
                    {formData.orderId === order._id && (
                      <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Route Information */}
          <div className="border-b border-gray-700/50 pb-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2" />
              Route Information
            </h3>
            
            {/* Origin Location */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-300 mb-3">Origin Location (India)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
                  <input
                    type="text"
                    value={formData.originLocation.address}
                    onChange={(e) => handleLocationChange('originLocation', 'address', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.originLocation.city}
                    onChange={(e) => handleLocationChange('originLocation', 'city', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                  <input
                    type="text"
                    value={formData.originLocation.state}
                    onChange={(e) => handleLocationChange('originLocation', 'state', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Postal Code *</label>
                  <input
                    type="text"
                    value={formData.originLocation.postalCode}
                    onChange={(e) => handleLocationChange('originLocation', 'postalCode', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Destination Location */}
            <div>
              <h4 className="text-md font-medium text-gray-300 mb-3">Destination Location</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
                  <input
                    type="text"
                    value={formData.destinationLocation.address}
                    onChange={(e) => handleLocationChange('destinationLocation', 'address', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.destinationLocation.city}
                    onChange={(e) => handleLocationChange('destinationLocation', 'city', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                  <input
                    type="text"
                    value={formData.destinationLocation.state}
                    onChange={(e) => handleLocationChange('destinationLocation', 'state', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
                  <input
                    type="text"
                    value={formData.destinationLocation.country}
                    onChange={(e) => handleLocationChange('destinationLocation', 'country', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Postal Code *</label>
                  <input
                    type="text"
                    value={formData.destinationLocation.postalCode}
                    onChange={(e) => handleLocationChange('destinationLocation', 'postalCode', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Transit Ports */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-300">Transit Ports (Optional)</h4>
                <button
                  type="button"
                  onClick={addTransitPort}
                  className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-md hover:bg-blue-600/30 transition-colors flex items-center gap-1"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Port
                </button>
              </div>
              {formData.transitPorts.map((port, index) => (
                <div key={index} className="bg-gray-700/30 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-gray-300">Transit Port {index + 1}</h5>
                    <button
                      type="button"
                      onClick={() => removeTransitPort(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-600/20 p-1 rounded"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Port Code</label>
                      <input
                        type="text"
                        value={port.portCode || ''}
                        onChange={(e) => updateTransitPort(index, 'portCode', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                        placeholder="e.g., INMAA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                      <input
                        type="text"
                        value={port.city}
                        onChange={(e) => updateTransitPort(index, 'city', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                      <input
                        type="text"
                        value={port.country}
                        onChange={(e) => updateTransitPort(index, 'country', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipment Details */}
          <div className="border-b border-gray-700/50 pb-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <TruckIcon className="w-5 h-5 mr-2" />
              Shipment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Transport Mode *</label>
                  <select
                    value={formData.transportMode}
                    onChange={(e) => handleInputChange('transportMode', e.target.value as TransportMode)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {Object.values(TransportMode).map(mode => (
                      <option key={mode} value={mode}>
                        {mode.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cargo Description *</label>
                  <textarea
                    value={formData.cargoDescription}
                    onChange={(e) => handleInputChange('cargoDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    placeholder="Describe the cargo being shipped..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">HS Code</label>
                  <input
                    type="text"
                    value={formData.hsCode}
                    onChange={(e) => handleInputChange('hsCode', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    placeholder="Harmonized System Code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Special Instructions</label>
                  <textarea
                    value={formData.specialInstructions}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    placeholder="Any special handling instructions..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Number of Packages *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.numberOfPackages}
                    onChange={(e) => handleInputChange('numberOfPackages', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Weight (kg) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalWeight}
                    onChange={(e) => handleInputChange('totalWeight', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Volume (m³) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalVolume}
                    onChange={(e) => handleInputChange('totalVolume', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Insurance Value (USD) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.insuranceValue}
                    onChange={(e) => handleInputChange('insuranceValue', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Shipping Cost (USD) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.shippingCost}
                    onChange={(e) => handleInputChange('shippingCost', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Special Handling */}
          <div className="border-b border-gray-700/50 pb-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
              Special Handling
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.dangerousGoods}
                  onChange={(e) => handleInputChange('dangerousGoods', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-300">Dangerous Goods</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.temperatureControlled}
                  onChange={(e) => handleInputChange('temperatureControlled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-300">Temperature Controlled</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.fragile}
                  onChange={(e) => handleInputChange('fragile', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-300">Fragile</span>
              </label>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-gray-700/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2" />
              Cost Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping Cost:</span>
                  <span className="text-gray-200">{formatCurrency(formData.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Insurance (1%):</span>
                  <span className="text-gray-200">{formatCurrency(formData.insuranceValue * 0.01)}</span>
                </div>
                <div className="border-t border-gray-600/50 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-200 font-medium">Estimated Total:</span>
                    <span className="text-gray-200 font-bold">
                      {formatCurrency(formData.shippingCost + (formData.insuranceValue * 0.01))}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Insurance Value:</span>
                  <span className="text-gray-200">{formatCurrency(formData.insuranceValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transport Mode:</span>
                  <div className="flex items-center">
                    {getTransportModeIcon(formData.transportMode)}
                    <span className="text-gray-200 ml-2">{formData.transportMode.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-md hover:bg-gray-600/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.orderId}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Creating...' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ShipmentForm;