import { useState, useEffect, useRef, RefObject } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
  onIntersect?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void;
}

/**
 * Custom hook for detecting when an element enters/exits the viewport
 * @param options - Configuration options for the intersection observer
 * @returns [ref, isVisible, entry] - Element ref, visibility state, and intersection entry
 */
export const useIntersectionObserver = <T extends Element = HTMLDivElement>(
  options: IntersectionObserverOptions = {}
): [RefObject<T>, boolean, IntersectionObserverEntry | null] => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = false,
    onIntersect
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) {
      console.warn('IntersectionObserver is not supported in this browser');
      setIsVisible(true); // Fallback to always visible
      return;
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [intersectionEntry] = entries;
      const isIntersecting = intersectionEntry.isIntersecting;
      
      setEntry(intersectionEntry);
      setIsVisible(isIntersecting);
      
      // Call the callback if provided
      onIntersect?.(isIntersecting, intersectionEntry);

      // If triggerOnce is true and element is visible, disconnect observer
      if (triggerOnce && isIntersecting && observerRef.current) {
        observerRef.current.disconnect();
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      root,
      rootMargin
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, root, rootMargin, triggerOnce, onIntersect]);

  return [elementRef, isVisible, entry];
};

/**
 * Simplified hook that only returns visibility state
 * @param options - Configuration options for the intersection observer
 * @returns [ref, isVisible] - Element ref and visibility state
 */
export const useInView = <T extends Element = HTMLDivElement>(
  options: IntersectionObserverOptions = {}
): [RefObject<T>, boolean] => {
  const [ref, isVisible] = useIntersectionObserver<T>(options);
  return [ref, isVisible];
};

/**
 * Hook for triggering animations when element enters viewport
 * @param options - Configuration options
 * @returns [ref, hasTriggered] - Element ref and whether animation has been triggered
 */
export const useAnimationTrigger = <T extends Element = HTMLDivElement>(
  options: Omit<IntersectionObserverOptions, 'triggerOnce'> = {}
): [RefObject<T>, boolean] => {
  const [hasTriggered, setHasTriggered] = useState(false);
  
  const [ref] = useIntersectionObserver<T>({
    ...options,
    triggerOnce: true,
    onIntersect: (isIntersecting) => {
      if (isIntersecting && !hasTriggered) {
        setHasTriggered(true);
      }
    }
  });

  return [ref, hasTriggered];
};

/**
 * Hook for multiple intersection thresholds
 * @param thresholds - Array of threshold values
 * @param options - Additional options
 * @returns [ref, visibilityMap] - Element ref and map of threshold visibility states
 */
export const useMultipleThresholds = <T extends Element = HTMLDivElement>(
  thresholds: number[],
  options: Omit<IntersectionObserverOptions, 'threshold'> = {}
): [RefObject<T>, Record<number, boolean>] => {
  const [visibilityMap, setVisibilityMap] = useState<Record<number, boolean>>(
    thresholds.reduce((acc, threshold) => ({ ...acc, [threshold]: false }), {})
  );

  const [ref] = useIntersectionObserver<T>({
    ...options,
    threshold: thresholds,
    onIntersect: (_, entry) => {
      const currentThreshold = entry.intersectionRatio;
      const newVisibilityMap = { ...visibilityMap };
      
      thresholds.forEach(threshold => {
        newVisibilityMap[threshold] = currentThreshold >= threshold;
      });
      
      setVisibilityMap(newVisibilityMap);
    }
  });

  return [ref, visibilityMap];
};