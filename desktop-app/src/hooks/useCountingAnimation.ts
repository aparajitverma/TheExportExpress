/**
 * Custom hook for counting animations
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { CountingAnimationConfig, AnimationState } from '../utils/animation-types';
import { EASING_FUNCTIONS, ANIMATION_DURATIONS } from '../utils/animation-constants';

/**
 * Hook for animating number counting
 */
export const useCountingAnimation = (
  config: CountingAnimationConfig
) => {
  const {
    start,
    end,
    duration = ANIMATION_DURATIONS.slow,
    easing = EASING_FUNCTIONS.easeOutQuart,
    onUpdate,
    onComplete,
  } = config;

  const [currentValue, setCurrentValue] = useState(start);
  const [state, setState] = useState<AnimationState>('idle');
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    if (!startTimeRef.current) {
      startTimeRef.current = performance.now();
    }

    const elapsed = performance.now() - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    
    const value = start + (end - start) * easedProgress;
    const roundedValue = Math.round(value);
    
    setCurrentValue(roundedValue);
    onUpdate?.(roundedValue);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setState('completed');
      onComplete?.();
      animationRef.current = null;
      startTimeRef.current = null;
    }
  }, [start, end, duration, easing, onUpdate, onComplete]);

  const startAnimation = useCallback(() => {
    if (state === 'running') return;
    
    setState('running');
    setCurrentValue(start);
    startTimeRef.current = null;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [state, start, animate]);

  const pauseAnimation = useCallback(() => {
    if (state !== 'running') return;
    
    setState('paused');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [state]);

  const resumeAnimation = useCallback(() => {
    if (state !== 'paused') return;
    
    setState('running');
    // Reset start time to account for pause duration
    startTimeRef.current = performance.now() - (startTimeRef.current ? performance.now() - startTimeRef.current : 0);
    animationRef.current = requestAnimationFrame(animate);
  }, [state, animate]);

  const resetAnimation = useCallback(() => {
    setState('idle');
    setCurrentValue(start);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    startTimeRef.current = null;
  }, [start]);

  const stopAnimation = useCallback(() => {
    setState('completed');
    setCurrentValue(end);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    startTimeRef.current = null;
    onComplete?.();
  }, [end, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    value: currentValue,
    state,
    start: startAnimation,
    pause: pauseAnimation,
    resume: resumeAnimation,
    reset: resetAnimation,
    stop: stopAnimation,
  };
};

/**
 * Hook for counting animation that starts when element is visible
 */
export const useCountingAnimationOnVisible = (
  config: CountingAnimationConfig & {
    threshold?: number;
    triggerOnce?: boolean;
  }
) => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    ...countingConfig
  } = config;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const counting = useCountingAnimation(countingConfig);

  useEffect(() => {
    if (!elementRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          counting.start();
          
          if (triggerOnce && observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      },
      { threshold }
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, triggerOnce, isVisible, counting]);

  return {
    ...counting,
    ref: elementRef,
    isVisible,
  };
};

/**
 * Hook for multiple counting animations with staggered start
 */
export const useMultipleCountingAnimations = (
  configs: CountingAnimationConfig[],
  staggerDelay = 200
) => {
  const [animations, setAnimations] = useState<ReturnType<typeof useCountingAnimation>[]>([]);
  const [allCompleted, setAllCompleted] = useState(false);

  // Create individual counting animations
  const countingAnimations = configs.map((config) => 
    useCountingAnimation({
      ...config,
      onComplete: () => {
        config.onComplete?.();
        // Check if all animations are completed
        const completed = animations.every(anim => anim.state === 'completed');
        if (completed) {
          setAllCompleted(true);
        }
      },
    })
  );

  useEffect(() => {
    setAnimations(countingAnimations);
  }, [countingAnimations]);

  const startAll = useCallback(() => {
    countingAnimations.forEach((animation, index) => {
      setTimeout(() => {
        animation.start();
      }, index * staggerDelay);
    });
  }, [countingAnimations, staggerDelay]);

  const pauseAll = useCallback(() => {
    countingAnimations.forEach(animation => animation.pause());
  }, [countingAnimations]);

  const resumeAll = useCallback(() => {
    countingAnimations.forEach(animation => animation.resume());
  }, [countingAnimations]);

  const resetAll = useCallback(() => {
    setAllCompleted(false);
    countingAnimations.forEach(animation => animation.reset());
  }, [countingAnimations]);

  const stopAll = useCallback(() => {
    countingAnimations.forEach(animation => animation.stop());
    setAllCompleted(true);
  }, [countingAnimations]);

  return {
    animations: countingAnimations,
    allCompleted,
    startAll,
    pauseAll,
    resumeAll,
    resetAll,
    stopAll,
  };
};

/**
 * Utility hook for formatting numbers during counting animation
 */
export const useFormattedCounting = (
  config: CountingAnimationConfig & {
    formatter?: (value: number) => string;
    prefix?: string;
    suffix?: string;
  }
) => {
  const {
    formatter = (value: number) => value.toLocaleString(),
    prefix = '',
    suffix = '',
    ...countingConfig
  } = config;

  const counting = useCountingAnimation(countingConfig);

  const formattedValue = `${prefix}${formatter(counting.value)}${suffix}`;

  return {
    ...counting,
    formattedValue,
  };
};