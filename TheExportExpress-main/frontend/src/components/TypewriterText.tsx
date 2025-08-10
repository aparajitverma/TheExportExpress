import React from 'react';
import { motion } from 'framer-motion';
import { useTypewriter } from '../hooks/useTypewriter';

interface TypewriterTextProps {
  text: string | string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  showCursor?: boolean;
  cursorClassName?: string;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className = '',
  speed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
  loop = false,
  showCursor = true,
  cursorClassName = '',
  onComplete,
}) => {
  const {
    displayText,
    showCursor: cursorVisible,
    state,
  } = useTypewriter(text, {
    speed,
    deleteSpeed,
    pauseDuration,
    loop,
  });

  React.useEffect(() => {
    if (state === 'completed' && onComplete) {
      onComplete();
    }
  }, [state, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <motion.span
          className={`inline-block ${cursorClassName}`}
          animate={{ opacity: cursorVisible ? 1 : 0 }}
          transition={{ duration: 0.1 }}
        >
          |
        </motion.span>
      )}
    </span>
  );
};

// Enhanced typewriter with gradient text effect
export const GradientTypewriter: React.FC<TypewriterTextProps & {
  gradientFrom?: string;
  gradientTo?: string;
}> = ({
  gradientFrom = '#5C3D2E',
  gradientTo = '#6B4E71',
  className = '',
  cursorClassName = '',
  ...props
}) => {
  return (
    <TypewriterText
      className={`bg-gradient-to-r from-[${gradientFrom}] to-[${gradientTo}] bg-clip-text text-transparent ${className}`}
      cursorClassName={`text-[${gradientFrom}] ${cursorClassName}`}
      {...props}
    />
  );
};

// Typewriter with reveal animation
export const AnimatedTypewriter: React.FC<TypewriterTextProps & {
  revealDelay?: number;
}> = ({
  revealDelay = 0,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: revealDelay,
        ease: "easeOut" 
      }}
    >
      <TypewriterText
        className={className}
        {...props}
      />
    </motion.div>
  );
};