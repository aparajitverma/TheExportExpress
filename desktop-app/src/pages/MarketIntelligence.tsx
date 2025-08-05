import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

interface MarketOpportunity {
  product_id: string;
  product_name: string;
  market: string;
  buy_price: number;
  sell_price: number;
  profit_margin: number;
  confidence: number;
  risk_score: number;
  optimal_quantity: string;
  time_sensitivity: string;
  expires_at: string;
}

interface PricePrediction {
  product_id: string;
  predictions: {
    [key: string]: {
      value: number;
      confidence: number;
      factors: string[];
    };
  };
  confidence: number;
  generated_at: string;
}

interface MarketSentiment {
  sentiment: string;
  confidence: number;
  trend: string;
  factors: string[];
  recent_impacts: number;
}

const MarketIntelligence = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedMarket, setSelectedMarket] = useState<string>('');
  const [analysisType, setAnalysisType] = useState<string>('arbitrage');
  const queryClient = useQueryClient();

  // Fetch market opportunities
  const { data: opportunities = [], isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['market-opportunities'],
    queryFn: async () => {
      const response = await window.__TAURI__.invoke('get_arbitrage_opportunities');
      return response || [];
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Fetch price predictions
  const { data: predictions = {}, isLoading: predictionsLoading } = useQuery({
    queryKey: ['price-predictions', selectedProduct],
    queryFn: async () => {
      if (!selectedProduct) return {};
      const response = await window.__TAURI__.invoke('get_ai_predictions', { productId: selectedProduct });
      return response || {};
    },
    enabled: !!selectedProduct,
  });

  // Fetch market sentiment
  const { data: sentiment = {}, isLoading: sentimentLoading } = useQuery({
    queryKey: ['market-sentiment', selectedProduct],
    queryFn: async () => {
      if (!selectedProduct) return {};
      // This would call the AI engine for sentiment analysis
      return {
        sentiment: 'positive',
        confidence: 0.75,
        trend: 'improving',
        factors: ['strong_demand', 'supply_stability'],
        recent_impacts: 3
      };
    },
    enabled: !!selectedProduct,
  });

  // Market analysis mutation
  const marketAnalysisMutation = useMutation({
    mutationFn: async ({ productIds, markets, analysisType }: {
      productIds: string[];
      markets: string[];
      analysisType: string;
    }) => {
      return await window.__TAURI__.invoke('analyze_market', {
        productIds,
        markets,
        analysisType
      });
    },
    onSuccess: (data) => {
      toast.success('Market analysis completed successfully');
      queryClient.invalidateQueries({ queryKey: ['market-opportunities'] });
    },
    onError: (error) => {
      toast.error('Market analysis failed');
    },
  });

  const handleMarketAnalysis = () => {
    if (!selectedProduct) {
      toast.error('Please select a product for analysis');
      return;
    }

    marketAnalysisMutation.mutate({
      productIds: [selectedProduct],
      markets: selectedMarket ? [selectedMarket] : ['US', 'EU', 'UK'],
      analysisType
    });
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />;
      default:
        return <MinusIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore <= 0.3) return 'text-green-600';
    if (riskScore <= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Market Intelligence
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered market analysis, price predictions, and arbitrage opportunities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* Analysis Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Market Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Product</option>
              <option value="saffron">Saffron</option>
              <option value="cardamom">Cardamom</option>
              <option value="turmeric">Turmeric</option>
              <option value="pepper">Pepper</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Market
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Markets</option>
              <option value="US">United States</option>
              <option value="EU">European Union</option>
              <option value="UK">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Japan">Japan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Analysis Type
            </label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="arbitrage">Arbitrage</option>
              <option value="trend">Trend Analysis</option>
              <option value="sentiment">Sentiment Analysis</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleMarketAnalysis}
              disabled={marketAnalysisMutation.isPending}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {marketAnalysisMutation.isPending ? 'Analyzing...' : 'Analyze Market'}
            </button>
          </div>
        </div>
      </div>

      {/* Market Opportunities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Arbitrage Opportunities</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            High-profit market opportunities detected by AI
          </p>
        </div>
        <div className="p-6">
          {opportunitiesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading opportunities...</p>
            </div>
          ) : opportunities.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {opportunities.slice(0, 6).map((opportunity: MarketOpportunity, index: number) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <GlobeAltIcon className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">{opportunity.product_name}</span>
                    </div>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {opportunity.market}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Buy Price</p>
                      <p className="font-semibold">₹{opportunity.buy_price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sell Price</p>
                      <p className="font-semibold">₹{opportunity.sell_price}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</p>
                      <p className={`font-semibold ${opportunity.profit_margin > 0.2 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {(opportunity.profit_margin * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Confidence</p>
                      <p className={`font-semibold ${getConfidenceColor(opportunity.confidence)}`}>
                        {(opportunity.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Risk</p>
                      <p className={`font-semibold ${getRiskColor(opportunity.risk_score)}`}>
                        {(opportunity.risk_score * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Optimal: {opportunity.optimal_quantity}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      opportunity.time_sensitivity === 'high' ? 'bg-red-100 text-red-800' :
                      opportunity.time_sensitivity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {opportunity.time_sensitivity} priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <InformationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No arbitrage opportunities found</p>
            </div>
          )}
        </div>
      </div>

      {/* Price Predictions */}
      {selectedProduct && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Price Predictions - {selectedProduct}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered price forecasts and market trends
            </p>
          </div>
          <div className="p-6">
            {predictionsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading predictions...</p>
              </div>
            ) : predictions.predictions ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(predictions.predictions as Record<string, any>).map(([timeframe, prediction]) => (
                  <div key={timeframe} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold capitalize">{timeframe.replace('_', ' ')}</h3>
                      <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{(prediction as any).value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Confidence: {((prediction as any).confidence * 100).toFixed(0)}%
                    </p>
                    <div className="space-y-1">
                      {(prediction as any).factors.map((factor: string, index: number) => (
                        <span key={index} className="inline-block bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1">
                          {factor.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <InformationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No predictions available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Market Sentiment */}
      {selectedProduct && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Market Sentiment - {selectedProduct}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-analyzed market sentiment and trends
            </p>
          </div>
          <div className="p-6">
            {sentimentLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading sentiment...</p>
              </div>
            ) : sentiment.sentiment ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Overall Sentiment</span>
                    <div className="flex items-center space-x-2">
                      {getSentimentIcon(sentiment.sentiment)}
                      <span className="font-semibold capitalize">{sentiment.sentiment}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Confidence</span>
                    <span className={`font-semibold ${getConfidenceColor(sentiment.confidence)}`}>
                      {(sentiment.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Trend</span>
                    <span className="font-semibold capitalize">{sentiment.trend}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Recent Impacts</span>
                    <span className="font-semibold">{sentiment.recent_impacts}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Factors</h4>
                  <div className="space-y-2">
                    {sentiment.factors.map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm capitalize">{factor.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <InformationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No sentiment data available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">AI Insights</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Machine learning insights and recommendations
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Market Trends</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Strong demand for organic spices in EU markets. Consider increasing production capacity.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Risk Alerts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Shipping container shortage may impact delivery timelines. Consider alternative routes.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Price Forecast</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Saffron prices expected to increase by 15% in next quarter due to supply constraints.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <GlobeAltIcon className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Market Opportunities</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    High arbitrage potential in US market for cardamom. Profit margin up to 35%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence; 