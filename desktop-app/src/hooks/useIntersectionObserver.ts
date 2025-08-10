/**
 * Custom hook for intersection observer functionality
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { IntersectionObserverConfig } from '../utils/animation-types';

/**
 * Hook for observing element intersection with viewport
 */
export const useIntersectionObserver = (
  config: IntersectionObserverConfig = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = config;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback(() => {
    if (!elementRef.current) return;

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isCurrentlyIntersecting = entry.isIntersecting;
        
        setIsIntersecting(isCurrentlyIntersecting);
        
        if (isCurrentlyIntersecting && !hasIntersected) {
          setHasIntersected(true);
          
          // If triggerOnce is true, stop observing after first intersection
          if (triggerOnce && observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(elementRef.current);
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  const unobserve = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setIsIntersecting(false);
    setHasIntersected(false);
    observe();
  }, [observe]);

  useEffect(() => {
    observe();
    return unobserve;
  }, [observe, unobserve]);

  return {
    ref: elementRef,
    isIntersecting,
    hasIntersected,
    observe,
    unobserve,
    reset,
  };
};

/**
 * Hook for observing multiple elements
 */
export const useMultipleIntersectionObserver = (
  config: IntersectionObserverConfig = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = config;

  const [intersections, setIntersections] = useState<Record<string, boolean>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<{ element: Element; id: string }[]>([]);
  const elementIdCounter = useRef(0);

  const getElementId = useCallback((element: Element): string => {
    for (let i = 0; i < elementsRef.current.length; i++) {
      if (elementsRef.current[i].element === element) {
        return elementsRef.current[i].id;
      }
    }
    const id = `element-${elementIdCounter.current++}`;
    elementsRef.current.push({ element, id });
    return id;
  }, []);

  const observe = useCallback((element: Element) => {
    if (!element) return;

    // Initialize observer if it doesn't exist
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          setIntersections(prev => {
            const newIntersections = { ...prev };
            
            entries.forEach(entry => {
              const elementId = getElementId(entry.target);
              const isCurrentlyIntersecting = entry.isIntersecting;
              newIntersections[elementId] = isCurrentlyIntersecting;
              
              // If triggerOnce is true, stop observing after first intersection
              if (isCurrentlyIntersecting && triggerOnce && observerRef.current) {
                observerRef.current.unobserve(entry.target);
                for (let i = 0; i < elementsRef.current.length; i++) {
                  if (elementsRef.current[i].element === entry.target) {
                    elementsRef.current.splice(i, 1);
                    break;
                  }
                }
              }
            });
            
            return newIntersections;
          });
        },
        {
          threshold,
          rootMargin,
        }
      );
    }

    getElementId(element); // Ensure element is tracked
    observerRef.current.observe(element);
  }, [threshold, rootMargin, triggerOnce, getElementId]);

  const unobserve = useCallback((element: Element) => {
    if (observerRef.current && element) {
      observerRef.current.unobserve(element);
      let elementId = '';
      for (let i = 0; i < elementsRef.current.length; i++) {
        if (elementsRef.current[i].element === element) {
          elementId = elementsRef.current[i].id;
          elementsRef.current.splice(i, 1);
          break;
        }
      }
      
      setIntersections(prev => {
        const newIntersections = { ...prev };
        delete newIntersections[elementId];
        return newIntersections;
      });
    }
  }, []);

  const unobserveAll = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    elementsRef.current = [];
    setIntersections({});
  }, []);

  const isIntersecting = useCallback((element: Element) => {
    const elementId = getElementId(element);
    return intersections[elementId] || false;
  }, [intersections, getElementId]);

  useEffect(() => {
    return unobserveAll;
  }, [unobserveAll]);

  return {
    observe,
    unobserve,
    unobserveAll,
    isIntersecting,
    intersections,
  };
};

/**
 * Hook for scroll-triggered animations with intersection observer
 */
export const useScrollAnimation = (
  config: IntersectionObserverConfig & {
    animationClass?: string;
    onEnter?: () => void;
    onExit?: () => void;
  } = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    animationClass,
    onEnter,
    onExit,
  } = config;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const { isIntersecting, hasIntersected } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce,
  });

  useEffect(() => {
    if (isIntersecting && !isVisible) {
      setIsVisible(true);
      onEnter?.();
      
      if (animationClass && elementRef.current) {
        elementRef.current.classList.add(animationClass);
      }
    } else if (!isIntersecting && isVisible && !triggerOnce) {
      setIsVisible(false);
      onExit?.();
      
      if (animationClass && elementRef.current) {
        elementRef.current.classList.remove(animationClass);
      }
    }
  }, [isIntersecting, isVisible, triggerOnce, animationClass, onEnter, onExit]);

  return {
    ref: elementRef,
    isVisible,
    hasIntersected,
    isIntersecting,
  };
};