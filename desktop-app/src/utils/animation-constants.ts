/**
 * Animation configuration constants and presets
 */

import type { AnimationConfig, EasingFunction } from './animation-types';

// Easing functions
export const EASING_FUNCTIONS: Record<string, EasingFunction> = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 + (--t) * t * t * t * t,
  easeInOutQuint: (t: number) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
};

// Animation duration presets (in milliseconds)
export const ANIMATION_DURATIONS = {
  instant: 0,
  fast: 200,
  normal: 400,
  slow: 600,
  slower: 800,
  slowest: 1200,
} as const;

// Animation delay presets (in milliseconds)
export const ANIMATION_DELAYS = {
  none: 0,
  short: 100,
  medium: 200,
  long: 400,
  longer: 600,
} as const;

// Default animation configurations
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  duration: ANIMATION_DURATIONS.normal,
  delay: ANIMATION_DELAYS.none,
  easing: 'easeOutCubic',
  repeat: false,
  direction: 'normal',
};

// Typewriter effect presets
export const TYPEWRITER_PRESETS = {
  fast: {
    speed: 50,
    deleteSpeed: 30,
    pauseDuration: 1000,
  },
  normal: {
    speed: 100,
    deleteSpeed: 50,
    pauseDuration: 2000,
  },
  slow: {
    speed: 150,
    deleteSpeed: 75,
    pauseDuration: 3000,
  },
} as const;

// Intersection observer thresholds
export const INTERSECTION_THRESHOLDS = {
  immediate: 0,
  partial: 0.1,
  half: 0.5,
  full: 1.0,
} as const;

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  LOW_FPS: 30,
  TARGET_FPS: 60,
  HIGH_FPS: 120,
  FRAME_TIME_BUDGET: 16.67, // 60fps = 16.67ms per frame
} as const;

// Device breakpoints (in pixels)
export const DEVICE_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
} as const;

// Reduced motion media query
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Animation class names for CSS
export const ANIMATION_CLASSES = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  rotateIn: 'animate-rotate-in',
  rotateOut: 'animate-rotate-out',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  shake: 'animate-shake',
  wobble: 'animate-wobble',
} as const;

// Framer Motion variants for common animations
export const MOTION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
} as const;

// Parallax speed presets
export const PARALLAX_SPEEDS = {
  slow: 0.5,
  normal: 0.8,
  fast: 1.2,
  faster: 1.5,
} as const;