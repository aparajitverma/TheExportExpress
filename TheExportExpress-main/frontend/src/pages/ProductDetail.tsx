import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getApiUrl, getUploadsUrl, INITIAL_API_URL, INITIAL_UPLOADS_URL } from '../config';
import { Product } from '../types/product';
import { motion } from 'framer-motion';

interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  message: string;
}

export default function ProductDetail() {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [currentApiUrl, setCurrentApiUrl] = useState(INITIAL_API_URL);
  const [currentUploadsUrl, setCurrentUploadsUrl] = useState(INITIAL_UPLOADS_URL);

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    message: '',
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  useEffect(() => {
    const initializeUrls = async () => {
      const apiUrl = await getApiUrl();
      const uploadsUrl = await getUploadsUrl();
      setCurrentApiUrl(apiUrl);
      setCurrentUploadsUrl(uploadsUrl);
      fetchProduct(apiUrl);
    };
    initializeUrls();
  }, [productId]);

  const fetchProduct = async (apiUrlToUse: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiUrlToUse}/api/products/${productId}`);
      const productData = response.data.data || response.data;
      if (!productData || typeof productData !== 'object') {
        throw new Error('Invalid product data received');
      }
      setProduct(productData);
      if (productData.images?.length > 0) {
        setSelectedImage(productData.images[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product details. Please try again later.');
      toast.error('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({ ...prev, [name]: value }));
  };

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productId) {
      toast.error('Product ID is missing. Cannot submit inquiry.');
      return;
    }
    setSubmittingInquiry(true);
    try {
      const payload = { ...inquiryForm, product: productId };
      await axios.post(`${currentApiUrl}/api/inquiries`, payload);
      toast.success('Inquiry submitted successfully! We will get back to you soon.');
      setIsEnquiryModalOpen(false);
      setInquiryForm({ name: '', email: '', phone: '', companyName: '', message: '' }); // Reset form
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      const errorMessage = err.response?.data?.message || 'Failed to submit inquiry. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
          <div className="card-strong p-8">
            <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-primary-dark)' }}>{error || 'Product not found'}</h2>
            <button onClick={() => navigate('/products')} className="btn-primary">Back to Products</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto pb-16"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="card overflow-hidden p-0">
              <img
                src={`${currentUploadsUrl}/${selectedImage || product.images[0]}`}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  className={`rounded-lg overflow-hidden border ${
                    (selectedImage || product.images[0]) === image ? 'border-[var(--color-primary)]' : 'border-gray-200'
                  } transition-colors duration-200 hover:border-[var(--color-primary)] bg-white`}
                >
                  <img
                    src={`${currentUploadsUrl}/${image}`}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card-strong">
              <h1 className="mb-2" style={{ fontSize: 'var(--fs-h2-d)', lineHeight: 'var(--lh-h2)', fontWeight: 700, color: 'var(--color-primary-dark)' }}>{product.name}</h1>
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="text-[var(--color-primary-dark)] font-medium">
                    {typeof product.category === 'object' ? product.category.name : product.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Origin</span>
                  <span className="text-gray-900">{product.origin}</span>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="card-strong">
              <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-primary-dark)' }}>Specifications</h2>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-500">{key}</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {product.certifications.length > 0 && (
              <div className="card-strong">
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-primary-dark)' }}>Certifications</h2>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <span 
                      key={cert}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging Options */}
            {product.packagingOptions.length > 0 && (
              <div className="card-strong">
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-primary-dark)' }}>Packaging Options</h2>
                <div className="space-y-2 text-gray-700">
                  {product.packagingOptions.map((option) => (
                    <div key={option}>• {option}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Inquiry Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsEnquiryModalOpen(true)}
              className="w-full btn-primary mt-2"
            >
              Make an Inquiry
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Inquiry Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full border border-gray-200 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-primary-dark)' }}>Product Inquiry</h2>
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={inquiryForm.name}
                  onChange={handleInquiryChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={inquiryForm.email}
                  onChange={handleInquiryChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={inquiryForm.phone}
                  onChange={handleInquiryChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={inquiryForm.companyName}
                  onChange={handleInquiryChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Message *</label>
                <textarea
                  name="message"
                  value={inquiryForm.message}
                  onChange={handleInquiryChange}
                  required
                  rows={4}
                  className="input-field"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setIsEnquiryModalOpen(false)} className="flex-1 btn-ghost">Cancel</button>
                <button type="submit" disabled={submittingInquiry} className="flex-1 btn-primary disabled:opacity-50">
                  {submittingInquiry ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}