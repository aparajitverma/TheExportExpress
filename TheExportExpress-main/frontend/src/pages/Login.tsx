import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/user';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uiLoading, setUiLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user, loading: authContextLoading } = useAuth();

  useEffect(() => {
    if (!authContextLoading && isAuthenticated && user) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if ([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR].includes(user.role)) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [authContextLoading, isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUiLoading(true);

    try {
      await login(email, password);
      console.log('Login successful');
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setUiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-orb w-96 h-96 top-10 left-10 animate-float opacity-20"></div>
        <div className="floating-orb w-64 h-64 bottom-20 right-10 animate-float-delayed opacity-15"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg mx-auto relative z-10"
      >
        <div className="card-strong p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-cosmic mb-6">
                <i className="fas fa-sign-in-alt text-3xl text-white"></i>
              </div>
            </motion.div>
            
            <h1 className="text-4xl font-bold cosmic-text-strong mb-4">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-lg">
              Sign in to your account to continue
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-300 mb-3">
                Email Address
              </label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400"></i>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="cosmic-input pl-12 text-lg"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-300 mb-3">
                Password
              </label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400"></i>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="cosmic-input pl-12 pr-12 text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={uiLoading}
                className="w-full cosmic-button text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {uiLoading && (
                  <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                    <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full"></div>
                  </div>
                )}
                <span className={uiLoading ? 'opacity-0' : 'opacity-100'}>
                  <i className="fas fa-sign-in-alt mr-3"></i>
                  Sign In
                </span>
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="section-divider"></div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-400 text-lg mb-6">
              Don't have an account?
            </p>
            <Link 
              to="/register" 
              className="btn-secondary text-lg px-8 py-3 group"
            >
              <i className="fas fa-user-plus mr-2 group-hover:scale-110 transition-transform duration-300"></i>
              Create Account
            </Link>
          </div>

          {/* Additional Links */}
          <div className="mt-8 flex justify-center space-x-8 text-sm">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
              Forgot Password?
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
              Need Help?
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}