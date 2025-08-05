import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminCategoryForm, { CategoryFormData } from '../../components/admin/AdminCategoryForm';
import { getApiUrl, INITIAL_API_URL } from '../../config';

const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const [currentApiUrl, setCurrentApiUrl] = useState(INITIAL_API_URL);

  useEffect(() => {
    getApiUrl().then(url => setCurrentApiUrl(url));
  }, []);

  const handleAddCategory = async (formData: CategoryFormData) => {
    try {
      await axios.post(`${currentApiUrl}/api/categories`, formData, {
        // headers: { 'Content-Type': 'application/json' } // Axios defaults to this for objects
      });
      toast.success('Category created successfully!');
      navigate('/admin/categories');
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error(error.response?.data?.message || 'Failed to create category.');
      throw error; // Propagate error to allow form to handle its loading state
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add New Category</h1>
      </div>
      <AdminCategoryForm onFormSubmit={handleAddCategory} isEditMode={false} />
    </div>
  );
};

export default AddCategory; 