import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnimationTrigger } from '../hooks/useIntersectionObserver';

interface CompetitiveAdvantage {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  icon: string;
  color: string;
  stats?: {
    value: string;
    label: string;
  };
  badge?: string;
}

interface ComparisonElement {
  feature: string;
  us: string;
  others: string;
  advantage: boolean;
}

const WhyChooseUsSection: React.FC = () => {
  const [sectionRef, isVisible] = useAnimationTrigger({
    threshold: 0.2,
    rootMargin: '-50px'
  });

  const [hoveredAdvantage, setHoveredAdvantage] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const competitiveAdvantages: CompetitiveAdvantage[] = [
    {
      id: 'global-network',
      title: 'Global Network',
      description: 'Extensive worldwide partnerships and connections',
      detailedDescription: 'Our vast network spans across 50+ countries with trusted local partners, ensuring seamless operations and cultural understanding in every market we serve.',
      icon: 'fa-globe-americas',
      color: 'from-blue-500 to-cyan-500',
      stats: {
        value: '50+',
        label: 'Countries'
      },
      badge: 'Worldwide Reach'
    },
    {
      id: 'expert-team',
      title: 'Expert Team',
      description: 'Industry veterans with decades of combined experience',
      detailedDescription: 'Our team consists of certified trade professionals, customs experts, and logistics specialists with over 200 years of combined experience in international trade.',
      icon: 'fa-users-cog',
      color: 'from-purple-500 to-violet-500',
      stats: {
        value: '200+',
        label: 'Years Experience'
      },
      badge: 'Certified Experts'
    },
    {
      id: 'technology-driven',
      title: 'Technology Driven',
      description: 'Cutting-edge digital solutions and automation',
      detailedDescription: 'Advanced AI-powered documentation, real-time tracking systems, and automated compliance checks ensure accuracy, speed, and transparency in every transaction.',
      icon: 'fa-microchip',
      color: 'from-green-500 to-emerald-500',
      stats: {
        value: '99.9%',
        label: 'Accuracy Rate'
      },
      badge: 'AI-Powered'
    },
    {
      id: 'customer-first',
      title: 'Customer First',
      description: '24/7 dedicated support and personalized service',
      detailedDescription: 'Round-the-clock customer support with dedicated account managers who understand your business needs and provide personalized solutions for every challenge.',
      icon: 'fa-heart',
      color: 'from-red-500 to-pink-500',
      stats: {
        value: '24/7',
        label: 'Support'
      },
      badge: 'Always Available'
    },
    {
      id: 'compliance-excellence',
      title: 'Compliance Excellence',
      description: 'Perfect regulatory compliance and risk management',
      detailedDescription: 'Zero compliance violations in our track record, with proactive risk assessment and mitigation strategies that protect your business from regulatory challenges.',
      icon: 'fa-shield-alt',
      color: 'from-orange-500 to-red-500',
      stats: {
        value: '100%',
        label: 'Compliance Rate'
      },
      badge: 'Risk-Free'
    },
    {
      id: 'cost-effective',
      title: 'Cost Effective',
      description: 'Competitive pricing with transparent fee structure',
      detailedDescription: 'Up to 30% cost savings compared to traditional export services, with no hidden fees and flexible pricing models that scale with your business growth.',
      icon: 'fa-dollar-sign',
      color: 'from-teal-500 to-cyan-500',
      stats: {
        value: '30%',
        label: 'Cost Savings'
      },
      badge: 'Best Value'
    }
  ];

  const comparisonElements: ComparisonElement[] = [
    {
      feature: 'Response Time',
      us: '< 2 hours',
      others: '24-48 hours',
      advantage: true
    },
    {
      feature: 'Global Coverage',
      us: '50+ countries',
      others: '10-20 countries',
      advantage: true
    },
    {
      feature: 'Compliance Rate',
      us: '100%',
      others: '85-95%',
      advantage: true
    },
    {
      feature: 'Digital Integration',
      us: 'Full automation',
      others: 'Manual processes',
      advantage: true
    },
    {
      feature: 'Cost Structure',
      us: 'Transparent pricing',
      others: 'Hidden fees',
      advantage: true
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

  const advantageVariants = {
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

  const comparisonVariants = {
    hidden: { 
      opacity: 0, 
      x: -100
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 px-4 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic background elements that emphasize key points */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50/30">
        {/* Interactive background that responds to mouse */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.15) 0%, transparent 50%)`
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Dynamic floating shapes that emphasize key points */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl"
              style={{
                width: `${60 + (i % 3) * 40}px`,
                height: `${60 + (i % 3) * 40}px`,
                left: `${5 + (i % 4) * 25}%`,
                top: `${5 + Math.floor(i / 4) * 30}%`,
                background: `linear-gradient(135deg, ${
                  ['rgba(59, 130, 246, 0.4)', 'rgba(147, 51, 234, 0.4)', 'rgba(236, 72, 153, 0.4)', 'rgba(34, 197, 94, 0.4)'][i % 4]
                }, transparent)`
              }}
              animate={{
                x: [0, 40, -40, 0],
                y: [0, -30, 30, 0],
                scale: [1, 1.3, 0.7, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20 + i * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Geometric patterns that respond to scroll */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 border-2 border-purple-400"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: `${15 + Math.floor(i / 4) * 35}%`,
                clipPath: i % 2 === 0 
                  ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                  : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15 + i * 3,
                repeat: Infinity,
                ease: "linear"
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent">
            Why Choose The Export Express?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the competitive advantages that make us the preferred choice for global trade solutions
          </p>
        </motion.div>

        {/* Alternating layout with animated advantage points */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="space-y-16"
        >
          {competitiveAdvantages.map((advantage, index) => (
            <motion.div
              key={advantage.id}
              variants={advantageVariants}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
              onMouseEnter={() => setHoveredAdvantage(advantage.id)}
              onMouseLeave={() => setHoveredAdvantage(null)}
            >
              {/* Advantage content */}
              <div className="flex-1 space-y-6">
                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    hoveredAdvantage === advantage.id 
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${advantage.color} shadow-lg`}>
                    {advantage.badge}
                  </span>
                </motion.div>

                {/* Title with entrance effect */}
                <motion.h3
                  className="text-3xl md:text-4xl font-bold text-gray-900"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {advantage.title}
                </motion.h3>

                {/* Description */}
                <p className="text-lg text-gray-600 leading-relaxed">
                  {advantage.description}
                </p>

                {/* Detailed description (revealed on hover) */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={
                    hoveredAdvantage === advantage.id 
                      ? { opacity: 1, height: 'auto' }
                      : { opacity: 0, height: 0 }
                  }
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-700 leading-relaxed">
                    {advantage.detailedDescription}
                  </p>
                </motion.div>

                {/* Stats display */}
                {advantage.stats && (
                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <div className={`px-6 py-3 rounded-xl bg-gradient-to-r ${advantage.color} text-white shadow-lg`}>
                      <div className="text-2xl font-bold">{advantage.stats.value}</div>
                      <div className="text-sm opacity-90">{advantage.stats.label}</div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Interactive visual element */}
              <div className="flex-1 flex justify-center">
                <motion.div
                  className="relative group perspective-container"
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: index % 2 === 0 ? 5 : -5,
                    rotateX: 5,
                    z: 50
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }}
                >
                  {/* Main icon container */}
                  <div className="relative w-64 h-64 rounded-3xl overflow-hidden">
                    {/* Glassmorphism background */}
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${advantage.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}></div>
                    </div>

                    {/* Icon */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <motion.div
                        className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${advantage.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                        animate={
                          hoveredAdvantage === advantage.id 
                            ? { 
                                scale: [1, 1.1, 1.05, 1.1, 1],
                                rotate: [0, -5, 5, -3, 0],
                              }
                            : { scale: 1, rotate: 0 }
                        }
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      >
                        <i className={`fas ${advantage.icon} text-4xl text-white`}></i>
                      </motion.div>
                    </div>

                    {/* Floating decorative elements */}
                    <div className="absolute inset-0 opacity-30">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${advantage.color}`}
                          style={{
                            left: `${20 + (i % 3) * 30}%`,
                            top: `${20 + Math.floor(i / 3) * 40}%`,
                          }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.8, 0.3],
                            y: [0, -10, 0],
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

                    {/* Corner accent */}
                    <div 
                      className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${advantage.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl`}
                      style={{ clipPath: 'polygon(100% 0%, 0% 0%, 100% 100%)' }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive comparison elements */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-24"
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How We Compare
          </h3>
          
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Comparison table header */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 border-b border-white/20">
                <div className="text-lg font-semibold text-gray-700">Feature</div>
                <div className="text-lg font-semibold text-center text-purple-600">The Export Express</div>
                <div className="text-lg font-semibold text-center text-gray-500">Others</div>
              </div>

              {/* Comparison rows */}
              <div className="divide-y divide-white/20">
                {comparisonElements.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={comparisonVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="grid grid-cols-3 gap-4 p-6 hover:bg-purple-50/50 transition-colors duration-300"
                  >
                    <div className="font-medium text-gray-800">{item.feature}</div>
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                        <i className="fas fa-check mr-2"></i>
                        {item.us}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-600">
                        <i className="fas fa-times mr-2 text-red-400"></i>
                        {item.others}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 1, delay: 2 }}
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

export default WhyChooseUsSection;