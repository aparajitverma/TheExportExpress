/**
 * Custom hook for device detection and responsive animation handling
 */

import { useState, useEffect, useCallback } from 'react';
import type { DeviceType, MotionPreference } from '../utils/animation-types';
import {
  getDeviceType,
  getMotionPreference,
  getDeviceInfo,
  shouldDisableAnimations,
  getAnimationComplexityLevel,
  createDeviceTypeListener,
  createMotionPreferenceListener,
} from '../utils/device-detection';

/**
 * Hook for detecting device type and capabilities
 */
export const useDeviceDetection = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => getDeviceType());
  const [motionPreference, setMotionPreference] = useState<MotionPreference>(() => getMotionPreference());
  const [deviceInfo, setDeviceInfo] = useState(() => getDeviceInfo());

  const updateDeviceInfo = useCallback(() => {
    setDeviceInfo(getDeviceInfo());
  }, []);

  useEffect(() => {
    // Listen for device type changes
    const cleanupDeviceListener = createDeviceTypeListener(setDeviceType);
    
    // Listen for motion preference changes
    const cleanupMotionListener = createMotionPreferenceListener(setMotionPreference);
    
    // Listen for window resize to update device info
    const handleResize = () => {
      setDeviceType(getDeviceType());
      updateDeviceInfo();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cleanupDeviceListener();
      cleanupMotionListener();
      window.removeEventListener('resize', handleResize);
    };
  }, [updateDeviceInfo]);

  const animationsDisabled = shouldDisableAnimations();
  const complexityLevel = getAnimationComplexityLevel();

  return {
    deviceType,
    motionPreference,
    deviceInfo,
    animationsDisabled,
    complexityLevel,
    updateDeviceInfo,
  };
};

/**
 * Hook for responsive animation configuration
 */
export const useResponsiveAnimation = () => {
  const { deviceType, motionPreference, complexityLevel } = useDeviceDetection();

  const getResponsiveConfig = useCallback(() => {
    const baseConfig = {
      duration: 400,
      staggerDelay: 100,
      enableParticles: true,
      enableParallax: true,
      enableComplexTransitions: true,
    };

    // Adjust based on motion preference
    if (motionPreference === 'reduce') {
      return {
        ...baseConfig,
        duration: 200,
        staggerDelay: 50,
        enableParticles: false,
        enableParallax: false,
        enableComplexTransitions: false,
      };
    }

    // Adjust based on complexity level
    switch (complexityLevel) {
      case 'minimal':
        return {
          ...baseConfig,
          duration: 0,
          staggerDelay: 0,
          enableParticles: false,
          enableParallax: false,
          enableComplexTransitions: false,
        };
      
      case 'reduced':
        return {
          ...baseConfig,
          duration: 200,
          staggerDelay: 50,
          enableParticles: false,
          enableParallax: false,
          enableComplexTransitions: false,
        };
      
      case 'normal':
        return {
          ...baseConfig,
          duration: 300,
          staggerDelay: 75,
          enableParticles: false,
          enableParallax: true,
          enableComplexTransitions: true,
        };
      
      case 'enhanced':
        return baseConfig;
      
      default:
        return baseConfig;
    }
  }, [motionPreference, complexityLevel]);

  const getDeviceSpecificVariants = useCallback(() => {
    const config = getResponsiveConfig();
    
    return {
      mobile: {
        ...config,
        duration: Math.max(config.duration * 0.8, 200),
        staggerDelay: Math.max(config.staggerDelay * 0.8, 50),
      },
      tablet: {
        ...config,
        duration: Math.max(config.duration * 0.9, 250),
        staggerDelay: Math.max(config.staggerDelay * 0.9, 75),
      },
      desktop: config,
    };
  }, [getResponsiveConfig]);

  const getCurrentConfig = useCallback(() => {
    const variants = getDeviceSpecificVariants();
    return variants[deviceType];
  }, [deviceType, getDeviceSpecificVariants]);

  return {
    deviceType,
    motionPreference,
    complexityLevel,
    getResponsiveConfig,
    getDeviceSpecificVariants,
    getCurrentConfig,
  };
};

/**
 * Hook for touch-aware interactions
 */
export const useTouchDetection = () => {
  const [isTouch, setIsTouch] = useState(false);
  const [lastTouchTime, setLastTouchTime] = useState(0);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    const handleTouchStart = () => {
      setLastTouchTime(Date.now());
      setIsTouch(true);
    };

    const handleMouseMove = () => {
      // If mouse move happens more than 500ms after last touch, likely not touch
      if (Date.now() - lastTouchTime > 500) {
        setIsTouch(false);
      }
    };

    checkTouch();
    
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [lastTouchTime]);

  return {
    isTouch,
    lastTouchTime,
  };
};

/**
 * Hook for viewport-aware animations
 */
export const useViewportAware = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSmallViewport = viewport.width < 768 || viewport.height < 600;
  const isLargeViewport = viewport.width > 1200 && viewport.height > 800;

  const getViewportConfig = useCallback(() => {
    if (isSmallViewport) {
      return {
        scale: 0.8,
        duration: 200,
        complexity: 'reduced' as const,
      };
    }

    if (isLargeViewport) {
      return {
        scale: 1.2,
        duration: 500,
        complexity: 'enhanced' as const,
      };
    }

    return {
      scale: 1,
      duration: 400,
      complexity: 'normal' as const,
    };
  }, [isSmallViewport, isLargeViewport]);

  return {
    viewport,
    isSmallViewport,
    isLargeViewport,
    getViewportConfig,
  };
};