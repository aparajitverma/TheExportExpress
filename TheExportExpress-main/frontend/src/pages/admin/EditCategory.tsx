import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminCategoryForm, { CategoryFormData } from '../../components/admin/AdminCategoryForm';
import { getApiUrl, INITIAL_API_URL } from '../../config';

// Define the expected structure for a single category fetched for editing
interface CategoryDetail {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  parentCategory?: { _id: string; name: string; slug: string };
  isActive: boolean;
  // Add other fields if necessary, like createdBy, createdAt, etc.
}

const EditCategory: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentApiUrl, setCurrentApiUrl] = useState(INITIAL_API_URL);

  useEffect(() => {
    const initialize = async () => {
      try {
        const apiUrl = await getApiUrl();
        setCurrentApiUrl(apiUrl);
        if (categoryId) {
          const response = await axios.get<{ data: CategoryDetail }>(`${apiUrl}/api/categories/${categoryId}`);
          setCategory(response.data.data || response.data); // Adjust based on actual response structure
          setError(null);
        } else {
          setError('Category ID not found.');
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error fetching category for editing:', err);
        setError(err.response?.data?.message || 'Failed to fetch category details.');
        setCategory(null);
      } finally {
        // Ensure loading is set to false only after category data is potentially set or error handled
        if (categoryId) setLoading(false);
      }
    };
    initialize();
  }, [categoryId]);

  const handleEditCategory = async (formData: CategoryFormData) => {
    if (!categoryId) {
      toast.error('Category ID is missing.');
      return;
    }
    try {
      await axios.patch(`${currentApiUrl}/api/categories/${categoryId}`, formData, {
        // headers: { 'Content-Type': 'application/json' } // Axios defaults to this
      });
      toast.success('Category updated successfully!');
      navigate('/admin/categories');
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast.error(error.response?.data?.message || 'Failed to update category.');
      throw error; // Propagate error to allow form to handle its loading state
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-2xl mx-auto py-6">
        <p className="text-sm text-red-700">{error || 'Category could not be loaded.'}</p>
        <button 
          onClick={() => navigate('/admin/categories')} 
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Category</h1>
      </div>
      <AdminCategoryForm 
        category={category} 
        onFormSubmit={handleEditCategory} 
        isEditMode={true} 
      />
    </div>
  );
};

export default EditCategory; 