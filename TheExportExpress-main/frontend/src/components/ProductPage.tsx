import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../types/product';
import ProductImageGallery from './ProductImageGallery';
import ProductInfoTabs from './ProductInfoTabs';
import ProductSpecifications from './ProductSpecifications';
import ProductFeaturesShowcase from './ProductFeaturesShowcase';
import '../styles/ProductInfoTabs.css';
import '../styles/ProductSpecifications.css';
import '../styles/ProductFeaturesShowcase.css';

interface ProductPageProps {
  className?: string;
}

const ProductPage: React.FC<ProductPageProps> = ({ className = '' }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');

  // Mock product data for demonstration
  const mockProduct: Product = {
    _id: id || '1',
    name: 'Premium Basmati Rice',
    description: 'Our Premium Basmati Rice is sourced from the fertile plains of Punjab, India. Known for its distinctive aroma, long grains, and exceptional taste, this rice variety is perfect for biryanis, pilafs, and other gourmet dishes. Each grain is carefully selected and processed to maintain its natural fragrance and nutritional value.',
    shortDescription: 'Premium long-grain basmati rice with distinctive aroma and exceptional taste.',
    category: 'Grains & Pulses',
    origin: 'Punjab, India',
    images: [
      '/api/placeholder/600/400',
      '/api/placeholder/600/401',
      '/api/placeholder/600/402',
      '/api/placeholder/600/403'
    ],
    specifications: {
      'Grain Length': '6.5-7.0 mm',
      'Moisture Content': '12-14%',
      'Broken Grains': 'Max 2%',
      'Foreign Matter': 'Max 0.1%',
      'Purity': '99.5%',
      'Aging': '12 months minimum',
      'Packaging': 'Jute bags, PP bags',
      'Shelf Life': '24 months',
      'Processing Method': 'Traditional aging',
      'Quality Grade': 'Export Grade A',
      'Color': 'Natural white',
      'Texture': 'Non-sticky when cooked'
    },
    certifications: [
      'ISO 22000:2018',
      'HACCP Certified',
      'Organic Certified',
      'Export Quality',
      'BRC Global Standard'
    ],
    packagingOptions: [
      '1 kg consumer packs',
      '5 kg retail bags',
      '25 kg bulk bags',
      '50 kg export bags',
      'Custom packaging available'
    ],
    isActive: true
  };

  useEffect(() => {
    // Simulate API call
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProduct(mockProduct);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleTabChange = (tabId: string) => {
    setActiveSection(tabId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">{error || 'The requested product could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-page ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span>Products</span>
            <span>/</span>
            <span>{typeof product.category === 'string' ? product.category : product.category?.name}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-lg text-gray-600 max-w-3xl">{product.shortDescription}</p>
        </motion.div>

        {/* Product Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            enableZoom={true}
            autoPlay={false}
            enable360View={false}
            className="max-w-4xl mx-auto"
          />
        </motion.div>

        {/* Product Information Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <ProductInfoTabs
            product={product}
            onTabChange={handleTabChange}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          />
        </motion.div>

        {/* Product Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <ProductFeaturesShowcase
            product={product}
            enableScrollAnimation={true}
            enableProgressiveDisclosure={true}
            maxFeaturesVisible={6}
            layout="grid"
            className="bg-gray-50 rounded-lg p-8"
          />
        </motion.div>

        {/* Detailed Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <ProductSpecifications
            product={product}
            enableSearch={true}
            enableFiltering={true}
            enableComparison={false}
            defaultExpanded={false}
            groupSpecifications={true}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          />
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-blue-50 rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Interested in {product.name}?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get in touch with our export team to discuss pricing, quantities, and shipping options for this premium product.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Request Quote
            </button>
            <button className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium">
              Contact Sales Team
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductPage;