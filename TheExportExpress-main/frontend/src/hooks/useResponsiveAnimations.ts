/**
 * Responsive animation hook for mobile and device-optimized animations
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  getDeviceInfo, 
  isLowPerformanceDevice, 
  createResizeHandler,
  createMediaQueryListener,
  mediaQueries,
  DeviceInfo 
} from '../utils/deviceDetection';
import { 
  getAnimationConfig, 
  getResponsiveMotionVariants, 
  getResponsiveCSSClasses,
  getTouchAlternatives,
  AnimationConfig 
} from '../utils/animationConfig';
import { useScrollPerformance } from './useScrollAnimations';

export interface ResponsiveAnimationState {
  deviceInfo: DeviceInfo;
  animationConfig: AnimationConfig;
  motionVariants: ReturnType<typeof getResponsiveMotionVariants>;
  cssClasses: ReturnType<typeof getResponsiveCSSClasses>;
  touchAlternatives: ReturnType<typeof getTouchAlternatives>;
  isOptimized: boolean;
  fps: number;
}

/**
 * Main hook for responsive animations
 */
export const useResponsiveAnimations = (): ResponsiveAnimationState => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getDeviceInfo());
  const [isLowPerf, setIsLowPerf] = useState(() => isLowPerformanceDevice());
  const { fps, isOptimized } = useScrollPerformance();

  // Update device info on resize
  useEffect(() => {
    const handleResize = createResizeHandler((newDeviceInfo) => {
      setDeviceInfo(newDeviceInfo);
      setIsLowPerf(isLowPerformanceDevice());
    });

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for reduced motion preference changes
  useEffect(() => {
    const cleanup = createMediaQueryListener(
      mediaQueries.reducedMotion,
      (matches) => {
        setDeviceInfo(prev => ({ ...prev, prefersReducedMotion: matches }));
      }
    );

    return cleanup;
  }, []);

  // Memoize animation configuration
  const animationConfig = useMemo(() => {
    return getAnimationConfig(deviceInfo, fps, isLowPerf);
  }, [deviceInfo, fps, isLowPerf]);

  // Memoize motion variants
  const motionVariants = useMemo(() => {
    return getResponsiveMotionVariants(animationConfig);
  }, [animationConfig]);

  // Memoize CSS classes
  const cssClasses = useMemo(() => {
    return getResponsiveCSSClasses(animationConfig);
  }, [animationConfig]);

  // Memoize touch alternatives
  const touchAlternatives = useMemo(() => {
    return getTouchAlternatives(deviceInfo);
  }, [deviceInfo]);

  return {
    deviceInfo,
    animationConfig,
    motionVariants,
    cssClasses,
    touchAlternatives,
    isOptimized,
    fps,
  };
};

/**
 * Hook for device-specific animation variants
 */
export const useDeviceAnimationVariants = () => {
  const { motionVariants } = useResponsiveAnimations();
  
  return {
    ...motionVariants,
    // Additional device-specific variants
    mobileOptimized: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: 'easeOut',
        },
      },
    },
    tabletOptimized: {
      hidden: { opacity: 0, y: 30, scale: 0.95 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: 'easeOut',
        },
      },
    },
    desktopOptimized: {
      hidden: { opacity: 0, y: 40, scale: 0.9 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.8,
          ease: 'easeOut',
        },
      },
    },
  };
};

/**
 * Hook for responsive stagger animations
 */
export const useResponsiveStagger = (itemCount: number) => {
  const { animationConfig, deviceInfo } = useResponsiveAnimations();
  
  const staggerConfig = useMemo(() => {
    // Limit stagger items based on device type
    const maxItems = deviceInfo.type === 'mobile' ? 6 : 
                    deviceInfo.type === 'tablet' ? 12 : 20;
    
    const limitedItemCount = Math.min(itemCount, maxItems);
    
    return {
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: animationConfig.stagger,
            delayChildren: 0.1,
          },
        },
      },
      item: {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: animationConfig.duration,
            ease: animationConfig.ease,
          },
        },
      },
      itemCount: limitedItemCount,
    };
  }, [animationConfig, deviceInfo.type, itemCount]);

  return staggerConfig;
};

/**
 * Hook for responsive parallax effects
 */
export const useResponsiveParallax = (speed: number = 0.5) => {
  const { animationConfig, deviceInfo } = useResponsiveAnimations();
  
  const parallaxConfig = useMemo(() => {
    if (!animationConfig.enableParallax) {
      return {
        enabled: false,
        speed: 0,
        y: 0,
        opacity: 1,
      };
    }

    // Limit parallax speed based on device type
    const maxSpeed = deviceInfo.type === 'mobile' ? 0.2 : 
                    deviceInfo.type === 'tablet' ? 0.5 : 1.0;
    
    const limitedSpeed = Math.min(speed, maxSpeed);

    return {
      enabled: true,
      speed: limitedSpeed,
      y: limitedSpeed * 100,
      opacity: 1,
    };
  }, [animationConfig.enableParallax, deviceInfo.type, speed]);

  return parallaxConfig;
};

/**
 * Hook for responsive hover effects
 */
export const useResponsiveHover = () => {
  const { touchAlternatives, animationConfig } = useResponsiveAnimations();
  
  const hoverConfig = useMemo(() => {
    if (!touchAlternatives.enableHoverAnimations) {
      return {
        enabled: false,
        whileHover: {},
        whileTap: { scale: 0.98 },
        className: touchAlternatives.touchClass,
      };
    }

    return {
      enabled: true,
      whileHover: animationConfig.enable3DTransforms ? {
        scale: 1.05,
        rotateX: 2,
        rotateY: 2,
        z: 20,
      } : {
        scale: 1.02,
      },
      whileTap: { scale: 0.98 },
      className: '',
    };
  }, [touchAlternatives, animationConfig]);

  return hoverConfig;
};

/**
 * Hook for responsive typewriter effects
 */
export const useResponsiveTypewriter = (text: string | string[]) => {
  const { animationConfig, deviceInfo } = useResponsiveAnimations();
  
  const typewriterConfig = useMemo(() => {
    if (!animationConfig.enableTypewriter) {
      return {
        enabled: false,
        text: Array.isArray(text) ? text[0] : text,
        speed: 0,
      };
    }

    // Adjust speed based on device type
    const speed = deviceInfo.type === 'mobile' ? 50 : 
                 deviceInfo.type === 'tablet' ? 75 : 100;

    return {
      enabled: true,
      text,
      speed,
      deleteSpeed: speed * 0.5,
      pauseDuration: deviceInfo.type === 'mobile' ? 1000 : 2000,
    };
  }, [animationConfig.enableTypewriter, deviceInfo.type, text]);

  return typewriterConfig;
};

/**
 * Hook for responsive counting animations
 */
export const useResponsiveCounting = (endValue: number, duration?: number) => {
  const { animationConfig, deviceInfo } = useResponsiveAnimations();
  
  const countingConfig = useMemo(() => {
    if (!animationConfig.enableCountingAnimations) {
      return {
        enabled: false,
        duration: 0,
        endValue,
      };
    }

    // Adjust duration based on device type
    const defaultDuration = deviceInfo.type === 'mobile' ? 1500 : 
                           deviceInfo.type === 'tablet' ? 2000 : 2500;

    return {
      enabled: true,
      duration: duration || defaultDuration,
      endValue,
      easing: 'easeOut',
    };
  }, [animationConfig.enableCountingAnimations, deviceInfo.type, endValue, duration]);

  return countingConfig;
};

/**
 * Hook for applying responsive animation classes
 */
export const useResponsiveClasses = (baseClasses: string = '') => {
  const { cssClasses, touchAlternatives, deviceInfo } = useResponsiveAnimations();
  
  const responsiveClasses = useMemo(() => {
    const classes = [baseClasses];
    
    // Add device-specific classes
    if (deviceInfo.type === 'mobile') {
      classes.push('mobile-optimized');
    }
    
    // Add touch classes
    if (touchAlternatives.touchClass) {
      classes.push(touchAlternatives.touchClass);
    }
    
    // Add touch target class
    if (touchAlternatives.touchTargetClass) {
      classes.push(touchAlternatives.touchTargetClass);
    }
    
    // Add performance classes
    if (cssClasses.willChange) {
      classes.push(cssClasses.willChange);
    }
    
    if (cssClasses.gpuAccelerated) {
      classes.push(cssClasses.gpuAccelerated);
    }
    
    return classes.filter(Boolean).join(' ');
  }, [baseClasses, cssClasses, touchAlternatives, deviceInfo.type]);

  return responsiveClasses;
};
