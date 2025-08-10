/**
 * Device detection utilities for responsive animation handling
 */

import type { DeviceType, MotionPreference } from './animation-types';
import { DEVICE_BREAKPOINTS, REDUCED_MOTION_QUERY } from './animation-constants';

/**
 * Detects the current device type based on screen width
 */
export const getDeviceType = (): DeviceType => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < DEVICE_BREAKPOINTS.mobile) {
    return 'mobile';
  } else if (width < DEVICE_BREAKPOINTS.tablet) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

/**
 * Checks if the user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
};

/**
 * Gets the user's motion preference
 */
export const getMotionPreference = (): MotionPreference => {
  return prefersReducedMotion() ? 'reduce' : 'no-preference';
};

/**
 * Checks if the device is touch-enabled
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Detects if the device has low performance characteristics
 */
export const isLowPerformanceDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  // Check for hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check for device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;
  
  // Check for connection type (if available)
  const connection = (navigator as any).connection;
  const isSlowConnection = connection && 
    (connection.effectiveType === 'slow-2g' || 
     connection.effectiveType === '2g' || 
     connection.effectiveType === '3g');
  
  // Consider device low performance if:
  // - Less than 4 CPU cores
  // - Less than 4GB RAM
  // - Slow network connection
  return cores < 4 || memory < 4 || isSlowConnection;
};

/**
 * Gets comprehensive device information
 */
export const getDeviceInfo = () => {
  return {
    type: getDeviceType(),
    isTouch: isTouchDevice(),
    prefersReducedMotion: prefersReducedMotion(),
    motionPreference: getMotionPreference(),
    isLowPerformance: isLowPerformanceDevice(),
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };
};

/**
 * Checks if animations should be disabled based on device capabilities and user preferences
 */
export const shouldDisableAnimations = (): boolean => {
  return prefersReducedMotion() || isLowPerformanceDevice();
};

/**
 * Gets recommended animation complexity level based on device capabilities
 */
export const getAnimationComplexityLevel = (): 'minimal' | 'reduced' | 'normal' | 'enhanced' => {
  if (prefersReducedMotion()) return 'minimal';
  if (isLowPerformanceDevice()) return 'reduced';
  
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'mobile':
      return 'reduced';
    case 'tablet':
      return 'normal';
    case 'desktop':
      return 'enhanced';
    default:
      return 'normal';
  }
};

/**
 * Creates a media query listener for device type changes
 */
export const createDeviceTypeListener = (callback: (deviceType: DeviceType) => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const mobileQuery = window.matchMedia(`(max-width: ${DEVICE_BREAKPOINTS.mobile - 1}px)`);
  const tabletQuery = window.matchMedia(`(max-width: ${DEVICE_BREAKPOINTS.tablet - 1}px)`);
  
  const handleChange = () => {
    callback(getDeviceType());
  };
  
  mobileQuery.addEventListener('change', handleChange);
  tabletQuery.addEventListener('change', handleChange);
  
  // Return cleanup function
  return () => {
    mobileQuery.removeEventListener('change', handleChange);
    tabletQuery.removeEventListener('change', handleChange);
  };
};

/**
 * Creates a media query listener for motion preference changes
 */
export const createMotionPreferenceListener = (callback: (preference: MotionPreference) => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  
  const handleChange = () => {
    callback(getMotionPreference());
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
};