import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminProductForm from '../../components/admin/AdminProductForm';
import { getApiUrl, INITIAL_API_URL } from '../../config';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [currentApiUrl, setCurrentApiUrl] = useState(INITIAL_API_URL);

  useEffect(() => {
    getApiUrl().then((url: string) => setCurrentApiUrl(url));
  }, []);

  const handleAddProduct = async (productData: FormData) => {
    try {
      await axios.post(`${currentApiUrl}/api/products`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product added successfully!');
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product. Please try again.');
      throw error;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Product</h1>
          <p className="text-gray-400 mt-1">Create a new product for your catalog</p>
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
        onFormSubmit={handleAddProduct} 
        isEditMode={false} 
      />
    </motion.div>
  );
};

export default AddProduct; 