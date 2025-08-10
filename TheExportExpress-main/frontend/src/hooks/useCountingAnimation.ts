import { useState, useEffect, useRef } from 'react';

interface CountingAnimationOptions {
  duration?: number;
  easing?: 'linear' | 'easeOut' | 'easeInOut' | 'easeOutQuart' | 'easeOutCubic';
  startDelay?: number;
  onComplete?: () => void;
}

/**
 * Custom hook for animating number counting with various easing functions
 * @param endValue - The target number to count to
 * @param options - Configuration options for the animation
 * @returns The current animated count value
 */
export const useCountingAnimation = (
  endValue: number,
  options: CountingAnimationOptions = {}
): number => {
  const {
    duration = 2000,
    easing = 'easeOutQuart',
    onComplete
  } = options;

  const [count, setCount] = useState(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  // Easing functions
  const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
    easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
    easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3)
  };

  const animate = (currentTime: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime;
    }

    const elapsed = currentTime - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunctions[easing](progress);
    const currentCount = Math.floor(endValue * easedProgress);

    setCount(currentCount);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return count;
};

/**
 * Hook that provides control functions for the counting animation
 * @param endValue - The target number to count to
 * @param options - Configuration options for the animation
 * @returns Object with count value and control functions
 */
export const useCountingAnimationWithControls = (
  endValue: number,
  options: CountingAnimationOptions = {}
) => {
  const {
    duration = 2000,
    easing = 'easeOutQuart',
    startDelay = 0,
    onComplete
  } = options;

  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  // Easing functions
  const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
    easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
    easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3)
  };

  const animate = (currentTime: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime;
    }

    const elapsed = currentTime - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunctions[easing](progress);
    const currentCount = Math.floor(endValue * easedProgress);

    setCount(currentCount);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      onComplete?.();
    }
  };

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCount(0);
    startTimeRef.current = undefined;

    const startAnimationFrame = () => {
      animationRef.current = requestAnimationFrame(animate);
    };

    if (startDelay > 0) {
      setTimeout(startAnimationFrame, startDelay);
    } else {
      startAnimationFrame();
    }
  };

  const resetAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setCount(0);
    setIsAnimating(false);
    startTimeRef.current = undefined;
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    count,
    isAnimating,
    startAnimation,
    resetAnimation
  };
};