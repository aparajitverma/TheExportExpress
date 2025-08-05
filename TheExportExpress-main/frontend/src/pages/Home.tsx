import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-white font-cosmic">
      {/* Hero Section with Enhanced Parallax */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <motion.div
          ref={targetRef}
          style={{ opacity, scale, y }}
          className="z-10 max-w-6xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-widest mb-8 cosmic-text-strong"
          >
            The Export Express
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-6 text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto mb-12 font-light leading-relaxed"
          >
            Your Gateway to Global Trade Excellence
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link to="/products" className="cosmic-button text-xl px-10 py-4">
              Explore Products
            </Link>
            <Link to="/contact-us" className="btn-secondary text-xl px-10 py-4">
              Get Started
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-orb w-32 h-32 top-20 left-10 animate-float opacity-30"></div>
          <div className="floating-orb w-24 h-24 top-40 right-20 animate-float-delayed opacity-20"></div>
          <div className="floating-orb w-40 h-40 bottom-32 left-1/4 animate-float-slow opacity-25"></div>
          <div className="floating-orb w-20 h-20 top-1/3 right-1/3 animate-float opacity-15"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4">
        {/* Section divider */}
        <div className="section-divider"></div>
        
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-center mb-20 cosmic-text uppercase tracking-wider"
          >
            Why Choose The Export Express?
          </motion.h2>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-32">
            {/* Global Reach */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="cosmic-card group"
            >
              <div className="relative z-10">
                <div className="h-20 w-20 mb-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-cosmic group-hover:shadow-cosmic-lg transition-all duration-500 group-hover:scale-110">
                  <i className="fas fa-globe text-3xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold mb-6 cosmic-text">
                  Global Reach
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Access markets worldwide with our extensive network of international trade partners and seamless logistics solutions.
                </p>
              </div>
            </motion.div>

            {/* Quality Assurance */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="cosmic-card group"
            >
              <div className="relative z-10">
                <div className="h-20 w-20 mb-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-cosmic group-hover:shadow-cosmic-lg transition-all duration-500 group-hover:scale-110">
                  <i className="fas fa-certificate text-3xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold mb-6 cosmic-text">
                  Quality Assurance
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Every product meets international standards with our rigorous quality control process and certification management.
                </p>
              </div>
            </motion.div>

            {/* Expert Support */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="cosmic-card group"
            >
              <div className="relative z-10">
                <div className="h-20 w-20 mb-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-cosmic group-hover:shadow-cosmic-lg transition-all duration-500 group-hover:scale-110">
                  <i className="fas fa-headset text-3xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold mb-6 cosmic-text">
                  Expert Support
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Our team of trade experts is available 24/7 to guide you through every step of your export journey.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32"
          >
            {[
              { number: '50+', label: 'Countries Served', icon: 'fa-earth-americas' },
              { number: '1000+', label: 'Products', icon: 'fa-boxes-stacked' },
              { number: '10K+', label: 'Happy Clients', icon: 'fa-users' },
              { number: '24/7', label: 'Support', icon: 'fa-clock' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center group hover:bg-purple-500/10"
              >
                <i className={`fas ${stat.icon} text-3xl text-purple-400 mb-6 group-hover:scale-125 transition-transform duration-300`}></i>
                <h4 className="text-4xl font-bold mb-4 cosmic-text">{stat.number}</h4>
                <p className="text-gray-400 text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-10 max-w-4xl mx-auto card-strong relative overflow-hidden"
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/10 opacity-50"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold cosmic-text-strong mb-8">
                Ready to Start Your Export Journey?
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
                Join thousands of businesses already trading globally with The Export Express
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/register"
                  className="cosmic-button text-xl px-12 py-4"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/products"
                  className="btn-secondary text-xl px-12 py-4"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}