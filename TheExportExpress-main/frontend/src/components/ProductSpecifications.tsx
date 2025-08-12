import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CheckIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import { Product } from '../types/product';

interface SpecificationGroup {
  id: string;
  title: string;
  specifications: Record<string, string>;
  isExpanded?: boolean;
}

interface ProductSpecificationsProps {
  product: Product;
  comparisonProducts?: Product[];
  className?: string;
  enableSearch?: boolean;
  enableFiltering?: boolean;
  enableComparison?: boolean;
  defaultExpanded?: boolean;
  groupSpecifications?: boolean;
}

interface FilterOption {
  id: string;
  label: string;
  value: string;
  count: number;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  product,
  comparisonProducts = [],
  className = '',
  enableSearch = true,
  enableFiltering = true,
  enableComparison = true,
  defaultExpanded = false,
  groupSpecifications = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'relevance'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Group specifications by category
  const specificationGroups = useMemo((): SpecificationGroup[] => {
    if (!groupSpecifications) {
      return [{
        id: 'all',
        title: 'All Specifications',
        specifications: product.specifications || {},
        isExpanded: defaultExpanded
      }];
    }

    // Group specifications by logical categories
    const groups: { [key: string]: Record<string, string> } = {
      'Physical Properties': {},
      'Quality Standards': {},
      'Packaging & Storage': {},
      'Technical Details': {},
      'Other': {}
    };

    Object.entries(product.specifications || {}).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      
      if (lowerKey.includes('weight') || lowerKey.includes('size') || lowerKey.includes('dimension') || 
          lowerKey.includes('color') || lowerKey.includes('texture') || lowerKey.includes('appearance')) {
        groups['Physical Properties'][key] = value;
      } else if (lowerKey.includes('quality') || lowerKey.includes('grade') || lowerKey.includes('purity') || 
                 lowerKey.includes('standard') || lowerKey.includes('certification')) {
        groups['Quality Standards'][key] = value;
      } else if (lowerKey.includes('packaging') || lowerKey.includes('storage') || lowerKey.includes('shelf') || 
                 lowerKey.includes('container') || lowerKey.includes('pack')) {
        groups['Packaging & Storage'][key] = value;
      } else if (lowerKey.includes('technical') || lowerKey.includes('specification') || lowerKey.includes('method') || 
                 lowerKey.includes('process') || lowerKey.includes('temperature')) {
        groups['Technical Details'][key] = value;
      } else {
        groups['Other'][key] = value;
      }
    });

    return Object.entries(groups)
      .filter(([, specs]) => Object.keys(specs).length > 0)
      .map(([title, specifications]) => ({
        id: title.toLowerCase().replace(/\s+/g, '-'),
        title,
        specifications,
        isExpanded: defaultExpanded
      }));
  }, [product.specifications, groupSpecifications, defaultExpanded]);

  // Initialize expanded groups
  useEffect(() => {
    if (defaultExpanded) {
      setExpandedGroups(new Set(specificationGroups.map(group => group.id)));
    }
  }, [specificationGroups, defaultExpanded]);

  // Filter options based on specification values
  const filterOptions = useMemo((): FilterOption[] => {
    const options: { [key: string]: FilterOption } = {};
    
    specificationGroups.forEach(group => {
      Object.entries(group.specifications).forEach(([key, value]) => {
        const words = value.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.length > 2) { // Only include meaningful words
            const id = `${key}-${word}`;
            if (!options[id]) {
              options[id] = {
                id,
                label: `${key}: ${word}`,
                value: word,
                count: 0
              };
            }
            options[id].count++;
          }
        });
      });
    });

    return Object.values(options).sort((a, b) => b.count - a.count);
  }, [specificationGroups]);

  // Filtered and sorted specifications
  const filteredGroups = useMemo(() => {
    return specificationGroups.map(group => {
      let filteredSpecs = Object.entries(group.specifications);

      // Apply search filter
      if (searchTerm) {
        filteredSpecs = filteredSpecs.filter(([key, value]) =>
          key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          value.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply selected filters
      if (selectedFilters.size > 0) {
        filteredSpecs = filteredSpecs.filter(([key, value]) => {
          return Array.from(selectedFilters).some(filter => {
            const filterValue = filterOptions.find(opt => opt.id === filter)?.value;
            return filterValue && value.toLowerCase().includes(filterValue);
          });
        });
      }

      // Apply sorting
      if (sortOrder === 'asc') {
        filteredSpecs.sort(([a], [b]) => a.localeCompare(b));
      } else if (sortOrder === 'desc') {
        filteredSpecs.sort(([a], [b]) => b.localeCompare(a));
      }

      return {
        ...group,
        specifications: Object.fromEntries(filteredSpecs)
      };
    }).filter(group => Object.keys(group.specifications).length > 0);
  }, [specificationGroups, searchTerm, selectedFilters, sortOrder, filterOptions]);

  // Toggle group expansion
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Toggle filter
  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filterId)) {
        newSet.delete(filterId);
      } else {
        newSet.add(filterId);
      }
      return newSet;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters(new Set());
    setSearchTerm('');
  };

  // Expand all groups
  const expandAll = () => {
    setExpandedGroups(new Set(specificationGroups.map(group => group.id)));
  };

  // Collapse all groups
  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  // Animation variants
  const groupVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const specItemVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const filterVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={`product-specifications ${className}`}>
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Product Specifications</h3>
          <p className="text-sm text-gray-600 mt-1">
            {Object.keys(product.specifications || {}).length} specifications available
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Expand/Collapse All */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={expandAll}
              className="px-3 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              aria-label="Expand all groups"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border-l border-gray-300 transition-colors duration-200"
              aria-label="Collapse all groups"
            >
              Collapse All
            </button>
          </div>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | 'relevance')}
            className="px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Sort specifications"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="asc">Sort A-Z</option>
            <option value="desc">Sort Z-A</option>
          </select>

          {/* Filter Toggle */}
          {enableFiltering && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors duration-200 ${
                showFilters 
                  ? 'bg-blue-50 border-blue-300 text-blue-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              aria-label="Toggle filters"
            >
              <FunnelIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        {enableSearch && (
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search specifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              aria-label="Search specifications"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Clear search"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && enableFiltering && (
            <motion.div
              variants={filterVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-900">Filter by Values</h4>
                {selectedFilters.size > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {filterOptions.slice(0, 20).map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleFilter(option.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                      selectedFilters.has(option.id)
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {selectedFilters.has(option.id) && (
                      <CheckIcon className="w-3 h-3 mr-1" />
                    )}
                    {option.label}
                    <span className="ml-1 text-gray-500">({option.count})</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters */}
        {(selectedFilters.size > 0 || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors duration-200"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            {Array.from(selectedFilters).map(filterId => {
              const option = filterOptions.find(opt => opt.id === filterId);
              return option ? (
                <span
                  key={filterId}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                >
                  {option.label}
                  <button
                    onClick={() => toggleFilter(filterId)}
                    className="ml-1 p-0.5 hover:bg-green-200 rounded-full transition-colors duration-200"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Specification Groups */}
      <div className="space-y-4">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <div
              key={group.id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
            >
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                aria-expanded={expandedGroups.has(group.id)}
                aria-controls={`group-${group.id}`}
              >
                <div className="flex items-center space-x-3">
                  <h4 className="text-lg font-semibold text-gray-900">{group.title}</h4>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {Object.keys(group.specifications).length}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: expandedGroups.has(group.id) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                </motion.div>
              </button>

              {/* Group Content */}
              <AnimatePresence>
                {expandedGroups.has(group.id) && (
                  <motion.div
                    id={`group-${group.id}`}
                    variants={groupVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="overflow-hidden"
                  >
                    <div className="p-6">
                      {enableComparison && comparisonProducts.length > 0 ? (
                        /* Comparison Table */
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Specification</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">{product.name}</th>
                                {comparisonProducts.map((compProduct) => (
                                  <th key={compProduct._id} className="text-left py-3 px-4 font-medium text-gray-900">
                                    {compProduct.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(group.specifications).map(([key, value], index) => (
                                <motion.tr
                                  key={key}
                                  variants={specItemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  transition={{ delay: index * 0.05 }}
                                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                                >
                                  <td className="py-3 px-4 font-medium text-gray-700">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </td>
                                  <td className="py-3 px-4 text-gray-900">{value}</td>
                                  {comparisonProducts.map((compProduct) => (
                                    <td key={compProduct._id} className="py-3 px-4 text-gray-900">
                                      {compProduct.specifications?.[key] || '-'}
                                    </td>
                                  ))}
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        /* Regular Specification Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(group.specifications).map(([key, value], index) => (
                            <motion.div
                              key={key}
                              variants={specItemVariants}
                              initial="hidden"
                              animate="visible"
                              transition={{ delay: index * 0.05 }}
                              className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 hover:shadow-sm transition-all duration-200"
                            >
                              <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </dt>
                              <dd className="text-gray-900 font-medium">{value}</dd>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MagnifyingGlassIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No specifications found</h4>
            <p className="text-gray-600">
              {searchTerm || selectedFilters.size > 0
                ? 'Try adjusting your search or filters'
                : 'No specifications are available for this product'
              }
            </p>
            {(searchTerm || selectedFilters.size > 0) && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSpecifications;