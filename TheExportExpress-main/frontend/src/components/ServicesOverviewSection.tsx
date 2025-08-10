import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnimationTrigger } from '../hooks/useIntersectionObserver';

interface ServiceCategory {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  icon: string;
  features: string[];
  color: string;
  bgPattern: string;
}

const ServicesOverviewSection: React.FC = () => {
  const [sectionRef, isVisible] = useAnimationTrigger({
    threshold: 0.2,
    rootMargin: '-50px'
  });

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const serviceCategories: ServiceCategory[] = [
    {
      id: 'export-documentation',
      title: 'Export Documentation',
      shortDescription: 'Complete documentation services for international trade',
      detailedDescription: 'Comprehensive export documentation services including certificates of origin, commercial invoices, packing lists, and all required customs paperwork to ensure smooth international transactions.',
      icon: 'fa-file-alt',
      features: ['Certificate of Origin', 'Commercial Invoices', 'Packing Lists', 'Customs Documentation'],
      color: 'from-blue-500 to-cyan-500',
      bgPattern: 'documents'
    },
    {
      id: 'logistics-coordination',
      title: 'Logistics Coordination',
      shortDescription: 'End-to-end logistics management and coordination',
      detailedDescription: 'Full-service logistics coordination including freight forwarding, shipping arrangements, cargo insurance, and real-time tracking to ensure your goods reach their destination safely and on time.',
      icon: 'fa-shipping-fast',
      features: ['Freight Forwarding', 'Shipping Arrangements', 'Cargo Insurance', 'Real-time Tracking'],
      color: 'from-green-500 to-emerald-500',
      bgPattern: 'logistics'
    },
    {
      id: 'customs-clearance',
      title: 'Customs Clearance',
      shortDescription: 'Expert customs clearance and compliance services',
      detailedDescription: 'Professional customs clearance services with expert knowledge of international trade regulations, duty calculations, and compliance requirements to prevent delays and ensure smooth border crossings.',
      icon: 'fa-shield-alt',
      features: ['Customs Brokerage', 'Duty Calculations', 'Compliance Checks', 'Border Clearance'],
      color: 'from-purple-500 to-violet-500',
      bgPattern: 'customs'
    },
    {
      id: 'trade-consulting',
      title: 'Trade Consulting',
      shortDescription: 'Strategic trade consulting and market analysis',
      detailedDescription: 'Expert trade consulting services including market analysis, regulatory guidance, trade route optimization, and strategic planning to help businesses expand their global reach effectively.',
      icon: 'fa-chart-line',
      features: ['Market Analysis', 'Regulatory Guidance', 'Route Optimization', 'Strategic Planning'],
      color: 'from-orange-500 to-red-500',
      bgPattern: 'consulting'
    },
    {
      id: 'quality-assurance',
      title: 'Quality Assurance',
      shortDescription: 'Comprehensive quality control and inspection services',
      detailedDescription: 'Rigorous quality assurance services including pre-shipment inspections, quality certifications, compliance testing, and detailed quality reports to ensure your products meet international standards.',
      icon: 'fa-award',
      features: ['Pre-shipment Inspections', 'Quality Certifications', 'Compliance Testing', 'Quality Reports'],
      color: 'from-teal-500 to-cyan-500',
      bgPattern: 'quality'
    },
    {
      id: 'digital-solutions',
      title: 'Digital Solutions',
      shortDescription: 'Advanced digital tools and platform integration',
      detailedDescription: 'Cutting-edge digital solutions including automated documentation, real-time tracking systems, digital compliance tools, and integrated platform solutions to streamline your export processes.',
      icon: 'fa-microchip',
      features: ['Automated Documentation', 'Real-time Tracking', 'Digital Compliance', 'Platform Integration'],
      color: 'from-indigo-500 to-purple-500',
      bgPattern: 'digital'
    }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateX: 45
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    idle: { 
      scale: 1, 
      rotate: 0,
      filter: 'brightness(1)'
    },
    hover: { 
      scale: 1.2, 
      rotate: [0, -10, 10, 0],
      filter: 'brightness(1.2)',
      transition: {
        rotate: {
          duration: 0.6,
          ease: "easeInOut"
        },
        scale: {
          duration: 0.3,
          ease: "easeOut"
        }
      }
    }
  };

  const backgroundPatterns = {
    documents: (
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-6 bg-current rounded-sm"
            style={{
              left: `${20 + (i % 3) * 30}%`,
              top: `${20 + Math.floor(i / 3) * 25}%`,
            }}
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    ),
    logistics: (
      <div className="absolute inset-0 opacity-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-4 bg-current rounded-full"
            style={{
              left: `${15 + (i % 2) * 40}%`,
              top: `${25 + Math.floor(i / 2) * 20}%`,
            }}
            animate={{
              x: [0, 20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    ),
    customs: (
      <div className="absolute inset-0 opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6 border-2 border-current rounded-full"
            style={{
              left: `${25 + (i % 3) * 25}%`,
              top: `${30 + Math.floor(i / 3) * 30}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    ),
    consulting: (
      <div className="absolute inset-0 opacity-10">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0 h-0 border-l-4 border-r-4 border-b-6 border-transparent border-b-current"
            style={{
              left: `${30 + (i % 2) * 30}%`,
              top: `${35 + Math.floor(i / 2) * 25}%`,
            }}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 3.5,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    ),
    quality: (
      <div className="absolute inset-0 opacity-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-5 h-5 bg-current"
            style={{
              left: `${20 + (i % 3) * 30}%`,
              top: `${25 + Math.floor(i / 3) * 30}%`,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 72, 144, 216, 288, 360],
            }}
            transition={{
              duration: 6,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    ),
    digital: (
      <div className="absolute inset-0 opacity-10">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-current rounded-full"
            style={{
              left: `${15 + (i % 4) * 20}%`,
              top: `${20 + Math.floor(i / 4) * 20}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    )
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 px-4 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background with interactive patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
        {/* Interactive background elements that respond to mouse */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.1) 0%, transparent 50%)`
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Floating background shapes */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full blur-3xl"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: `${10 + Math.floor(i / 4) * 40}%`,
                background: `linear-gradient(135deg, ${
                  ['rgba(99, 102, 241, 0.3)', 'rgba(168, 85, 247, 0.3)', 'rgba(236, 72, 153, 0.3)', 'rgba(34, 197, 94, 0.3)'][i % 4]
                }, transparent)`
              }}
              animate={{
                x: [0, 30, -30, 0],
                y: [0, -20, 20, 0],
                scale: [1, 1.2, 0.8, 1],
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 bg-clip-text text-transparent">
            Our Services Overview
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive export solutions tailored to your business needs, from documentation to delivery
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {serviceCategories.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              className="group relative perspective-container"
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Service card */}
              <motion.div
                className="relative h-full min-h-[400px] rounded-2xl overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                  z: 50
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                {/* Card background with glassmorphism */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                  
                  {/* Background pattern */}
                  <div className={`absolute inset-0 text-gray-400 group-hover:text-current transition-colors duration-500`}>
                    {backgroundPatterns[service.bgPattern as keyof typeof backgroundPatterns]}
                  </div>
                </div>

                {/* Card content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Icon */}
                  <motion.div
                    variants={iconVariants}
                    initial="idle"
                    animate={hoveredCard === service.id ? "hover" : "idle"}
                    className="mb-6"
                  >
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <i className={`fas ${service.icon} text-2xl text-white`}></i>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Short description (always visible) */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Detailed description (revealed on hover) */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={
                      hoveredCard === service.id 
                        ? { opacity: 1, height: 'auto' }
                        : { opacity: 0, height: 0 }
                    }
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                      {service.detailedDescription}
                    </p>
                    
                    {/* Features list */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 text-sm">Key Features:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={
                              hoveredCard === service.id 
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -20 }
                            }
                            transition={{ 
                              duration: 0.3, 
                              delay: featureIndex * 0.1 
                            }}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <motion.div
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color} mr-3 flex-shrink-0`}
                              animate={
                                hoveredCard === service.id 
                                  ? { scale: [1, 1.3, 1] }
                                  : { scale: 1 }
                              }
                              transition={{ 
                                duration: 0.5, 
                                delay: featureIndex * 0.1 
                              }}
                            />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* Learn more button (appears on hover) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      hoveredCard === service.id 
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="mt-auto pt-4"
                  >
                    <button className={`w-full py-3 px-6 rounded-xl bg-gradient-to-r ${service.color} text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}>
                      Learn More
                    </button>
                  </motion.div>
                </div>

                {/* Decorative corner accent */}
                <div 
                  className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${service.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl`}
                  style={{ clipPath: 'polygon(100% 0%, 0% 0%, 100% 100%)' }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex justify-center mt-16"
        >
          <div className="flex space-x-3">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${
                    ['#6366f1', '#8b5cf6', '#ec4899', '#22c55e', '#f59e0b', '#06b6d4'][i]
                  }, transparent)`
                }}
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

export default ServicesOverviewSection;