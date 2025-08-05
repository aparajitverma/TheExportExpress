import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  activeSuppliers: number;
  arbitrageOpportunities: number;
  marketTrends: {
    trend: 'up' | 'down' | 'stable';
    percentage: number;
    description: string;
  };
  aiInsights: Array<{
    type: 'opportunity' | 'risk' | 'trend';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

const Dashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('week');

  // Fetch dashboard data
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', selectedTimeframe],
    queryFn: async () => {
      // This would call Tauri commands to get real data
      return {
        totalOrders: 156,
        totalRevenue: 2847500,
        pendingOrders: 23,
        completedOrders: 133,
        activeSuppliers: 18,
        arbitrageOpportunities: 7,
        marketTrends: {
          trend: 'up' as const,
          percentage: 12.5,
          description: 'Strong demand in EU markets'
        },
        aiInsights: [
          {
            type: 'opportunity' as const,
            title: 'High Arbitrage Opportunity',
            description: 'Saffron prices in US market show 35% profit potential',
            priority: 'high' as const
          },
          {
            type: 'risk' as const,
            title: 'Supply Chain Alert',
            description: 'Shipping container shortage may impact delivery timelines',
            priority: 'medium' as const
          },
          {
            type: 'trend' as const,
            title: 'Market Trend',
            description: 'Cardamom demand increasing in UK market',
            priority: 'low' as const
          }
        ]
      } as DashboardStats;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="h-5 w-5 text-green-500" />;
      case 'down':
        return <ArrowDownIcon className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 bg-gray-300 rounded-full" />;
    }
  };

  const getInsightIcon = (type: 'opportunity' | 'risk' | 'trend') => {
    switch (type) {
      case 'opportunity':
        return <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />;
      case 'risk':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'trend':
        return <ChartBarIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'low':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered insights and real-time export management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+8.2%</span>
            <span className="text-gray-500 ml-1">from last period</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(stats?.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+12.5%</span>
            <span className="text-gray-500 ml-1">from last period</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.pendingOrders}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-red-600">-3.1%</span>
            <span className="text-gray-500 ml-1">from last period</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Opportunities</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.arbitrageOpportunities}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <GlobeAltIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+15.3%</span>
            <span className="text-gray-500 ml-1">from last period</span>
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Market Trends</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI-analyzed market insights and trends
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getTrendIcon(stats?.marketTrends.trend || 'stable')}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {stats?.marketTrends.trend === 'up' ? 'Market Growth' : 
                   stats?.marketTrends.trend === 'down' ? 'Market Decline' : 'Market Stable'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats?.marketTrends.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${
                stats?.marketTrends.trend === 'up' ? 'text-green-600' :
                stats?.marketTrends.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stats?.marketTrends.percentage}%
              </p>
              <p className="text-sm text-gray-500">Change</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">AI Insights</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Machine learning powered recommendations and alerts
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stats?.aiInsights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {insight.description}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    insight.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {insight.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create New Order
            </button>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Add Supplier
            </button>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Market Analysis
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Order #EXP-2024-001 completed</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">New arbitrage opportunity detected</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Market trend analysis updated</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Engine</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Real-time Updates</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 