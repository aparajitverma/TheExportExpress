import { useState, useEffect, useRef, RefObject } from 'react';
import { useScroll, useTransform, MotionValue } from 'framer-motion';

interface ScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
  offset?: [string, string];
}

/**
 * Hook for scroll-triggered animations with viewport detection
 */
export const useScrollAnimation = <T extends Element = HTMLDivElement>(
  options: ScrollAnimationOptions = {}
): [RefObject<T>, boolean, MotionValue<number>] => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px',
    offset = ["start end", "end start"]
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T>(null);
  const { scrollYProgress } = useScroll({
    target: elementRef,
    offset
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        
        if (isIntersecting && (!isVisible || !triggerOnce)) {
          setIsVisible(true);
        } else if (!triggerOnce) {
          setIsVisible(isIntersecting);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, isVisible]);

  return [elementRef, isVisible, scrollYProgress];
};

/**
 * Hook for parallax effects with different speeds
 */
export const useParallax = (speed: number = 0.5, offset: [string, string] = ["start end", "end start"]) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return { ref, y, opacity };
};

/**
 * Hook for multiple parallax layers with different speeds
 */
export const useMultiLayerParallax = (layers: number[] = [0.2, 0.5, 0.8]) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const parallaxLayers = layers.map(speed => ({
    y: useTransform(scrollYProgress, [0, 1], [0, speed * -200]),
    opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
  }));

  return { containerRef, parallaxLayers };
};

/**
 * Hook for staggered animations
 */
export const useStaggeredAnimation = (
  itemCount: number,
  staggerDelay: number = 0.1
) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const getItemDelay = (index: number) => index * staggerDelay;

  return { containerRef, isVisible, getItemDelay };
};

/**
 * Hook for scroll-based scale animations
 */
export const useScrollScale = (
  scaleRange: [number, number] = [0.8, 1],
  offset: [string, string] = ["start end", "end start"]
) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleRange[0], 1, scaleRange[1]]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return { ref, scale, opacity };
};

/**
 * Hook for scroll-based rotation animations
 */
export const useScrollRotation = (
  rotationRange: [number, number] = [0, 360],
  offset: [string, string] = ["start end", "end start"]
) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset
  });

  const rotate = useTransform(scrollYProgress, [0, 1], rotationRange);

  return { ref, rotate };
};

/**
 * Hook for performance monitoring of scroll animations
 */
export const useScrollPerformance = () => {
  const [fps, setFps] = useState(60);
  const [isOptimized, setIsOptimized] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime.current >= 1000) {
        const currentFps = frameCount.current;
        setFps(currentFps);
        
        // Optimize animations if FPS drops below 30
        if (currentFps < 30 && !isOptimized) {
          setIsOptimized(true);
          document.body.classList.add('reduced-animations');
        } else if (currentFps >= 45 && isOptimized) {
          setIsOptimized(false);
          document.body.classList.remove('reduced-animations');
        }
        
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    const animationId = requestAnimationFrame(measureFPS);
    
    return () => cancelAnimationFrame(animationId);
  }, [isOptimized]);

  return { fps, isOptimized };
};

/**
 * Hook for device-specific animation settings
 * @deprecated Use useResponsiveAnimations from hooks/useResponsiveAnimations.ts instead
 */
export const useDeviceAnimations = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detect device type
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Check for reduced motion preference
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
    };

    checkDeviceType();
    checkReducedMotion();

    window.addEventListener('resize', checkDeviceType);
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkReducedMotion);

    return () => {
      window.removeEventListener('resize', checkDeviceType);
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

  const getAnimationConfig = () => {
    if (reducedMotion) {
      return {
        duration: 0.01,
        ease: 'linear',
        stagger: 0
      };
    }

    switch (deviceType) {
      case 'mobile':
        return {
          duration: 0.3,
          ease: 'easeOut',
          stagger: 0.05
        };
      case 'tablet':
        return {
          duration: 0.5,
          ease: 'easeOut',
          stagger: 0.1
        };
      default:
        return {
          duration: 0.8,
          ease: 'easeOut',
          stagger: 0.15
        };
    }
  };

  return { deviceType, reducedMotion, getAnimationConfig };
};