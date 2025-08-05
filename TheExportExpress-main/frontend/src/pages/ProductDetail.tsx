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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24 px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            {error || 'Product not found'}
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-full hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Back to Products
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 px-4">
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
            <div className="backdrop-blur-lg bg-black/60 rounded-xl overflow-hidden border border-[#a259ff]/30 shadow-xl">
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
                  className={`backdrop-blur-lg bg-black/60 rounded-lg overflow-hidden border ${
                    (selectedImage || product.images[0]) === image
                      ? 'border-[#a259ff]'
                      : 'border-[#a259ff]/20'
                  } transition-all duration-300 hover:border-[#a259ff]`}
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
            <div className="backdrop-blur-lg bg-black/60 rounded-xl p-6 border border-[#a259ff]/30 shadow-xl">
              <h1 className="text-3xl font-bold uppercase tracking-widest bg-gradient-to-r from-white via-[#a259ff] to-white bg-clip-text text-transparent mb-4" style={{ fontFamily: 'Montserrat, Roboto, "DIN Next Pro", Arial, sans-serif' }}>
                {product.name}
              </h1>
              <p className="text-gray-200 mb-6">{product.description}</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-[#a259ff] font-semibold">
                    {typeof product.category === 'object' ? product.category.name : product.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Origin</span>
                  <span className="text-white">{product.origin}</span>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="backdrop-blur-lg bg-black/60 rounded-xl p-6 border border-[#a259ff]/30 shadow-xl">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-[#a259ff] to-white bg-clip-text text-transparent mb-4">
                Specifications
              </h2>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-400">{key}</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {product.certifications.length > 0 && (
              <div className="backdrop-blur-lg bg-black/60 rounded-xl p-6 border border-[#a259ff]/30 shadow-xl">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-[#a259ff] to-white bg-clip-text text-transparent mb-4">
                  Certifications
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <span 
                      key={cert}
                      className="px-3 py-1 bg-[#a259ff]/10 rounded-full text-sm text-[#a259ff] border border-[#a259ff]/40"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging Options */}
            {product.packagingOptions.length > 0 && (
              <div className="backdrop-blur-lg bg-black/60 rounded-xl p-6 border border-[#a259ff]/30 shadow-xl">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-[#a259ff] to-white bg-clip-text text-transparent mb-4">
                  Packaging Options
                </h2>
                <div className="space-y-2">
                  {product.packagingOptions.map((option) => (
                    <div key={option} className="text-gray-200">
                      • {option}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inquiry Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsEnquiryModalOpen(true)}
              className="w-full py-3 bg-[#a259ff] text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-2xl font-bold uppercase tracking-widest text-lg mt-4"
            >
              Make an Inquiry
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Inquiry Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/80 backdrop-blur-lg rounded-xl p-6 max-w-md w-full border border-[#a259ff]/40 shadow-2xl"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-[#a259ff] to-white bg-clip-text text-transparent mb-6">
              Product Inquiry
            </h2>
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={inquiryForm.name}
                  onChange={handleInquiryChange}
                  required
                  className="w-full px-4 py-2 bg-black/60 text-white rounded-lg border border-[#a259ff]/30 focus:outline-none focus:border-[#a259ff]"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={inquiryForm.email}
                  onChange={handleInquiryChange}
                  required
                  className="w-full px-4 py-2 bg-black/60 text-white rounded-lg border border-[#a259ff]/30 focus:outline-none focus:border-[#a259ff]"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={inquiryForm.phone}
                  onChange={handleInquiryChange}
                  className="w-full px-4 py-2 bg-black/60 text-white rounded-lg border border-[#a259ff]/30 focus:outline-none focus:border-[#a259ff]"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={inquiryForm.companyName}
                  onChange={handleInquiryChange}
                  className="w-full px-4 py-2 bg-black/60 text-white rounded-lg border border-[#a259ff]/30 focus:outline-none focus:border-[#a259ff]"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Message *</label>
                <textarea
                  name="message"
                  value={inquiryForm.message}
                  onChange={handleInquiryChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-black/60 text-white rounded-lg border border-[#a259ff]/30 focus:outline-none focus:border-[#a259ff]"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEnquiryModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333] transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#a259ff] to-[#7f3cff] text-white rounded-lg hover:from-[#b47aff] hover:to-[#a259ff] transition-all duration-300 disabled:opacity-50"
                >
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