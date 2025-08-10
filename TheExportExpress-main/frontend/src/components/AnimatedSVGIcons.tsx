import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedIconProps {
  className?: string;
  size?: number;
}

export const AnimatedGlobeIcon: React.FC<AnimatedIconProps> = ({ className = "", size = 24 }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Globe outline */}
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Longitude lines */}
      <motion.path
        d="M2 12h20"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      <motion.path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      />
      
      {/* Animated dots representing locations */}
      {[
        { cx: 8, cy: 8 },
        { cx: 16, cy: 10 },
        { cx: 6, cy: 16 },
        { cx: 18, cy: 16 }
      ].map((dot, index) => (
        <motion.circle
          key={index}
          cx={dot.cx}
          cy={dot.cy}
          r="1.5"
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 1 + index * 0.2,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 2
          }}
        />
      ))}
    </motion.svg>
  );
};

export const AnimatedCertificateIcon: React.FC<AnimatedIconProps> = ({ className = "", size = 24 }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.1, rotate: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Certificate background */}
      <motion.rect
        x="3"
        y="4"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      
      {/* Certificate lines */}
      <motion.line
        x1="7"
        y1="9"
        x2="17"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.line
        x1="7"
        y1="13"
        x2="13"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      />
      
      {/* Ribbon */}
      <motion.path
        d="M15 18l2 2 2-2v-4h-4v4z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      />
      
      {/* Animated seal/star */}
      <motion.path
        d="M17 11l1 2h2l-1.5 1.5L19 17l-2-1-2 1 .5-2.5L14 13h2l1-2z"
        fill="currentColor"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 1.5,
          type: "spring",
          stiffness: 200
        }}
      />
    </motion.svg>
  );
};

export const AnimatedHeadsetIcon: React.FC<AnimatedIconProps> = ({ className = "", size = 24 }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Headband */}
      <motion.path
        d="M3 18v-6a9 9 0 0 1 18 0v6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      
      {/* Left earpiece */}
      <motion.rect
        x="1"
        y="14"
        width="4"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ scale: 0, x: 3 }}
        animate={{ scale: 1, x: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      />
      
      {/* Right earpiece */}
      <motion.rect
        x="19"
        y="14"
        width="4"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ scale: 0, x: 21 }}
        animate={{ scale: 1, x: 19 }}
        transition={{ duration: 0.6, delay: 1 }}
      />
      
      {/* Microphone */}
      <motion.path
        d="M8 20v2h8v-2"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      />
      
      {/* Animated sound waves */}
      {[6, 8, 10].map((y, index) => (
        <motion.circle
          key={index}
          cx="12"
          cy={y}
          r="0.5"
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 0], 
            opacity: [0, 1, 0] 
          }}
          transition={{ 
            duration: 1.5, 
            delay: 2 + index * 0.2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        />
      ))}
    </motion.svg>
  );
};

// Icon selector component
interface IconProps extends AnimatedIconProps {
  type: 'globe' | 'certificate' | 'headset';
}

export const AnimatedIcon: React.FC<IconProps> = ({ type, ...props }) => {
  switch (type) {
    case 'globe':
      return <AnimatedGlobeIcon {...props} />;
    case 'certificate':
      return <AnimatedCertificateIcon {...props} />;
    case 'headset':
      return <AnimatedHeadsetIcon {...props} />;
    default:
      return <AnimatedGlobeIcon {...props} />;
  }
};