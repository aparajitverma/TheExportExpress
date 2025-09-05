import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import AdminService from '../../services/AdminService';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/admin/AdminLayout';
import { UnifiedForm, FormField } from '../../components/admin/UnifiedForm';
import VendorDetails from '../../components/admin/VendorDetails';
import { useVendors } from '../../hooks/useAdminData';
import { IVendor } from '../../types/vendor';

// Vendor form configuration
const vendorFormFields: FormField[] = [
  // Basic Information Section
  {
    name: 'name',
    label: 'Contact Name',
    type: 'text',
    required: true,
    section: 'basic',
    placeholder: 'Enter contact person name'
  },
  {
    name: 'companyName',
    label: 'Company Name',
    type: 'text',
    required: true,
    section: 'basic',
    placeholder: 'Enter company name'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    section: 'basic',
    placeholder: 'Enter email address',
    validation: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : 'Please enter a valid email address';
    }
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    required: true,
    section: 'basic',
    placeholder: 'Enter phone number'
  },
  {
    name: 'website',
    label: 'Website',
    type: 'text',
    section: 'basic',
    placeholder: 'https://company.com'
  },

  // Address Section
  {
    name: 'address',
    label: 'Address Information',
    type: 'object',
    section: 'address',
    gridCols: 2,
    fields: [
      { name: 'street', label: 'Street Address', type: 'text', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'state', label: 'State/Province', type: 'text', required: true },
      { name: 'country', label: 'Country', type: 'text', required: true },
      { name: 'postalCode', label: 'Postal Code', type: 'text', required: true }
    ]
  },

  // Business Information Section
  {
    name: 'businessType',
    label: 'Business Type',
    type: 'select',
    required: true,
    section: 'business',
    options: [
      { value: 'manufacturer', label: 'Manufacturer' },
      { value: 'wholesaler', label: 'Wholesaler' },
      { value: 'distributor', label: 'Distributor' },
      { value: 'exporter', label: 'Exporter' },
      { value: 'supplier', label: 'Supplier' }
    ]
  },
  {
    name: 'industry',
    label: 'Industry',
    type: 'text',
    required: true,
    section: 'business',
    placeholder: 'e.g., Electronics, Textiles, Food'
  },
  {
    name: 'yearEstablished',
    label: 'Year Established',
    type: 'number',
    required: true,
    section: 'business',
    validation: (value) => {
      const currentYear = new Date().getFullYear();
      return value >= 1900 && value <= currentYear ? null : 'Please enter a valid year';
    }
  },
  {
    name: 'employeeCount',
    label: 'Employee Count',
    type: 'number',
    required: true,
    section: 'business',
    validation: (value) => value > 0 ? null : 'Employee count must be greater than 0'
  },

  // Financial Information Section
  {
    name: 'paymentMethod',
    label: 'Payment Method',
    type: 'select',
    required: true,
    section: 'financial',
    options: [
      { value: 'advance', label: 'Advance Payment' },
      { value: 'net30', label: 'Net 30 Days' },
      { value: 'net60', label: 'Net 60 Days' },
      { value: 'net90', label: 'Net 90 Days' },
      { value: 'letter_of_credit', label: 'Letter of Credit' }
    ]
  },
  {
    name: 'currency',
    label: 'Currency',
    type: 'select',
    required: true,
    section: 'financial',
    options: [
      { value: 'USD', label: 'US Dollar (USD)' },
      { value: 'EUR', label: 'Euro (EUR)' },
      { value: 'GBP', label: 'British Pound (GBP)' },
      { value: 'INR', label: 'Indian Rupee (INR)' },
      { value: 'CNY', label: 'Chinese Yuan (CNY)' }
    ]
  },
  {
    name: 'taxId',
    label: 'Tax ID',
    type: 'text',
    required: true,
    section: 'financial',
    placeholder: 'Enter tax identification number'
  },
  {
    name: 'creditTerms',
    label: 'Credit Terms',
    type: 'textarea',
    required: true,
    section: 'financial',
    placeholder: 'Describe credit terms and conditions'
  },

  // Product Information Section
  {
    name: 'initialProducts',
    label: 'Initial Products (Optional)',
    type: 'array',
    section: 'products',
    expandOnMultiple: true,
    arrayItemFields: [
      { name: 'name', label: 'Product Name', type: 'text', placeholder: 'Enter product name', required: true },
      { name: 'currentPrice', label: 'Base Price', type: 'number', placeholder: 'e.g., 120.50' },
      { name: 'currency', label: 'Currency', type: 'select', options: [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
        { value: 'INR', label: 'INR' },
        { value: 'CNY', label: 'CNY' },
      ]},
      { name: 'unit', label: 'Unit', type: 'text', placeholder: 'kg, piece, pack' },
      { name: 'minimumOrderQuantity', label: 'Minimum Order Quantity', type: 'number', placeholder: 'e.g., 1000', validation: (value: number) => value > 0 ? null : 'MOQ must be greater than 0' },
      { name: 'leadTime', label: 'Lead Time (days)', type: 'number', placeholder: 'e.g., 15', validation: (value: number) => value > 0 ? null : 'Lead time must be greater than 0' },
      { name: 'hscCode', label: 'HSC Code', type: 'text', placeholder: 'e.g., 1234.56.78' },
      { name: 'additionalComment', label: 'Additional Comment', type: 'textarea', placeholder: 'Any additional notes or comments about this product' },
      {
        name: 'packagingOptions',
        label: 'Packaging Options & Pricing',
        type: 'array',
        gridCols: 2,
        arrayItemFields: [
          { name: 'option', label: 'Packaging Option', type: 'text', required: true, placeholder: 'e.g., Bulk, Retail Pack' },
          { name: 'pricePerOption', label: 'Price Per Option', type: 'number', placeholder: 'Additional cost' }
        ]
      },
      {
        name: 'certificationFiles',
        label: 'Certification Documents (PDF)',
        type: 'file',
        accept: 'application/pdf',
        multiple: true
      }
    ]
  },

  // Performance Metrics Section
  {
    name: 'rating',
    label: 'Rating (1-5)',
    type: 'number',
    section: 'performance',
    validation: (value) => value >= 1 && value <= 5 ? null : 'Rating must be between 1 and 5'
  },
  {
    name: 'reliabilityScore',
    label: 'Reliability Score (1-100)',
    type: 'number',
    section: 'performance',
    validation: (value) => value >= 1 && value <= 100 ? null : 'Score must be between 1 and 100'
  },

  // Contact Information Section
  {
    name: 'primaryContact',
    label: 'Primary Contact Information',
    type: 'object',
    section: 'contact',
    gridCols: 2,
    fields: [
      { name: 'name', label: 'Contact Name', type: 'text', required: true },
      { name: 'position', label: 'Position/Title', type: 'text', required: true },
      { name: 'email', label: 'Contact Email', type: 'email', required: true },
      { name: 'phone', label: 'Contact Phone', type: 'tel', required: true }
    ]
  },

  // Additional Information
  {
    name: 'specialization',
    label: 'Specializations',
    type: 'array',
    section: 'additional',
    arrayItemFields: [
      { name: 'specialty', label: 'Specialty', type: 'text', required: true }
    ]
  },
  {
    name: 'tags',
    label: 'Tags',
    type: 'array',
    section: 'additional',
    arrayItemFields: [
      { name: 'tag', label: 'Tag', type: 'text', required: true }
    ]
  },
  {
    name: 'notes',
    label: 'Notes',
    type: 'textarea',
    section: 'additional',
    placeholder: 'Additional notes about the vendor'
  },

  // Document Uploads Section
  {
    name: 'certificatesFiles',
    label: 'Vendor Certificates (PDF)',
    type: 'file',
    section: 'documents',
    accept: 'application/pdf',
    multiple: true
  },
  {
    name: 'brochureFiles',
    label: 'Company Brochures (PDF)',
    type: 'file',
    section: 'documents',
    accept: 'application/pdf',
    multiple: true
  }
];

const Vendors: React.FC = () => {
  const {
    data: vendors,
    loading,
    stats,
    filters,
    pagination,
    selectedItems,
    create,
    update,
    remove,
    bulkUpdate,
    updateFilters,
    changePage,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    exportData,
    hasSelection,
    allSelected,
    refresh,
  } = useVendors();

  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [editingVendor, setEditingVendor] = useState<IVendor | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<IVendor | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Form handlers
  const handleCreateVendor = () => {
    setEditingVendor(null);
    setFormMode('create');
    setShowVendorForm(true);
  };

  const handleEditVendor = (vendor: IVendor) => {
    setEditingVendor(vendor);
    setFormMode('edit');
    setShowVendorForm(true);
  };

  const handleViewVendor = (vendor: IVendor) => {
    setSelectedVendor(vendor);
    setShowVendorDetails(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (formMode === 'create') {
      // Extract file fields but keep initialProducts in the vendor data
      const { certificatesFiles, brochureFiles, ...vendorData } = formData;
      
      // Transform array fields to match backend expectations
      if (vendorData.specialization && Array.isArray(vendorData.specialization)) {
        vendorData.specialization = vendorData.specialization.map((item: any) => 
          typeof item === 'object' && item.specialty ? item.specialty : item
        );
      }
      
      if (vendorData.tags && Array.isArray(vendorData.tags)) {
        vendorData.tags = vendorData.tags.map((item: any) => 
          typeof item === 'object' && item.tag ? item.tag : item
        );
      }
      
      // Transform initialProducts to match backend schema
      if (vendorData.initialProducts && Array.isArray(vendorData.initialProducts)) {
        vendorData.initialProducts = vendorData.initialProducts
          .filter((ip: any) => {
            // Skip empty rows
            return Object.values(ip || {}).some((v: any) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0));
          })
          .map((ip: any) => ({
            name: ip.name || '',
            currentPrice: ip.currentPrice ? Number(ip.currentPrice) : undefined,
            currency: ip.currency || 'USD',
            unit: ip.unit || '',
            minimumOrderQuantity: ip.minimumOrderQuantity ? Number(ip.minimumOrderQuantity) : undefined,
            leadTime: ip.leadTime ? Number(ip.leadTime) : undefined,
            hscCode: ip.hscCode || '',
            additionalComment: ip.additionalComment || '',
            packagingOptions: Array.isArray(ip.packagingOptions) ? ip.packagingOptions.map((p: any) => ({
              option: p.option || p.value || p,
              pricePerOption: p.pricePerOption ? Number(p.pricePerOption) : undefined
            })) : [],
            certificationFiles: Array.isArray(ip.certificationFiles) ? Array.from(ip.certificationFiles).map((file: any) => file.name || file) : []
          }));
      }
      
      // Handle file uploads for initialProducts certification documents
      const productCertificationFiles: { [productIndex: number]: FileList } = {};
      if (vendorData.initialProducts && Array.isArray(vendorData.initialProducts)) {
        vendorData.initialProducts.forEach((product: any, index: number) => {
          if (product.certificationFiles && (product.certificationFiles as FileList).length > 0) {
            productCertificationFiles[index] = product.certificationFiles;
            // Store file names in the product data for now
            product.certificationFiles = Array.from(product.certificationFiles).map((file: any) => (file as File).name);
          }
        });
      }

      const created = await create(vendorData);
      const createdVendor: any = (created as any)?.vendor || created; // normalize response shape
      setShowVendorForm(false);
      if (createdVendor) {
        // Upload vendor-level documents
        if (certificatesFiles && (certificatesFiles as any).length > 0) {
          try {
            await (await import('../../services/AdminService')).default.uploadVendorDocuments(createdVendor._id, { certificates: certificatesFiles });
          } catch (e) {
            console.warn('Failed to upload certificates at creation time:', e);
          }
        }
        
        if (brochureFiles && (brochureFiles as any).length > 0) {
          try {
            await (await import('../../services/AdminService')).default.uploadVendorDocuments(createdVendor._id, { brochures: brochureFiles });
          } catch (e) {
            console.warn('Failed to upload brochures at creation time:', e);
          }
        }

        // Upload product certification files
        for (const [productIndex, files] of Object.entries(productCertificationFiles)) {
          try {
            await (await import('../../services/AdminService')).default.uploadVendorDocuments(createdVendor._id, { certificates: files });
          } catch (e) {
            console.warn(`Failed to upload product certification files for product ${productIndex}:`, e);
          }
        }

        // Initial products are now saved directly in the vendor document
        // No need to create separate Product entities
      }
    } else if (formMode === 'edit') {
      await update(editingVendor!._id, formData);
      setShowVendorForm(false);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      await remove(vendorId);
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    await bulkUpdate(selectedItems, { status });
    clearSelection();
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'inactive': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'suspended': return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-200">Vendor Management</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage your supplier network and track performance
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={handleCreateVendor}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Vendor
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 border border-blue-500/20 backdrop-blur-sm p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Vendors</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.overview?.totalVendors || 0}</p>
                </div>
                <BuildingOfficeIcon className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-gray-800/50 border border-green-500/20 backdrop-blur-sm p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Vendors</p>
                  <p className="text-2xl font-bold text-green-400">{stats.overview?.activeVendors || 0}</p>
                </div>
                <CheckCircleIcon className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-gray-800/50 border border-yellow-500/20 backdrop-blur-sm p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.overview?.pendingVendors || 0}</p>
                </div>
                <ClockIcon className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-gray-800/50 border border-purple-500/20 backdrop-blur-sm p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Rating</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.overview?.avgRating?.toFixed(1) || '0.0'}</p>
                </div>
                <StarIcon className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={filters.search || ''}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status || ''}
                onChange={(e) => updateFilters({ status: e.target.value })}
                className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Created Date</option>
                <option value="companyName">Company Name</option>
                <option value="rating">Rating</option>
                <option value="reliabilityScore">Reliability</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {hasSelection && (
          <div className="bg-blue-900/20 border border-blue-500/30 backdrop-blur-sm p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-400 text-sm">
                {selectedItems.length} vendor{selectedItems.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate('active')}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('suspended')}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Suspend
                </button>
                <button
                  onClick={clearSelection}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vendors Table */}
        <div className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={allSelected ? clearSelection : selectAll}
                      className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span className="text-gray-400">Loading vendors...</span>
                      </div>
                    </td>
                  </tr>
                ) : vendors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No vendors found
                    </td>
                  </tr>
                ) : (
                  vendors.map((vendor) => (
                    <tr key={vendor._id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected(vendor._id)}
                          onChange={() => toggleSelection(vendor._id)}
                          className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                              <BuildingOfficeIcon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-200">{vendor.companyName}</div>
                            <div className="text-sm text-gray-400">{vendor.businessType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-200">{vendor.name}</div>
                        <div className="text-sm text-gray-400 flex items-center">
                          <EnvelopeIcon className="w-3 h-3 mr-1" />
                          {vendor.email}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center">
                          <PhoneIcon className="w-3 h-3 mr-1" />
                          {vendor.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-200">{vendor.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Reliability: {vendor.reliabilityScore || 'N/A'}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(vendor.status)}`}>
                          {getStatusIcon(vendor.status)}
                          <span className="ml-1 capitalize">{vendor.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewVendor(vendor)}
                            className="text-blue-400 hover:text-blue-300"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditVendor(vendor)}
                            className="text-yellow-400 hover:text-yellow-300"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVendor(vendor._id)}
                            className="text-red-400 hover:text-red-300"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
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
          {pagination.totalPages > 1 && (
            <div className="bg-gray-700/30 px-4 py-3 flex items-center justify-between border-t border-gray-700">
              <div className="flex-1 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                  {pagination.totalItems} results
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => changePage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => changePage(page)}
                      className={`px-3 py-1 text-sm rounded ${
                        page === pagination.currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => changePage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Forms and Modals */}
        {showVendorForm && (
          <UnifiedForm
            title={formMode === 'create' ? 'Add New Vendor' : 'Edit Vendor'}
            fields={vendorFormFields}
            initialData={editingVendor || {}}
            onSubmit={handleFormSubmit}
            onClose={() => setShowVendorForm(false)}
            submitText={formMode === 'create' ? 'Create Vendor' : 'Update Vendor'}
          />
        )}

        {showVendorDetails && selectedVendor && (
          <VendorDetails
            vendor={selectedVendor}
            onClose={() => setShowVendorDetails(false)}
            onDocumentsUploaded={() => refresh()}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Vendors;