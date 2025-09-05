export interface IVendor {
  _id: string;
  // Basic Information
  name: string;
  companyName: string;
  vendorCode: string;
  email: string;
  phone: string;
  website?: string;
  // Computed fields (from server) for UI convenience
  productCount?: number;
  catalogsCount?: number;
  certificatesCount?: number;
  
  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  
  // Business Information
  businessType: 'manufacturer' | 'wholesaler' | 'distributor' | 'exporter' | 'supplier';
  industry: string;
  specialization: string[];
  yearEstablished: number;
  employeeCount: number;
  
  // Contact Information
  primaryContact: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  
  // Financial Information
  creditTerms: string;
  paymentMethod: 'advance' | 'net30' | 'net60' | 'net90' | 'letter_of_credit';
  currency: string;
  taxId: string;
  
  // Quality & Certifications
  certifications: {
    iso9001: boolean;
    iso14001: boolean;
    fssai: boolean;
    organic: boolean;
    fairTrade: boolean;
    other: string[];
  };
  
  // Product Information
  productCategories: Array<{
    _id: string;
    name: string;
    description?: string;
  }>;
  minimumOrderQuantity: number;
  leadTime: number; // in days
  samplePolicy: string;
  
  // Performance Metrics
  rating: number; // 1-5 stars
  reliabilityScore: number; // 1-100
  qualityScore: number; // 1-100
  deliveryScore: number; // 1-100
  
  // Status & Verification
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  verified: boolean;
  verificationDate?: string;
  
  // Documents
  documents: {
    businessLicense?: string;
    taxCertificate?: string;
    qualityCertificates: string[];
    bankDetails?: string;
    other: string[];
    // Additional document types for uploads
    certificates?: string[];
    brochures?: string[];
    catalogs?: string[];
  };
  
  // Initial Products - vendor-specific product catalog
  initialProducts?: Array<{
    name: string;
    currentPrice?: number;
    currency?: string;
    unit?: string;
    minimumOrderQuantity?: number;
    leadTime?: number;
    hscCode?: string;
    additionalComment?: string;
    packagingOptions?: Array<{
      option: string;
      pricePerOption?: number;
    }>;
    certificationFiles?: string[];
  }>;
  
  // Notes & History
  notes?: string;
  tags: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface VendorFormData {
  // Basic Information
  name: string;
  companyName: string;
  vendorCode?: string;
  email: string;
  phone: string;
  website?: string;
  
  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  
  // Business Information
  businessType: 'manufacturer' | 'wholesaler' | 'distributor' | 'exporter' | 'supplier';
  industry: string;
  specialization: string[];
  yearEstablished: number;
  employeeCount: number;
  
  // Contact Information
  primaryContact: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  
  // Financial Information
  creditTerms: string;
  paymentMethod: 'advance' | 'net30' | 'net60' | 'net90' | 'letter_of_credit';
  currency: string;
  taxId: string;
  
  // Quality & Certifications
  certifications: {
    iso9001: boolean;
    iso14001: boolean;
    fssai: boolean;
    organic: boolean;
    fairTrade: boolean;
    other: string[];
  };
  
  // Product Information
  productCategories: string[];
  minimumOrderQuantity: number;
  leadTime: number;
  samplePolicy: string;
  
  // Performance Metrics
  rating: number;
  reliabilityScore: number;
  qualityScore: number;
  deliveryScore: number;
  
  // Status & Verification
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  verified: boolean;
  
  // Documents
  documents: {
    businessLicense?: string;
    taxCertificate?: string;
    qualityCertificates: string[];
    bankDetails?: string;
    other: string[];
  };
  
  // Notes & History
  notes?: string;
  tags: string[];
}

export interface VendorStats {
  totalVendors: number;
  activeVendors: number;
  pendingVendors: number;
  verifiedVendors: number;
  avgRating: number;
  avgReliabilityScore: number;
  avgQualityScore: number;
  avgDeliveryScore: number;
}

export interface VendorFilters {
  search: string;
  status?: string;
  businessType?: string;
  industry?: string;
  country?: string;
  verified?: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface VendorPagination {
  currentPage: number;
  totalPages: number;
  totalVendors: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface VendorListResponse {
  vendors: IVendor[];
  pagination: VendorPagination;
  stats: VendorStats;
}

export interface VendorStatsResponse {
  overview: VendorStats;
  businessTypeStats: Array<{
    _id: string;
    count: number;
  }>;
  countryStats: Array<{
    _id: string;
    count: number;
  }>;
  topRatedVendors: Array<{
    _id: string;
    name: string;
    companyName: string;
    rating: number;
    reliabilityScore: number;
    qualityScore: number;
    deliveryScore: number;
  }>;
} 