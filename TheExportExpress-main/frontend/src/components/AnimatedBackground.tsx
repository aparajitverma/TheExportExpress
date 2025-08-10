import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  className?: string;
  variant?: 'hero' | 'section';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = '',
  variant = 'hero',
}) => {
  const gradientVariants = {
    hero: {
      background: [
        'linear-gradient(135deg, #F5E9D4 0%, #FFF8E8 50%, #D4C2A6 100%)',
        'linear-gradient(135deg, #FFF8E8 0%, #F5E9D4 50%, #E8D5B7 100%)',
        'linear-gradient(135deg, #D4C2A6 0%, #F5E9D4 50%, #FFF8E8 100%)',
        'linear-gradient(135deg, #F5E9D4 0%, #FFF8E8 50%, #D4C2A6 100%)',
      ],
    },
    section: {
      background: [
        'linear-gradient(45deg, #F9F9F9 0%, #FFFFFF 50%, #F5E9D4 100%)',
        'linear-gradient(45deg, #FFFFFF 0%, #F9F9F9 50%, #FFF8E8 100%)',
        'linear-gradient(45deg, #F5E9D4 0%, #FFFFFF 50%, #F9F9F9 100%)',
        'linear-gradient(45deg, #F9F9F9 0%, #FFFFFF 50%, #F5E9D4 100%)',
      ],
    },
  };

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Main animated gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: gradientVariants[variant].background,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Overlay patterns */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(92, 61, 46, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(107, 78, 113, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(168, 181, 162, 0.1) 0%, transparent 50%)
            `,
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235C3D2E' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

// Animated section divider
export const AnimatedDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative h-px ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#5C3D2E] to-[#6B4E71] rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      />
    </div>
  );
};