/**
 * Utility functions for scroll-based animations and navigation
 */

export interface ScrollToOptions {
  behavior?: 'smooth' | 'auto';
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
  offset?: number;
}

/**
 * Smooth scroll to element with optional offset
 */
export const scrollToElement = (
  elementId: string, 
  options: ScrollToOptions = {}
): void => {
  const {
    behavior = 'smooth',
    block = 'start',
    inline = 'nearest',
    offset = 0
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with id "${elementId}" not found`);
    return;
  }

  if (offset === 0) {
    element.scrollIntoView({
      behavior,
      block,
      inline
    });
  } else {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition + offset;

    window.scrollTo({
      top: offsetPosition,
      behavior
    });
  }
};

/**
 * Get current scroll progress as percentage
 */
export const getScrollProgress = (): number => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
};

/**
 * Check if element is in viewport
 */
export const isElementInViewport = (
  element: Element,
  threshold: number = 0
): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const verticalThreshold = windowHeight * threshold;
  const horizontalThreshold = windowWidth * threshold;

  return (
    rect.top >= -verticalThreshold &&
    rect.left >= -horizontalThreshold &&
    rect.bottom <= windowHeight + verticalThreshold &&
    rect.right <= windowWidth + horizontalThreshold
  );
};

/**
 * Get elements currently in viewport
 */
export const getElementsInViewport = (
  selector: string,
  threshold: number = 0
): Element[] => {
  const elements = document.querySelectorAll(selector);
  return Array.from(elements).filter(element => 
    isElementInViewport(element, threshold)
  );
};

/**
 * Throttle function for scroll events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Debounce function for scroll events
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Calculate parallax offset based on scroll position
 */
export const calculateParallaxOffset = (
  element: Element,
  speed: number = 0.5
): number => {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset;
  const elementTop = rect.top + scrollTop;
  const windowHeight = window.innerHeight;
  
  // Calculate how much the element has scrolled into view
  const scrolled = scrollTop + windowHeight - elementTop;
  const rate = scrolled * speed;
  
  return rate;
};

/**
 * Get scroll direction
 */
export const getScrollDirection = (() => {
  let lastScrollTop = 0;
  
  return (): 'up' | 'down' | 'none' => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
      lastScrollTop = scrollTop;
      return 'down';
    } else if (scrollTop < lastScrollTop) {
      lastScrollTop = scrollTop;
      return 'up';
    }
    
    return 'none';
  };
})();

/**
 * Smooth scroll to top of page
 */
export const scrollToTop = (duration: number = 500): void => {
  const startPosition = window.pageYOffset;
  const startTime = performance.now();

  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease out cubic)
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    
    window.scrollTo(0, startPosition * (1 - easeOutCubic));
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

/**
 * Create intersection observer for scroll animations
 */
export const createScrollObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px',
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Performance-optimized scroll listener
 */
export const addOptimizedScrollListener = (
  callback: (event: Event) => void,
  options: {
    throttle?: number;
    debounce?: number;
    passive?: boolean;
  } = {}
): (() => void) => {
  const { throttle: throttleMs, debounce: debounceMs, passive = true } = options;
  
  let optimizedCallback = callback;
  
  if (throttleMs) {
    optimizedCallback = throttle(callback, throttleMs);
  } else if (debounceMs) {
    optimizedCallback = debounce(callback, debounceMs);
  }
  
  window.addEventListener('scroll', optimizedCallback, { passive });
  
  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', optimizedCallback);
  };
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get device type based on screen width
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  
  if (width < 768) {
    return 'mobile';
  } else if (width < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

/**
 * Calculate optimal animation duration based on device and preferences
 */
export const getOptimalAnimationDuration = (
  baseDuration: number = 0.8
): number => {
  if (prefersReducedMotion()) {
    return 0.01;
  }
  
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'mobile':
      return baseDuration * 0.5;
    case 'tablet':
      return baseDuration * 0.75;
    default:
      return baseDuration;
  }
};

/**
 * Create staggered animation delays
 */
export const createStaggeredDelays = (
  count: number,
  baseDelay: number = 0.1,
  maxDelay: number = 1
): number[] => {
  const delays: number[] = [];
  
  for (let i = 0; i < count; i++) {
    const delay = Math.min(i * baseDelay, maxDelay);
    delays.push(delay);
  }
  
  return delays;
};

/**
 * Measure animation performance
 */
export const measureAnimationPerformance = (
  callback: (fps: number) => void,
  duration: number = 5000
): (() => void) => {
  let frameCount = 0;
  let startTime = performance.now();
  let animationId: number;
  
  const measure = () => {
    frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - startTime;
    
    if (elapsed >= 1000) {
      const fps = Math.round((frameCount * 1000) / elapsed);
      callback(fps);
      
      frameCount = 0;
      startTime = currentTime;
    }
    
    if (elapsed < duration) {
      animationId = requestAnimationFrame(measure);
    }
  };
  
  animationId = requestAnimationFrame(measure);
  
  // Return cleanup function
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
};