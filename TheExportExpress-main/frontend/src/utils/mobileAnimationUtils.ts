/**
 * Mobile-specific animation utilities and optimizations
 */

import { DeviceInfo } from './deviceDetection';
import { AnimationConfig } from './animationConfig';

/**
 * Mobile-optimized animation variants for Framer Motion
 */
export const getMobileOptimizedVariants = (deviceInfo: DeviceInfo, _animationConfig: AnimationConfig) => {
  const isMobile = deviceInfo.type === 'mobile';
  const isTouch = deviceInfo.touchCapability === 'touch';
  const reducedMotion = deviceInfo.prefersReducedMotion;

  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.01 } },
      hover: {},
      tap: {},
    };
  }

  return {
    // Simplified mobile animations
    hidden: { 
      opacity: 0, 
      y: isMobile ? 15 : 30,
      scale: isMobile ? 0.98 : 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: isMobile ? 0.3 : 0.5,
        ease: 'easeOut',
      },
    },
    // Touch-friendly hover alternatives
    hover: isTouch ? {} : {
      scale: isMobile ? 1.01 : 1.02,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };
};

/**
 * Mobile-optimized CSS classes
 */
export const getMobileOptimizedClasses = (deviceInfo: DeviceInfo) => {
  const classes = [];

  if (deviceInfo.type === 'mobile') {
    classes.push('mobile-optimized');
  }

  if (deviceInfo.touchCapability === 'touch') {
    classes.push('touch-manipulation', 'select-none');
  }

  if (deviceInfo.prefersReducedMotion) {
    classes.push('reduced-motion');
  }

  return classes.join(' ');
};

/**
 * Mobile-optimized typewriter configuration
 */
export const getMobileTypewriterConfig = (deviceInfo: DeviceInfo) => {
  if (deviceInfo.prefersReducedMotion) {
    return {
      enabled: false,
      speed: 0,
    };
  }

  return {
    enabled: true,
    speed: deviceInfo.type === 'mobile' ? 50 : 100,
    deleteSpeed: deviceInfo.type === 'mobile' ? 25 : 50,
    pauseDuration: deviceInfo.type === 'mobile' ? 1000 : 2000,
  };
};

/**
 * Mobile-optimized counting animation configuration
 */
export const getMobileCountingConfig = (deviceInfo: DeviceInfo) => {
  if (deviceInfo.prefersReducedMotion) {
    return {
      enabled: false,
      duration: 0,
    };
  }

  return {
    enabled: true,
    duration: deviceInfo.type === 'mobile' ? 1500 : 2500,
    easing: 'easeOut',
  };
};

/**
 * Mobile-optimized parallax configuration
 */
export const getMobileParallaxConfig = (deviceInfo: DeviceInfo, speed: number = 0.5) => {
  // Disable parallax on mobile for performance
  if (deviceInfo.type === 'mobile' || deviceInfo.prefersReducedMotion) {
    return {
      enabled: false,
      speed: 0,
    };
  }

  // Limit parallax speed on tablet
  const maxSpeed = deviceInfo.type === 'tablet' ? 0.3 : 0.5;
  
  return {
    enabled: true,
    speed: Math.min(speed, maxSpeed),
  };
};

/**
 * Mobile-optimized stagger configuration
 */
export const getMobileStaggerConfig = (deviceInfo: DeviceInfo, itemCount: number) => {
  const maxItems = deviceInfo.type === 'mobile' ? 6 : 
                  deviceInfo.type === 'tablet' ? 12 : 20;
  
  const limitedItemCount = Math.min(itemCount, maxItems);
  
  const staggerDelay = deviceInfo.type === 'mobile' ? 0.05 : 
                      deviceInfo.type === 'tablet' ? 0.08 : 0.15;

  if (deviceInfo.prefersReducedMotion) {
    return {
      enabled: false,
      itemCount: limitedItemCount,
      staggerDelay: 0,
    };
  }

  return {
    enabled: true,
    itemCount: limitedItemCount,
    staggerDelay,
  };
};

/**
 * Mobile-optimized button configuration
 */
export const getMobileButtonConfig = (deviceInfo: DeviceInfo) => {
  const isMobile = deviceInfo.type === 'mobile';
  const isTouch = deviceInfo.touchCapability === 'touch';

  return {
    // Minimum touch target size for mobile
    minHeight: isMobile ? '44px' : '40px',
    minWidth: isMobile ? '44px' : 'auto',
    
    // Touch-friendly padding
    padding: isMobile ? '0.75rem 1.5rem' : '0.5rem 1rem',
    
    // Font size optimization
    fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
    
    // Touch-specific classes
    className: isTouch ? 'touch-manipulation select-none' : '',
    
    // Animation configuration
    animation: {
      whileTap: { scale: 0.98 },
      whileHover: isTouch ? {} : { scale: 1.02 },
      transition: { duration: 0.1 },
    },
  };
};

/**
 * Mobile-optimized form input configuration
 */
export const getMobileInputConfig = (deviceInfo: DeviceInfo) => {
  const isMobile = deviceInfo.type === 'mobile';

  return {
    // Minimum height for touch targets
    minHeight: isMobile ? '44px' : '40px',
    
    // Font size to prevent zoom on iOS
    fontSize: isMobile ? '16px' : '14px',
    
    // Touch-friendly padding
    padding: isMobile ? '0.75rem' : '0.5rem',
    
    // Border radius optimization
    borderRadius: isMobile ? '0.5rem' : '0.375rem',
    
    // Touch-specific classes
    className: isMobile ? 'touch-manipulation' : '',
  };
};

/**
 * Mobile-optimized card configuration
 */
export const getMobileCardConfig = (deviceInfo: DeviceInfo) => {
  const isMobile = deviceInfo.type === 'mobile';
  const isTouch = deviceInfo.touchCapability === 'touch';

  return {
    // Padding optimization
    padding: isMobile ? '1.25rem' : '1.5rem',
    
    // Border radius optimization
    borderRadius: isMobile ? '0.75rem' : '1rem',
    
    // Hover effects
    hoverEnabled: !isTouch,
    
    // Animation configuration
    animation: {
      whileHover: isTouch ? {} : {
        y: -2,
        transition: { duration: 0.2 },
      },
      whileTap: isTouch ? {
        scale: 0.98,
        transition: { duration: 0.1 },
      } : {},
    },
    
    // Touch-specific classes
    className: isTouch ? 'touch-manipulation' : '',
  };
};

/**
 * Mobile-optimized scroll configuration
 */
export const getMobileScrollConfig = (deviceInfo: DeviceInfo) => {
  return {
    // Smooth scroll behavior
    behavior: deviceInfo.prefersReducedMotion ? 'auto' : 'smooth',
    
    // Scroll threshold for animations
    threshold: deviceInfo.type === 'mobile' ? 0.2 : 0.1,
    
    // Root margin for intersection observer
    rootMargin: deviceInfo.type === 'mobile' ? '50px' : '100px',
    
    // Trigger once for performance
    triggerOnce: deviceInfo.type === 'mobile',
  };
};

/**
 * Apply mobile optimizations to existing animation configurations
 */
export const applyMobileOptimizations = (
  baseConfig: any,
  deviceInfo: DeviceInfo
) => {
  const optimizedConfig = { ...baseConfig };

  // Reduce animation duration on mobile
  if (deviceInfo.type === 'mobile') {
    if (optimizedConfig.transition?.duration) {
      optimizedConfig.transition.duration = Math.min(
        optimizedConfig.transition.duration,
        0.3
      );
    }
  }

  // Disable complex animations on low-performance devices
  if (deviceInfo.connectionSpeed === 'slow' || deviceInfo.prefersReducedMotion) {
    optimizedConfig.transition = { duration: 0.01 };
    
    // Remove complex transform properties
    delete optimizedConfig.rotateX;
    delete optimizedConfig.rotateY;
    delete optimizedConfig.z;
    delete optimizedConfig.scale;
  }

  // Simplify animations for touch devices
  if (deviceInfo.touchCapability === 'touch') {
    // Remove hover-specific animations
    delete optimizedConfig.whileHover;
    
    // Add touch-friendly tap animation
    optimizedConfig.whileTap = {
      scale: 0.98,
      transition: { duration: 0.1 },
    };
  }

  return optimizedConfig;
};