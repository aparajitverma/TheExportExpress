import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminProductForm from '../../components/admin/AdminProductForm';
import { Product } from '../../types/product';
import { getApiUrl, INITIAL_API_URL } from '../../config';

const EditProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentApiUrl, setCurrentApiUrl] = useState(INITIAL_API_URL);

  useEffect(() => {
    const initialize = async () => {
      try {
        const apiUrl = await getApiUrl();
        setCurrentApiUrl(apiUrl);
        if (productId) {
          const response = await axios.get(`${apiUrl}/api/products/${productId}`);
          setProduct(response.data.data || response.data);
          setError(null);
        } else {
          setError('Product ID not found.');
        }
      } catch (err: any) {
        console.error('Error fetching product for editing:', err);
        setError(err.response?.data?.message || 'Failed to fetch product details.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [productId]);

  const handleEditProduct = async (productData: FormData) => {
    if (!productId) {
      toast.error('Product ID is missing.');
      return;
    }
    try {
      await axios.patch(`${currentApiUrl}/api/products/${productId}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product.');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error || !product) {
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
            <p className="font-medium">{error || 'Product could not be loaded.'}</p>
            <button 
              onClick={() => navigate('/admin/products')} 
              className="mt-3 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Products
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
          <h1 className="text-2xl font-bold text-white">Edit Product</h1>
          <p className="text-gray-400 mt-1">Update product information and settings</p>
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </button>
      </div>

      {/* Form */}
      <AdminProductForm 
        product={product} 
        onFormSubmit={handleEditProduct} 
        isEditMode={true} 
      />
    </motion.div>
  );
};

export default EditProduct; 