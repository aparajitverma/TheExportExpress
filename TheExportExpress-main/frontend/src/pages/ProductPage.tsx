import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../types/product';
import { getApiUrl, getUploadsUrl, INITIAL_UPLOADS_URL } from '../config';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProductImageGallery from '../components/ProductImageGallery';
import '../styles/product-page.css';
import '../styles/product-image-gallery.css';

export default function ProductPage() {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State management
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUploadsUrl, setCurrentUploadsUrl] = useState(INITIAL_UPLOADS_URL);

  // Initialize URLs and fetch product data
  useEffect(() => {
    const initializeUrls = async () => {
      const apiUrl = await getApiUrl();
      const uploadsUrl = await getUploadsUrl();
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
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product details. Please try again later.');
      toast.error('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="flex items-center justify-center"
        >
          <div className="animate-spin h-10 w-10 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-3xl mx-auto text-center"
        >
          <div className="card-strong p-8">
            <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-primary-dark)' }}>
              {error || 'Product not found'}
            </h2>
            <button 
              onClick={() => navigate('/products')} 
              className="btn-primary"
            >
              Back to Products
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Product Page Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pt-24 pb-16"
      >
        {/* Product Page Grid Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="product-page-grid">
            {/* Hero Section - Product Images */}
            <section className="product-hero-section">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ProductImageGallery
                  images={product.images}
                  productName={product.name}
                  uploadsUrl={currentUploadsUrl}
                />
              </motion.div>
            </section>

            {/* Product Information Section */}
            <section className="product-info-section">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="product-details-container"
              >
                <div className="product-header">
                  <h1 className="product-title">{product.name}</h1>
                  <p className="product-description">{product.description}</p>
                </div>

                <div className="product-meta">
                  <div className="meta-item">
                    <span className="meta-label">Category</span>
                    <span className="meta-value">
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Origin</span>
                    <span className="meta-value">{product.origin}</span>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Additional Sections Placeholder */}
            <section className="product-additional-info">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="additional-info-container"
              >
                {/* Specifications */}
                {Object.keys(product.specifications).length > 0 && (
                  <div className="specifications-section">
                    <h3 className="section-title">Specifications</h3>
                    <div className="specifications-grid">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="spec-item">
                          <span className="spec-label">{key}</span>
                          <span className="spec-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {product.certifications.length > 0 && (
                  <div className="certifications-section">
                    <h3 className="section-title">Certifications</h3>
                    <div className="certifications-list">
                      {product.certifications.map((cert) => (
                        <span key={cert} className="certification-badge">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}