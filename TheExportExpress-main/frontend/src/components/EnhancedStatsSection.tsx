import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCountingAnimationWithControls } from '../hooks/useCountingAnimation';
import { useAnimationTrigger } from '../hooks/useIntersectionObserver';

interface StatItem {
  number: number;
  suffix?: string;
  label: string;
  icon: string;
  color?: string;
}

interface StatCardProps {
  stat: StatItem;
  index: number;
  isVisible: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, isVisible }) => {
  const { count, startAnimation, resetAnimation } = useCountingAnimationWithControls(
    stat.number,
    {
      duration: 2000,
      easing: 'easeOutQuart',
      startDelay: index * 200, // Stagger the animations
    }
  );

  useEffect(() => {
    if (isVisible) {
      startAnimation();
    } else {
      resetAnimation();
    }
  }, [isVisible, startAnimation, resetAnimation]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className="group relative"
    >
      {/* Glassmorphism card */}
      <div className="relative overflow-hidden rounded-2xl p-8 text-center transition-all duration-500 ease-out group-hover:scale-105">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl transition-all duration-500 group-hover:from-white/30 group-hover:via-white/20 group-hover:to-white/10 group-hover:border-white/30"></div>
        
        {/* Animated background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl"></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 shadow-2xl shadow-purple-500/20"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon with hover animation */}
          <motion.div
            whileHover={{ 
              scale: 1.2, 
              rotate: 5,
              transition: { type: "spring", stiffness: 300, damping: 10 }
            }}
            className="mb-6"
          >
            <i 
              className={`fas ${stat.icon} text-4xl transition-all duration-500 ${
                stat.color || 'text-purple-400'
              } group-hover:text-purple-300 group-hover:drop-shadow-lg`}
            ></i>
          </motion.div>
          
          {/* Animated number */}
          <div className="mb-4">
            <motion.span
              key={count}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-purple-600 transition-all duration-500"
            >
              {count}
            </motion.span>
            {stat.suffix && (
              <span className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-purple-600 transition-all duration-500">
                {stat.suffix}
              </span>
            )}
          </div>
          
          {/* Label */}
          <p className="text-lg font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
            {stat.label}
          </p>
          
          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={isVisible ? { width: '60%' } : { width: 0 }}
            transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
            className="mx-auto mt-4 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
          ></motion.div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                x: [-5, 5, -5],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const EnhancedStatsSection: React.FC = () => {
  const [sectionRef, isVisible] = useAnimationTrigger({
    threshold: 0.2,
    rootMargin: '-50px'
  });

  const stats: StatItem[] = [
    { 
      number: 50, 
      suffix: '+', 
      label: 'Countries Served', 
      icon: 'fa-earth-americas',
      color: 'text-blue-400'
    },
    { 
      number: 1000, 
      suffix: '+', 
      label: 'Products', 
      icon: 'fa-boxes-stacked',
      color: 'text-green-400'
    },
    { 
      number: 10000, 
      suffix: '+', 
      label: 'Happy Clients', 
      icon: 'fa-users',
      color: 'text-purple-400'
    },
    { 
      number: 24, 
      suffix: '/7', 
      label: 'Support', 
      icon: 'fa-clock',
      color: 'text-orange-400'
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-24 px-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-purple-50/30"></div>
      
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trusted by businesses worldwide, delivering excellence across the globe
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex justify-center mt-16"
        >
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
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

export default EnhancedStatsSection;