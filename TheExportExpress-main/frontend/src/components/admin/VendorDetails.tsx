import React from 'react';
import { motion } from 'framer-motion';
import { 
  XMarkIcon,
  BuildingOfficeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  StarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  UsersIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { IVendor } from '../../types/vendor';

interface VendorDetailsProps {
  vendor: IVendor;
  onClose: () => void;
}

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendor, onClose }) => {
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
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{vendor.name}</h2>
            <p className="text-sm text-gray-600">{vendor.companyName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Vendor Code</label>
                  <p className="text-sm text-gray-900">{vendor.vendorCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Business Type</label>
                  <p className="text-sm text-gray-900 capitalize">{vendor.businessType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Industry</label>
                  <p className="text-sm text-gray-900">{vendor.industry}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Year Established</label>
                  <p className="text-sm text-gray-900">{vendor.yearEstablished}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Employee Count</label>
                  <p className="text-sm text-gray-900">{vendor.employeeCount} employees</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <EnvelopeIcon className="w-3 h-3" />
                    {vendor.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <PhoneIcon className="w-3 h-3" />
                    {vendor.phone}
                  </p>
                </div>
                {vendor.website && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Website</label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <GlobeAltIcon className="w-3 h-3" />
                      {vendor.website}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Primary Contact</label>
                  <p className="text-sm text-gray-900">{vendor.primaryContact.name}</p>
                  <p className="text-xs text-gray-600">{vendor.primaryContact.position}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2" />
              Address
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-900">
                {vendor.address.street}<br />
                {vendor.address.city}, {vendor.address.state} {vendor.address.postalCode}<br />
                {vendor.address.country}
              </p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <StarIcon className="w-5 h-5 mr-2" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{vendor.rating.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{vendor.reliabilityScore}%</p>
                <p className="text-sm text-gray-600">Reliability</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">{vendor.qualityScore}%</p>
                <p className="text-sm text-gray-600">Quality</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">{vendor.deliveryScore}%</p>
                <p className="text-sm text-gray-600">Delivery</p>
              </div>
            </div>
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Overall Score</p>
              <p className="text-2xl font-bold text-gray-900">{getOverallScore(vendor)}%</p>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2" />
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Method</label>
                  <p className="text-sm text-gray-900 capitalize">{vendor.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Currency</label>
                  <p className="text-sm text-gray-900">{vendor.currency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Credit Terms</label>
                  <p className="text-sm text-gray-900">{vendor.creditTerms || 'Not specified'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Minimum Order Quantity</label>
                  <p className="text-sm text-gray-900">{vendor.minimumOrderQuantity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Lead Time</label>
                  <p className="text-sm text-gray-900">{vendor.leadTime} days</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Sample Policy</label>
                  <p className="text-sm text-gray-900">{vendor.samplePolicy || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Verification */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              Status & Verification
            </h3>
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vendor.status)}`}>
                {getStatusIcon(vendor.status)}
                <span className="ml-1 capitalize">{vendor.status}</span>
              </span>
              {vendor.verified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-100">
                  <ShieldCheckIcon className="w-4 h-4 mr-1" />
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Specializations and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.specialization.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <TagIcon className="w-5 h-5 mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {vendor.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          {vendor.notes && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900">{vendor.notes}</p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Created: {new Date(vendor.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Updated: {new Date(vendor.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VendorDetails; 