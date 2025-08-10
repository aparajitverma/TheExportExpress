import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

interface EstablishedImportExportHeroProps {
  className?: string;
}

export const EstablishedImportExportHero: React.FC<EstablishedImportExportHeroProps> = ({
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Update time every second for live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const establishedYear = "1995";
  const yearsInBusiness = new Date().getFullYear() - parseInt(establishedYear);
  
  // Trade statistics (example data)
  const tradeStats = [
    { label: "COUNTRIES SERVED", value: "150+" },
    { label: "YEARS ESTABLISHED", value: yearsInBusiness.toString() },
    { label: "SHIPMENTS COMPLETED", value: "50K+" },
    { label: "TRADE VOLUME", value: "$2.5B+" }
  ];

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.01, -0.05, 0.95]
      }
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 1.5,
        ease: [0.6, 0.01, -0.05, 0.95]
      }
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className={`relative min-h-screen bg-white text-black overflow-hidden ${className}`}
      style={{ y, opacity }}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Header Bar with Company Info */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 border-b border-black/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-xs tracking-wider">
          <div className="flex items-center space-x-8">
            <span className="font-light">EST. {establishedYear}</span>
            <span className="font-light">GLOBAL TRADE SOLUTIONS</span>
            <span className="font-light">ISO 9001:2015 CERTIFIED</span>
          </div>
          <div className="flex items-center space-x-8">
            <span className="font-light">
              {currentTime.toLocaleTimeString('en-US', { 
                timeZone: 'UTC',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
              })} UTC
            </span>
            <span className="font-light">24/7 OPERATIONS</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-6">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Company Badge */}
          <motion.div
            className="mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center space-x-4 border border-black/20 px-6 py-3"
              variants={itemVariants}
            >
              <div className="w-2 h-2 bg-black"></div>
              <span className="text-xs tracking-[0.3em] font-light">ESTABLISHED IMPORT EXPORT COMPANY</span>
              <div className="w-2 h-2 bg-black"></div>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Main Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Main Headline */}
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tight mb-8"
                variants={itemVariants}
              >
                THE EXPORT
                <br />
                <span className="font-black">EXPRESS</span>
              </motion.h1>

              {/* Decorative Line */}
              <motion.div
                className="w-24 h-[2px] bg-black mb-8"
                variants={lineVariants}
              />

              {/* Subtitle */}
              <motion.p
                className="text-lg md:text-xl font-light leading-relaxed mb-8 max-w-lg"
                variants={itemVariants}
              >
                Connecting global markets since {establishedYear}. Your trusted partner 
                for comprehensive import-export solutions across {tradeStats[0].value.replace('+', '')} countries worldwide.
              </motion.p>

              {/* Key Services */}
              <motion.div
                className="space-y-3 mb-12"
                variants={itemVariants}
              >
                {[
                  "International Trade Facilitation",
                  "Customs Clearance & Documentation",
                  "Supply Chain Management",
                  "Global Logistics Solutions"
                ].map((service, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + index * 0.1, duration: 0.6 }}
                  >
                    <div className="w-1 h-1 bg-black"></div>
                    <span className="text-sm tracking-wide font-light">{service}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <motion.button
                  className="group relative px-8 py-4 bg-black text-white font-light tracking-wider text-sm uppercase overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gray-800"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Start Trading</span>
                </motion.button>

                <motion.button
                  className="group relative px-8 py-4 border border-black text-black font-light tracking-wider text-sm uppercase overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-black"
                    initial={{ y: '100%' }}
                    whileHover={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                    View Services
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Column - Trade Statistics & Visual Elements */}
            <motion.div
              className="relative"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Trade Statistics Grid */}
              <div className="grid grid-cols-2 gap-8 mb-12">
                {tradeStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center border border-black/10 p-6"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, borderColor: 'rgba(0,0,0,0.3)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="text-3xl md:text-4xl font-black mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2 + index * 0.1, duration: 0.6, type: "spring" }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs tracking-[0.2em] font-light text-gray-600">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Global Trade Visualization */}
              <motion.div
                className="relative border border-black/10 p-8 bg-gray-50/30"
                variants={itemVariants}
              >
                <div className="text-center mb-6">
                  <h3 className="text-sm tracking-[0.3em] font-light mb-2">GLOBAL TRADE NETWORK</h3>
                  <div className="w-16 h-[1px] bg-black mx-auto"></div>
                </div>
                
                {/* Enhanced World Map with Trade Routes */}
                <div className="relative h-40 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 1 }}
                  >
                    {/* Major Trade Hubs */}
                    <div className="relative w-full h-full">
                      {/* Asia-Pacific */}
                      <motion.div
                        className="absolute w-3 h-3 border-2 border-black bg-white"
                        style={{ left: '75%', top: '35%' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 3, duration: 0.4 }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-light whitespace-nowrap">ASIA</div>
                      </motion.div>
                      
                      {/* Europe */}
                      <motion.div
                        className="absolute w-3 h-3 border-2 border-black bg-white"
                        style={{ left: '45%', top: '25%' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 3.1, duration: 0.4 }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-light">EUROPE</div>
                      </motion.div>
                      
                      {/* North America */}
                      <motion.div
                        className="absolute w-3 h-3 border-2 border-black bg-white"
                        style={{ left: '20%', top: '30%' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 3.2, duration: 0.4 }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-light whitespace-nowrap">N.AMERICA</div>
                      </motion.div>
                      
                      {/* Middle East */}
                      <motion.div
                        className="absolute w-2 h-2 bg-black"
                        style={{ left: '55%', top: '45%' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 3.3, duration: 0.4 }}
                      />
                      
                      {/* Africa */}
                      <motion.div
                        className="absolute w-2 h-2 bg-black"
                        style={{ left: '50%', top: '65%' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 3.4, duration: 0.4 }}
                      />
                      
                      {/* South America */}
                      <motion.div
                        className="absolute w-2 h-2 bg-black"
                        style={{ left: '30%', top: '70%' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 3.5, duration: 0.4 }}
                      />
                      
                      {/* Trade Route Lines */}
                      {/* Asia to Europe */}
                      <motion.div
                        className="absolute h-[1px] bg-black/40"
                        style={{
                          left: '45%',
                          top: '30%',
                          width: '30%',
                          transformOrigin: 'left center'
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 3.8, duration: 1 }}
                      />
                      
                      {/* Europe to North America */}
                      <motion.div
                        className="absolute h-[1px] bg-black/40"
                        style={{
                          left: '20%',
                          top: '35%',
                          width: '25%',
                          transformOrigin: 'left center'
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 4, duration: 1 }}
                      />
                      
                      {/* Shipping Indicators */}
                      <motion.div
                        className="absolute text-xs font-light"
                        style={{ left: '60%', top: '20%' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 4.5, duration: 0.8 }}
                      >
                        ⚓ MAJOR PORTS
                      </motion.div>
                      
                      <motion.div
                        className="absolute text-xs font-light"
                        style={{ left: '15%', top: '80%' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 4.7, duration: 0.8 }}
                      >
                        ✈ AIR FREIGHT
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center mt-6">
                  <p className="text-xs font-light text-gray-600">
                    Active trade routes connecting 150+ countries worldwide
                  </p>
                </div>
              </motion.div>

              {/* Live Trade Activity */}
              <motion.div
                className="border border-black/10 p-6 bg-white/50 mt-8"
                variants={itemVariants}
              >
                <div className="text-center mb-4">
                  <h4 className="text-xs tracking-[0.3em] font-light mb-2">LIVE TRADE ACTIVITY</h4>
                  <div className="w-12 h-[1px] bg-black mx-auto"></div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { route: "SHANGHAI → ROTTERDAM", cargo: "Electronics", status: "IN TRANSIT" },
                    { route: "MUMBAI → NEW YORK", cargo: "Textiles", status: "CUSTOMS" },
                    { route: "DUBAI → LONDON", cargo: "Machinery", status: "DELIVERED" }
                  ].map((shipment, index) => (
                    <motion.div
                      key={index}
                      className="flex justify-between items-center text-xs border-b border-black/5 pb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 4 + index * 0.2, duration: 0.6 }}
                    >
                      <div>
                        <div className="font-light">{shipment.route}</div>
                        <div className="text-gray-600 text-xs">{shipment.cargo}</div>
                      </div>
                      <div className={`px-2 py-1 text-xs font-light ${
                        shipment.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        shipment.status === 'IN TRANSIT' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {shipment.status}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Certification Badges */}
              <motion.div
                className="flex justify-center space-x-6 mt-8"
                variants={itemVariants}
              >
                {[
                  { code: "ISO", full: "ISO 9001:2015" },
                  { code: "WTO", full: "WTO MEMBER" },
                  { code: "AEO", full: "AEO CERTIFIED" }
                ].map((cert, index) => (
                  <motion.div
                    key={index}
                    className="text-center group cursor-default"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3 + index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-12 h-12 border border-black/20 flex items-center justify-center mb-2 group-hover:border-black/40 transition-colors duration-300">
                      <span className="text-xs font-black">{cert.code.charAt(0)}</span>
                    </div>
                    <span className="text-xs tracking-wider font-light">{cert.code}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => {
            const nextSection = document.getElementById('stats');
            nextSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-xs tracking-[0.2em] font-light mb-4">SCROLL</span>
          <div className="w-[1px] h-12 bg-black/30 mb-2" />
          <div className="w-2 h-2 border border-black rotate-45 border-t-0 border-l-0" />
        </motion.div>
      </motion.div>

      {/* Bottom Border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 4.5, duration: 2 }}
        style={{ transformOrigin: 'left center' }}
      />
    </motion.section>
  );
};

export default EstablishedImportExportHero;