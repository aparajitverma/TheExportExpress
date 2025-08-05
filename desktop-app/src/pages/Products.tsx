import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  pricing: {
    current_price: number;
    currency: string;
  };
  inventory: {
    available: number;
    total: number;
  };
  ai_insights?: {
    price_prediction: number;
    confidence: number;
    trend: 'up' | 'down' | 'stable';
    market_opportunity: boolean;
  };
}

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const queryClient = useQueryClient();

  // Fetch products with AI insights
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: async () => {
      const response = await window.__TAURI__.invoke('get_products', { 
        category: selectedCategory || undefined 
      });
      return response || [];
    },
  });

  // Fetch AI predictions for products
  const { data: aiPredictions = {} } = useQuery({
    queryKey: ['ai-predictions'],
    queryFn: async () => {
      // This would call the AI engine for predictions
      return {
        'product_001': {
          price_prediction: 3200,
          confidence: 0.85,
          trend: 'up' as const,
          market_opportunity: true
        },
        'product_002': {
          price_prediction: 1800,
          confidence: 0.72,
          trend: 'stable' as const,
          market_opportunity: false
        }
      };
    },
  });

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your product catalog with AI-powered insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAIInsights(!showAIInsights)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              showAIInsights 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>AI Insights</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="spices">Spices</option>
              <option value="herbs">Herbs</option>
              <option value="tea">Tea</option>
              <option value="organic">Organic</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product: Product) => {
          const aiInsight = aiPredictions[product._id];
          
          return (
            <div key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Product Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.category}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-600">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current Price:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{product.pricing.current_price}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Stock:</span>
                    <span className={`font-semibold ${
                      product.inventory.available > 50 ? 'text-green-600' :
                      product.inventory.available > 10 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.inventory.available} / {product.inventory.total}
                    </span>
                  </div>
                </div>

                {/* AI Insights */}
                {showAIInsights && aiInsight && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        AI Prediction
                      </span>
                      {getTrendIcon(aiInsight.trend)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Predicted Price:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{aiInsight.price_prediction}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Confidence:</span>
                        <span className={`text-sm font-semibold ${getConfidenceColor(aiInsight.confidence)}`}>
                          {(aiInsight.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      
                      {aiInsight.market_opportunity && (
                        <div className="flex items-center space-x-2">
                          <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                          <span className="text-xs text-yellow-600 dark:text-yellow-400">
                            Market Opportunity
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedCategory 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first product.'
            }
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Product
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      )}

      {/* AI Insights Summary */}
      {showAIInsights && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">AI Insights Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-600">Price Increase</p>
              <p className="text-2xl font-bold text-green-600">8</p>
              <p className="text-xs text-green-500">products</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-yellow-600">Market Opportunities</p>
              <p className="text-2xl font-bold text-yellow-600">5</p>
              <p className="text-xs text-yellow-500">detected</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-blue-600">78%</p>
              <p className="text-xs text-blue-500">predictions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 