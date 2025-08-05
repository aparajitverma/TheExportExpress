import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getApiUrl, INITIAL_API_URL } from '../../config';
import { useAuth } from '../../contexts/AuthContext'; // For createdBy if needed, or just for auth check

// Define ICategory structure matching the backend model (simplified for now)
export interface ICategoryDisplay {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: { _id: string; name: string; slug: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetCategoriesResponse {
  data: ICategoryDisplay[];
  page: number;
  limit: number;
  total: number;
  // Potentially other pagination fields
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<ICategoryDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentApiUrl, setCurrentApiUrl] = useState(INITIAL_API_URL);
  const navigate = useNavigate();
  // const { user } = useAuth(); // If needed for permissions or display

  // TODO: Add pagination state if implementing full pagination controls
  // const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(10);
  // const [totalCategories, setTotalCategories] = useState(0);

  useEffect(() => {
    const initializeUrlAndFetch = async () => {
      try {
        const apiUrl = await getApiUrl();
        setCurrentApiUrl(apiUrl);
        fetchAdminCategories(apiUrl /*, page, limit */);
      } catch (e) {
        console.error("Error initializing API URL for Admin Categories:", e);
        setError('Failed to initialize API settings. Please try again later.');
        setLoading(false);
      }
    };
    initializeUrlAndFetch();
  }, [/* page, limit */]); // Add page, limit to dependency array if using them

  const fetchAdminCategories = async (apiUrlToUse: string /*, currentPage: number, currentLimit: number */) => {
    setLoading(true);
    try {
      // Update with pagination params if implemented: `?page=${currentPage}&limit=${currentLimit}`
      const response = await axios.get<GetCategoriesResponse>(`${apiUrlToUse}/api/categories`);
      setCategories(response.data.data || []); // Ensure it handles cases where data might be nested differently or empty
      // setTotalCategories(response.data.total);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching categories for admin:', err);
      setError(err.response?.data?.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category? This might affect products using it.')) {
      return;
    }
    try {
      await axios.delete(`${currentApiUrl}/api/categories/${categoryId}`);
      toast.success('Category deleted successfully');
      setCategories(prevCategories => prevCategories.filter(c => c._id !== categoryId));
    } catch (err: any) {
      console.error('Error deleting category:', err);
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-900/20 border border-red-500/30 rounded-lg p-6"
      >
        <div className="flex items-center text-red-400">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => fetchAdminCategories(currentApiUrl /*, page, limit */)} 
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Categories</h1>
          <p className="text-gray-400 mt-1">Organize your products with categories and subcategories</p>
        </div>
        <Link 
          to="/admin/categories/new" 
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-gray-300 text-lg mb-2">No categories found</p>
          <p className="text-gray-400 mb-4">Create categories to organize your products effectively</p>
          <Link 
            to="/admin/categories/new" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Your First Category
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Parent
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {categories.map((category, index) => (
                  <motion.tr
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{category.name}</div>
                        {category.description && (
                          <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">{category.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm text-blue-300 bg-blue-900/30 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {category.parentCategory ? (
                          <Link 
                            to={`/admin/categories/edit/${category.parentCategory._id}`} 
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {category.parentCategory.name}
                          </Link>
                        ) : (
                          <span className="text-gray-500">Root Category</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        category.isActive 
                          ? 'bg-green-900/50 text-green-300 border border-green-500/30'
                          : 'bg-red-900/50 text-red-300 border border-red-500/30'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link 
                          to={`/admin/categories/edit/${category._id}`} 
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button 
                          onClick={() => handleDeleteCategory(category._id)}
                          className="text-red-400 hover:text-red-300 transition-colors ml-2"
                          disabled={!category.isActive}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminCategories; 