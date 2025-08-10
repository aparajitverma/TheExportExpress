import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useHoverState, 
  useFocusState,
  usePerformanceAwareAnimations,
  useAccessibleFocus 
} from '../hooks/useMicroAnimations';
import { AnimatedPattern } from './MicroAnimations';

// Enhanced Link Component with Micro-animations
interface InteractiveLinkProps {
  children: React.ReactNode;
  href?: string;
  to?: string;
  className?: string;
  underlineAnimation?: boolean;
  iconAnimation?: boolean;
  external?: boolean;
}

export const InteractiveLink: React.FC<InteractiveLinkProps> = ({
  children,
  href,
  to,
  className = '',
  underlineAnimation = true,
  iconAnimation = true,
  external = false,
}) => {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverState();
  const { isFocusVisible, handleFocus, handleBlur } = useFocusState();
  const { getFocusClasses } = useAccessibleFocus();

  const linkClasses = getFocusClasses(`
    relative inline-flex items-center gap-2 transition-all duration-300
    text-[#5C3D2E] hover:text-[#6B4E71] 
    ${underlineAnimation ? 'hover:underline' : ''}
    ${className}
  `);

  const linkContent = (
    <>
      <span className="relative">
        {children}
        
        {/* Animated underline */}
        {underlineAnimation && (
          <motion.span
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#5C3D2E] to-[#6B4E71]"
            initial={{ width: 0 }}
            animate={{ width: isHovered ? '100%' : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        )}
      </span>

      {/* External link icon with animation */}
      {external && (
        <motion.i
          className={`fas fa-external-link-alt text-sm ${iconAnimation ? 'icon-bounce' : ''}`}
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 12 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Focus indicator */}
      <motion.div
        className="absolute inset-0 rounded border-2 border-transparent pointer-events-none"
        animate={{
          borderColor: isFocusVisible ? '#5C3D2E' : 'transparent',
          boxShadow: isFocusVisible 
            ? '0 0 0 2px white, 0 0 0 4px #5C3D2E' 
            : '0 0 0 0px transparent',
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );

  const commonProps = {
    className: linkClasses,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  if (href) {
    return (
      <a 
        href={href} 
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...commonProps}
      >
        {linkContent}
      </a>
    );
  }

  // For React Router Link (would need to import Link from react-router-dom)
  return (
    <span {...commonProps}>
      {linkContent}
    </span>
  );
};

// Enhanced Input Component with Micro-animations
interface InteractiveInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  animatedPlaceholder?: boolean;
}

export const InteractiveInput: React.FC<InteractiveInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  label,
  error,
  icon,
  animatedPlaceholder = true,
}) => {
  const { isFocused, handleFocus, handleBlur } = useFocusState();
  const { getFocusClasses } = useAccessibleFocus();
  const hasValue = value && value.length > 0;

  const inputClasses = getFocusClasses(`
    w-full px-4 py-3 border-2 rounded-lg transition-all duration-300
    ${error 
      ? 'border-red-300 focus:border-red-500' 
      : 'border-gray-300 focus:border-[#5C3D2E]'
    }
    ${icon ? 'pl-12' : ''}
    ${className}
  `);

  return (
    <div className="relative">
      {/* Label */}
      {label && (
        <motion.label
          className="block text-sm font-medium text-gray-700 mb-2"
          animate={{
            color: isFocused ? '#5C3D2E' : '#374151',
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}

      <div className="relative">
        {/* Icon */}
        {icon && (
          <motion.div
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            animate={{
              color: isFocused ? '#5C3D2E' : '#9CA3AF',
              scale: isFocused ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}

        {/* Input */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClasses}
          placeholder={!animatedPlaceholder ? placeholder : undefined}
        />

        {/* Animated Placeholder */}
        {animatedPlaceholder && placeholder && (
          <motion.span
            className="absolute left-4 pointer-events-none text-gray-400"
            animate={{
              top: isFocused || hasValue ? '8px' : '50%',
              fontSize: isFocused || hasValue ? '12px' : '16px',
              color: isFocused ? '#5C3D2E' : '#9CA3AF',
              y: isFocused || hasValue ? 0 : '-50%',
            }}
            transition={{ duration: 0.2 }}
          >
            {placeholder}
          </motion.span>
        )}

        {/* Focus ring animation */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{
            boxShadow: isFocused 
              ? '0 0 0 3px rgba(92, 61, 46, 0.1)' 
              : '0 0 0 0px transparent',
          }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-2 text-sm text-red-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Card Component with Hover Effects
interface InteractiveCardEnhancedProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  backgroundPattern?: 'dots' | 'lines' | 'waves' | 'geometric';
  hoverEffect?: 'lift' | 'tilt' | 'glow' | 'scale';
  glowColor?: string;
}

export const InteractiveCardEnhanced: React.FC<InteractiveCardEnhancedProps> = ({
  children,
  className = '',
  onClick,
  href,
  backgroundPattern,
  hoverEffect = 'lift',
  glowColor = 'rgba(92, 61, 46, 0.2)',
}) => {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverState();
  const { isFocused, handleFocus, handleBlur } = useFocusState();
  const { getAnimationConfig } = usePerformanceAwareAnimations();

  const cardClasses = `
    relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer
    ${hoverEffect === 'lift' ? 'hover-lift' : ''}
    ${hoverEffect === 'tilt' ? 'hover-tilt' : ''}
    ${hoverEffect === 'glow' ? 'card-glow' : ''}
    ${hoverEffect === 'scale' ? 'micro-scale' : ''}
    focus-accessible
    ${className}
  `;

  const cardContent = (
    <>
      {/* Background Pattern */}
      {backgroundPattern && (
        <AnimatedPattern
          pattern={backgroundPattern}
          className="opacity-5"
          speed={isHovered ? 2 : 1}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        animate={getAnimationConfig({
          opacity: isHovered || isFocused ? 1 : 0,
          scale: isHovered || isFocused ? 1.1 : 1,
        })}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
          transform: 'translateX(-100%)',
        }}
        animate={{
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </>
  );

  const commonProps = {
    className: cardClasses,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onClick,
  };

  if (href) {
    return (
      <a href={href} {...commonProps}>
        {cardContent}
      </a>
    );
  }

  return (
    <div {...commonProps}>
      {cardContent}
    </div>
  );
};

// Enhanced Icon Component with Micro-animations
interface InteractiveIconProps {
  icon: string;
  className?: string;
  animation?: 'spin' | 'bounce' | 'pulse' | 'morph';
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const InteractiveIcon: React.FC<InteractiveIconProps> = ({
  icon,
  className = '',
  animation = 'bounce',
  color = '#5C3D2E',
  size = 'md',
}) => {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverState();

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const animationClasses = {
    spin: 'icon-spin',
    bounce: 'icon-bounce',
    pulse: 'icon-pulse',
    morph: 'icon-morph',
  };

  return (
    <motion.i
      className={`
        ${icon} 
        ${sizeClasses[size]} 
        ${animationClasses[animation]}
        transition-all duration-300
        ${className}
      `}
      style={{ color }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: isHovered ? 1.1 : 1,
      }}
      transition={{ duration: 0.2 }}
    />
  );
};

// Loading States with Micro-animations
interface LoadingStateProps {
  type?: 'dots' | 'spinner' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'dots',
  size = 'md',
  color = '#5C3D2E',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  if (type === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        <div className="loading-dots">
          <span className={`inline-block ${sizeClasses[size]} rounded-full`} style={{ backgroundColor: color }} />
          <span className={`inline-block ${sizeClasses[size]} rounded-full`} style={{ backgroundColor: color }} />
          <span className={`inline-block ${sizeClasses[size]} rounded-full`} style={{ backgroundColor: color }} />
        </div>
      </div>
    );
  }

  if (type === 'spinner') {
    return (
      <div className={`${className}`}>
        <div 
          className={`loading-spinner ${sizeClasses[size]} border-2 border-gray-200 border-t-current rounded-full`}
          style={{ borderTopColor: color }}
        />
      </div>
    );
  }

  return (
    <div className={`loading-pulse ${sizeClasses[size]} rounded-full ${className}`} style={{ backgroundColor: color }} />
  );
};