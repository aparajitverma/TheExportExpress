import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types/product';

interface TabData {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface ProductInfoTabsProps {
  product: Product;
  className?: string;
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

const ProductInfoTabs: React.FC<ProductInfoTabsProps> = ({
  product,
  className = '',
  defaultTab,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [tabIndicatorStyle, setTabIndicatorStyle] = useState({ width: 0, left: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Generate tabs based on product data
  const tabs: TabData[] = [
    {
      id: 'description',
      label: 'Description',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
          {product.shortDescription && (
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-2">Summary</h4>
              <p className="text-gray-600">{product.shortDescription}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'specifications',
      label: 'Specifications',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
          {Object.keys(product.specifications).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </dt>
                  <dd className="mt-1 text-gray-900 font-medium">{value}</dd>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No specifications available</p>
          )}
        </div>
      )
    },
    {
      id: 'origin',
      label: 'Origin & Quality',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Origin Information</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 font-medium">Origin:</span>
                <span className="text-gray-900 font-semibold">{product.origin}</span>
              </div>
            </div>
          </div>
          
          {product.certifications && product.certifications.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-3">Certifications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {product.certifications.map((cert, index) => (
                  <motion.div
                    key={cert}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-green-50 border border-green-200 p-3 rounded-lg text-center"
                  >
                    <span className="text-green-800 font-medium text-sm">{cert}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'packaging',
      label: 'Packaging',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Packaging Options</h3>
          {product.packagingOptions && product.packagingOptions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.packagingOptions.map((option, index) => (
                <motion.div
                  key={option}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-900 font-medium">{option}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No packaging options specified</p>
          )}
        </div>
      )
    }
  ];

  // Initialize active tab
  useEffect(() => {
    const initialTab = defaultTab || tabs[0]?.id || '';
    setActiveTab(initialTab);
  }, [defaultTab, tabs]);

  // Update tab indicator position
  useEffect(() => {
    const updateIndicator = () => {
      const activeTabElement = tabRefs.current[activeTab];
      if (activeTabElement && tabsRef.current) {
        const tabsContainer = tabsRef.current;
        const tabRect = activeTabElement.getBoundingClientRect();
        const containerRect = tabsContainer.getBoundingClientRect();
        
        setTabIndicatorStyle({
          width: tabRect.width,
          left: tabRect.left - containerRect.left
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    const currentIndex = tabs.findIndex(tab => tab.id === tabId);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const nextTab = tabs[nextIndex];
    if (nextTab) {
      handleTabClick(nextTab.id);
      tabRefs.current[nextTab.id]?.focus();
    }
  };

  // Animation variants
  const tabVariants = {
    inactive: {
      color: '#6B7280',
      transition: { duration: 0.2 }
    },
    active: {
      color: '#1F2937',
      transition: { duration: 0.2 }
    },
    hover: {
      color: '#374151',
      transition: { duration: 0.15 }
    }
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.2
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  const indicatorVariants = {
    hidden: {
      scaleX: 0,
      opacity: 0
    },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className={`product-info-tabs ${className}`}>
      {/* Tab Navigation */}
      <div className="relative">
        <div 
          ref={tabsRef}
          className="flex space-x-1 border-b border-gray-200 bg-white"
          role="tablist"
          aria-label="Product information tabs"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              variants={tabVariants}
              initial="inactive"
              animate={activeTab === tab.id ? "active" : "inactive"}
              whileHover="hover"
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              className={`
                relative px-6 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-lg
                ${activeTab === tab.id 
                  ? 'text-gray-900 bg-white' 
                  : 'text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100'
                }
              `}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              <span className="flex items-center space-x-2">
                {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
                <span>{tab.label}</span>
              </span>
            </motion.button>
          ))}
        </div>

        {/* Animated Tab Indicator */}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-blue-500 rounded-full"
          variants={indicatorVariants}
          initial="hidden"
          animate="visible"
          style={{
            width: tabIndicatorStyle.width,
            left: tabIndicatorStyle.left
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        />
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="min-h-[200px]"
                role="tabpanel"
                id={`tabpanel-${tab.id}`}
                aria-labelledby={`tab-${tab.id}`}
                tabIndex={0}
              >
                {tab.content}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductInfoTabs;