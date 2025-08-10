/**
 * Animation configuration utilities for responsive and mobile-optimized animations
 */

import { DeviceType, DeviceInfo } from './deviceDetection';

export interface AnimationConfig {
  duration: number;
  ease: string;
  stagger: number;
  enableParallax: boolean;
  enableParticles: boolean;
  enableGlow: boolean;
  enableTypewriter: boolean;
  enableCountingAnimations: boolean;
  enable3DTransforms: boolean;
  enableGlassmorphism: boolean;
}

export interface ResponsiveAnimationVariants {
  mobile: AnimationConfig;
  tablet: AnimationConfig;
  desktop: AnimationConfig;
  reducedMotion: AnimationConfig;
  lowPerformance: AnimationConfig;
}

/**
 * Default animation configurations for different device types
 */
export const DEFAULT_ANIMATION_CONFIGS: ResponsiveAnimationVariants = {
  mobile: {
    duration: 0.3,
    ease: 'easeOut',
    stagger: 0.05,
    enableParallax: false,
    enableParticles: false,
    enableGlow: false,
    enableTypewriter: true,
    enableCountingAnimations: true,
    enable3DTransforms: false,
    enableGlassmorphism: true,
  },
  tablet: {
    duration: 0.5,
    ease: 'easeOut',
    stagger: 0.08,
    enableParallax: true,
    enableParticles: false,
    enableGlow: true,
    enableTypewriter: true,
    enableCountingAnimations: true,
    enable3DTransforms: true,
    enableGlassmorphism: true,
  },
  desktop: {
    duration: 0.8,
    ease: 'easeOut',
    stagger: 0.15,
    enableParallax: true,
    enableParticles: true,
    enableGlow: true,
    enableTypewriter: true,
    enableCountingAnimations: true,
    enable3DTransforms: true,
    enableGlassmorphism: true,
  },
  reducedMotion: {
    duration: 0.01,
    ease: 'linear',
    stagger: 0,
    enableParallax: false,
    enableParticles: false,
    enableGlow: false,
    enableTypewriter: false,
    enableCountingAnimations: false,
    enable3DTransforms: false,
    enableGlassmorphism: false,
  },
  lowPerformance: {
    duration: 0.2,
    ease: 'easeOut',
    stagger: 0.03,
    enableParallax: false,
    enableParticles: false,
    enableGlow: false,
    enableTypewriter: true,
    enableCountingAnimations: true,
    enable3DTransforms: false,
    enableGlassmorphism: false,
  },
};

/**
 * Framer Motion variants for different device types
 */
export const getResponsiveMotionVariants = (config: AnimationConfig) => ({
  // Fade in animation
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: config.duration,
        ease: config.ease,
      },
    },
  },

  // Slide up animation
  slideUp: {
    hidden: { opacity: 0, y: config.enable3DTransforms ? 60 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: config.duration,
        ease: config.ease,
      },
    },
  },

  // Slide left animation
  slideLeft: {
    hidden: { opacity: 0, x: config.enable3DTransforms ? 60 : 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: config.duration,
        ease: config.ease,
      },
    },
  },

  // Slide right animation
  slideRight: {
    hidden: { opacity: 0, x: config.enable3DTransforms ? -60 : -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: config.duration,
        ease: config.ease,
      },
    },
  },

  // Scale animation
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: config.duration,
        ease: config.ease,
      },
    },
  },

  // Staggered container animation
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: config.stagger,
        delayChildren: 0.1,
      },
    },
  },

  // Staggered item animation
  staggerItem: {
    hidden: { opacity: 0, y: config.enable3DTransforms ? 40 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: config.duration,
        ease: config.ease,
      },
    },
  },

  // 3D card hover effect (only on desktop with 3D transforms enabled)
  cardHover: config.enable3DTransforms ? {
    rest: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      z: 0,
    },
    hover: {
      scale: 1.05,
      rotateX: 5,
      rotateY: 10,
      z: 50,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  } : {
    rest: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  },

  // Button hover animation
  buttonHover: {
    rest: { scale: 1 },
    hover: {
      scale: config.enable3DTransforms ? 1.05 : 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
        ease: 'easeOut',
      },
    },
  },
});

/**
 * CSS animation classes for different device types
 */
export const getResponsiveCSSClasses = (config: AnimationConfig) => ({
  // Base animation classes
  fadeIn: config.duration > 0.01 ? 'animate-fade-in' : '',
  slideUp: config.duration > 0.01 ? 'animate-slide-up' : '',
  
  // Glassmorphism classes
  glass: config.enableGlassmorphism ? 'glass-base' : 'bg-white border border-gray-200',
  glassStrong: config.enableGlassmorphism ? 'glass-strong' : 'bg-white border border-gray-200 shadow-lg',
  
  // Glow effects
  glow: config.enableGlow ? 'cosmic-glow' : '',
  glowStrong: config.enableGlow ? 'cosmic-glow-strong' : '',
  
  // Performance optimizations
  willChange: config.duration > 0.01 ? 'will-change-transform' : '',
  gpuAccelerated: config.enable3DTransforms ? 'gpu-accelerated' : '',
});

/**
 * Touch-friendly alternatives for hover effects
 */
export const getTouchAlternatives = (deviceInfo: DeviceInfo) => {
  const isTouchDevice = deviceInfo.touchCapability === 'touch';
  
  return {
    // Replace hover with active states on touch devices
    hoverClass: isTouchDevice ? 'active:' : 'hover:',
    
    // Use tap instead of hover for touch devices
    interactionEvent: isTouchDevice ? 'onTouchStart' : 'onMouseEnter',
    
    // Disable hover animations on touch devices
    enableHoverAnimations: !isTouchDevice,
    
    // Use larger touch targets on mobile
    touchTargetClass: deviceInfo.type === 'mobile' ? 'min-h-[44px] min-w-[44px]' : '',
    
    // Add touch manipulation for better performance
    touchClass: isTouchDevice ? 'touch-manipulation' : '',
  };
};

/**
 * Performance-optimized animation settings
 */
export const getPerformanceOptimizedConfig = (
  baseConfig: AnimationConfig,
  fps: number,
  isLowPerformance: boolean
): AnimationConfig => {
  // If FPS is low or device is low performance, reduce animation complexity
  if (fps < 30 || isLowPerformance) {
    return {
      ...baseConfig,
      duration: Math.min(baseConfig.duration, 0.3),
      stagger: Math.min(baseConfig.stagger, 0.05),
      enableParallax: false,
      enableParticles: false,
      enableGlow: false,
      enable3DTransforms: false,
    };
  }
  
  // If FPS is moderate, reduce some effects
  if (fps < 45) {
    return {
      ...baseConfig,
      enableParticles: false,
      enable3DTransforms: false,
    };
  }
  
  return baseConfig;
};

/**
 * Get animation configuration based on device info and performance
 */
export const getAnimationConfig = (
  deviceInfo: DeviceInfo,
  fps: number = 60,
  isLowPerformance: boolean = false
): AnimationConfig => {
  let baseConfig: AnimationConfig;
  
  // Check for reduced motion preference first
  if (deviceInfo.prefersReducedMotion) {
    baseConfig = DEFAULT_ANIMATION_CONFIGS.reducedMotion;
  }
  // Check for low performance
  else if (isLowPerformance || deviceInfo.connectionSpeed === 'slow') {
    baseConfig = DEFAULT_ANIMATION_CONFIGS.lowPerformance;
  }
  // Use device-specific config
  else {
    baseConfig = DEFAULT_ANIMATION_CONFIGS[deviceInfo.type];
  }
  
  // Apply performance optimizations
  return getPerformanceOptimizedConfig(baseConfig, fps, isLowPerformance);
};

/**
 * Responsive breakpoint utilities for animations
 */
export const ANIMATION_BREAKPOINTS = {
  mobile: {
    maxParallaxSpeed: 0.2,
    maxStaggerItems: 6,
    maxAnimationDuration: 0.4,
  },
  tablet: {
    maxParallaxSpeed: 0.5,
    maxStaggerItems: 12,
    maxAnimationDuration: 0.6,
  },
  desktop: {
    maxParallaxSpeed: 1.0,
    maxStaggerItems: 20,
    maxAnimationDuration: 1.0,
  },
} as const;

/**
 * Get responsive animation limits
 */
export const getAnimationLimits = (deviceType: DeviceType) => {
  return ANIMATION_BREAKPOINTS[deviceType];
};