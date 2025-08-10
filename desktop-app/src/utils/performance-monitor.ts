/**
 * Performance monitoring utilities for animation FPS tracking
 */

import type { PerformanceMetrics } from './animation-types';
import { PERFORMANCE_THRESHOLDS } from './animation-constants';

/**
 * Performance monitor class for tracking animation performance
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private frameStartTime = 0;
  private isMonitoring = false;
  private animationFrameId: number | null = null;
  private metrics: PerformanceMetrics = {
    fps: 0,
    frameTime: 0,
    isLowPerformance: false,
    timestamp: 0,
  };
  private callbacks: Array<(metrics: PerformanceMetrics) => void> = [];
  private measurementInterval = 1000; // 1 second

  constructor() {
    this.measureFrame = this.measureFrame.bind(this);
  }

  /**
   * Starts monitoring performance
   */
  start(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.measureFrame();
  }

  /**
   * Stops monitoring performance
   */
  stop(): void {
    this.isMonitoring = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Adds a callback to be called when metrics are updated
   */
  onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Gets the current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Measures frame performance
   */
  private measureFrame(): void {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameCount++;

    // Calculate frame time
    if (this.frameStartTime > 0) {
      this.metrics.frameTime = currentTime - this.frameStartTime;
    }
    this.frameStartTime = currentTime;

    // Calculate FPS every measurement interval
    if (currentTime - this.lastTime >= this.measurementInterval) {
      const elapsed = currentTime - this.lastTime;
      this.metrics.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.metrics.isLowPerformance = this.metrics.fps < PERFORMANCE_THRESHOLDS.LOW_FPS;
      this.metrics.timestamp = currentTime;

      // Notify callbacks
      this.callbacks.forEach(callback => callback(this.metrics));

      // Reset counters
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    this.animationFrameId = requestAnimationFrame(this.measureFrame);
  }
}

// Global performance monitor instance
let globalMonitor: PerformanceMonitor | null = null;

/**
 * Gets the global performance monitor instance
 */
export const getPerformanceMonitor = (): PerformanceMonitor => {
  if (!globalMonitor) {
    globalMonitor = new PerformanceMonitor();
  }
  return globalMonitor;
};

/**
 * Measures the performance of a specific animation function
 */
export const measureAnimationPerformance = <T>(
  animationFn: () => T,
  name?: string
): { result: T; metrics: { duration: number; name?: string } } => {
  const startTime = performance.now();
  
  try {
    const result = animationFn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      result,
      metrics: {
        duration,
        name,
      },
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.warn(`Animation "${name || 'unknown'}" failed after ${duration}ms:`, error);
    throw error;
  }
};

/**
 * Creates a performance-aware animation wrapper
 */
export const createPerformanceAwareAnimation = <T extends any[]>(
  animationFn: (...args: T) => void,
  options: {
    name?: string;
    maxFrameTime?: number;
    fallbackFn?: (...args: T) => void;
  } = {}
) => {
  const { name, maxFrameTime = PERFORMANCE_THRESHOLDS.FRAME_TIME_BUDGET, fallbackFn } = options;
  const monitor = getPerformanceMonitor();
  
  return (...args: T) => {
    const metrics = monitor.getMetrics();
    
    // If performance is poor and we have a fallback, use it
    if (metrics.isLowPerformance && fallbackFn) {
      console.warn(`Using fallback animation for "${name}" due to low performance (${metrics.fps} FPS)`);
      return fallbackFn(...args);
    }
    
    // If frame time is too high, skip this frame
    if (metrics.frameTime > maxFrameTime) {
      console.warn(`Skipping animation frame for "${name}" due to high frame time (${metrics.frameTime}ms)`);
      return;
    }
    
    return animationFn(...args);
  };
};

/**
 * Utility to check if the current performance allows for complex animations
 */
export const canRunComplexAnimations = (): boolean => {
  const monitor = getPerformanceMonitor();
  const metrics = monitor.getMetrics();
  
  return !metrics.isLowPerformance && metrics.frameTime < PERFORMANCE_THRESHOLDS.FRAME_TIME_BUDGET;
};

/**
 * Utility to get performance-based animation configuration
 */
export const getPerformanceBasedConfig = () => {
  const monitor = getPerformanceMonitor();
  const metrics = monitor.getMetrics();
  
  if (metrics.isLowPerformance) {
    return {
      enableParticles: false,
      enableParallax: false,
      enableComplexTransitions: false,
      animationDuration: 200, // Faster animations
      staggerDelay: 50, // Less stagger
    };
  }
  
  if (metrics.fps < PERFORMANCE_THRESHOLDS.TARGET_FPS) {
    return {
      enableParticles: false,
      enableParallax: true,
      enableComplexTransitions: false,
      animationDuration: 300,
      staggerDelay: 100,
    };
  }
  
  return {
    enableParticles: true,
    enableParallax: true,
    enableComplexTransitions: true,
    animationDuration: 400,
    staggerDelay: 150,
  };
};

/**
 * Debounced performance logger
 */
let logTimeout: number | null = null;

export const logPerformanceMetrics = (metrics: PerformanceMetrics, debounceMs = 5000) => {
  if (logTimeout) {
    clearTimeout(logTimeout);
  }
  
  logTimeout = setTimeout(() => {
    console.log('Animation Performance Metrics:', {
      fps: metrics.fps,
      frameTime: `${metrics.frameTime.toFixed(2)}ms`,
      isLowPerformance: metrics.isLowPerformance,
      timestamp: new Date(metrics.timestamp).toISOString(),
    });
  }, debounceMs);
};