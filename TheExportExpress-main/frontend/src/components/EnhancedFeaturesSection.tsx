import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { InteractiveIcon } from "./InteractiveElements";
import { useHoverState, usePerformanceAwareAnimations } from "../hooks/useMicroAnimations";

interface FeatureCardProps {
  icon: "globe" | "certificate" | "headset";
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  index,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverState();
  const { getAnimationConfig } = usePerformanceAwareAnimations();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 60, scale: 0.8 }
      }
      transition={getAnimationConfig({
        duration: 0.8,
        delay: index * 0.2,
        ease: "easeOut",
      })}
      className="feature-card-3d group hover-lift card-glow micro-scale focus-accessible"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="article"
      aria-label={`Feature: ${title}`}
    >
      <div className="feature-card-inner">
        {/* Enhanced Glassmorphism background */}
        <motion.div 
          className="absolute inset-0 bg-white/70 backdrop-blur-md border border-white/20 rounded-xl shadow-lg"
          animate={getAnimationConfig({
            backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.7)',
            borderColor: isHovered ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)',
          })}
          transition={{ duration: 0.3 }}
        />

        {/* Multi-layered gradient overlay with ripple effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 rounded-xl"
          animate={getAnimationConfig({
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.02 : 1,
          })}
          transition={{ duration: 0.5 }}
        />

        {/* Ripple effect on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 p-6">
          {/* Enhanced Animated SVG Icon Container with Micro-animations */}
          <motion.div
            className="h-16 w-16 mb-6 rounded-xl flex items-center justify-center bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border border-white/30 shadow-lg micro-glow icon-bounce"
            animate={getAnimationConfig({
              scale: isHovered ? 1.15 : 1,
              rotate: isHovered ? [0, 5, -5, 0] : 0,
              boxShadow: isHovered 
                ? "0 20px 40px rgba(0,0,0,0.15), 0 0 30px rgba(147, 51, 234, 0.2)" 
                : "0 8px 16px rgba(0,0,0,0.1)",
            })}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              rotate: { duration: 0.6, ease: "easeInOut" }
            }}
          >
            <InteractiveIcon
              icon={`fas fa-${icon === 'globe' ? 'globe' : icon === 'certificate' ? 'certificate' : 'headset'}`}
              animation="morph"
              size="lg"
              className="text-[var(--color-primary)] group-hover:text-[#6B4E71] transition-colors duration-300"
            />
          </motion.div>

          {/* Enhanced Title with gradient text effect and micro-animations */}
          <motion.h3
            className="text-xl font-semibold mb-3 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent text-glow"
            animate={getAnimationConfig({
              backgroundImage: isHovered 
                ? 'linear-gradient(to right, #581c87, #7c3aed, #581c87)'
                : 'linear-gradient(to right, #111827, #374151, #111827)',
              scale: isHovered ? 1.02 : 1,
            })}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h3>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            {description}
          </p>

          {/* Enhanced Hover reveal element with ripple effect */}
          <motion.div
            className="absolute bottom-4 right-4"
            animate={getAnimationConfig({
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0,
              rotate: isHovered ? 360 : 0,
            })}
            transition={{ 
              duration: 0.4,
              rotate: { duration: 0.6, ease: "easeInOut" }
            }}
          >
            <motion.div 
              className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center micro-glow ripple-effect-enhanced"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <InteractiveIcon
                icon="fas fa-arrow-right"
                animation="bounce"
                color="white"
                size="sm"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Floating particles effect with performance awareness */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          {[...Array(isHovered ? 5 : 3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full pattern-pulse"
              style={{
                left: `${15 + i * 20}%`,
                top: `${25 + i * 15}%`,
              }}
              animate={getAnimationConfig({
                y: [-10, 10, -10],
                x: [-5, 5, -5],
                opacity: [0.2, isHovered ? 0.8 : 0.5, 0.2],
                scale: [1, isHovered ? 1.5 : 1.2, 1],
              })}
              transition={{
                duration: 2.5 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
          
          {/* Additional morphing shapes on hover */}
          {isHovered && (
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 bg-blue-400/40 rounded-full"
              animate={{
                scale: [0, 1.5, 0],
                rotate: [0, 180, 360],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const EnhancedFeaturesSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const features = [
    {
      icon: "globe" as const,
      title: "Global Reach",
      description:
        "Access markets worldwide with our extensive network of international trade partners and seamless logistics solutions.",
    },
    {
      icon: "certificate" as const,
      title: "Quality Assurance",
      description:
        "Every product meets international standards with our rigorous quality control process and certification management.",
    },
    {
      icon: "headset" as const,
      title: "Expert Support",
      description:
        "Our team of trade experts is available 24/7 to guide you through every step of your export journey.",
    },
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10"></div>
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            Why Choose The Export Express?
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Discover the advantages that make us your ideal global trade partner
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedFeaturesSection;
