import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  GlobeAltIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

interface Supplier {
  _id: string;
  name: string;
  company_name: string;
  email: string;
  phone: string;
  country: string;
  products: string[];
  rating: number;
  total_orders: number;
  total_value: number;
  status: 'active' | 'inactive' | 'suspended';
  ai_analysis?: {
    reliability_score: number;
    performance_trend: 'improving' | 'declining' | 'stable';
    risk_assessment: 'low' | 'medium' | 'high';
    recommended_actions: string[];
  };
}

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showAIAnalytics, setShowAIAnalytics] = useState(false);
  const queryClient = useQueryClient();

  // Fetch suppliers with AI analytics
  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers', selectedCountry],
    queryFn: async () => {
      const response = await window.__TAURI__.invoke('get_suppliers', {
        country: selectedCountry || undefined
      });
      return response || [];
    },
  });

  // Fetch AI analytics for suppliers
  const { data: aiAnalytics = {} } = useQuery({
    queryKey: ['ai-supplier-analytics'],
    queryFn: async () => {
      // This would call the AI engine for supplier analytics
      return {
        'supplier_001': {
          reliability_score: 0.85,
          performance_trend: 'improving' as const,
          risk_assessment: 'low' as const,
          recommended_actions: ['Increase order volume', 'Extend contract']
        },
        'supplier_002': {
          reliability_score: 0.72,
          performance_trend: 'stable' as const,
          risk_assessment: 'medium' as const,
          recommended_actions: ['Monitor performance', 'Review pricing']
        }
      };
    },
  });

  const filteredSuppliers = suppliers.filter((supplier: Supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'inactive':
        return <XCircleIcon className="h-4 w-4" />;
      case 'suspended':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <XCircleIcon className="h-4 w-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <ChartBarIcon className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <ChartBarIcon className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Suppliers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage supplier relationships with AI-powered insights and analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAIAnalytics(!showAIAnalytics)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              showAIAnalytics
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>AI Analytics</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Add Supplier</span>
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
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Countries</option>
              <option value="India">India</option>
              <option value="China">China</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Thailand">Thailand</option>
              <option value="Indonesia">Indonesia</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Filter by:</span>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Suppliers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier: Supplier) => {
          const aiAnalysis = aiAnalytics[supplier._id as keyof typeof aiAnalytics] as any;
          
          return (
            <div key={supplier._id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Supplier Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {supplier.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {supplier.company_name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(supplier.status)}`}>
                      {getStatusIcon(supplier.status)}
                      <span className="capitalize">{supplier.status}</span>
                    </span>
                  </div>
                </div>

                {/* Supplier Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <GlobeAltIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {supplier.country}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TruckIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {supplier.total_orders} orders
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ₹{supplier.total_value.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <div className="flex items-center space-x-1">
                      {renderStars(supplier.rating)}
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        ({supplier.rating})
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Analytics */}
                {showAIAnalytics && aiAnalysis && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <ChartBarIcon className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-900 dark:text-white">AI Analysis</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Reliability:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {(aiAnalysis.reliability_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Performance:</span>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(aiAnalysis.performance_trend)}
                          <span className="text-sm font-medium capitalize">
                            {aiAnalysis.performance_trend}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level:</span>
                        <span className={`text-sm font-semibold ${getRiskColor(aiAnalysis.risk_assessment)}`}>
                          {aiAnalysis.risk_assessment.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* AI Recommendations */}
                    {aiAnalysis.recommended_actions && aiAnalysis.recommended_actions.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          AI Recommendations:
                        </p>
                        <div className="space-y-1">
                          {aiAnalysis.recommended_actions.map((action: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {action}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-600">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSuppliers.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <GlobeAltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No suppliers found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedCountry
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first supplier.'
            }
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Supplier
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading suppliers...</p>
        </div>
      )}

      {/* AI Analytics Summary */}
      {showAIAnalytics && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">AI Analytics Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-600">High Reliability</p>
              <p className="text-2xl font-bold text-green-600">12</p>
              <p className="text-xs text-green-500">suppliers</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-yellow-600">Medium Risk</p>
              <p className="text-2xl font-bold text-yellow-600">5</p>
              <p className="text-xs text-yellow-500">suppliers</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-600">Improving</p>
              <p className="text-2xl font-bold text-blue-600">8</p>
              <p className="text-xs text-blue-500">suppliers</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-600">Total Value</p>
              <p className="text-2xl font-bold text-purple-600">₹2.4M</p>
              <p className="text-xs text-purple-500">this month</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers; 