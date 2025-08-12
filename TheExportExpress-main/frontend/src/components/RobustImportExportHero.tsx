import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface RobustImportExportHeroProps {
  className?: string;
}

export const RobustImportExportHero: React.FC<RobustImportExportHeroProps> = ({
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  
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

  // Set loaded state after component mounts
  useEffect(() => {
    setIsLoaded(true);
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

  if (!isLoaded) {
    return (
      <section className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-light">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      ref={containerRef}
      className={`relative min-h-screen bg-white text-black overflow-hidden ${className}`}
      style={{ y, opacity }}
      id="hero"
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
        className="absolute top-0 left-0 right-0 z-20 border-b border-black/10 bg-white"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-xs tracking-wider gap-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <span className="font-light">EST. {establishedYear}</span>
            <span className="font-light">GLOBAL TRADE SOLUTIONS</span>
            <span className="font-light">ISO 9001:2015 CERTIFIED</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
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
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Company Badge */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="inline-flex items-center space-x-4 border border-black/20 px-6 py-3">
              <div className="w-2 h-2 bg-black"></div>
              <span className="text-xs tracking-[0.3em] font-light">ESTABLISHED IMPORT EXPORT COMPANY</span>
              <div className="w-2 h-2 bg-black"></div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[0.9] tracking-tight mb-8">
                THE EXPORT
                <br />
                <span className="font-black">EXPRESS</span>
              </h1>

              {/* Decorative Line */}
              <motion.div
                className="w-24 h-[2px] bg-black mb-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />

              {/* Subtitle */}
              <p className="text-lg md:text-xl font-light leading-relaxed mb-8 max-w-lg">
                Connecting global markets since {establishedYear}. Your trusted partner 
                for comprehensive import-export solutions across {tradeStats[0].value.replace('+', '')} countries worldwide.
              </p>

              {/* Key Services */}
              <div className="space-y-3 mb-12">
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
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                  >
                    <div className="w-1 h-1 bg-black"></div>
                    <span className="text-sm tracking-wide font-light">{service}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="px-8 py-4 bg-black text-white font-light tracking-wider text-sm uppercase hover:bg-gray-800 transition-colors duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Trading
                </motion.button>

                <motion.button
                  className="px-8 py-4 border border-black text-black font-light tracking-wider text-sm uppercase hover:bg-black hover:text-white transition-colors duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Services
                </motion.button>
              </div>
            </motion.div>

            {/* Right Column - Trade Statistics & Visual Elements */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {/* Trade Statistics Grid */}
              <div className="grid grid-cols-2 gap-8 mb-12">
                {tradeStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center border border-black/10 p-6 hover:border-black/30 transition-colors duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-3xl md:text-4xl font-black mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs tracking-[0.2em] font-light text-gray-600">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Global Trade Visualization */}
              <motion.div
                className="relative border border-black/10 p-8 bg-gray-50/30"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.8 }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-sm tracking-[0.3em] font-light mb-2">GLOBAL TRADE NETWORK</h3>
                  <div className="w-16 h-[1px] bg-black mx-auto"></div>
                </div>
                
                {/* Simplified World Map */}
                <div className="relative h-32 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Major Trade Hubs */}
                    <div className="absolute w-3 h-3 border-2 border-black bg-white" style={{ left: '76%', top: '30%' }}>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-light whitespace-nowrap">ASIA</div>
                    </div>
                    
                    <div className="absolute w-3 h-3 border-2 border-black bg-white" style={{ left: '45%', top: '30%' }}>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-light">EUROPE</div>
                    </div>
                    
                    <div className="absolute w-3 h-3 border-2 border-black bg-white" style={{ left: '18%', top: '30%' }}>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-light whitespace-nowrap">AMERICAS</div>
                    </div>
                    
                    {/* Connection lines */}
                    <div className="absolute h-[1px] bg-black/40" style={{ left: '47%', top: '35%', width: '30%' }} />
                    <div className="absolute h-[1px] bg-black/40" style={{ left: '20%', top: '35%', width: '25%' }} />
                    
                    {/* Shipping Indicators */}
                    <div className="absolute text-xs font-light" style={{ left: '65%', top: '80%' }}>
                      ⚓ MAJOR PORTS
                    </div>
                    
                    <div className="absolute text-xs font-light" style={{ left: '15%', top: '80%' }}>
                      ✈ AIR FREIGHT
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <p className="text-xs font-light text-gray-600">
                    Active trade routes connecting 150+ countries worldwide
                  </p>
                </div>
              </motion.div>

              {/* Certification Badges */}
              <motion.div
                className="flex justify-center space-x-6 mt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.8, duration: 0.8 }}
              >
                {[
                  { code: "ISO", full: "ISO 9001:2015" },
                  { code: "WTO", full: "WTO MEMBER" },
                  { code: "AEO", full: "AEO CERTIFIED" }
                ].map((cert, index) => (
                  <div
                    key={index}
                    className="text-center group cursor-default"
                  >
                    <div className="w-12 h-12 border border-black/20 flex items-center justify-center mb-2 group-hover:border-black/40 transition-colors duration-300">
                      <span className="text-xs font-black">{cert.code.charAt(0)}</span>
                    </div>
                    <span className="text-xs tracking-wider font-light">{cert.code}</span>
                  </div>
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
        transition={{ delay: 3, duration: 0.8 }}
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
        transition={{ delay: 3.5, duration: 2 }}
        style={{ transformOrigin: 'left center' }}
      />
    </motion.section>
  );
};

export default RobustImportExportHero;