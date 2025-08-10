/**
 * Custom hook for typewriter effect animations
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface TypewriterConfig {
  text: string;
  speed: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
}

export type AnimationState = 'idle' | 'running' | 'paused' | 'completed' | 'error';

const TYPEWRITER_PRESETS = {
  fast: {
    speed: 50,
    deleteSpeed: 30,
    pauseDuration: 1000,
  },
  normal: {
    speed: 100,
    deleteSpeed: 50,
    pauseDuration: 2000,
  },
  slow: {
    speed: 150,
    deleteSpeed: 75,
    pauseDuration: 3000,
  },
} as const;

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

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
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