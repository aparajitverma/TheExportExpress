import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationTrigger } from '../hooks/useIntersectionObserver';

interface ContactMethod {
  id: string;
  title: string;
  value: string;
  icon: string;
  color: string;
  description: string;
  action?: () => void;
}

interface OfficeLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  image: string;
  coordinates: { lat: number; lng: number };
  isMain?: boolean;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  subject: string;
  message: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
}

interface FormErrors {
  [key: string]: string;
}

const ContactLocationSection: React.FC = () => {
  const [sectionRef, isVisible] = useAnimationTrigger({
    threshold: 0.1,
    rootMargin: '-50px'
  });

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeLocation, setActiveLocation] = useState(0);
  const [showMap, setShowMap] = useState(false);

  const contactMethods: ContactMethod[] = [
    {
      id: 'phone',
      title: 'Call Us',
      value: '+91 98765 43210',
      icon: 'fa-phone',
      color: 'from-green-400 to-emerald-500',
      description: 'Speak directly with our export specialists',
      action: () => window.open('tel:+919876543210')
    },
    {
      id: 'email',
      title: 'Email Us',
      value: 'info@theexportexpress.com',
      icon: 'fa-envelope',
      color: 'from-blue-400 to-cyan-500',
      description: 'Send us your detailed requirements',
      action: () => window.open('mailto:info@theexportexpress.com')
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      value: '+91 98765 43210',
      icon: 'fa-whatsapp',
      color: 'from-green-500 to-green-600',
      description: 'Quick chat for instant responses',
      action: () => window.open('https://wa.me/919876543210')
    },
    {
      id: 'location',
      title: 'Visit Us',
      value: 'New Delhi, India',
      icon: 'fa-map-marker-alt',
      color: 'from-purple-400 to-pink-500',
      description: 'Meet us at our office locations',
      action: () => setShowMap(true)
    }
  ];

  const officeLocations: OfficeLocation[] = [
    {
      id: 'delhi',
      name: 'Head Office - New Delhi',
      address: 'Connaught Place, New Delhi, Delhi 110001, India',
      phone: '+91 98765 43210',
      email: 'delhi@theexportexpress.com',
      hours: 'Mon - Fri: 9:00 AM - 6:00 PM IST',
      image: '/images/office-delhi.jpg',
      coordinates: { lat: 28.6139, lng: 77.2090 },
      isMain: true
    },
    {
      id: 'mumbai',
      name: 'Mumbai Branch',
      address: 'Bandra Kurla Complex, Mumbai, Maharashtra 400051, India',
      phone: '+91 98765 43211',
      email: 'mumbai@theexportexpress.com',
      hours: 'Mon - Fri: 9:00 AM - 6:00 PM IST',
      image: '/images/office-mumbai.jpg',
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    {
      id: 'bangalore',
      name: 'Bangalore Office',
      address: 'Electronic City, Bangalore, Karnataka 560100, India',
      phone: '+91 98765 43212',
      email: 'bangalore@theexportexpress.com',
      hours: 'Mon - Fri: 9:00 AM - 6:00 PM IST',
      image: '/images/office-bangalore.jpg',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    }
  ];

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.country.trim()) errors.country = 'Country is required';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        country: '',
        subject: '',
        message: '',
        preferredContact: 'email'
      });
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.05,
      rotateY: 5,
      z: 50,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <section ref={sectionRef} className="relative py-24 px-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"></div>
      
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-green-200 to-blue-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to expand your business globally? Contact us today and let's discuss how we can help you succeed in international markets.
          </p>
        </motion.div>

        {/* Contact Methods Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {contactMethods.map((method) => (
            <motion.div
              key={method.id}
              variants={itemVariants}
              whileHover="hover"
              className="group cursor-pointer"
              onClick={method.action}
            >
              <motion.div
                variants={cardHoverVariants}
                className="relative overflow-hidden rounded-xl p-6 bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg group-hover:shadow-xl transition-all duration-500"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl`}></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon with hover animation */}
                  <motion.div
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 10,
                      transition: { type: "spring", stiffness: 300, damping: 10 }
                    }}
                    className="mb-4"
                  >
                    <i className={`fas ${method.icon} text-4xl bg-gradient-to-r ${method.color} bg-clip-text text-transparent`}></i>
                  </motion.div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                    {method.title}
                  </h3>
                  
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {method.value}
                  </p>
                  
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {method.description}
                  </p>
                </div>

                {/* Decorative corner accent */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${method.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                     style={{ clipPath: 'polygon(100% 0%, 0% 0%, 100% 100%)' }}></div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Send Us a Message
              </h3>
              
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-3"></i>
                      <p className="text-green-700 font-medium">
                        Thank you! Your message has been sent successfully. We'll get back to you soon.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your full name"
                    />
                    <AnimatePresence>
                      {formErrors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {formErrors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your email address"
                    />
                    <AnimatePresence>
                      {formErrors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {formErrors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your phone number"
                    />
                    <AnimatePresence>
                      {formErrors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {formErrors.phone}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Company Field */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Country Field */}
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.country ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your country"
                    />
                    <AnimatePresence>
                      {formErrors.country && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {formErrors.country}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      id="preferredContact"
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone Call</option>
                      <option value="whatsapp">WhatsApp</option>
                    </motion.select>
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter the subject of your inquiry"
                  />
                  <AnimatePresence>
                    {formErrors.subject && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {formErrors.subject}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none`}
                    placeholder="Tell us about your requirements, questions, or how we can help you..."
                  />
                  <AnimatePresence>
                    {formErrors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {formErrors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Sending Message...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <i className="fas fa-paper-plane mr-3"></i>
                      Send Message
                    </div>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Office Locations & Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-8"
          >
            {/* Interactive Map */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Our Locations
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowMap(!showMap)}
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                  <i className={`fas ${showMap ? 'fa-list' : 'fa-map'} text-xl`}></i>
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {showMap ? (
                  <motion.div
                    key="map"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    {/* Interactive Map with Animated Markers */}
                    <div className="w-full h-80 rounded-xl overflow-hidden relative bg-gray-100">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight={0} 
                        marginWidth={0} 
                        src="https://www.openstreetmap.org/export/embed.html?bbox=76.84036254882814%2C28.39684603908789%2C77.5780487060547%2C28.97000953059845&amp;layer=mapnik&amp;marker=28.6139,77.2090" 
                        className="rounded-xl"
                      />
                      
                      {/* Animated location markers overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                        {officeLocations.map((location, index) => (
                          <motion.div
                            key={location.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className="absolute"
                            style={{
                              left: `${20 + index * 25}%`,
                              top: `${30 + index * 15}%`
                            }}
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.8, 1, 0.8]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.5
                              }}
                              className="w-4 h-4 bg-red-500 rounded-full shadow-lg"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <small className="block text-xs mt-2 text-center text-gray-600">
                      <a 
                        href="https://www.openstreetmap.org/?mlat=28.6139&amp;mlon=77.2090#map=11/28.6139/77.2090" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline"
                      >
                        View Larger Map
                      </a>
                    </small>
                  </motion.div>
                ) : (
                  <motion.div
                    key="locations"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    {/* Office Location Showcase with Image Carousels */}
                    {officeLocations.map((location, index) => (
                      <motion.div
                        key={location.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                          activeLocation === index
                            ? 'bg-blue-50 border-blue-200 shadow-md'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveLocation(index)}
                      >
                        <div className="flex items-start space-x-4">
                          {/* Location Image */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                              <i className={`fas fa-building text-white text-xl ${location.isMain ? 'fa-star' : ''}`}></i>
                            </div>
                          </div>
                          
                          {/* Location Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-1">
                              <h4 className="text-lg font-semibold text-gray-900 truncate">
                                {location.name}
                              </h4>
                              {location.isMain && (
                                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  Main Office
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                            <div className="space-y-1 text-xs text-gray-500">
                              <div className="flex items-center">
                                <i className="fas fa-phone w-4"></i>
                                <span className="ml-2">{location.phone}</span>
                              </div>
                              <div className="flex items-center">
                                <i className="fas fa-envelope w-4"></i>
                                <span className="ml-2">{location.email}</span>
                              </div>
                              <div className="flex items-center">
                                <i className="fas fa-clock w-4"></i>
                                <span className="ml-2">{location.hours}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Expand indicator */}
                          <motion.div
                            animate={{ rotate: activeLocation === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <i className="fas fa-chevron-down text-gray-400"></i>
                          </motion.div>
                        </div>
                        
                        {/* Expanded content */}
                        <AnimatePresence>
                          {activeLocation === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 pt-4 border-t border-gray-200"
                            >
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Services Available:</h5>
                                  <ul className="space-y-1 text-gray-600">
                                    <li>• Export Documentation</li>
                                    <li>• Trade Consultation</li>
                                    <li>• Logistics Support</li>
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Quick Actions:</h5>
                                  <div className="space-y-2">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`tel:${location.phone.replace(/\s/g, '')}`);
                                      }}
                                      className="block w-full text-left text-blue-600 hover:text-blue-700 transition-colors duration-200"
                                    >
                                      <i className="fas fa-phone mr-2"></i>Call Now
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`mailto:${location.email}`);
                                      }}
                                      className="block w-full text-left text-blue-600 hover:text-blue-700 transition-colors duration-200"
                                    >
                                      <i className="fas fa-envelope mr-2"></i>Send Email
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Business Hours & Additional Info */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Business Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-clock text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Business Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM (IST)</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM (IST)</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-headset text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                    <p className="text-gray-600">Emergency support available for urgent export matters</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-language text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Languages Supported</h4>
                    <p className="text-gray-600">English, Hindi, Spanish, French, Arabic</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex justify-center mt-16"
        >
          <div className="flex space-x-3">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactLocationSection;