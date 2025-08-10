import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  details: string[];
  duration: string;
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: "Initial Consultation",
    description: "Understanding your export requirements and business goals",
    icon: "fas fa-handshake",
    details: [
      "Business needs assessment",
      "Market analysis and research",
      "Regulatory requirements review",
      "Timeline and budget planning"
    ],
    duration: "1-2 days"
  },
  {
    id: 2,
    title: "Documentation Preparation",
    description: "Comprehensive preparation of all required export documents",
    icon: "fas fa-file-alt",
    details: [
      "Export licenses and permits",
      "Commercial invoices and packing lists",
      "Certificates of origin",
      "Quality and compliance certificates"
    ],
    duration: "3-5 days"
  },
  {
    id: 3,
    title: "Quality Assurance",
    description: "Rigorous quality control and compliance verification",
    icon: "fas fa-shield-alt",
    details: [
      "Product quality inspection",
      "Compliance verification",
      "Testing and certification",
      "Final quality approval"
    ],
    duration: "2-3 days"
  },
  {
    id: 4,
    title: "Logistics Coordination",
    description: "Efficient shipping and logistics management",
    icon: "fas fa-shipping-fast",
    details: [
      "Shipping method selection",
      "Freight forwarding coordination",
      "Insurance and risk management",
      "Customs clearance preparation"
    ],
    duration: "1-2 days"
  },
  {
    id: 5,
    title: "Shipment & Tracking",
    description: "Real-time monitoring and delivery coordination",
    icon: "fas fa-map-marker-alt",
    details: [
      "Shipment dispatch and tracking",
      "Real-time status updates",
      "Customs clearance support",
      "Delivery confirmation"
    ],
    duration: "Ongoing"
  }
];

const ProcessOverviewSection: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [progressWidth, setProgressWidth] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    if (isVisible) {
      controls.start("visible");
      // Animate progress bar
      const timer = setTimeout(() => {
        setProgressWidth(100);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const stepVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const connectionVariants = {
    hidden: { 
      scaleX: 0,
      opacity: 0
    },
    visible: { 
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 1,
        delay: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section 
      ref={ref}
      className="relative py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl process-floating-shapes"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl process-floating-shapes"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-green-200 to-blue-200 rounded-full blur-2xl process-floating-shapes"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 process-gradient-text">
            Our Export Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A streamlined, transparent workflow that ensures your products reach global markets 
            efficiently and compliantly
          </p>
        </motion.div>

        {/* Progress Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, transition: { duration: 0.8, delay: 0.3 } }
          }}
          className="relative mb-20"
        >
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2 z-0"></div>
          
          {/* Animated Progress Bar */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transform -translate-y-1/2 z-10 transition-all duration-3000 ease-out"
            style={{ width: `${progressWidth}%` }}
          ></div>

          {/* Progress Indicators */}
          <div className="relative flex justify-between items-center z-20">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={controls}
                variants={{
                  visible: { 
                    scale: 1, 
                    opacity: 1, 
                    transition: { 
                      duration: 0.5, 
                      delay: 0.8 + (index * 0.1) 
                    } 
                  }
                }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center shadow-lg process-indicator-pulse">
                  <span className="text-blue-600 font-bold text-sm">{step.id}</span>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-xs font-medium text-gray-600 whitespace-nowrap">
                    {step.duration}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {processSteps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={stepVariants}
              className="relative group"
              onMouseEnter={() => setActiveStep(step.id)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Step Card */}
              <div className="relative h-full bg-white rounded-2xl p-8 shadow-lg process-card-3d process-glassmorphism transition-all duration-500 hover:shadow-2xl">
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-2xl rounded-tr-2xl process-corner-accent"></div>
                
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg process-step-number">
                  {step.id}
                </div>

                {/* Icon */}
                <div className="mb-6 mt-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center process-icon-morph">
                    <i className={`${step.icon} text-2xl text-blue-600`}></i>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Detailed Steps - Revealed on Hover */}
                  <div className={`overflow-hidden transition-all duration-500 ${
                    activeStep === step.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3">Key Activities:</h4>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <motion.li
                            key={detailIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={activeStep === step.id ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, delay: detailIndex * 0.1 }}
                            className="flex items-start space-x-2 text-sm text-gray-600"
                          >
                            <i className="fas fa-check-circle text-green-500 mt-0.5 flex-shrink-0"></i>
                            <span>{detail}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>

              {/* Connection Line (for larger screens) */}
              {index < processSteps.length - 1 && (
                <motion.div
                  initial="hidden"
                  animate={controls}
                  variants={connectionVariants}
                  className="hidden xl:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform -translate-y-1/2 z-10"
                  style={{ transformOrigin: 'left center' }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 1.5 } }
          }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 process-glassmorphism">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Export Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our expert team is ready to guide you through every step of the export process. 
              Let's discuss your specific requirements and create a customized solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 process-button-glow"
              >
                <i className="fas fa-rocket mr-2"></i>
                Start Your Process
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <i className="fas fa-phone mr-2"></i>
                Schedule Consultation
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessOverviewSection;