/**
 * Animation configuration types and interfaces
 */

export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
  repeat?: boolean | number;
  direction?: 'normal' | 'reverse' | 'alternate';
}

export interface ParallaxConfig {
  speed: number;
  direction: 'vertical' | 'horizontal';
  element: HTMLElement;
}

export interface TypewriterConfig {
  text: string;
  speed: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
}

export interface CountingAnimationConfig {
  start: number;
  end: number;
  duration: number;
  easing?: (t: number) => number;
  onUpdate?: (value: number) => void;
  onComplete?: () => void;
}

export interface VisualEffectsState {
  isHeroVisible: boolean;
  scrollProgress: number;
  mousePosition: { x: number; y: number };
  reducedMotion: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export interface IntersectionObserverConfig {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  isLowPerformance: boolean;
  timestamp: number;
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type EasingFunction = (t: number) => number;

// Animation states
export type AnimationState = 'idle' | 'running' | 'paused' | 'completed' | 'error';

// Motion preferences
export type MotionPreference = 'no-preference' | 'reduce';