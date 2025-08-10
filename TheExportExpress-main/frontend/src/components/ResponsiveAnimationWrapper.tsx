/**
 * Responsive Animation Wrapper Component
 * Automatically applies device-appropriate animations and optimizations
 */

import React, { ReactNode, useEffect } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useResponsiveAnimations, useResponsiveClasses } from '../hooks/useResponsiveAnimations';

interface ResponsiveAnimationWrapperProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'none';
  className?: string;
  enableHover?: boolean;
  enableParallax?: boolean;
  parallaxSpeed?: number;
  stagger?: boolean;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  motionProps?: Omit<MotionProps, 'variants' | 'initial' | 'animate' | 'whileHover'>;
}

export const ResponsiveAnimationWrapper: React.FC<ResponsiveAnimationWrapperProps> = ({
  children,
  animation = 'fadeIn',
  className = '',
  enableHover = false,
  enableParallax = false,
  parallaxSpeed = 0.5,
  stagger = false,
  delay = 0,
  as = 'div',
  motionProps = {},
}) => {
  const { 
    deviceInfo, 
    animationConfig, 
    motionVariants, 
    touchAlternatives,
    isOptimized 
  } = useResponsiveAnimations();
  
  const responsiveClasses = useResponsiveClasses(className);

  // Apply device-specific optimizations to body
  useEffect(() => {
    const bodyClasses = [];
    
    if (deviceInfo.type === 'mobile') {
      bodyClasses.push('mobile-optimized');
    }
    
    if (isOptimized) {
      bodyClasses.push('reduced-animations');
    }
    
    if (deviceInfo.touchCapability === 'touch') {
      bodyClasses.push('touch-optimized');
    }
    
    bodyClasses.forEach(cls => document.body.classList.add(cls));
    
    return () => {
      bodyClasses.forEach(cls => document.body.classList.remove(cls));
    };
  }, [deviceInfo.type, deviceInfo.touchCapability, isOptimized]);

  // Get appropriate motion variant
  const getMotionVariant = () => {
    if (animation === 'none' || !animationConfig.duration || animationConfig.duration <= 0.01) {
      return {
        initial: {},
        animate: {},
        transition: { duration: 0 },
      };
    }

    const variant = motionVariants[animation];
    if (!variant) return motionVariants.fadeIn;

    return {
      initial: variant.hidden,
      animate: variant.visible,
      transition: {
        ...variant.visible.transition,
        delay,
      },
    };
  };

  // Get hover animation if enabled
  const getHoverAnimation = () => {
    if (!enableHover || !touchAlternatives.enableHoverAnimations) {
      return {};
    }

    if (animationConfig.enable3DTransforms) {
      return {
        whileHover: {
          scale: 1.02,
          rotateX: 2,
          rotateY: 2,
          z: 10,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20,
          },
        },
        whileTap: { scale: 0.98 },
      };
    }

    return {
      whileHover: { scale: 1.01 },
      whileTap: { scale: 0.99 },
    };
  };

  // Get parallax animation if enabled
  const getParallaxAnimation = () => {
    if (!enableParallax || !animationConfig.enableParallax) {
      return {};
    }

    // Limit parallax speed based on device
    const maxSpeed = deviceInfo.type === 'mobile' ? 0.2 : 
                    deviceInfo.type === 'tablet' ? 0.5 : 1.0;
    const limitedSpeed = Math.min(parallaxSpeed, maxSpeed);

    return {
      style: {
        transform: `translateY(${limitedSpeed * -50}px)`,
      },
    };
  };

  const motionVariant = getMotionVariant();
  const hoverAnimation = getHoverAnimation();
  const parallaxAnimation = getParallaxAnimation();

  const MotionComponent = motion[as as keyof typeof motion] as any;

  return (
    <MotionComponent
      className={responsiveClasses}
      initial={motionVariant.initial}
      animate={motionVariant.animate}
      transition={motionVariant.transition}
      {...hoverAnimation}
      {...parallaxAnimation}
      {...motionProps}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * Responsive Stagger Container Component
 */
interface ResponsiveStaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  maxItems?: number;
}

export const ResponsiveStaggerContainer: React.FC<ResponsiveStaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay,
  maxItems,
}) => {
  const { deviceInfo, animationConfig } = useResponsiveAnimations();
  const responsiveClasses = useResponsiveClasses(className);

  // Calculate stagger delay based on device
  const getStaggerDelay = () => {
    if (staggerDelay !== undefined) return staggerDelay;
    return animationConfig.stagger;
  };

  // Limit items based on device performance
  const getMaxItems = () => {
    if (maxItems !== undefined) return maxItems;
    
    switch (deviceInfo.type) {
      case 'mobile': return 6;
      case 'tablet': return 12;
      default: return 20;
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: getStaggerDelay(),
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animationConfig.duration,
        ease: animationConfig.ease,
      },
    },
  };

  return (
    <motion.div
      className={responsiveClasses}
      variants={staggerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => {
        if (index >= getMaxItems()) return null;
        
        return (
          <motion.div variants={itemVariants}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

/**
 * Responsive Button Component with touch optimizations
 */
interface ResponsiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const { deviceInfo, touchAlternatives } = useResponsiveAnimations();
  
  const getButtonClasses = () => {
    const baseClasses = ['transition-all', 'duration-200', 'ease-out'];
    
    // Variant classes
    switch (variant) {
      case 'primary':
        baseClasses.push('btn-primary');
        break;
      case 'secondary':
        baseClasses.push('btn-secondary');
        break;
      case 'ghost':
        baseClasses.push('btn-ghost');
        break;
    }
    
    // Size classes with touch optimization
    const isMobile = deviceInfo.type === 'mobile';
    switch (size) {
      case 'sm':
        baseClasses.push(isMobile ? 'px-4 py-3 text-sm min-h-[44px]' : 'px-3 py-2 text-sm');
        break;
      case 'md':
        baseClasses.push(isMobile ? 'px-6 py-3 text-base min-h-[44px]' : 'px-4 py-2 text-base');
        break;
      case 'lg':
        baseClasses.push(isMobile ? 'px-8 py-4 text-lg min-h-[48px]' : 'px-6 py-3 text-lg');
        break;
    }
    
    // Touch optimizations
    if (deviceInfo.touchCapability === 'touch') {
      baseClasses.push('touch-manipulation', 'select-none');
    }
    
    return [...baseClasses, className].join(' ');
  };

  const getMotionProps = () => {
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

  return (
    <motion.button
      className={getButtonClasses()}
      {...getMotionProps()}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default ResponsiveAnimationWrapper;