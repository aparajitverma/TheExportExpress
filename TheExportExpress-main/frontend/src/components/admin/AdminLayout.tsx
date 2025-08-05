import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/user';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};

const sidebarVariants = {
  open: { x: 0, width: '16rem' },
  closed: { x: '-100%', width: '16rem' }
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState(3); // Mock notification count

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊', description: 'Overview & Analytics' },
    { path: '/admin/products', label: 'Products', icon: '📦', description: 'Manage Export Products' },
    { path: '/admin/categories', label: 'Categories', icon: '🏷️', description: 'Product Categories' },
    { path: '/admin/inquiries', label: 'Inquiries', icon: '📧', description: 'B2B Inquiries', badge: '5' },
    { path: '/admin/bulk-import', label: 'Bulk Import', icon: '📥', description: 'Import Products' },
    { path: '/admin/vendors', label: 'Vendors', icon: '🏭', description: 'Supplier Management' },
    { path: '/admin/orders', label: 'Orders', icon: '📋', description: 'Order Tracking', comingSoon: true },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈', description: 'Business Reports', comingSoon: true },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️', description: 'System Settings' },
  ];

  // Add Users menu item only for super admin
  if (user?.role === UserRole.SUPER_ADMIN) {
    menuItems.splice(5, 0, { path: '/admin/users', label: 'Users', icon: '👥', description: 'User Management' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-800 to-gray-900 backdrop-blur-sm border-r border-gray-700 shadow-2xl"
          >
            {/* Logo/Title */}
            <div className="flex h-16 items-center justify-center border-b border-gray-700">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                  ExportExpress
                </h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </motion.div>
            </div>

            {/* Navigation */}
            <nav className="mt-8 px-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={menuItemVariants}
                >
                  {item.comingSoon ? (
                    <div className="group flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-500 cursor-not-allowed opacity-50">
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span>{item.label}</span>
                          <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">Soon</span>
                        </div>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-blue-400'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs ${location.pathname === item.path ? 'text-blue-200' : 'text-gray-500'}`}>
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* User Info & Logout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700"
            >
              {user && (
                <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-400">Logged in as</p>
                  <p className="font-medium text-blue-400">{user.name}</p>
                  <p className="text-xs text-emerald-400">{user.role}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-400 bg-blue-900/20 rounded-lg border border-blue-500/30 hover:bg-blue-900/40 transition-all duration-200"
                >
                  <span className="mr-2">🏠</span>
                  Website
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-400 bg-red-900/20 rounded-lg border border-red-500/30 hover:bg-red-900/40 transition-all duration-200"
                >
                  <span className="mr-2">🚪</span>
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
        {/* Top Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-200">
                  {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-400">
                  {menuItems.find(item => item.path === location.pathname)?.description || 'Admin Panel'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <span className="text-xl">🔔</span>
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              
              {/* User Menu */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-200">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 lg:p-6 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}