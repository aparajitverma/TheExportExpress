/**
 * Device detection and responsive utilities for mobile optimization
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type TouchCapability = 'touch' | 'no-touch' | 'hybrid';

export interface DeviceInfo {
  type: DeviceType;
  touchCapability: TouchCapability;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  isLandscape: boolean;
  isHighDPI: boolean;
  supportsHover: boolean;
  prefersReducedMotion: boolean;
  connectionSpeed: 'slow' | 'fast' | 'unknown';
}

/**
 * Breakpoints for device detection
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

/**
 * Get current device type based on screen width
 */
export const getDeviceType = (width: number = window.innerWidth): DeviceType => {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};

/**
 * Detect touch capability
 */
export const getTouchCapability = (): TouchCapability => {
  // Check for touch events support
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check for hover capability (desktop with mouse)
  const hasHover = window.matchMedia('(hover: hover)').matches;
  
  if (hasTouch && hasHover) return 'hybrid'; // Devices like Surface Pro
  if (hasTouch) return 'touch';
  return 'no-touch';
};

/**
 * Check if device supports hover interactions
 */
export const supportsHover = (): boolean => {
  return window.matchMedia('(hover: hover)').matches;
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Estimate connection speed based on navigator.connection
 */
export const getConnectionSpeed = (): 'slow' | 'fast' | 'unknown' => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    
    if (connection.effectiveType) {
      // 'slow-2g', '2g', '3g', '4g'
      return ['slow-2g', '2g', '3g'].includes(connection.effectiveType) ? 'slow' : 'fast';
    }
    
    if (connection.downlink) {
      // Downlink in Mbps
      return connection.downlink < 1.5 ? 'slow' : 'fast';
    }
  }
  
  return 'unknown';
};

/**
 * Get comprehensive device information
 */
export const getDeviceInfo = (): DeviceInfo => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  return {
    type: getDeviceType(width),
    touchCapability: getTouchCapability(),
    screenWidth: width,
    screenHeight: height,
    pixelRatio: window.devicePixelRatio || 1,
    isLandscape: width > height,
    isHighDPI: window.devicePixelRatio > 1,
    supportsHover: supportsHover(),
    prefersReducedMotion: prefersReducedMotion(),
    connectionSpeed: getConnectionSpeed(),
  };
};

/**
 * Check if device is mobile (including tablets in portrait)
 */
export const isMobileDevice = (): boolean => {
  const deviceType = getDeviceType();
  const touchCapability = getTouchCapability();
  
  return deviceType === 'mobile' || 
         (deviceType === 'tablet' && touchCapability === 'touch' && !(window.innerWidth > window.innerHeight));
};

/**
 * Check if device has limited performance capabilities
 */
export const isLowPerformanceDevice = (): boolean => {
  const deviceInfo = getDeviceInfo();
  
  // Consider mobile devices with slow connection as low performance
  if (deviceInfo.type === 'mobile' && deviceInfo.connectionSpeed === 'slow') {
    return true;
  }
  
  // Check for hardware concurrency (CPU cores)
  if ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency <= 2) {
    return true;
  }
  
  // Check for device memory (if available)
  if ('deviceMemory' in navigator && (navigator as any).deviceMemory <= 2) {
    return true;
  }
  
  return false;
};

/**
 * Get optimal animation configuration based on device capabilities
 */
export const getOptimalAnimationConfig = () => {
  const deviceInfo = getDeviceInfo();
  const isLowPerf = isLowPerformanceDevice();
  
  if (deviceInfo.prefersReducedMotion) {
    return {
      duration: 0.01,
      ease: 'linear',
      stagger: 0,
      enableParallax: false,
      enableParticles: false,
      enableGlow: false,
    };
  }
  
  if (isLowPerf || deviceInfo.connectionSpeed === 'slow') {
    return {
      duration: 0.2,
      ease: 'easeOut',
      stagger: 0.05,
      enableParallax: false,
      enableParticles: false,
      enableGlow: false,
    };
  }
  
  switch (deviceInfo.type) {
    case 'mobile':
      return {
        duration: 0.3,
        ease: 'easeOut',
        stagger: 0.08,
        enableParallax: false,
        enableParticles: false,
        enableGlow: false,
      };
    
    case 'tablet':
      return {
        duration: 0.5,
        ease: 'easeOut',
        stagger: 0.1,
        enableParallax: true,
        enableParticles: false,
        enableGlow: true,
      };
    
    default: // desktop
      return {
        duration: 0.8,
        ease: 'easeOut',
        stagger: 0.15,
        enableParallax: true,
        enableParticles: true,
        enableGlow: true,
      };
  }
};

/**
 * Debounced resize handler for performance
 */
export const createResizeHandler = (callback: (deviceInfo: DeviceInfo) => void, delay: number = 250) => {
  let timeoutId: NodeJS.Timeout;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(getDeviceInfo());
    }, delay);
  };
};

/**
 * Media query helpers
 */
export const mediaQueries = {
  mobile: `(max-width: ${BREAKPOINTS.mobile - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.tablet}px)`,
  touch: '(hover: none) and (pointer: coarse)',
  hover: '(hover: hover) and (pointer: fine)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  highContrast: '(prefers-contrast: high)',
  darkMode: '(prefers-color-scheme: dark)',
} as const;

/**
 * Create media query listener
 */
export const createMediaQueryListener = (
  query: string,
  callback: (matches: boolean) => void
) => {
  const mediaQuery = window.matchMedia(query);
  
  // Initial call
  callback(mediaQuery.matches);
  
  // Add listener
  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  mediaQuery.addEventListener('change', handler);
  
  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handler);
};
