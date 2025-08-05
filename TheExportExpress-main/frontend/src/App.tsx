// import React from 'react'; // Removed as it's often not needed with modern JSX transform
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AboutPage from './pages/About';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { UserRole } from './types/user';
import AdminLayout from './components/admin/AdminLayout';
import AdminProducts from './pages/admin/Products';
import AdminUsers from './pages/admin/Users';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import AdminCategories from './pages/admin/Categories';
import AddCategory from './pages/admin/AddCategory';
import EditCategory from './pages/admin/EditCategory';
import AdminInquiries from './pages/admin/Inquiries';
import AdminSettings from './pages/admin/Settings';
import BulkImport from './pages/admin/BulkImport';
import Vendors from './pages/admin/Vendors';
import NotFound from './pages/NotFound';
import TestConnection from './pages/TestConnection';
import { setupAxiosInterceptors } from './utils/authUtils';
import './index.css'; // Ensure global styles are loaded

// Component to conditionally render navbar and footer
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen font-cosmic text-white flex flex-col overflow-hidden cosmic-bg">
      {/* Enhanced Parallax Background with Floating Orbs */}
      <div className="fixed inset-0 z-0 parallax-container">
        {/* Base black background */}
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Animated floating orbs */}
        <div className="floating-orb w-96 h-96 top-10 left-10 animate-float"></div>
        <div className="floating-orb w-64 h-64 top-1/2 right-20 animate-float-delayed"></div>
        <div className="floating-orb w-80 h-80 bottom-20 left-1/3 animate-float-slow"></div>
        
        {/* Multiple gradient layers for depth */}
        <div className="absolute inset-0 bg-cosmic-gradient animate-pulse-cosmic"></div>
        <div className="absolute inset-0 bg-cosmic-gradient-2 animate-pulse-cosmic" style={{ animationDelay: '-2s', animationDuration: '8s' }}></div>
        <div className="absolute inset-0 bg-cosmic-gradient-3 animate-pulse-cosmic" style={{ animationDelay: '-4s', animationDuration: '12s' }}></div>
        
        {/* Additional atmospheric layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-purple-800/5"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-700/5 via-transparent to-purple-900/5"></div>
        
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-shimmer"></div>
      </div>

      {/* Main Content Container with Glass Effect */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Only show navbar for non-admin routes */}
        {!isAdminRoute && <Navbar />}
        
        <main className={`flex-grow relative ${!isAdminRoute ? 'pt-16' : ''}`}>
          {/* Content overlay for better glassmorphism */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-xs"></div>
          
          <div className="relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/test" element={<TestConnection />} />
              
              {/* Customer Dashboard - REMOVED */}
              {/* <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              /> */}

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR]}>
                    <Navigate to="/admin/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR]}>
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/new" element={<AddProduct />} />
                        <Route path="products/edit/:productId" element={<EditProduct />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="categories/new" element={<AddCategory />} />
                        <Route path="categories/edit/:categoryId" element={<EditCategory />} />
                        <Route path="bulk-import" element={<BulkImport />} />
                        <Route path="vendors" element={<Vendors />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="inquiries" element={<AdminInquiries />} />
                        <Route path="settings" element={<AdminSettings />} />
                        {/* Add other admin routes here */}
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        
        {/* Only show footer for non-admin routes */}
        {!isAdminRoute && <Footer />}
        
        {/* Enhanced Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              border: '1px solid rgba(162, 89, 255, 0.3)',
              backdropFilter: 'blur(12px)',
            },
            success: {
              style: {
                border: '1px solid rgba(34, 197, 94, 0.3)',
              },
            },
            error: {
              style: {
                border: '1px solid rgba(239, 68, 68, 0.3)',
              },
            },
          }}
        />
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Set up axios interceptors for authentication
    setupAxiosInterceptors();
  }, []);
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;