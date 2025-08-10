import React from 'react';
import { motion } from 'framer-motion';
import { useAnimationTrigger } from '../hooks/useIntersectionObserver';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: string;
}

interface CompanyValue {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const AboutUsSection: React.FC = () => {
  const [sectionRef, isVisible] = useAnimationTrigger({
    threshold: 0.2,
    rootMargin: '-50px'
  });

  const timelineItems: TimelineItem[] = [
    {
      year: '2010',
      title: 'Company Founded',
      description: 'Started with a vision to simplify global trade for businesses worldwide.',
      icon: 'fa-rocket'
    },
    {
      year: '2015',
      title: 'Global Expansion',
      description: 'Expanded operations to serve 25+ countries across multiple continents.',
      icon: 'fa-globe'
    },
    {
      year: '2018',
      title: 'Digital Innovation',
      description: 'Launched our digital platform to streamline export processes.',
      icon: 'fa-microchip'
    },
    {
      year: '2020',
      title: 'Pandemic Resilience',
      description: 'Adapted quickly to support businesses during global challenges.',
      icon: 'fa-shield-alt'
    },
    {
      year: '2024',
      title: 'Industry Leadership',
      description: 'Recognized as a leading export solutions provider with 10,000+ clients.',
      icon: 'fa-trophy'
    }
  ];

  const companyValues: CompanyValue[] = [
    {
      title: 'Excellence',
      description: 'We strive for perfection in every aspect of our service delivery.',
      icon: 'fa-star',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Innovation',
      description: 'Continuously evolving our solutions to meet changing market needs.',
      icon: 'fa-lightbulb',
      color: 'from-blue-400 to-purple-500'
    },
    {
      title: 'Integrity',
      description: 'Building trust through transparent and ethical business practices.',
      icon: 'fa-handshake',
      color: 'from-green-400 to-teal-500'
    },
    {
      title: 'Partnership',
      description: 'Working closely with clients to achieve their global trade goals.',
      icon: 'fa-users',
      color: 'from-purple-400 to-pink-500'
    }
  ];

  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const timelineItemVariants = {
    hidden: { 
      opacity: 0, 
      x: -100,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const valuesVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  const valueCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateX: 45
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
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
            About The Export Express
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in global trade, connecting businesses worldwide with excellence and innovation
          </p>
        </motion.div>

        {/* Split-screen layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left side - Company Story Timeline */}
          <motion.div
            variants={timelineVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="relative"
          >
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Our Journey</h3>
            
            {/* Timeline container */}
            <div className="relative">
              {/* Timeline line */}
              <motion.div
                initial={{ height: 0 }}
                animate={isVisible ? { height: '100%' } : { height: 0 }}
                transition={{ duration: 2, delay: 0.5 }}
                className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400"
              ></motion.div>

              {/* Timeline items */}
              <div className="space-y-8">
                {timelineItems.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={timelineItemVariants}
                    className="relative flex items-start group"
                  >
                    {/* Timeline dot */}
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="relative z-10 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300"
                    >
                      <i className={`fas ${item.icon} text-white text-lg`}></i>
                    </motion.div>

                    {/* Timeline content */}
                    <div className="ml-6 flex-1">
                      <motion.div
                        whileHover={{ x: 10 }}
                        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 group-hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center mb-2">
                          <span className="text-2xl font-bold text-blue-600 mr-3">{item.year}</span>
                          <h4 className="text-xl font-semibold text-gray-900">{item.title}</h4>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right side - Mission Statement and Values */}
          <div className="space-y-12">
            {/* Floating Mission Statement */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: 30 }}
              animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 30 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              {/* Gradient background with animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
              <motion.div
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
                    'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)',
                    'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(147, 51, 234, 0.1) 100%)'
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl"
              >
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Our Mission
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  To empower businesses of all sizes to reach global markets through innovative export solutions, 
                  exceptional service, and unwavering commitment to their success.
                </p>
                <div className="flex items-center text-blue-600">
                  <i className="fas fa-quote-left text-2xl mr-3 opacity-50"></i>
                  <span className="italic font-medium">
                    "Connecting the world, one export at a time."
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Company Values Cards */}
            <motion.div
              variants={valuesVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
            >
              <h3 className="text-3xl font-bold mb-8 text-gray-900">Our Values</h3>
              <div className="grid grid-cols-2 gap-4">
                {companyValues.map((value, index) => (
                  <motion.div
                    key={index}
                    variants={valueCardVariants}
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      z: 50
                    }}
                    className="group relative perspective-container"
                  >
                    {/* Card background with glassmorphism */}
                    <div className="relative overflow-hidden rounded-xl p-6 bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg group-hover:shadow-xl transition-all duration-500">
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl`}></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon with hover animation */}
                        <motion.div
                          whileHover={{ 
                            scale: 1.2, 
                            rotate: 10,
                            transition: { type: "spring", stiffness: 300, damping: 10 }
                          }}
                          className="mb-4"
                        >
                          <i className={`fas ${value.icon} text-3xl bg-gradient-to-r ${value.color} bg-clip-text text-transparent`}></i>
                        </motion.div>
                        
                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                          {value.title}
                        </h4>
                        
                        {/* Description with reveal animation */}
                        <motion.p
                          initial={{ opacity: 0.7, height: 'auto' }}
                          whileHover={{ opacity: 1 }}
                          className="text-sm text-gray-600 leading-relaxed transition-all duration-300"
                        >
                          {value.description}
                        </motion.p>
                      </div>

                      {/* Decorative corner accent */}
                      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${value.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                           style={{ clipPath: 'polygon(100% 0%, 0% 0%, 100% 100%)' }}></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
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

export default AboutUsSection;