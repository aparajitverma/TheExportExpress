import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../../config';
// import { ICategoryDisplay } from '../pages/admin/Categories'; // Removed problematic import

// Define needed Category structure for the form and props
interface CategoryForForm {
    _id: string;
    name: string;
    description?: string;
    slug?: string; // slug might not be directly part of form data but good for display/parent
    parentCategory?: { _id: string; name: string; slug?: string };
    isActive?: boolean;
}

interface AdminCategoryFormProps {
  category?: CategoryForForm; // For pre-filling form in edit mode
  onFormSubmit: (formData: CategoryFormData) => Promise<void>;
  isEditMode?: boolean;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parentCategory?: string | null; // ID of the parent category or null/empty
  isActive?: boolean; // Only relevant for edit mode, usually set on backend for create
}

const initialCategoryState: CategoryFormData = {
  name: '',
  description: '',
  parentCategory: null,
  isActive: true,
};

const AdminCategoryForm: React.FC<AdminCategoryFormProps> = ({ category, onFormSubmit, isEditMode = false }) => {
  const [formData, setFormData] = useState<CategoryFormData>(initialCategoryState);
  const [allCategories, setAllCategories] = useState<CategoryForForm[]>([]); // For parent category dropdown
  const [loading, setLoading] = useState(false);
  // Removed unused currentApiUrl state

  useEffect(() => {
    const initialize = async () => {
      const apiUrl = await getApiUrl();
      try {
        // Fetch only essential fields for the dropdown to keep payload small
        const response = await axios.get<{data: CategoryForForm[]}>(`${apiUrl}/api/categories?limit=1000&includeInactive=false&fields=name,_id,slug`); 
        setAllCategories(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories for dropdown:", error);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (isEditMode && category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        parentCategory: category.parentCategory?._id || null,
        isActive: category.isActive === undefined ? true : category.isActive, // Ensure isActive has a default
      });
    } else {
      setFormData(initialCategoryState);
    }
  }, [category, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value === '' && name === 'parentCategory' ? null : value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onFormSubmit(formData);
      // Optionally reset form or navigate away from parent component
    } catch (error) {
      // Error is usually handled by the parent component's onFormSubmit via toast
      console.error("Category form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter out the current category from the parent options in edit mode
  const parentCategoryOptions = allCategories.filter(c => !isEditMode || c._id !== category?._id);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow sm:rounded-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
      </div>

      <div>
        <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700">Parent Category (Optional)</label>
        <select 
          name="parentCategory" 
          id="parentCategory" 
          value={formData.parentCategory || ''} // Ensure value is string or it defaults to first option
          onChange={handleChange} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">-- No Parent --</option>
          {parentCategoryOptions.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {isEditMode && (
        <div>
          <label htmlFor="isActive" className="flex items-center text-sm font-medium text-gray-700">
            <input 
              type="checkbox" 
              name="isActive" 
              id="isActive" 
              checked={formData.isActive === undefined ? true : formData.isActive} // Default to true if undefined
              onChange={handleChange} 
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
            />
            Active
          </label>
        </div>
      )}

      <div className="pt-5">
        <div className="flex justify-end">
          <button type="button" onClick={() => window.history.back()} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {loading ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Category')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AdminCategoryForm; 