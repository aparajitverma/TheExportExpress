/**
 * Custom hook for typewriter effect animations
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { TypewriterConfig, AnimationState } from '../utils/animation-types';
import { TYPEWRITER_PRESETS } from '../utils/animation-constants';

/**
 * Hook for creating typewriter effect
 */
export const useTypewriter = (
  text: string | string[],
  config: Partial<TypewriterConfig> = {}
) => {
  const {
    speed = TYPEWRITER_PRESETS.normal.speed,
    deleteSpeed = TYPEWRITER_PRESETS.normal.deleteSpeed,
    pauseDuration = TYPEWRITER_PRESETS.normal.pauseDuration,
    loop = false,
  } = config;

  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [state, setState] = useState<AnimationState>('idle');
  const [showCursor, setShowCursor] = useState(true);

  const timeoutRef = useRef<number | null>(null);
  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[currentIndex] || '';

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setState('running');
  }, []);

  const pause = useCallback(() => {
    setState('paused');
    setIsPaused(true);
    clearTimeoutRef();
  }, [clearTimeoutRef]);

  const resume = useCallback(() => {
    setState('running');
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setDisplayText('');
    setCurrentIndex(0);
    setIsDeleting(false);
    setIsPaused(false);
    clearTimeoutRef();
  }, [clearTimeoutRef]);

  const stop = useCallback(() => {
    setState('completed');
    clearTimeoutRef();
  }, [clearTimeoutRef]);

  useEffect(() => {
    if (state !== 'running' || isPaused) return;

    const typeNextCharacter = () => {
      if (isDeleting) {
        // Deleting characters
        if (displayText.length > 0) {
          setDisplayText(prev => prev.slice(0, -1));
          timeoutRef.current = setTimeout(typeNextCharacter, deleteSpeed);
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          if (textArray.length > 1) {
            setCurrentIndex(prev => (prev + 1) % textArray.length);
          }
          
          if (!loop && currentIndex === textArray.length - 1) {
            setState('completed');
            return;
          }
          
          timeoutRef.current = setTimeout(typeNextCharacter, speed);
        }
      } else {
        // Typing characters
        if (displayText.length < currentText.length) {
          setDisplayText(prev => currentText.slice(0, prev.length + 1));
          timeoutRef.current = setTimeout(typeNextCharacter, speed);
        } else {
          // Finished typing current text
          if (textArray.length > 1 || loop) {
            // Pause before deleting
            timeoutRef.current = setTimeout(() => {
              setIsDeleting(true);
              typeNextCharacter();
            }, pauseDuration);
          } else {
            setState('completed');
          }
        }
      }
    };

    timeoutRef.current = setTimeout(typeNextCharacter, speed);

    return clearTimeoutRef;
  }, [
    state,
    isPaused,
    displayText,
    currentText,
    isDeleting,
    currentIndex,
    textArray,
    loop,
    speed,
    deleteSpeed,
    pauseDuration,
    clearTimeoutRef,
  ]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530); // Standard cursor blink rate

    return () => clearInterval(cursorInterval);
  }, []);

  // Auto-start when component mounts
  useEffect(() => {
    if (state === 'idle') {
      start();
    }
  }, [start, state]);

  // Cleanup on unmount
  useEffect(() => {
    return clearTimeoutRef;
  }, [clearTimeoutRef]);

  return {
    displayText,
    showCursor,
    state,
    isDeleting,
    currentIndex,
    start,
    pause,
    resume,
    reset,
    stop,
  };
};

/**
 * Hook for typewriter effect with custom cursor
 */
export const useTypewriterWithCursor = (
  text: string | string[],
  config: Partial<TypewriterConfig & {
    cursor?: string;
    cursorBlinkSpeed?: number;
  }> = {}
) => {
  const {
    cursor = '|',
    cursorBlinkSpeed = 530,
    ...typewriterConfig
  } = config;

  const typewriter = useTypewriter(text, typewriterConfig);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, cursorBlinkSpeed);

    return () => clearInterval(interval);
  }, [cursorBlinkSpeed]);

  const displayTextWithCursor = typewriter.displayText + 
    (cursorVisible && typewriter.state === 'running' ? cursor : '');

  return {
    ...typewriter,
    displayTextWithCursor,
    cursorVisible,
  };
};

/**
 * Hook for typewriter effect that starts when element is visible
 */
export const useTypewriterOnVisible = (
  text: string | string[],
  config: Partial<TypewriterConfig & {
    threshold?: number;
    triggerOnce?: boolean;
  }> = {}
) => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    ...typewriterConfig
  } = config;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const typewriter = useTypewriter(text, {
    ...typewriterConfig,
    // Don't auto-start
  });

  useEffect(() => {
    if (!elementRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          typewriter.start();
          
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
  }, [threshold, triggerOnce, isVisible, typewriter]);

  return {
    ...typewriter,
    ref: elementRef,
    isVisible,
  };
};