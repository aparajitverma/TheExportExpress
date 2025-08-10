import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchSuggestion } from '../hooks/useProductSearch';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/apiClient';
import { INITIAL_UPLOADS_URL } from '../config';
import Logo from './Logo';

type NavLinkProps = {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
};

const NavLink: React.FC<NavLinkProps> = ({ to, isActive, children }) => (
  <Link
    to={to}
    className={`relative px-3 py-2 text-700 hover:text-[var(--color-primary)] transition-colors ${isActive ? 'font-medium text-[var(--color-primary)]' : ''}`}
  >
    {children}
    {isActive && (
      <motion.div
        layoutId="navbar-indicator"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
      />
    )}
  </Link>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (id: string) => {
    setIsSearchOpen(false);
    navigate(`/products/${id}`);
  };

  const fetchSearchSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      // The API client already extracts response.data.data, so we get the products array directly
      const products = await api.get<{ _id: string; name: string; category: { _id: string; name: string; slug?: string }; images?: string[]; shortDescription?: string; }[]>(`/products/search?q=${encodeURIComponent(query)}&limit=5`);
      
      // Transform the backend response to SearchSuggestion format
      const searchSuggestions: SearchSuggestion[] = products.map((product) => ({
        id: product._id,
        name: product.name,
        category: product.category?.name || 'Uncategorized',
        image: product.images?.[0],
        shortDescription: product.shortDescription
      }));
      
      setSearchSuggestions(searchSuggestions);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      setSearchSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 nav-glass font-cosmic text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Logo className="py-1" />

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex sm:items-center sm:gap-6">
          <NavLink to="/" isActive={isActive('/')}>Home</NavLink>
          <NavLink to="/products" isActive={isActive('/products')}>Products</NavLink>
          <NavLink to="/services" isActive={isActive('/services')}>Services</NavLink>
          <NavLink to="/case-studies" isActive={isActive('/case-studies')}>Case Studies</NavLink>
          <NavLink to="/compliance" isActive={isActive('/compliance')}>Compliance</NavLink>
          <NavLink to="/about" isActive={isActive('/about')}>About</NavLink>
          <NavLink to="/contact-us" isActive={isActive('/contact-us')}>Contact Us</NavLink>
        </div>

        {/* Search and Auth */}
        <div className="hidden sm:flex sm:items-center">
          <div className="flex items-center space-x-4">
            {/* Universal Search Button */}
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors" aria-label="Toggle search">
              <i className="fas fa-search text-gray-600"></i>
            </button>
            {user && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsOpen(!isOpen)}>
          <span className="sr-only">Open main menu</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Universal Search Overlay */}
      {isSearchOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 p-6 glass-strong border-t border-purple-500/30"
        >
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto relative">
            <input
              type="text"
              placeholder="Search products, categories..."
              className="cosmic-input pr-12 text-lg"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchSearchSuggestions(e.target.value);
              }}
              autoFocus
            />
            <button 
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors p-2 hover:bg-purple-500/20 rounded-full"
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Search Suggestions */}
            {(searchSuggestions.length > 0 || isLoading) && (
              <div className="absolute left-0 right-0 mt-2 rounded-xl shadow-cosmic-lg glass-strong border border-purple-500/30 overflow-hidden">
                {isLoading ? (
                  <div className="px-6 py-4 text-gray-400 text-sm">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Searching...
                  </div>
                ) : (
                  searchSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion.id)}
                      className="w-full px-6 py-4 flex items-center gap-4 hover:bg-purple-500/20 transition-all duration-300 normal-case group border-b border-purple-500/10 last:border-b-0"
                    >
                      {suggestion.image && (
                        <img
                          src={`${INITIAL_UPLOADS_URL}/${suggestion.image}`}
                          alt={suggestion.name}
                          className="w-12 h-12 object-cover rounded-lg border border-purple-500/30 group-hover:border-purple-400/50 transition-all duration-300"
                        />
                      )}
                      <div className="flex-1 text-left">
                        <div className="font-medium text-white group-hover:text-purple-400 transition-colors">{suggestion.name}</div>
                        <div className="text-sm text-gray-400">{suggestion.category}</div>
                        {suggestion.shortDescription && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">{suggestion.shortDescription}</div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </form>
        </motion.div>
      )}

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`sm:hidden overflow-hidden glass-strong`}
      >
        <div className="px-6 pt-4 pb-6 space-y-2">
          <MobileNavLink to="/" isActive={isActive('/')}>Home</MobileNavLink>
          <MobileNavLink to="/products" isActive={isActive('/products')}>Products</MobileNavLink>
          <MobileNavLink to="/services" isActive={isActive('/services')}>Services</MobileNavLink>
          <MobileNavLink to="/case-studies" isActive={isActive('/case-studies')}>Case Studies</MobileNavLink>
          <MobileNavLink to="/compliance" isActive={isActive('/compliance')}>Compliance</MobileNavLink>
          <MobileNavLink to="/about" isActive={isActive('/about')}>About</MobileNavLink>
          <MobileNavLink to="/contact-us" isActive={isActive('/contact-us')}>Contact Us</MobileNavLink>
          
          <div className="pt-4 border-t border-purple-500/20">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-full text-left px-4 py-3 rounded-lg glass-base hover:bg-purple-500/20 transition-all duration-300 normal-case"
            >
              <i className="fas fa-search mr-3 text-purple-400"></i>
              Search Products
            </button>
            
            {user && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-300 normal-case mt-2"
              >
                <i className="fas fa-sign-out-alt mr-3"></i>
                Logout
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </nav>
  );
}

const MobileNavLink: React.FC<NavLinkProps> = ({ to, isActive, children }) => (
  <Link
    to={to}
    className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive
        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
        : 'text-gray-300 hover:bg-purple-500/10 hover:text-purple-400'
    }`}
  >
    {children}
  </Link>
);