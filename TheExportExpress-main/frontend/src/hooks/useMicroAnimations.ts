import { useState, useEffect, useRef, useCallback } from 'react';

// Hook for managing ripple effects
export const useRippleEffect = () => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; timestamp: number }>>([]);
  const rippleIdRef = useRef(0);

  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: rippleIdRef.current++,
      x,
      y,
      timestamp: Date.now(),
    };

    setRipples(prev => [...prev, newRipple]);

    // Clean up ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  }, []);

  return { ripples, createRipple };
};

// Hook for managing hover states with debouncing
export const useHoverState = (delay: number = 100) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isHovered, handleMouseEnter, handleMouseLeave };
};

// Hook for managing focus states with accessibility
export const useFocusState = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const handleFocus = useCallback((event: React.FocusEvent) => {
    setIsFocused(true);
    // Check if focus is visible (keyboard navigation)
    setIsFocusVisible(event.target.matches(':focus-visible'));
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setIsFocusVisible(false);
  }, []);

  return { isFocused, isFocusVisible, handleFocus, handleBlur };
};

// Hook for managing morphing animations
export const useMorphingShape = (shapes: string[], interval: number = 500) => {
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const startMorphing = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const morphInterval = setInterval(() => {
      setCurrentShapeIndex(prev => (prev + 1) % shapes.length);
    }, interval);

    return () => {
      clearInterval(morphInterval);
      setIsAnimating(false);
    };
  }, [shapes.length, interval, isAnimating]);

  const stopMorphing = useCallback(() => {
    setIsAnimating(false);
    setCurrentShapeIndex(0);
  }, []);

  return {
    currentShape: shapes[currentShapeIndex],
    currentShapeIndex,
    isAnimating,
    startMorphing,
    stopMorphing,
  };
};

// Hook for managing background pattern animations
export const usePatternAnimation = (pattern: 'dots' | 'lines' | 'waves' | 'geometric') => {
  const [isActive, setIsActive] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const patternConfigs = {
    dots: {
      backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    lines: {
      backgroundImage: 'linear-gradient(45deg, currentColor 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    waves: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    },
    geometric: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='currentColor' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h20V20z'/%3E%3C/g%3E%3C/svg%3E")`,
    },
  };

  const activatePattern = useCallback(() => setIsActive(true), []);
  const deactivatePattern = useCallback(() => setIsActive(false), []);

  return {
    isActive,
    animationSpeed,
    setAnimationSpeed,
    activatePattern,
    deactivatePattern,
    patternStyle: patternConfigs[pattern],
  };
};

// Hook for managing performance-aware animations
export const usePerformanceAwareAnimations = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Monitor performance
    const measurePerformance = () => {
      frameCountRef.current++;
      const currentTime = performance.now();

      if (currentTime - lastTimeRef.current >= 1000) {
        const fps = frameCountRef.current;
        
        if (fps < 30) {
          setPerformanceLevel('low');
        } else if (fps < 50) {
          setPerformanceLevel('medium');
        } else {
          setPerformanceLevel('high');
        }

        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      requestAnimationFrame(measurePerformance);
    };

    measurePerformance();

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const getAnimationConfig = useCallback((baseConfig: any) => {
    if (shouldReduceMotion) {
      return { ...baseConfig, duration: 0.01, repeat: 0 };
    }

    switch (performanceLevel) {
      case 'low':
        return { ...baseConfig, duration: baseConfig.duration * 0.5, repeat: 0 };
      case 'medium':
        return { ...baseConfig, duration: baseConfig.duration * 0.8 };
      default:
        return baseConfig;
    }
  }, [shouldReduceMotion, performanceLevel]);

  return {
    shouldReduceMotion,
    performanceLevel,
    getAnimationConfig,
  };
};

// Hook for managing interactive element states
export const useInteractiveState = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleMouseDown = useCallback(() => setIsPressed(true), []);
  const handleMouseUp = useCallback(() => setIsPressed(false), []);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);
  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);
  const handleClick = useCallback(() => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 150);
  }, []);

  const interactiveProps = {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onClick: handleClick,
  };

  return {
    isPressed,
    isHovered,
    isFocused,
    isActive,
    interactiveProps,
  };
};

// Hook for managing staggered animations
export const useStaggeredAnimation = (baseDelay: number = 0.1) => {
  const [isTriggered, setIsTriggered] = useState(false);

  const getStaggerDelay = useCallback((index: number) => {
    return index * baseDelay;
  }, [baseDelay]);

  const triggerAnimation = useCallback(() => {
    setIsTriggered(true);
  }, []);

  const resetAnimation = useCallback(() => {
    setIsTriggered(false);
  }, []);

  return {
    isTriggered,
    getStaggerDelay,
    triggerAnimation,
    resetAnimation,
  };
};

// Hook for managing accessibility-compliant focus management
export const useAccessibleFocus = () => {
  const [focusMethod, setFocusMethod] = useState<'mouse' | 'keyboard' | null>(null);

  useEffect(() => {
    const handleMouseDown = () => setFocusMethod('mouse');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') setFocusMethod('keyboard');
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getFocusClasses = useCallback((baseClasses: string = '') => {
    const focusClasses = focusMethod === 'keyboard' 
      ? 'focus-accessible' 
      : 'focus:outline-none';
    
    return `${baseClasses} ${focusClasses}`.trim();
  }, [focusMethod]);

  return {
    focusMethod,
    getFocusClasses,
    isKeyboardFocus: focusMethod === 'keyboard',
    isMouseFocus: focusMethod === 'mouse',
  };
};