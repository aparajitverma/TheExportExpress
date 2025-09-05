import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  TagIcon
} from '@heroicons/react/24/outline';
import { IVendor } from '../../types/vendor';
import AdminService from '../../services/AdminService';

interface VendorDetailsProps {
  vendor: IVendor;
  onClose: () => void;
  onDocumentsUploaded?: () => void;
}

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendor, onClose, onDocumentsUploaded }) => {
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

  // Document upload handlers
  const [documentSections, setDocumentSections] = React.useState([
    { name: '', files: null as FileList | null }
  ]);
  const [uploading, setUploading] = React.useState(false);

  const addDocumentSection = () => {
    setDocumentSections([...documentSections, { name: '', files: null }]);
  };

  const removeDocumentSection = (index: number) => {
    setDocumentSections(documentSections.filter((_, i) => i !== index));
  };

  const updateDocumentSection = (index: number, field: string, value: any) => {
    const updated = [...documentSections];
    updated[index] = { ...updated[index], [field]: value };
    setDocumentSections(updated);
  };

  // Use vendor's own initialProducts array
  const initialProducts = vendor.initialProducts || [];

  const handleUpload = async () => {
    try {
      setUploading(true);
      
      // Filter sections that have files
      const validSections = documentSections.filter(section => 
        section.files && section.files.length > 0
      );
      
      if (validSections.length === 0) {
        alert('Please select files to upload.');
        return;
      }

      // Collect all files with their names from all sections
      const documentsData = validSections.map(section => ({
        files: section.files ? Array.from(section.files) : [],
        name: section.name || 'Untitled Document'
      }));

      await AdminService.uploadVendorDocuments(vendor._id, documentsData);
      
      // Reset form
      setDocumentSections([
        { name: '', files: null }
      ]);
      
      onDocumentsUploaded && onDocumentsUploaded();
    } catch (e) {
      // toast handled inside service
    } finally {
      setUploading(false);
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

          {/* Initial Products */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Initial Products from this Vendor</h3>
            {initialProducts.length === 0 ? (
              <div className="text-sm text-gray-600">No initial products specified for this vendor.</div>
            ) : (
              <div className="space-y-4">
                {initialProducts.map((p: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold text-gray-900">{p.name}</p>
                      </div>
                      <div className="text-right">
                        {p.currentPrice !== undefined && (
                          <p className="text-base font-semibold text-gray-900">
                            {p.currentPrice} {p.currency || 'USD'}
                          </p>
                        )}
                        {p.unit && (
                          <p className="text-xs text-gray-600">Unit: {p.unit}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-800">
                      {p.minimumOrderQuantity !== undefined && (
                        <div><span className="text-gray-600">Minimum Order Quantity:</span> {p.minimumOrderQuantity}</div>
                      )}
                      {p.leadTime !== undefined && (
                        <div><span className="text-gray-600">Lead Time:</span> {p.leadTime} days</div>
                      )}
                      {p.hscCode && (
                        <div><span className="text-gray-600">HSC Code:</span> {p.hscCode}</div>
                      )}
                      {p.additionalComment && (
                        <div className="md:col-span-2"><span className="text-gray-600">Comment:</span> {p.additionalComment}</div>
                      )}
                    </div>
                    {Array.isArray(p.packagingOptions) && p.packagingOptions.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm font-medium text-gray-900 mb-1">Packaging Options</div>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {p.packagingOptions?.map((option: any, optIndex: number) => (
                            <li key={optIndex}>
                              {option.option}: ${option.pricePerOption || 'N/A'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Product Certification Files */}
                    {p.certificationFiles && p.certificationFiles.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Certification Files:</span>
                        <div className="mt-1 space-y-1">
                          {p.certificationFiles.map((file: string, fileIndex: number) => (
                            <div key={fileIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                              <span className="text-gray-600 truncate">{file.split('/').pop() || file}</span>
                              <div className="flex gap-2">
                                <a
                                  href={`http://localhost:3000/uploads/${file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-xs"
                                >
                                  View
                                </a>
                                <a
                                  href={`http://localhost:3000/uploads/${file}`}
                                  download
                                  className="text-green-600 hover:text-green-800 text-xs"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Existing Documents Display */}
          {((vendor.documents?.certificates?.length || 0) > 0 || (vendor.documents?.brochures?.length || 0) > 0 || (vendor.documents?.catalogs?.length || 0) > 0 || (vendor.documents?.other?.length || 0) > 0) && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Certificates */}
                {(vendor.documents?.certificates?.length || 0) > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Certificates ({vendor.documents?.certificates?.length || 0})</h4>
                    <div className="space-y-2">
                      {(vendor.documents?.certificates || []).map((cert: string, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-600 truncate">{cert.split('/').pop()}</span>
                          <div className="flex gap-2">
                            <a
                              href={`http://localhost:3000/uploads/${cert}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              View
                            </a>
                            <a
                              href={`http://localhost:3000/uploads/${cert}`}
                              download
                              className="text-green-600 hover:text-green-800 text-xs"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brochures */}
                {(vendor.documents?.brochures?.length || 0) > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Brochures ({vendor.documents?.brochures?.length || 0})</h4>
                    <div className="space-y-2">
                      {(vendor.documents?.brochures || []).map((brochure: string, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-600 truncate">{brochure.split('/').pop()}</span>
                          <div className="flex gap-2">
                            <a
                              href={`http://localhost:3000/uploads/${brochure}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              View
                            </a>
                            <a
                              href={`http://localhost:3000/uploads/${brochure}`}
                              download
                              className="text-green-600 hover:text-green-800 text-xs"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Catalogs */}
                {(vendor.documents?.catalogs?.length || 0) > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Catalogs ({vendor.documents?.catalogs?.length || 0})</h4>
                    <div className="space-y-2">
                      {(vendor.documents?.catalogs || []).map((catalog: string, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-600 truncate">{catalog.split('/').pop()}</span>
                          <div className="flex gap-2">
                            <a
                              href={`http://localhost:3000/uploads/${catalog}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              View
                            </a>
                            <a
                              href={`http://localhost:3000/uploads/${catalog}`}
                              download
                              className="text-green-600 hover:text-green-800 text-xs"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Documents */}
                {(vendor.documents?.other?.length || 0) > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Other Documents ({vendor.documents?.other?.length || 0})</h4>
                    <div className="space-y-2">
                      {(vendor.documents?.other || []).map((doc: string, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-600 truncate">{doc.split('/').pop()}</span>
                          <div className="flex gap-2">
                            <a
                              href={`http://localhost:3000/uploads/${doc}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              View
                            </a>
                            <a
                              href={`http://localhost:3000/uploads/${doc}`}
                              download
                              className="text-green-600 hover:text-green-800 text-xs"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Document Uploads */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Upload New Documents</h3>
              <button
                onClick={addDocumentSection}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Add More Files
              </button>
            </div>
            
            <div className="space-y-4">
              {documentSections.map((section, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    {/* Document Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Document Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter document name or description"
                        value={section.name}
                        onChange={(e) => updateDocumentSection(index, 'name', e.target.value)}
                        className="block w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Files (Multiple allowed)
                      </label>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,image/*"
                        onChange={(e) => updateDocumentSection(index, 'files', e.target.files)}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
                      />
                    </div>
                    
                    {/* Remove Button */}
                    <div>
                      {documentSections.length > 1 && (
                        <button
                          onClick={() => removeDocumentSection(index)}
                          className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* File Preview */}
                  {section.files && section.files.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">
                        Selected files ({section.files.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(section.files).map((file, fileIndex) => (
                          <span
                            key={fileIndex}
                            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                          >
                            {file.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload All Documents'}
              </button>
            </div>
          </div>

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
        <div className="flex justify-between items-center gap-4 p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Tip: You can upload catalogs, brochures, and certificates above, or add products for this vendor.
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/admin/products/new?vendorId=${vendor._id}`}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Product for Vendor
            </Link>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VendorDetails;