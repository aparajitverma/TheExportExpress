import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface Order {
  _id: string;
  order_number: string;
  customer_name: string;
  products: Array<{
    product_id: string;
    name: string;
    quantity: number;
    unit_price: number;
  }>;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  expected_delivery: string;
  ai_analysis?: {
    profit_margin: number;
    risk_score: number;
    market_opportunity: boolean;
    recommended_actions: string[];
  };
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAIAnalytics, setShowAIAnalytics] = useState(false);
  const queryClient = useQueryClient();

  // Fetch orders with AI analytics
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', selectedStatus],
    queryFn: async () => {
      const response = await window.__TAURI__.invoke('get_orders', { 
        status: selectedStatus || undefined 
      });
      return response || [];
    },
  });

  // Fetch AI analytics for orders
  const { data: aiAnalytics = {} } = useQuery({
    queryKey: ['ai-order-analytics'],
    queryFn: async () => {
      // This would call the AI engine for order analytics
      return {
        'order_001': {
          profit_margin: 0.25,
          risk_score: 0.15,
          market_opportunity: true,
          recommended_actions: ['Increase quantity', 'Negotiate better pricing']
        },
        'order_002': {
          profit_margin: 0.18,
          risk_score: 0.35,
          market_opportunity: false,
          recommended_actions: ['Review pricing strategy', 'Monitor market trends']
        }
      };
    },
  });

  const filteredOrders = orders.filter((order: Order) =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'processing':
        return <ChartBarIcon className="h-4 w-4" />;
      case 'shipped':
        return <ArrowUpIcon className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 0.3) return 'text-green-600';
    if (riskScore < 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProfitColor = (profitMargin: number) => {
    if (profitMargin > 0.2) return 'text-green-600';
    if (profitMargin > 0.1) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage export orders with AI-powered analytics and insights
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
            <span>Create Order</span>
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
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order: Order) => {
          const aiAnalysis = aiAnalytics[order._id as keyof typeof aiAnalytics] as any;
          
          return (
            <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {order.order_number}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.customer_name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
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
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ₹{order.total_amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {order.products.length} items
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* AI Analytics */}
                {showAIAnalytics && aiAnalysis && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <ChartBarIcon className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-900 dark:text-white">AI Analysis</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</p>
                        <p className={`text-lg font-semibold ${getProfitColor(aiAnalysis.profit_margin)}`}>
                          {(aiAnalysis.profit_margin * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Risk Score</p>
                        <p className={`text-lg font-semibold ${getRiskColor(aiAnalysis.risk_score)}`}>
                          {(aiAnalysis.risk_score * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Market Opportunity</p>
                        <div className="flex items-center space-x-2">
                          {aiAnalysis.market_opportunity ? (
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <div className="h-5 w-5 bg-gray-300 rounded-full" />
                          )}
                          <span className="text-sm font-medium">
                            {aiAnalysis.market_opportunity ? 'Yes' : 'No'}
                          </span>
                        </div>
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
                <div className="flex items-center space-x-3 mt-4">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Edit Order
                  </button>
                  <button className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors">
                    Track
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedStatus 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first order.'
            }
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Create Order
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
        </div>
      )}

      {/* AI Analytics Summary */}
      {showAIAnalytics && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">AI Analytics Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-600">Avg Profit Margin</p>
              <p className="text-2xl font-bold text-green-600">22.5%</p>
              <p className="text-xs text-green-500">across orders</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-yellow-600">High Risk Orders</p>
              <p className="text-2xl font-bold text-yellow-600">3</p>
              <p className="text-xs text-yellow-500">need attention</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-600">Market Opportunities</p>
              <p className="text-2xl font-bold text-blue-600">7</p>
              <p className="text-xs text-blue-500">identified</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <ArrowUpIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-600">Revenue Growth</p>
              <p className="text-2xl font-bold text-purple-600">+15.3%</p>
              <p className="text-xs text-purple-500">this month</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 