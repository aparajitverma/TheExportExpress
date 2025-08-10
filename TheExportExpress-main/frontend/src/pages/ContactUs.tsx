import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getApiUrl, INITIAL_API_URL } from '../config';
import { Product } from '../types/product'; // Assuming you might want to populate products
import { motion } from 'framer-motion';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  subject: string;
  message: string;
  productId?: string; // For product-specific inquiry
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    country: '',
    subject: '',
    message: '',
    productId: undefined,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentApiUrl, setCurrentApiUrl] = useState(INITIAL_API_URL);

  const location = useLocation();

  useEffect(() => {
    const initializeApi = async () => {
      const apiUrl = await getApiUrl();
      setCurrentApiUrl(apiUrl);
      fetchProducts(apiUrl);
    };
    initializeApi();
  }, []);

  useEffect(() => {
    // Check if coming from a product page with productId in state
    if (location.state?.productId) {
      setFormData(prev => ({ ...prev, productId: location.state.productId, subject: `Inquiry about product: ${location.state.productName || 'Selected Product'}` }));
    }
  }, [location.state]);

  const fetchProducts = async (apiUrlToUse: string) => {
    setLoadingProducts(true);
    try {
      const response = await axios.get(`${apiUrlToUse}/api/products?limit=100&fields=name`); // Fetch only name and id
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products for dropdown:", error);
      toast.error('Could not load products for inquiry form.');
    }
    setLoadingProducts(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Endpoint for general contact/inquiry, adjust if you have a specific one
      // This is similar to the product inquiry, but might go to a different handler or have different fields
      const payload = { ...formData };
      if (!payload.productId) delete payload.productId; // Remove if not set, or handle backend appropriately
      
      await axios.post(`${currentApiUrl}/api/inquiries`, payload); // Using existing inquiry endpoint for now
      toast.success('Your message has been sent successfully! We will contact you shortly.');
      setFormData({
        name: '', email: '', phone: '', companyName: '',
        country: '', subject: '', message: '', productId: undefined
      });
      // navigate back or to a thank you page if desired
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-4 pt-20 pb-20">
        <header className="text-center space-y-3 mb-10">
          <h1 className="mx-auto" style={{ fontSize: 'var(--fs-h1-d)', lineHeight: 'var(--lh-h1)', fontWeight: 700, color: 'var(--color-primary-dark)' }}>Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">We&apos;re here to help. Reach out to us with any questions or inquiries.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="card-strong p-8">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-primary-dark)' }}>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 input-field" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 input-field" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 input-field" />
              </div>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} className="mt-1 input-field" />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} required className="mt-1 input-field" />
              </div>
              
              <div>
                <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Product of Interest (Optional)</label>
                <select 
                  name="productId" 
                  id="productId" 
                  value={formData.productId || ''} 
                  onChange={handleChange}
                  className="mt-1 input-field"
                  disabled={loadingProducts}
                >
                  <option value="">-- Select a Product (if applicable) --</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>{product.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="mt-1 input-field" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea name="message" id="message" value={formData.message} onChange={handleChange} rows={4} required className="mt-1 input-field"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full btn-primary mt-2 disabled:opacity-50" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Details & Map */}
          <div className="space-y-8">
            <div className="card-strong p-8">
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-primary-dark)' }}>Our Contact Information</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>Address:</strong> New Delhi, Delhi, India</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Email:</strong> info@theexportexpress.com</p>
                <p><strong>Business Hours:</strong> Mon - Fri, 9:00 AM - 6:00 PM (IST)</p>
              </div>
            </div>
            <div className="card-strong p-8" style={{ height: '450px' }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-primary-dark)' }}>Our Location</h2>
              <div className="w-full h-full rounded overflow-hidden">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight={0} 
                  marginWidth={0} 
                  src="https://www.openstreetmap.org/export/embed.html?bbox=76.84036254882814%2C28.39684603908789%2C77.5780487060547%2C28.97000953059845&amp;layer=mapnik&amp;marker=28.6139,77.2090" 
                  style={{border: '1px solid #e5e7eb'}}
                >
                </iframe>
                <small className="block text-xs mt-1">
                  <a href="https://www.openstreetmap.org/?mlat=28.6139&amp;mlon=77.2090#map=11/28.6139/77.2090" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">
                    View Larger Map
                  </a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;