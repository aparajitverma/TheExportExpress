import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  XMarkIcon,
  ClockIcon,
  MapPinIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  TruckIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  HomeIcon,
  CheckCircleIcon,
  XCircleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { getApiUrl } from '../../config';
import {
  IShipment,
  ITrackingUpdateFormData,
  ShipmentPhase,
  ShipmentStatus
} from '../../types/shipment';

interface TrackingUpdateProps {
  shipment: IShipment;
  onClose: () => void;
  onSuccess: () => void;
}

const TrackingUpdate: React.FC<TrackingUpdateProps> = ({ shipment, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [currentApiUrl, setCurrentApiUrl] = useState('');
  const [formData, setFormData] = useState<ITrackingUpdateFormData>({
    phase: shipment.currentPhase,
    status: shipment.currentStatus,
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    description: '',
    estimatedNextUpdate: '',
    attachments: [],
    isException: false,
    exceptionReason: ''
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

  const handleInputChange = (field: keyof ITrackingUpdateFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const addAttachment = () => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, '']
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const updateAttachment = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.map((att, i) => i === index ? value : att)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentApiUrl) {
      toast.error('API URL not initialized');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${currentApiUrl}/api/shipments/${shipment._id}/tracking`,
        {
          ...formData,
          attachments: formData.attachments.filter(att => att.trim() !== '')
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Tracking update added successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Error updating tracking:', error);
      toast.error(error.response?.data?.message || 'Failed to update tracking');
    } finally {
      setLoading(false);
    }
  };

  const getPhaseIcon = (phase: ShipmentPhase) => {
    switch (phase) {
      case ShipmentPhase.VENDOR_TO_HOST:
        return <BuildingOfficeIcon className="w-5 h-5" />;
      case ShipmentPhase.HOST_TO_PORT:
        return <TruckIcon className="w-5 h-5" />;
      case ShipmentPhase.PORT_TO_PORT:
        return <GlobeAltIcon className="w-5 h-5" />;
      case ShipmentPhase.IMPORT_PROCESSING:
        return <DocumentTextIcon className="w-5 h-5" />;
      case ShipmentPhase.PORT_TO_CLIENT:
        return <HomeIcon className="w-5 h-5" />;
      default:
        return <TruckIcon className="w-5 h-5" />;
    }
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

  const getStatusesForPhase = (phase: ShipmentPhase): ShipmentStatus[] => {
    switch (phase) {
      case ShipmentPhase.VENDOR_TO_HOST:
        return [
          ShipmentStatus.PENDING_PICKUP,
          ShipmentStatus.PICKED_UP,
          ShipmentStatus.IN_TRANSIT_TO_HOST,
          ShipmentStatus.ARRIVED_AT_HOST,
          ShipmentStatus.QUALITY_CHECKED,
          ShipmentStatus.READY_FOR_EXPORT
        ];
      case ShipmentPhase.HOST_TO_PORT:
        return [
          ShipmentStatus.DOCUMENTATION_IN_PROGRESS,
          ShipmentStatus.CUSTOMS_SUBMITTED,
          ShipmentStatus.IN_TRANSIT_TO_PORT,
          ShipmentStatus.ARRIVED_AT_PORT,
          ShipmentStatus.CUSTOMS_CLEARED,
          ShipmentStatus.LOADED_FOR_SHIPPING
        ];
      case ShipmentPhase.PORT_TO_PORT:
        return [
          ShipmentStatus.DEPARTED_ORIGIN_PORT,
          ShipmentStatus.IN_TRANSIT_INTERNATIONAL,
          ShipmentStatus.ARRIVED_DESTINATION_PORT,
          ShipmentStatus.DISCHARGED
        ];
      case ShipmentPhase.IMPORT_PROCESSING:
        return [
          ShipmentStatus.IMPORT_DOCUMENTATION_SUBMITTED,
          ShipmentStatus.CUSTOMS_INSPECTION,
          ShipmentStatus.DUTIES_PAID,
          ShipmentStatus.IMPORT_CLEARED,
          ShipmentStatus.READY_FOR_DELIVERY
        ];
      case ShipmentPhase.PORT_TO_CLIENT:
        return [
          ShipmentStatus.OUT_FOR_DELIVERY,
          ShipmentStatus.DELIVERY_ATTEMPTED,
          ShipmentStatus.DELIVERED,
          ShipmentStatus.DELIVERY_CONFIRMED
        ];
      default:
        return Object.values(ShipmentStatus);
    }
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
              Update Shipment Tracking
            </h2>
            <p className="text-sm text-gray-300">
              {shipment.shipmentId} - {shipment.orderNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Current Status */}
        <div className="p-6 border-b border-gray-700/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Current Status</h3>
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getPhaseIcon(shipment.currentPhase)}
                <div>
                  <div className="text-sm font-medium text-gray-200">
                    {shipment.currentPhase.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-gray-400">
                    {shipment.currentStatus.replace('_', ' ')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300">
                  Last updated: {new Date(shipment.updatedAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-400">
                  Updates: {shipment.trackingUpdates.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Phase and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phase *</label>
              <select
                value={formData.phase}
                onChange={(e) => {
                  const newPhase = e.target.value as ShipmentPhase;
                  handleInputChange('phase', newPhase);
                  // Reset status when phase changes
                  const statusesForPhase = getStatusesForPhase(newPhase);
                  if (statusesForPhase.length > 0) {
                    handleInputChange('status', statusesForPhase[0]);
                  }
                }}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {Object.values(ShipmentPhase).map(phase => (
                  <option key={phase} value={phase}>
                    {phase.replace('_', ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as ShipmentStatus)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {getStatusesForPhase(formData.phase).map(status => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-md font-medium text-gray-300 mb-3 flex items-center">
              <MapPinIcon className="w-4 h-4 mr-2" />
              Current Location
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => handleLocationChange('address', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Current location address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => handleLocationChange('state', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => handleLocationChange('country', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              placeholder="Describe the current status and any relevant details..."
              required
            />
          </div>

          {/* Estimated Next Update */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estimated Next Update
            </label>
            <input
              type="datetime-local"
              value={formData.estimatedNextUpdate}
              onChange={(e) => handleInputChange('estimatedNextUpdate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Exception Handling */}
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="isException"
                checked={formData.isException}
                onChange={(e) => handleInputChange('isException', e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="isException" className="text-sm font-medium text-gray-300 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1 text-red-400" />
                Mark as Exception
              </label>
            </div>
            
            {formData.isException && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exception Reason
                </label>
                <textarea
                  value={formData.exceptionReason}
                  onChange={(e) => handleInputChange('exceptionReason', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-red-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Explain the exception or issue..."
                />
              </div>
            )}
          </div>

          {/* Attachments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">Attachments (URLs)</label>
              <button
                type="button"
                onClick={addAttachment}
                className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-md hover:bg-blue-600/30 transition-colors flex items-center gap-1"
              >
                <PlusIcon className="w-4 h-4" />
                Add
              </button>
            </div>
            
            {formData.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="url"
                  value={attachment}
                  onChange={(e) => updateAttachment(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-600/20 p-2 rounded"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-300 mb-3">Update Preview</h4>
            <div className="flex items-start gap-3">
              {getPhaseIcon(formData.phase)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(formData.status)}
                  <span className="text-sm font-medium text-gray-200">
                    {formData.phase.replace('_', ' ')} - {formData.status.replace('_', ' ')}
                  </span>
                  {formData.isException && (
                    <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded-full border border-red-500/30">
                      Exception
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-300 mb-2">{formData.description}</div>
                <div className="text-xs text-gray-400">
                  {formData.location.city}{formData.location.country && `, ${formData.location.country}`}
                </div>
                {formData.estimatedNextUpdate && (
                  <div className="text-xs text-blue-400 mt-1">
                    Next update: {new Date(formData.estimatedNextUpdate).toLocaleString()}
                  </div>
                )}
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
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Updating...' : 'Add Update'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TrackingUpdate;