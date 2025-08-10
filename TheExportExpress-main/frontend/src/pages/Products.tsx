import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getApiUrl, getUploadsUrl, INITIAL_API_URL, INITIAL_UPLOADS_URL } from '../config';
import { Product } from '../types/product';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentApiUrl, setCurrentApiUrl] = useState(INITIAL_API_URL);
  const [currentUploadsUrl, setCurrentUploadsUrl] = useState(INITIAL_UPLOADS_URL);

  const fetchProducts = async (apiUrlToUse: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<{ data: Product[] }>(`${apiUrlToUse}/api/products`);
      setProducts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeUrlsAndFetch = async () => {
      try {
        const apiUrl = await getApiUrl();
        const uploadsUrl = await getUploadsUrl();
        setCurrentApiUrl(apiUrl);
        setCurrentUploadsUrl(uploadsUrl);
        await fetchProducts(apiUrl);
      } catch (e) {
        console.error("Error initializing URLs for Products page:", e);
        fetchProducts(INITIAL_API_URL);
      }
    };
    initializeUrlsAndFetch();
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                          (product.category && 
                           (typeof product.category === 'object' ? 
                             product.category._id === selectedCategory :
                             product.category === selectedCategory));
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="card-strong p-10 text-center max-w-md mx-auto">
          <div className="animate-spin w-10 h-10 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-primary-dark)' }}>Loading Products</h2>
          <p className="text-gray-500">Discovering amazing export opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="card-strong p-10 text-center max-w-lg mx-auto">
          <i className="fas fa-exclamation-triangle text-4xl text-red-600 mb-4"></i>
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#991b1b' }}>Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => fetchProducts(currentApiUrl)}
            className="btn-primary"
          >
            <i className="fas fa-refresh mr-2"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto text-center mb-16"
      >
        <h1 className="mb-4" style={{ fontSize: 'var(--fs-h2-d)', lineHeight: 'var(--lh-h2)', fontWeight: 700, color: 'var(--color-primary-dark)' }}>Our Premium Export Products</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">Discover our curated selection of high-quality products ready for global export</p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto mb-16"
      >
        <div className="card-strong p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search products, descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="cosmic-input pl-12"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="w-full lg:w-80">
              <div className="relative">
                <i className="fas fa-filter absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="cosmic-input pl-12 appearance-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {/* Add category options here */}
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 pointer-events-none"></i>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              <span className="font-medium text-[var(--color-primary-dark)]">{filteredProducts.length}</span> 
              {filteredProducts.length === 1 ? ' product' : ' products'} found
            </p>
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto"
      >
        {filteredProducts.length === 0 ? (
          <div className="card-strong p-16 text-center">
            <i className="fas fa-search text-6xl text-purple-400 mb-8 opacity-50"></i>
            <h3 className="text-3xl font-bold mb-6 cosmic-text">No Products Found</h3>
            <p className="text-gray-400 text-xl mb-8">Try adjusting your search terms or filters</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="btn-secondary"
            >
              <i className="fas fa-refresh mr-2"></i>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                variants={item}
                className="group"
              >
                <div className="card h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-6">
                    {product.images && product.images[0] ? (
                      <img
                        src={`${currentUploadsUrl}/${product.images[0]}`}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <i className="fas fa-image text-3xl text-gray-400"></i>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Hover overlay with quick view */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Link
                        to={`/products/${product._id}`}
                        className="btn-primary"
                      >
                        <i className="fas fa-eye mr-2"></i>
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-medium">
                        {typeof product.category === 'object' ? product.category.name : 'Category'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-gray-900">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                      {product.shortDescription || product.description}
                    </p>
                    
                    <Link
                      to={`/products/${product._id}`}
                      className="w-full text-center btn-secondary"
                    >
                      Learn More
                      <i className="fas fa-arrow-right ml-2"></i>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}