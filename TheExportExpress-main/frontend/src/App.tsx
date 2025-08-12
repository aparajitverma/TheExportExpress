// import React from 'react'; // Removed as it's often not needed with modern JSX transform
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ProductPage from './pages/ProductPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AboutPage from './pages/About';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
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
import Orders from './pages/admin/Orders';
import Payments from './pages/admin/Payments';
import ShipmentTracking from './pages/admin/ShipmentTracking';
import TradeAnalytics from './pages/admin/TradeAnalytics';
import NotFound from './pages/NotFound';
import TestConnection from './pages/TestConnection';
import FlowOverview from './pages/admin/flow/FlowOverview';
import Phase1 from './pages/admin/flow/Phase1';
import Phase2 from './pages/admin/flow/Phase2';
import Phase3 from './pages/admin/flow/Phase3';
import Phase4 from './pages/admin/flow/Phase4';
import Phase5 from './pages/admin/flow/Phase5';
import OrderTracker from './pages/admin/flow/OrderTracker';
import TradeServices from './pages/TradeServices';
import CaseStudies from './pages/CaseStudies';
import Compliance from './pages/Compliance';
import { setupAxiosInterceptors } from './utils/authUtils';
import './index.css'; // Ensure global styles are loaded

// Component to conditionally render navbar and footer
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen font-cosmic text-gray-900 flex flex-col overflow-hidden bg-white">
      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Only show navbar for non-admin routes */}
        {!isAdminRoute && <Navbar />}
        
        <main className={`flex-grow relative ${!isAdminRoute ? 'pt-16' : ''}`}>
          <div className="relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<TradeServices />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/compliance" element={<Compliance />} />
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
                        <Route path="flow" element={<FlowOverview />} />
                        <Route path="flow/phase-1" element={<Phase1 />} />
                        <Route path="flow/phase-2" element={<Phase2 />} />
                        <Route path="flow/phase-3" element={<Phase3 />} />
                        <Route path="flow/phase-4" element={<Phase4 />} />
                        <Route path="flow/phase-5" element={<Phase5 />} />
                        <Route path="flow/order-tracker" element={<OrderTracker />} />
                        <Route path="flow/order-tracker/:orderId" element={<OrderTracker />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/new" element={<AddProduct />} />
                        <Route path="products/edit/:productId" element={<EditProduct />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="categories/new" element={<AddCategory />} />
                        <Route path="categories/edit/:categoryId" element={<EditCategory />} />
                        <Route path="bulk-import" element={<BulkImport />} />
                        <Route path="vendors" element={<Vendors />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="payments" element={<Payments />} />
                        <Route path="shipment-tracking" element={<ShipmentTracking />} />
                        <Route path="trade-analytics" element={<TradeAnalytics />} />
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