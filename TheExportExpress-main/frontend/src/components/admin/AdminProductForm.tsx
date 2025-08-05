import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // Removed
// import axios from 'axios'; // Removed
// import toast from 'react-hot-toast'; // Removed
import { Product /*, ProductCategory */ } from '../../types/product'; // ProductCategory enum might be removed later or its usage changed
import { getUploadsUrl, getApiUrl as fetchApiUrl } from '../../config'; // Renamed getApiUrl to avoid conflict if used as a variable
import axios from 'axios'; // Re-adding axios as it will be used here to fetch categories

// Interface for categories fetched for the dropdown
interface CategoryOption {
  _id: string;
  name: string;
}

interface AdminProductFormProps {
  product?: Product;
  onFormSubmit: (productData: FormData) => Promise<void>;
  isEditMode?: boolean;
}

// Adjust initialProductState: category will now be string (ID) or null/empty string
const initialProductState: Omit<Product, '_id' | 'images' | 'createdAt' | 'updatedAt' | 'isActive' | 'category'> & { category: string } = {
  name: '',
  description: '',
  shortDescription: '',
  category: '', // Initialize category as an empty string (will hold category ID)
  origin: '',
  specifications: {},
  certifications: [],
  packagingOptions: [],
};

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onFormSubmit, isEditMode = false }) => {
  const [formData, setFormData] = useState<Omit<Product, '_id' | 'images' | 'createdAt' | 'updatedAt' | 'isActive' | 'category'> & { category: string }>(initialProductState);
  const [specifications, setSpecifications] = useState<Record<string, string>>({}); 
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [certificationsArray, setCertificationsArray] = useState<string[]>([]); // Renamed to avoid conflict with Product type field
  const [newCertification, setNewCertification] = useState('');
  const [packagingOptionsArray, setPackagingOptionsArray] = useState<string[]>([]); // Renamed
  const [newPackagingOption, setNewPackagingOption] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const apiUrl = await fetchApiUrl();
        const response = await axios.get<{ data: CategoryOption[] }>(`${apiUrl}/api/categories?isActive=true&limit=1000`); // Fetch active categories
        setAvailableCategories(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories for product form:", error);
        // toast.error("Could not load categories"); // Consider adding toast here if it was re-added
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && product) {
      const {
        name, description, shortDescription, category: productCategory, // product.category could be an object or ID string
        origin, specifications: productSpecs, 
        certifications: productCerts, packagingOptions: productPackages 
      } = product;

      setFormData({
        name: name || '',
        description: description || '',
        shortDescription: shortDescription || '',
        // If product.category is an object like { _id: ..., name: ... }, use productCategory._id
        // If product.category is already an ID string, use it directly.
        // This needs to align with how backend sends product data (populated or not).
        category: typeof productCategory === 'object' ? (productCategory as any)?._id || '' : productCategory as string || '',
        origin: origin || '',
        specifications: productSpecs || {},
        certifications: productCerts || [],
        packagingOptions: productPackages || [],
      });

      setSpecifications(productSpecs || {});
      setCertificationsArray(productCerts || []);
      setPackagingOptionsArray(productPackages || []);

      if (product.images && product.images.length > 0) {
        getUploadsUrl().then(uploadsUrl => {
          setImagePreviews(product.images.map(img => `${uploadsUrl}/${img}`));
        });
      }
    } else if (!isEditMode) {
      setFormData(initialProductState);
      setSpecifications({});
      setCertificationsArray([]);
      setPackagingOptionsArray([]);
      setImagePreviews([]);
      setImages(null);
    }
  }, [product, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // No longer casting category to ProductCategory enum, it's a string (ID)
    setFormData(prev => ({ ...prev, [name]: value })); 
  };

  const handleAddSpecification = () => {
    if (newSpecKey && newSpecValue) {
      setSpecifications((prev) => ({ ...prev, [newSpecKey]: newSpecValue }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };
  const handleRemoveSpecification = (key: string) => {
    setSpecifications((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setCertificationsArray((prev) => [...prev, newCertification.trim()]);
      setNewCertification('');
    }
  };
  const handleRemoveCertification = (index: number) => {
    setCertificationsArray((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPackagingOption = () => {
    if (newPackagingOption.trim()) {
      setPackagingOptionsArray((prev) => [...prev, newPackagingOption.trim()]);
      setNewPackagingOption('');
    }
  };
  const handleRemovePackagingOption = (index: number) => {
    setPackagingOptionsArray((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
      const previews = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const productPayload = new FormData();
    productPayload.append('name', formData.name);
    productPayload.append('description', formData.description);
    productPayload.append('shortDescription', formData.shortDescription);
    productPayload.append('category', formData.category); // This is now category ID (string)
    productPayload.append('origin', formData.origin);
    productPayload.append('specifications', JSON.stringify(specifications));
    certificationsArray.forEach(cert => productPayload.append('certifications[]', cert));
    packagingOptionsArray.forEach(opt => productPayload.append('packagingOptions[]', opt));
    if (images) {
      Array.from(images).forEach(image => {
        productPayload.append('images', image);
      });
    }
    try {
      await onFormSubmit(productPayload);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8 bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Basic Information</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-300 mb-2">Origin *</label>
              <input 
                type="text" 
                name="origin" 
                id="origin" 
                value={formData.origin} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., India, China, USA"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
            <select 
              name="category" 
              id="category" 
              value={formData.category}
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">-- Select Category --</option>
              {availableCategories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-300 mb-2">Short Description *</label>
            <input 
              type="text" 
              name="shortDescription" 
              id="shortDescription" 
              value={formData.shortDescription} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Brief description for product cards"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Full Description *</label>
            <textarea 
              name="description" 
              id="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={6} 
              required 
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
              placeholder="Detailed product description"
            />
          </div>
        </div>
        
        {/* Specifications */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Specifications</h3>
          
          {Object.entries(specifications).length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-blue-300">{key}:</span>
                    <span className="ml-2 text-sm text-gray-300">{String(value)}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSpecification(key)} 
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Specification name (e.g., Weight)" 
              value={newSpecKey} 
              onChange={(e) => setNewSpecKey(e.target.value)} 
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <input 
              type="text" 
              placeholder="Specification value (e.g., 2.5 kg)" 
              value={newSpecValue} 
              onChange={(e) => setNewSpecValue(e.target.value)} 
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button 
              type="button" 
              onClick={handleAddSpecification} 
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-all"
            >
              Add
            </button>
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Certifications</h3>
          
          {certificationsArray.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {certificationsArray.map((cert, index) => (
                <div key={index} className="flex items-center px-3 py-2 bg-emerald-900/50 text-emerald-300 rounded-full border border-emerald-500/30">
                  <span className="text-sm">{cert}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveCertification(index)} 
                    className="ml-2 text-emerald-400 hover:text-emerald-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Add certification (e.g., ISO 9001, FDA Approved)" 
              value={newCertification} 
              onChange={(e) => setNewCertification(e.target.value)} 
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button 
              type="button" 
              onClick={handleAddCertification} 
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-all"
            >
              Add
            </button>
          </div>
        </div>

        {/* Packaging Options */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Packaging Options</h3>
          
          {packagingOptionsArray.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {packagingOptionsArray.map((opt, index) => (
                <div key={index} className="flex items-center px-3 py-2 bg-purple-900/50 text-purple-300 rounded-full border border-purple-500/30">
                  <span className="text-sm">{opt}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemovePackagingOption(index)} 
                    className="ml-2 text-purple-400 hover:text-purple-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Add packaging option (e.g., 1kg bags, 25kg sacks)" 
              value={newPackagingOption} 
              onChange={(e) => setNewPackagingOption(e.target.value)} 
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button 
              type="button" 
              onClick={handleAddPackagingOption} 
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-all"
            >
              Add
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Product Images</h3>
          
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-300 mb-2">
              Upload Images (Multiple files allowed)
            </label>
            <div className="relative">
              <input 
                type="file" 
                name="images" 
                id="images" 
                multiple 
                accept="image/*"
                onChange={handleImageChange} 
                className="hidden"
              />
              <label 
                htmlFor="images"
                className="w-full flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-700/20"
              >
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-400">Click to upload images or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB each</p>
              </label>
            </div>
          </div>
          
          {imagePreviews.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-300 mb-3">Image Previews:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="h-32 w-full object-cover rounded-lg border border-gray-600 group-hover:border-blue-500 transition-colors"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">Image {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-700">
          <button 
            type="button" 
            onClick={() => window.history.back()} 
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm; 