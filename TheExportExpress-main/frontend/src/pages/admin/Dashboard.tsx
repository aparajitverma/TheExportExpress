import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { getApiUrl } from '../../config';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/user';
import { useNavigate } from 'react-router-dom';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

interface DashboardStats {
  totalProducts: number;
  totalAdmins: number;
  totalInquiries: number;
  totalCategories: number;
  recentProducts: Array<{
    _id: string;
    name: string;
    category: string;
    createdAt: string;
  }>;
  recentInquiries: Array<{
    _id: string;
    customerName: string;
    productName: string;
    status: string;
    priority: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    _id: string;
    name: string;
    inquiryCount: number;
    category: string;
  }>;
  exportCountries: Array<{
    country: string;
    inquiryCount: number;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUrlAndFetch = async () => {
      const apiUrl = await getApiUrl();
      fetchStats(apiUrl);
    };
    initializeUrlAndFetch();
  }, []);

  const fetchStats = async (apiUrlToUse: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${apiUrlToUse}/api/admin/dashboard/stats`, {
        headers
      });
      setStats(response.data.data);
      setError(null);
    } catch (err: any) {
      console.error('Dashboard stats fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
      case 'responded': return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'processing': return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      case 'closed': return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'medium': return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg"
        >
          <div className="flex items-center text-red-400">
            <div className="flex-shrink-0">⚠️</div>
            <div className="ml-3">
              <p>{error}</p>
            </div>
          </div>
        </motion.div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-8"
      >
        {/* Welcome Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            ExportExpress Admin Dashboard
          </h1>
          {user && (
            <p className="mt-4 text-xl text-gray-300">
              Welcome back, {user.name}! You're signed in as {" "}
              <span className="text-emerald-400 font-medium">{user.role}</span>
            </p>
          )}
          <p className="mt-2 text-gray-400">Your business control center for Indian exports</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2"
          >
            <span>📦</span>
            Manage Products
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/inquiries')}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2"
          >
            <span>📧</span>
            View Inquiries
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/categories')}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center gap-2"
          >
            <span>🏷️</span>
            Manage Categories
          </motion.button>
          {user?.role === UserRole.SUPER_ADMIN && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/users')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:from-orange-700 hover:to-orange-800 transition-all flex items-center gap-2"
            >
              <span>👥</span>
              Manage Users
            </motion.button>
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {/* Products Stats */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg bg-gray-800/50 border border-blue-500/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-blue-600/20">
                <span className="text-2xl">📦</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Products</p>
                <p className="text-3xl font-bold text-blue-400">{stats?.totalProducts || 0}</p>
              </div>
            </div>
          </motion.div>

          {/* Inquiries Stats */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg bg-gray-800/50 border border-green-500/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-green-600/20">
                <span className="text-2xl">📧</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Inquiries</p>
                <p className="text-3xl font-bold text-green-400">{stats?.totalInquiries || 0}</p>
              </div>
            </div>
          </motion.div>

          {/* Categories Stats */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg bg-gray-800/50 border border-purple-500/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-purple-600/20">
                <span className="text-2xl">🏷️</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Categories</p>
                <p className="text-3xl font-bold text-purple-400">{stats?.totalCategories || 0}</p>
              </div>
            </div>
          </motion.div>

          {/* Admins Stats */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg bg-gray-800/50 border border-emerald-500/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-emerald-600/20">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Admins</p>
                <p className="text-3xl font-bold text-emerald-400">{stats?.totalAdmins || 0}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Inquiries */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-700/50">
              <h3 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                <span>📧</span>
                Recent Inquiries
              </h3>
            </div>
            <div className="divide-y divide-gray-700/50 max-h-96 overflow-y-auto">
              {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
                stats.recentInquiries.map((inquiry) => (
                  <motion.div
                    key={inquiry._id}
                    whileHover={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}
                    className="p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-300 font-medium">{inquiry.customerName}</div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(inquiry.priority)}`}>
                          {inquiry.priority}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">{inquiry.productName}</div>
                    <p className="text-xs text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="p-4 text-gray-400">No recent inquiries found.</p>
              )}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-700/50">
              <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                <span>📈</span>
                Top Products by Inquiries
              </h3>
            </div>
            <div className="divide-y divide-gray-700/50 max-h-96 overflow-y-auto">
              {stats?.topProducts && stats.topProducts.length > 0 ? (
                stats.topProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    whileHover={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}
                    className="p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <div className="text-gray-300 font-medium">{product.name}</div>
                      </div>
                      <div className="text-blue-400 font-bold">{product.inquiryCount} inquiries</div>
                    </div>
                    <span className="px-3 py-1 text-sm rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-500/30">
                      {product.category}
                    </span>
                  </motion.div>
                ))
              ) : (
                <p className="p-4 text-gray-400">No product data available.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Export Countries */}
        {stats?.exportCountries && stats.exportCountries.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-8 bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-700/50">
              <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
                <span>🌍</span>
                Export Countries
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {stats.exportCountries.map((country) => (
                  <motion.div
                    key={country.country}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/30"
                  >
                    <div className="text-2xl mb-2">🏳️</div>
                    <div className="text-gray-300 font-medium">{country.country}</div>
                    <div className="text-purple-400 font-bold">{country.inquiryCount}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Products Section */}
        <motion.div
          variants={itemVariants}
          className="mt-8 max-w-4xl mx-auto"
        >
          <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700/50">
              <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                <span>📦</span>
                Recent Products
              </h3>
            </div>
            <div className="divide-y divide-gray-700/50">
              {stats?.recentProducts && stats.recentProducts.length > 0 ? (
                stats.recentProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    whileHover={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}
                    className="p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-gray-300 hover:text-blue-400 cursor-pointer" 
                           onClick={() => navigate(`/products/${product._id}`)}>
                        {product.name}
                      </div>
                      <span className="px-3 py-1 text-sm rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-500/30">
                        {product.category}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Added {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="p-4 text-gray-400">No recent products found.</p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}