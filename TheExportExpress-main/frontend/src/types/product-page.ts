// Enhanced TypeScript interfaces for Product Page Interactive Redesign

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  type: 'main' | 'thumbnail' | '360' | 'lifestyle' | 'detail';
  order: number;
  width?: number;
  height?: number;
}

export interface ProductPricing {
  basePrice: number;
  salePrice?: number;
  currency: string;
  bulkDiscounts: BulkDiscount[];
  promotions: Promotion[];
  priceHistory?: PriceHistoryEntry[];
}

export interface BulkDiscount {
  minQuantity: number;
  maxQuantity?: number;
  discountPercentage: number;
  discountAmount?: number;
}

export interface Promotion {
  id: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'bundle';
  value: number;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  conditions?: PromotionCondition[];
}

export interface PromotionCondition {
  type: 'minQuantity' | 'minAmount' | 'category' | 'user';
  value: any;
}

export interface PriceHistoryEntry {
  price: number;
  date: Date;
  reason?: string;
}

export interface ProductReview {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: ReviewAuthor;
  date: Date;
  verified: boolean;
  helpful: number;
  unhelpful: number;
  images?: string[];
  pros?: string[];
  cons?: string[];
  wouldRecommend: boolean;
}

export interface ReviewAuthor {
  id: string;
  name: string;
  avatar?: string;
  isVerifiedBuyer: boolean;
  totalReviews: number;
}

export interface ReviewFilter {
  rating?: number;
  verified?: boolean;
  hasImages?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy: 'newest' | 'oldest' | 'rating-high' | 'rating-low' | 'helpful';
}

export interface ProductSpecification {
  category: string;
  items: SpecificationItem[];
  order: number;
}

export interface SpecificationItem {
  key: string;
  value: string;
  unit?: string;
  important?: boolean;
  comparable?: boolean;
}

export interface TrustSignal {
  type: 'security' | 'authenticity' | 'certification' | 'guarantee' | 'award';
  title: string;
  description: string;
  icon?: string;
  verificationUrl?: string;
  issuedBy?: string;
  validUntil?: Date;
}

export interface InventoryInfo {
  stockLevel: number;
  lowStockThreshold: number;
  isInStock: boolean;
  isLowStock: boolean;
  estimatedRestockDate?: Date;
  maxOrderQuantity?: number;
  minOrderQuantity: number;
}

export interface DeliveryInfo {
  estimatedDays: {
    min: number;
    max: number;
  };
  shippingMethods: ShippingMethod[];
  freeShippingThreshold?: number;
  restrictions?: string[];
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  cost: number;
  estimatedDays: {
    min: number;
    max: number;
  };
  trackingAvailable: boolean;
}

export interface ProductRecommendation {
  id: string;
  type: 'related' | 'similar' | 'frequently-bought' | 'recently-viewed' | 'trending';
  products: string[];
  title: string;
  algorithm?: string;
  confidence?: number;
}

export interface ProductComparison {
  products: string[];
  attributes: string[];
  createdAt: Date;
  userId?: string;
}

export interface ProductFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  unhelpful: number;
  isOfficial: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductQA {
  id: string;
  question: string;
  answer?: string;
  askedBy: {
    id: string;
    name: string;
  };
  answeredBy?: {
    id: string;
    name: string;
    isOfficial: boolean;
  };
  helpful: number;
  unhelpful: number;
  createdAt: Date;
  answeredAt?: Date;
}

// Enhanced Product interface for interactive redesign
export interface EnhancedProduct {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string | PopulatedCategory;
  origin: string;
  images: ProductImage[];
  pricing: ProductPricing;
  specifications: ProductSpecification[];
  certifications: string[];
  packagingOptions: string[];
  reviews: ProductReview[];
  averageRating: number;
  totalReviews: number;
  trustSignals: TrustSignal[];
  inventory: InventoryInfo;
  delivery: DeliveryInfo;
  recommendations: ProductRecommendation[];
  faqs: ProductFAQ[];
  qas: ProductQA[];
  features: ProductFeature[];
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  order: number;
  isHighlight: boolean;
}

export interface PopulatedCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string;
}

// Animation and interaction states
export interface ProductPageState {
  selectedImage: number;
  zoomLevel: number;
  activeTab: string;
  selectedQuantity: number;
  reviewFilters: ReviewFilter[];
  comparisonProducts: string[];
  isQuickPreviewOpen: boolean;
  reducedMotion: boolean;
  isWishlisted: boolean;
  cartItemCount: number;
}

export interface InteractionState {
  isHovering: boolean;
  isDragging: boolean;
  touchPosition: { x: number; y: number };
  scrollProgress: number;
  viewportIntersections: Record<string, boolean>;
  lastInteraction: Date;
}

// User preferences for product page
export interface ProductPagePreferences {
  preferredImageSize: 'small' | 'medium' | 'large';
  autoplayVideos: boolean;
  showPriceHistory: boolean;
  defaultReviewSort: ReviewFilter['sortBy'];
  enableAnimations: boolean;
  enableHapticFeedback: boolean;
}

// Analytics and tracking
export interface ProductPageAnalytics {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  conversionRate: number;
  mostViewedSections: string[];
  interactionHeatmap: Record<string, number>;
}

// Error handling
export interface ProductPageError {
  type: 'network' | 'validation' | 'permission' | 'not-found' | 'server';
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  recoverable: boolean;
}

// Loading states
export interface LoadingState {
  product: boolean;
  images: boolean;
  reviews: boolean;
  recommendations: boolean;
  pricing: boolean;
  inventory: boolean;
}

// Form interfaces for interactions
export interface InquiryForm {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  message: string;
  productId: string;
  inquiryType: 'general' | 'pricing' | 'bulk' | 'custom' | 'technical';
}

export interface ReviewForm {
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  wouldRecommend: boolean;
  images?: File[];
}

export interface QuestionForm {
  question: string;
  category: string;
  isUrgent: boolean;
}

// API response interfaces
export interface ProductPageResponse {
  success: boolean;
  data: EnhancedProduct;
  meta?: {
    relatedProducts: string[];
    viewCount: number;
    lastUpdated: Date;
  };
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: ProductReview[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    summary: {
      averageRating: number;
      totalReviews: number;
      ratingDistribution: Record<number, number>;
    };
  };
}

export interface RecommendationsResponse {
  success: boolean;
  data: {
    recommendations: ProductRecommendation[];
    products: EnhancedProduct[];
  };
}