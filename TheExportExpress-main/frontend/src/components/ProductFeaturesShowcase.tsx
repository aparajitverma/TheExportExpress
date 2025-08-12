import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';
import { 
  StarIcon,
  ShieldCheckIcon,
  TruckIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  SparklesIcon,
  CubeIcon,
  HeartIcon,
  LightBulbIcon,
  BoltIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { Product } from '../types/product';

interface ProductFeature {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  icon: React.ReactNode;
  category: 'quality' | 'sustainability' | 'innovation' | 'service' | 'certification';
  priority: number;
  benefits?: string[];
  isHighlighted?: boolean;
}

interface ProductFeaturesShowcaseProps {
  product: Product;
  className?: string;
  enableScrollAnimation?: boolean;
  enableProgressiveDisclosure?: boolean;
  maxFeaturesVisible?: number;
  layout?: 'grid' | 'carousel' | 'masonry';
}

const ProductFeaturesShowcase: React.FC<ProductFeaturesShowcaseProps> = ({
  product,
  className = '',
  enableScrollAnimation = true,
  enableProgressiveDisclosure = true,
  maxFeaturesVisible = 6,
  layout = 'grid'
}) => {
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const [visibleFeatures, setVisibleFeatures] = useState(maxFeaturesVisible);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const controls = useAnimation();

  // Generate features based on product data
  const generateFeatures = (): ProductFeature[] => {
    const features: ProductFeature[] = [];

    // Quality features based on specifications
    if (product.specifications) {
      Object.entries(product.specifications).forEach(([key, value], index) => {
        if (key.toLowerCase().includes('quality') || key.toLowerCase().includes('grade')) {
          features.push({
            id: `quality-${index}`,
            title: `Premium ${key}`,
            description: `High-quality ${value} ensuring superior product standards`,
            detailedDescription: `Our ${product.name} features exceptional ${key.toLowerCase()} rated as ${value}. This ensures consistent quality and meets international standards for export markets.`,
            icon: <StarIcon className="w-6 h-6" />,
            category: 'quality',
            priority: 1,
            benefits: ['Consistent quality', 'International standards', 'Premium grade'],
            isHighlighted: true
          });
        }
      });
    }

    // Origin-based features
    if (product.origin) {
      features.push({
        id: 'origin-authenticity',
        title: `Authentic ${product.origin} Origin`,
        description: `Sourced directly from ${product.origin} for authentic quality`,
        detailedDescription: `Our ${product.name} is sourced directly from ${product.origin}, ensuring authenticity and supporting local communities. We maintain direct relationships with suppliers to guarantee origin authenticity.`,
        icon: <GlobeAltIcon className="w-6 h-6" />,
        category: 'quality',
        priority: 2,
        benefits: ['Authentic sourcing', 'Direct supplier relationships', 'Origin guarantee'],
        isHighlighted: true
      });
    }

    // Certification features
    if (product.certifications && product.certifications.length > 0) {
      features.push({
        id: 'certifications',
        title: 'Certified Quality Standards',
        description: `${product.certifications.length} quality certifications`,
        detailedDescription: `Our product holds ${product.certifications.length} international certifications including ${product.certifications.slice(0, 3).join(', ')}. These certifications ensure compliance with global quality and safety standards.`,
        icon: <CheckBadgeIcon className="w-6 h-6" />,
        category: 'certification',
        priority: 1,
        benefits: product.certifications.slice(0, 3),
        isHighlighted: true
      });
    }

    // Packaging features
    if (product.packagingOptions && product.packagingOptions.length > 0) {
      features.push({
        id: 'packaging',
        title: 'Flexible Packaging Options',
        description: `${product.packagingOptions.length} packaging variants available`,
        detailedDescription: `We offer ${product.packagingOptions.length} different packaging options to meet diverse customer needs: ${product.packagingOptions.join(', ')}. All packaging is designed for optimal product protection during transport.`,
        icon: <CubeIcon className="w-6 h-6" />,
        category: 'service',
        priority: 3,
        benefits: ['Multiple options', 'Transport protection', 'Custom solutions']
      });
    }

    // Default features for all products
    const defaultFeatures: ProductFeature[] = [
      {
        id: 'export-ready',
        title: 'Export Ready',
        description: 'Prepared for international shipping and compliance',
        detailedDescription: 'Our products are export-ready with all necessary documentation, packaging, and compliance measures in place for smooth international shipping.',
        icon: <TruckIcon className="w-6 h-6" />,
        category: 'service',
        priority: 2,
        benefits: ['International compliance', 'Proper documentation', 'Secure packaging']
      },
      {
        id: 'sustainable-sourcing',
        title: 'Sustainable Sourcing',
        description: 'Environmentally responsible procurement practices',
        detailedDescription: 'We prioritize sustainable sourcing practices that support environmental conservation and fair trade principles, ensuring a positive impact on communities and ecosystems.',
        icon: <SparklesIcon className="w-6 h-6" />,
        category: 'sustainability',
        priority: 4,
        benefits: ['Environmental protection', 'Fair trade', 'Community support']
      },
      {
        id: 'quality-assurance',
        title: 'Quality Assurance',
        description: 'Rigorous testing and quality control processes',
        detailedDescription: 'Every batch undergoes comprehensive quality testing using advanced techniques to ensure consistency, safety, and compliance with international standards.',
        icon: <ShieldCheckIcon className="w-6 h-6" />,
        category: 'quality',
        priority: 1,
        benefits: ['Batch testing', 'Safety compliance', 'Consistent quality']
      },
      {
        id: 'innovation',
        title: 'Innovation Focus',
        description: 'Cutting-edge processing and handling techniques',
        detailedDescription: 'We employ the latest innovations in processing, storage, and handling to maintain product integrity and extend shelf life while preserving natural qualities.',
        icon: <LightBulbIcon className="w-6 h-6" />,
        category: 'innovation',
        priority: 5,
        benefits: ['Advanced processing', 'Extended shelf life', 'Natural preservation']
      }
    ];

    return [...features, ...defaultFeatures].sort((a, b) => a.priority - b.priority);
  };

  const allFeatures = generateFeatures();
  
  // Filter features by category
  const filteredFeatures = selectedCategory === 'all' 
    ? allFeatures 
    : allFeatures.filter(feature => feature.category === selectedCategory);

  const displayedFeatures = filteredFeatures.slice(0, visibleFeatures);

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'All Features', count: allFeatures.length },
    { id: 'quality', label: 'Quality', count: allFeatures.filter(f => f.category === 'quality').length },
    { id: 'certification', label: 'Certifications', count: allFeatures.filter(f => f.category === 'certification').length },
    { id: 'service', label: 'Service', count: allFeatures.filter(f => f.category === 'service').length },
    { id: 'sustainability', label: 'Sustainability', count: allFeatures.filter(f => f.category === 'sustainability').length },
    { id: 'innovation', label: 'Innovation', count: allFeatures.filter(f => f.category === 'innovation').length }
  ].filter(cat => cat.count > 0);

  // Toggle feature expansion
  const toggleFeature = (featureId: string) => {
    if (!enableProgressiveDisclosure) return;
    
    setExpandedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  };

  // Show more features
  const showMoreFeatures = () => {
    setVisibleFeatures(prev => Math.min(prev + maxFeaturesVisible, filteredFeatures.length));
  };

  // Scroll animation effect
  useEffect(() => {
    if (enableScrollAnimation && isInView) {
      controls.start("visible");
    }
  }, [isInView, controls, enableScrollAnimation]);

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const featureVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const cardHoverVariants = {
    rest: {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    rest: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.2
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2
      }
    }
  };

  const expandVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div ref={containerRef} className={`product-features-showcase ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Product Features & Benefits
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
          }}
          className="text-gray-600 max-w-2xl mx-auto"
        >
          Discover what makes our {product.name} exceptional with these key features and benefits
        </motion.p>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
          }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
              <span className="ml-1 text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className={`
          ${layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
          ${layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3 gap-6' : ''}
          ${layout === 'carousel' ? 'flex overflow-x-auto gap-6 pb-4' : ''}
        `}
      >
        <AnimatePresence mode="wait">
          {displayedFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
              className={`
                feature-card bg-white rounded-xl border border-gray-200 overflow-hidden
                ${layout === 'carousel' ? 'flex-shrink-0 w-80' : ''}
                ${feature.isHighlighted ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
              `}
            >
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                className="h-full"
              >
                <div className="p-6">
                  {/* Feature Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <motion.div
                      variants={iconVariants}
                      className={`
                        flex-shrink-0 p-3 rounded-lg
                        ${feature.category === 'quality' ? 'bg-yellow-100 text-yellow-600' : ''}
                        ${feature.category === 'certification' ? 'bg-green-100 text-green-600' : ''}
                        ${feature.category === 'service' ? 'bg-blue-100 text-blue-600' : ''}
                        ${feature.category === 'sustainability' ? 'bg-emerald-100 text-emerald-600' : ''}
                        ${feature.category === 'innovation' ? 'bg-purple-100 text-purple-600' : ''}
                      `}
                    >
                      {feature.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                    {feature.isHighlighted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="flex-shrink-0"
                      >
                        <SparklesIcon className="w-5 h-5 text-yellow-500" />
                      </motion.div>
                    )}
                  </div>

                  {/* Benefits List */}
                  {feature.benefits && feature.benefits.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <motion.span
                            key={benefit}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + benefitIndex * 0.1 }}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                          >
                            <CheckBadgeIcon className="w-3 h-3 mr-1 text-green-500" />
                            {benefit}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progressive Disclosure */}
                  {enableProgressiveDisclosure && feature.detailedDescription && (
                    <div>
                      <button
                        onClick={() => toggleFeature(feature.id)}
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                      >
                        <span>
                          {expandedFeatures.has(feature.id) ? 'Show Less' : 'Learn More'}
                        </span>
                        <motion.div
                          animate={{ rotate: expandedFeatures.has(feature.id) ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-1"
                        >
                          <ChevronDownIcon className="w-4 h-4" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {expandedFeatures.has(feature.id) && (
                          <motion.div
                            variants={expandVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {feature.detailedDescription}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Show More Button */}
      {visibleFeatures < filteredFeatures.length && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <button
            onClick={showMoreFeatures}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Show More Features ({filteredFeatures.length - visibleFeatures} remaining)
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ProductFeaturesShowcase;