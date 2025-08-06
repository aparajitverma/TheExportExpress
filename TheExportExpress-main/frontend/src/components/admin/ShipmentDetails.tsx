import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  XMarkIcon,
  TruckIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  HomeIcon,
  CurrencyDollarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  EyeIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import { getApiUrl } from '../../config';
import {
  IShipment,
  ShipmentPhase,
  ShipmentStatus,
  TransportMode
} from '../../types/shipment';

interface ShipmentDetailsProps {
  shipment: IShipment;
  onClose: () => void;
  onRefresh: () => void;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ shipment, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);

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
        return <GlobeAltIcon className="w-5 h-5" />;
      case TransportMode.AIR_FREIGHT:
        return <PaperAirplaneIcon className="w-5 h-5" />;
      case TransportMode.ROAD_TRANSPORT:
        return <TruckIcon className="w-5 h-5" />;
      case TransportMode.RAIL_TRANSPORT:
        return <TruckIcon className="w-5 h-5" />;
      case TransportMode.MULTIMODAL:
        return <GlobeAltIcon className="w-5 h-5" />;
      default:
        return <TruckIcon className="w-5 h-5" />;
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPhaseProgress = (phase: ShipmentPhase) => {
    const phases = Object.values(ShipmentPhase);
    const currentIndex = phases.indexOf(shipment.currentPhase);
    const phaseIndex = phases.indexOf(phase);
    
    if (phaseIndex < currentIndex) return 'completed';
    if (phaseIndex === currentIndex) return 'current';
    return 'pending';
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
        className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto border border-gray-700/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Shipment Details
            </h2>
            <p className="text-sm text-gray-300">
              {shipment.shipmentId} - Order #{shipment.orderNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Shipment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <TruckIcon className="w-5 h-5 mr-2" />
                Shipment Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipment ID:</span>
                  <span className="text-gray-200 font-medium">{shipment.shipmentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Number:</span>
                  <span className="text-gray-200">{shipment.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Phase:</span>
                  <div className="flex items-center">
                    {getPhaseIcon(shipment.currentPhase)}
                    <span className="text-gray-200 ml-2">{shipment.currentPhase.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(shipment.currentStatus)}`}>
                    {getStatusIcon(shipment.currentStatus)}
                    <span className="ml-1">{shipment.currentStatus.replace('_', ' ')}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transport Mode:</span>
                  <div className="flex items-center">
                    {getTransportModeIcon(shipment.transportMode)}
                    <span className="text-gray-200 ml-2">{shipment.transportMode.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2" />
                Route Information
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">Origin</div>
                  <div className="text-gray-200 font-medium">{shipment.originLocation.city}, {shipment.originLocation.country}</div>
                  <div className="text-sm text-gray-400">{shipment.originLocation.address}</div>
                </div>
                <div className="flex justify-center">
                  <TruckIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Destination</div>
                  <div className="text-gray-200 font-medium">{shipment.destinationLocation.city}, {shipment.destinationLocation.country}</div>
                  <div className="text-sm text-gray-400">{shipment.destinationLocation.address}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-gray-200">{formatDate(shipment.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Est. Delivery:</span>
                  <span className="text-gray-200">{formatDate(shipment.estimatedDeliveryDate)}</span>
                </div>
                {shipment.actualDeliveryDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Actual Delivery:</span>
                    <span className="text-green-400">{formatDate(shipment.actualDeliveryDate)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Packages:</span>
                  <span className="text-gray-200">{shipment.numberOfPackages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Weight:</span>
                  <span className="text-gray-200">{shipment.totalWeight} kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Phase Progress */}
          <div className="bg-gray-700/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-200 mb-6 flex items-center">
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              Export Flow Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.values(ShipmentPhase).map((phase, index) => {
                const progress = getPhaseProgress(phase);
                const phaseInfo = shipment.phases[phase];
                
                return (
                  <div
                    key={phase}
                    className={`p-4 rounded-lg border ${
                      progress === 'completed'
                        ? 'bg-green-600/20 border-green-500/30'
                        : progress === 'current'
                        ? 'bg-blue-600/20 border-blue-500/30'
                        : 'bg-gray-600/20 border-gray-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {getPhaseIcon(phase)}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        progress === 'completed'
                          ? 'bg-green-600/20 text-green-400'
                          : progress === 'current'
                          ? 'bg-blue-600/20 text-blue-400'
                          : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        Phase {index + 1}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-200 mb-1">
                      {phase.replace('_', ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      ).join(' ')}
                    </div>
                    <div className="text-xs text-gray-400">
                      Est: {phaseInfo?.estimatedDuration || 24}h
                    </div>
                    {phaseInfo?.actualDuration && (
                      <div className="text-xs text-gray-300">
                        Act: {Math.round(phaseInfo.actualDuration)}h
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cargo Information */}
          <div className="bg-gray-700/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Cargo Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Description:</span>
                  <span className="text-gray-200">{shipment.cargoDescription}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">HS Code:</span>
                  <span className="text-gray-200">{shipment.hsCode || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Weight:</span>
                  <span className="text-gray-200">{shipment.totalWeight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Volume:</span>
                  <span className="text-gray-200">{shipment.totalVolume} m³</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Packages:</span>
                  <span className="text-gray-200">{shipment.numberOfPackages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Insurance Value:</span>
                  <span className="text-gray-200">{formatCurrency(shipment.insuranceValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dangerous Goods:</span>
                  <span className={shipment.dangerousGoods ? 'text-red-400' : 'text-green-400'}>
                    {shipment.dangerousGoods ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Temperature Controlled:</span>
                  <span className={shipment.temperatureControlled ? 'text-blue-400' : 'text-gray-400'}>
                    {shipment.temperatureControlled ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-700/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2" />
              Financial Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping Cost:</span>
                  <span className="text-gray-200">{formatCurrency(shipment.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Insurance Cost:</span>
                  <span className="text-gray-200">{formatCurrency(shipment.insuranceCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Customs Duties:</span>
                  <span className="text-gray-200">{formatCurrency(shipment.customsDuties)}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Currency:</span>
                  <span className="text-gray-200">{shipment.currency}</span>
                </div>
                <div className="border-t border-gray-600/50 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-200 font-medium">Total Cost:</span>
                    <span className="text-gray-200 font-bold text-lg">{formatCurrency(shipment.totalCost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Updates */}
          <div className="bg-gray-700/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Tracking Updates ({shipment.trackingUpdates.length})
            </h3>
            <div className="space-y-4">
              {shipment.trackingUpdates.map((update, index) => (
                <div key={update._id} className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getPhaseIcon(update.phase)}
                      <div>
                        <div className="text-sm font-medium text-gray-200">
                          {update.phase.replace('_', ' ')} - {update.status.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-300 mt-1">{update.description}</div>
                        <div className="text-xs text-gray-400 mt-2">
                          {update.location.city}, {update.location.country}
                        </div>
                        {update.isException && (
                          <div className="text-xs text-red-400 mt-1">
                            Exception: {update.exceptionReason}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-300">{formatDate(update.timestamp)}</div>
                      <div className="text-xs text-gray-400">{update.updatedBy.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stakeholders */}
          <div className="bg-gray-700/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Stakeholders ({shipment.stakeholders.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shipment.stakeholders.map((stakeholder, index) => (
                <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-200">{stakeholder.name}</div>
                  {stakeholder.company && (
                    <div className="text-sm text-gray-300">{stakeholder.company}</div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">{stakeholder.role}</div>
                  <div className="text-xs text-blue-400 mt-1">{stakeholder.type.replace('_', ' ')}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <EnvelopeIcon className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{stakeholder.email}</span>
                  </div>
                  {stakeholder.phone && (
                    <div className="flex items-center gap-2 mt-1">
                      <PhoneIcon className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{stakeholder.phone}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          {shipment.documents.length > 0 && (
            <div className="bg-gray-700/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
                Documents ({shipment.documents.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shipment.documents.map((document) => (
                  <div key={document._id} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-200">{document.fileName}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {document.type.replace('_', ' ')} - {document.phase.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Uploaded: {formatDate(document.uploadedAt)}
                        </div>
                        {document.verified && (
                          <div className="text-xs text-green-400 mt-1">
                            ✓ Verified by {document.verifiedBy?.name}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => window.open(document.fileUrl, '_blank')}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 p-1 rounded"
                        title="View Document"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          {shipment.specialInstructions && (
            <div className="bg-gray-700/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Special Instructions</h3>
              <p className="text-gray-300">{shipment.specialInstructions}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShipmentDetails;