import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Ripple Effect Component
interface RippleProps {
  x: number;
  y: number;
  size?: number;
  color?: string;
  duration?: number;
}

export const Ripple: React.FC<RippleProps> = ({ 
  x, 
  y, 
  size = 100, 
  color = 'rgba(255, 255, 255, 0.6)', 
  duration = 0.6 
}) => {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        backgroundColor: color,
      }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 4, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration, ease: "easeOut" }}
    />
  );
};

// Enhanced Ripple Button Component
interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  rippleColor?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  morphShape?: boolean;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  onClick,
  className = '',
  rippleColor = 'rgba(255, 255, 255, 0.6)',
  disabled = false,
  variant = 'primary',
  morphShape = false,
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const createRipple = (e: React.MouseEvent) => {
    if (disabled) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: rippleId.current++,
      x,
      y,
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  };

  const baseClasses = `
    relative overflow-hidden font-medium transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    px-6 py-3 rounded-lg
    ${className}
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#5C3D2E] to-[#6B4E71] text-white 
      hover:from-[#4A2F22] hover:to-[#5A4260] 
      focus:ring-[#5C3D2E] shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-gradient-to-r from-[#F5E9D4] to-[#FFF8E8] text-[#5C3D2E] 
      hover:from-[#E8D5B7] hover:to-[#F5E9D4] 
      focus:ring-[#F5E9D4] shadow-md hover:shadow-lg
    `,
    ghost: `
      bg-transparent text-[#5C3D2E] border border-[#5C3D2E]
      hover:bg-[#F5E9D4] hover:bg-opacity-50
      focus:ring-[#5C3D2E]
    `,
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`${baseClasses} ${variantClasses[variant]}`}
      onMouseDown={createRipple}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      disabled={disabled}
      whileHover={{ 
        scale: morphShape ? 1.05 : 1.02,
        y: -2,
      }}
      whileTap={{ scale: 0.98 }}
      animate={{
        borderRadius: morphShape && isHovered ? '20px' : '8px',
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Ripple Effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <Ripple
            key={ripple.id}
            x={ripple.x}
            y={ripple.y}
            color={rippleColor}
          />
        ))}
      </AnimatePresence>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
        style={{
          background: variant === 'primary' 
            ? 'linear-gradient(135deg, rgba(92, 61, 46, 0.3), rgba(107, 78, 113, 0.3))'
            : 'linear-gradient(135deg, rgba(245, 233, 212, 0.5), rgba(255, 248, 232, 0.5))',
          filter: 'blur(8px)',
        }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Focus Indicator */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          border: '2px solid transparent',
          background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #5C3D2E, #6B4E71) border-box',
        }}
        animate={{
          opacity: isFocused ? 1 : 0,
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

// Morphing Shape Component
interface MorphingShapeProps {
  isHovered: boolean;
  className?: string;
  shapes?: ('circle' | 'square' | 'triangle' | 'hexagon')[];
  color?: string;
}

export const MorphingShape: React.FC<MorphingShapeProps> = ({
  isHovered,
  className = '',
  shapes = ['circle', 'square'],
  color = '#5C3D2E',
}) => {
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setCurrentShapeIndex(prev => (prev + 1) % shapes.length);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isHovered, shapes.length]);

  const shapeVariants = {
    circle: { borderRadius: '50%', rotate: 0 },
    square: { borderRadius: '0%', rotate: 45 },
    triangle: { borderRadius: '0%', rotate: 0, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
    hexagon: { borderRadius: '0%', rotate: 0, clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' },
  };

  return (
    <motion.div
      className={`w-8 h-8 ${className}`}
      style={{ backgroundColor: color }}
      animate={shapeVariants[shapes[currentShapeIndex]]}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    />
  );
};

// Interactive Card Component with Hover Effects
interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotate?: number;
  glowColor?: string;
  morphingAccent?: boolean;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  hoverScale = 1.03,
  hoverRotate = 2,
  glowColor = 'rgba(92, 61, 46, 0.2)',
  morphingAccent = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      whileHover={{
        scale: hoverScale,
        rotateY: hoverRotate,
        z: 50,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        animate={{
          opacity: isHovered || isFocused ? 1 : 0,
          scale: isHovered || isFocused ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Morphing Accent */}
      {morphingAccent && (
        <div className="absolute top-4 right-4">
          <MorphingShape isHovered={isHovered} />
        </div>
      )}

      {/* Focus Indicator */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none border-2"
        style={{
          borderColor: '#5C3D2E',
        }}
        animate={{
          opacity: isFocused ? 1 : 0,
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

// Background Pattern Animation Component
interface AnimatedPatternProps {
  pattern: 'dots' | 'lines' | 'waves' | 'geometric';
  className?: string;
  color?: string;
  opacity?: number;
  speed?: number;
}

export const AnimatedPattern: React.FC<AnimatedPatternProps> = ({
  pattern,
  className = '',
  color = '#5C3D2E',
  opacity = 0.1,
  speed = 1,
}) => {
  const patternVariants = {
    dots: {
      backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
    },
    lines: {
      backgroundImage: `linear-gradient(45deg, ${color} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
    },
    waves: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='${opacity}'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    },
    geometric: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='${opacity}' fill-rule='evenodd'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h20V20z'/%3E%3C/g%3E%3C/svg%3E")`,
    },
  };

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        ...patternVariants[pattern],
        opacity,
      }}
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%'],
      }}
      transition={{
        duration: 20 / speed,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

// Focus Trap Component for Accessibility
interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ children, isActive }) => {
  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const trap = trapRef.current;
    if (!trap) return;

    const focusableElements = trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return (
    <div ref={trapRef}>
      {children}
    </div>
  );
};