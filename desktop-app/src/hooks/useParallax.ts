/**
 * Custom hook for parallax scroll effects
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ParallaxConfig } from '../utils/animation-types';
import { PARALLAX_SPEEDS } from '../utils/animation-constants';

/**
 * Hook for creating parallax scroll effects
 */
export const useParallax = (
  config: Partial<ParallaxConfig & {
    offset?: number;
    disabled?: boolean;
  }> = {}
) => {
  const {
    speed = PARALLAX_SPEEDS.normal,
    direction = 'vertical',
    offset = 0,
    disabled = false,
  } = config;

  const [transform, setTransform] = useState('translate3d(0, 0, 0)');
  const elementRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const updateTransform = useCallback(() => {
    if (!elementRef.current || disabled) return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const scrollY = window.scrollY;
    const elementTop = rect.top + scrollY;
    const windowHeight = window.innerHeight;
    
    // Calculate the element's position relative to the viewport
    const elementCenter = elementTop + rect.height / 2;
    const viewportCenter = scrollY + windowHeight / 2;
    const distance = elementCenter - viewportCenter;
    
    // Apply parallax effect based on distance from viewport center
    const parallaxValue = distance * (speed - 1) + offset;
    
    if (direction === 'vertical') {
      setTransform(`translate3d(0, ${parallaxValue}px, 0)`);
    } else {
      setTransform(`translate3d(${parallaxValue}px, 0, 0)`);
    }
  }, [speed, direction, offset, disabled]);

  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(updateTransform);
  }, [updateTransform]);

  useEffect(() => {
    if (disabled) {
      setTransform('translate3d(0, 0, 0)');
      return;
    }

    // Initial calculation
    updateTransform();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateTransform, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateTransform);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll, updateTransform, disabled]);

  return {
    ref: elementRef,
    transform,
    style: {
      transform,
      willChange: disabled ? 'auto' : 'transform',
    },
  };
};

/**
 * Hook for multiple parallax elements with different speeds
 */
export const useMultipleParallax = (
  configs: Array<Partial<ParallaxConfig & {
    offset?: number;
    disabled?: boolean;
  }>>
) => {
  const parallaxElements = configs.map((config) => useParallax(config));

  return parallaxElements;
};

/**
 * Hook for parallax effect that only activates when element is in viewport
 */
export const useParallaxOnVisible = (
  config: Partial<ParallaxConfig & {
    offset?: number;
    disabled?: boolean;
    threshold?: number;
  }> = {}
) => {
  const {
    threshold = 0.1,
    ...parallaxConfig
  } = config;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const parallax = useParallax({
    ...parallaxConfig,
    disabled: parallaxConfig.disabled || !isVisible,
  });

  useEffect(() => {
    if (!elementRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold]);

  // Sync refs
  useEffect(() => {
    if (elementRef.current && parallax.ref.current !== elementRef.current) {
      (parallax.ref as React.MutableRefObject<HTMLElement | null>).current = elementRef.current;
    }
  }, [parallax.ref]);

  return {
    ...parallax,
    ref: elementRef,
    isVisible,
  };
};

/**
 * Hook for advanced parallax with custom easing and boundaries
 */
export const useAdvancedParallax = (
  config: Partial<ParallaxConfig & {
    offset?: number;
    disabled?: boolean;
    easing?: (t: number) => number;
    minTransform?: number;
    maxTransform?: number;
    startOffset?: number;
    endOffset?: number;
  }> = {}
) => {
  const {
    speed = PARALLAX_SPEEDS.normal,
    direction = 'vertical',
    offset = 0,
    disabled = false,
    easing = (t: number) => t, // Linear by default
    minTransform = -Infinity,
    maxTransform = Infinity,
    startOffset = 0,
    endOffset = 0,
  } = config;

  const [transform, setTransform] = useState('translate3d(0, 0, 0)');
  const elementRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const updateTransform = useCallback(() => {
    if (!elementRef.current || disabled) return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const scrollY = window.scrollY;
    const elementTop = rect.top + scrollY;
    const windowHeight = window.innerHeight;
    
    // Calculate progress through the viewport
    const elementBottom = elementTop + rect.height;
    const viewportTop = scrollY - startOffset;
    const viewportBottom = scrollY + windowHeight + endOffset;
    
    // Only apply parallax when element is in extended viewport
    if (elementBottom < viewportTop || elementTop > viewportBottom) {
      return;
    }
    
    // Calculate normalized progress (0 to 1)
    const totalDistance = viewportBottom - viewportTop + rect.height;
    const currentDistance = viewportBottom - elementTop;
    const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));
    
    // Apply easing function
    const easedProgress = easing(progress);
    
    // Calculate parallax value
    const range = maxTransform - minTransform;
    const parallaxValue = Math.max(
      minTransform,
      Math.min(maxTransform, minTransform + range * easedProgress * speed + offset)
    );
    
    if (direction === 'vertical') {
      setTransform(`translate3d(0, ${parallaxValue}px, 0)`);
    } else {
      setTransform(`translate3d(${parallaxValue}px, 0, 0)`);
    }
  }, [
    speed,
    direction,
    offset,
    disabled,
    easing,
    minTransform,
    maxTransform,
    startOffset,
    endOffset,
  ]);

  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(updateTransform);
  }, [updateTransform]);

  useEffect(() => {
    if (disabled) {
      setTransform('translate3d(0, 0, 0)');
      return;
    }

    // Initial calculation
    updateTransform();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateTransform, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateTransform);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll, updateTransform, disabled]);

  return {
    ref: elementRef,
    transform,
    style: {
      transform,
      willChange: disabled ? 'auto' : 'transform',
    },
  };
};

/**
 * Hook for mouse-based parallax effects
 */
export const useMouseParallax = (
  config: {
    speed?: number;
    invert?: boolean;
    disabled?: boolean;
  } = {}
) => {
  const {
    speed = 0.1,
    invert = false,
    disabled = false,
  } = config;

  const [transform, setTransform] = useState('translate3d(0, 0, 0)');
  const elementRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!elementRef.current || disabled) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position relative to center (-1 to 1)
      const x = (clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (clientY - innerHeight / 2) / (innerHeight / 2);
      
      // Apply speed and inversion
      const moveX = x * speed * (invert ? -1 : 1) * 100;
      const moveY = y * speed * (invert ? -1 : 1) * 100;
      
      setTransform(`translate3d(${moveX}px, ${moveY}px, 0)`);
    });
  }, [speed, invert, disabled]);

  useEffect(() => {
    if (disabled) {
      setTransform('translate3d(0, 0, 0)');
      return;
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, disabled]);

  return {
    ref: elementRef,
    transform,
    style: {
      transform,
      willChange: disabled ? 'auto' : 'transform',
    },
  };
};