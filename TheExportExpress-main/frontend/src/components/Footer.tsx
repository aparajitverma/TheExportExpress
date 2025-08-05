import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-auto">
      {/* Enhanced Glassmorphism Container */}
      <div className="glass-strong border-t border-purple-500/30"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Info & Logo */}
          <div className="space-y-6">
            <Logo showTagline={true} />
            <p className="text-gray-300 text-base leading-relaxed">
              Your trusted partner in global trade, connecting Indian excellence with international markets.
            </p>
            <div className="flex space-x-6">
              {/* Social Media Icons */}
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-125 hover:shadow-cosmic"
              >
                <i className="fab fa-linkedin text-2xl"></i>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-125 hover:shadow-cosmic"
              >
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-125 hover:shadow-cosmic"
              >
                <i className="fab fa-facebook text-2xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 cosmic-text">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-6 cosmic-text">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  Export Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  Shipping Info
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-6 cosmic-text">Newsletter</h3>
            <p className="text-gray-300 text-base mb-6 leading-relaxed">
              Stay updated with our latest products and trade insights
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="cosmic-input text-base"
              />
              <button
                type="submit"
                className="w-full cosmic-button text-base py-3"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Section Divider */}
        <div className="section-divider"></div>

        {/* Bottom Bar */}
        <div className="pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <p className="text-gray-400 text-base">
              © {new Date().getFullYear()} TheExportExpress. All rights reserved.
            </p>
            <div className="flex space-x-8 text-base">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-105">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-105">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-105">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;