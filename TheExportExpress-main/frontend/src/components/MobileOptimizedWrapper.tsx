/**
 * Mobile Optimized Wrapper Component
 * Provides mobile-specific optimizations for existing components
 */

import React, { ReactNode, useEffect, useRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useResponsiveAnimations } from '../hooks/useResponsiveAnimations';
import { 
  getMobileOptimizedVariants,
  getMobileOptimizedClasses,
  applyMobileOptimizations 
} from '../utils/mobileAnimationUtils';

interface MobileOptimizedWrapperProps {
  children: ReactNode;
  className?: string;
  enableAnimations?: boolean;
  enableHover?: boolean;
  enableParallax?: boolean;
  optimizeForTouch?: boolean;
  as?: keyof JSX.IntrinsicElements;
  motionProps?: Omit<MotionProps, 'variants' | 'initial' | 'animate'>;
}

export const MobileOptimizedWrapper: React.FC<MobileOptimizedWrapperProps> = ({
  children,
  className = '',
  enableAnimations = true,
  enableHover = true,
  enableParallax = false, // eslint-disable-line @typescript-eslint/no-unused-vars
  optimizeForTouch = true,
  as = 'div',
  motionProps = {},
}) => {
  const { deviceInfo, animationConfig } = useResponsiveAnimations();
  const wrapperRef = useRef<HTMLElement>(null);

  // Apply mobile-specific optimizations
  useEffect(() => {
    if (!wrapperRef.current) return;

    const element = wrapperRef.current;
    
    // Add device-specific classes
    const mobileClasses = getMobileOptimizedClasses(deviceInfo);
    if (mobileClasses) {
      element.className += ` ${mobileClasses}`;
    }

    // Apply touch optimizations
    if (optimizeForTouch && deviceInfo.touchCapability === 'touch') {
      element.style.touchAction = 'manipulation';
      (element.style as any).webkitTapHighlightColor = 'rgba(0, 0, 0, 0.1)';
      element.style.userSelect = 'none';
    }

    // Apply mobile-specific styles
    if (deviceInfo.type === 'mobile') {
      // Ensure minimum touch target size for interactive elements
      const interactiveElements = element.querySelectorAll('button, a, input, textarea, select');
      interactiveElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.offsetHeight < 44) {
          htmlEl.style.minHeight = '44px';
        }
        if (htmlEl.offsetWidth < 44) {
          htmlEl.style.minWidth = '44px';
        }
      });

      // Optimize font sizes to prevent zoom on iOS
      const inputs = element.querySelectorAll('input, textarea, select');
      inputs.forEach((input) => {
        const htmlInput = input as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlInput);
        const fontSize = parseFloat(computedStyle.fontSize);
        if (fontSize < 16) {
          htmlInput.style.fontSize = '16px';
        }
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, [deviceInfo, optimizeForTouch]);

  // Get mobile-optimized animation variants
  const variants = getMobileOptimizedVariants(deviceInfo, animationConfig);

  // Apply mobile optimizations to motion props
  const optimizedMotionProps = applyMobileOptimizations(motionProps, deviceInfo);

  // Determine if animations should be enabled
  const shouldAnimate = enableAnimations && 
                       animationConfig.duration > 0.01 && 
                       !deviceInfo.prefersReducedMotion;

  // Get motion configuration
  const motionConfig = shouldAnimate ? {
    initial: variants.hidden,
    animate: variants.visible,
    whileHover: enableHover ? variants.hover : undefined,
    whileTap: variants.tap,
    ...optimizedMotionProps,
  } : {
    ...optimizedMotionProps,
  };

  const MotionComponent = motion[as as keyof typeof motion] as any;

  return (
    <MotionComponent
      ref={wrapperRef}
      className={className}
      {...motionConfig}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * Mobile Optimized Button Component
 */
interface MobileOptimizedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

export const MobileOptimizedButton: React.FC<MobileOptimizedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  loading = false,
  disabled,
  ...props
}) => {
  const { deviceInfo } = useResponsiveAnimations();
  
  const getButtonClasses = () => {
    const baseClasses = ['transition-all', 'duration-200', 'ease-out', 'font-medium'];
    
    // Variant classes
    switch (variant) {
      case 'primary':
        baseClasses.push('bg-primary-600', 'text-white', 'hover:bg-primary-700');
        break;
      case 'secondary':
        baseClasses.push('bg-white', 'text-primary-600', 'border', 'border-primary-600', 'hover:bg-primary-50');
        break;
      case 'ghost':
        baseClasses.push('bg-transparent', 'text-primary-600', 'hover:bg-primary-50');
        break;
    }
    
    // Size classes with mobile optimization
    const isMobile = deviceInfo.type === 'mobile';
    switch (size) {
      case 'sm':
        baseClasses.push(
          isMobile ? 'px-4 py-3 text-sm min-h-[44px] rounded-lg' : 'px-3 py-2 text-sm rounded-md'
        );
        break;
      case 'md':
        baseClasses.push(
          isMobile ? 'px-6 py-3 text-base min-h-[44px] rounded-lg' : 'px-4 py-2 text-base rounded-md'
        );
        break;
      case 'lg':
        baseClasses.push(
          isMobile ? 'px-8 py-4 text-lg min-h-[48px] rounded-xl' : 'px-6 py-3 text-lg rounded-lg'
        );
        break;
    }
    
    // Touch optimizations
    if (deviceInfo.touchCapability === 'touch') {
      baseClasses.push('touch-manipulation', 'select-none');
    }
    
    // Disabled state
    if (disabled || loading) {
      baseClasses.push('opacity-50', 'cursor-not-allowed');
    }
    
    return [...baseClasses, className].join(' ');
  };

  const getMotionProps = () => {
    if (disabled || loading) {
      return {};
    }

    if (deviceInfo.touchCapability === 'touch') {
      return {
        whileTap: { scale: 0.98 },
        transition: { duration: 0.1 },
      };
    }

    return {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.2 },
    };
  };

  // Separate motion props from HTML button props to avoid conflicts
  const motionProps = getMotionProps();
  const {
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    onTransitionEnd,
    onDragStart,
    onDragEnd,
    onDrag,
    onDragEnter,
    onDragExit,
    onDragLeave,
    onDragOver,
    onDrop,
    ...buttonProps
  } = props;

  return (
    <motion.button
      className={getButtonClasses()}
      disabled={disabled || loading}
      {...motionProps}
      {...buttonProps}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

/**
 * Mobile Optimized Input Component
 */
interface MobileOptimizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const MobileOptimizedInput: React.FC<MobileOptimizedInputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const { deviceInfo } = useResponsiveAnimations();
  
  const getInputClasses = () => {
    const baseClasses = [
      'w-full',
      'border',
      'rounded-lg',
      'transition-colors',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary-500',
      'focus:border-primary-500',
    ];
    
    // Mobile optimizations
    if (deviceInfo.type === 'mobile') {
      baseClasses.push(
        'px-4',
        'py-3',
        'text-base', // Prevent zoom on iOS
        'min-h-[44px]'
      );
    } else {
      baseClasses.push('px-3', 'py-2', 'text-sm');
    }
    
    // Touch optimizations
    if (deviceInfo.touchCapability === 'touch') {
      baseClasses.push('touch-manipulation');
    }
    
    // Error state
    if (error) {
      baseClasses.push('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
    } else {
      baseClasses.push('border-gray-300');
    }
    
    return [...baseClasses, className].join(' ');
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={getInputClasses()}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

/**
 * Mobile Optimized Card Component
 */
interface MobileOptimizedCardProps {
  children: ReactNode;
  className?: string;
  enableHover?: boolean;
  enableAnimation?: boolean;
  onClick?: () => void;
}

export const MobileOptimizedCard: React.FC<MobileOptimizedCardProps> = ({
  children,
  className = '',
  enableHover = true,
  enableAnimation = true,
  onClick,
}) => {
  const { deviceInfo } = useResponsiveAnimations();
  
  const getCardClasses = () => {
    const baseClasses = [
      'bg-white',
      'border',
      'border-gray-200',
      'shadow-sm',
      'transition-all',
      'duration-200',
    ];
    
    // Mobile optimizations
    if (deviceInfo.type === 'mobile') {
      baseClasses.push('p-5', 'rounded-xl');
    } else {
      baseClasses.push('p-6', 'rounded-lg');
    }
    
    // Interactive styles
    if (onClick) {
      baseClasses.push('cursor-pointer');
      
      if (deviceInfo.touchCapability === 'touch') {
        baseClasses.push('touch-manipulation', 'select-none');
      }
    }
    
    return [...baseClasses, className].join(' ');
  };

  const getMotionProps = () => {
    if (!enableAnimation) return {};

    const baseProps = {
      layout: true,
      transition: { duration: 0.2 },
    };

    if (onClick) {
      if (deviceInfo.touchCapability === 'touch') {
        return {
          ...baseProps,
          whileTap: { scale: 0.98 },
        };
      } else if (enableHover) {
        return {
          ...baseProps,
          whileHover: { y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
          whileTap: { scale: 0.98 },
        };
      }
    }

    return baseProps;
  };

  return (
    <motion.div
      className={getCardClasses()}
      onClick={onClick}
      {...getMotionProps()}
    >
      {children}
    </motion.div>
  );
};

export default MobileOptimizedWrapper;
