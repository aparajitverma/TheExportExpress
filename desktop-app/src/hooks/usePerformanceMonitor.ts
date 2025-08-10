/**
 * Custom hook for performance monitoring
 */

import { useEffect, useState, useCallback } from 'react';
import type { PerformanceMetrics } from '../utils/animation-types';
import { getPerformanceMonitor, logPerformanceMetrics } from '../utils/performance-monitor';

/**
 * Hook for monitoring animation performance
 */
export const usePerformanceMonitor = (options: {
  autoStart?: boolean;
  logMetrics?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
} = {}) => {
  const {
    autoStart = false,
    logMetrics = false,
    onMetricsUpdate,
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    isLowPerformance: false,
    timestamp: 0,
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  const monitor = getPerformanceMonitor();

  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    monitor.start();
  }, [monitor, isMonitoring]);

  const stopMonitoring = useCallback(() => {
    if (!isMonitoring) return;
    
    setIsMonitoring(false);
    monitor.stop();
  }, [monitor, isMonitoring]);

  const getLatestMetrics = useCallback(() => {
    return monitor.getMetrics();
  }, [monitor]);

  useEffect(() => {
    const unsubscribe = monitor.onMetricsUpdate((newMetrics) => {
      setMetrics(newMetrics);
      onMetricsUpdate?.(newMetrics);
      
      if (logMetrics) {
        logPerformanceMetrics(newMetrics);
      }
    });

    return unsubscribe;
  }, [monitor, onMetricsUpdate, logMetrics]);

  useEffect(() => {
    if (autoStart) {
      startMonitoring();
    }

    return () => {
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, [autoStart, startMonitoring, stopMonitoring, isMonitoring]);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getLatestMetrics,
  };
};

/**
 * Hook for performance-aware animations
 */
export const usePerformanceAwareAnimation = () => {
  const { metrics } = usePerformanceMonitor({ autoStart: true });

  const shouldReduceAnimations = metrics.isLowPerformance || metrics.fps < 30;
  const shouldDisableParticles = metrics.isLowPerformance || metrics.fps < 45;
  const shouldDisableParallax = metrics.isLowPerformance || metrics.fps < 40;

  const getAnimationConfig = useCallback(() => {
    if (metrics.isLowPerformance) {
      return {
        duration: 200,
        staggerDelay: 50,
        enableParticles: false,
        enableParallax: false,
        enableComplexTransitions: false,
        quality: 'low' as const,
      };
    }

    if (metrics.fps < 45) {
      return {
        duration: 300,
        staggerDelay: 75,
        enableParticles: false,
        enableParallax: true,
        enableComplexTransitions: false,
        quality: 'medium' as const,
      };
    }

    return {
      duration: 400,
      staggerDelay: 100,
      enableParticles: true,
      enableParallax: true,
      enableComplexTransitions: true,
      quality: 'high' as const,
    };
  }, [metrics]);

  return {
    metrics,
    shouldReduceAnimations,
    shouldDisableParticles,
    shouldDisableParallax,
    getAnimationConfig,
  };
};