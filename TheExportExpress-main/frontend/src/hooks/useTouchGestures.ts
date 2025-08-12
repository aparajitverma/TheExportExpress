import { useCallback, useRef, useState } from 'react';

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onDoubleTap?: () => void;
  onSingleTap?: () => void;
  onPinchStart?: () => void;
  onPinchMove?: (scale: number, center: { x: number; y: number }) => void;
  onPinchEnd?: () => void;
  swipeThreshold?: number;
  doubleTapDelay?: number;
}

interface TouchState {
  startTime: number;
  startPos: { x: number; y: number };
  lastTap: number;
  initialDistance: number;
  initialScale: number;
  isPinching: boolean;
}

export const useTouchGestures = (options: TouchGestureOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onDoubleTap,
    onSingleTap,
    onPinchStart,
    onPinchMove,
    onPinchEnd,
    swipeThreshold = 50,
    doubleTapDelay = 300
  } = options;

  const touchState = useRef<TouchState>({
    startTime: 0,
    startPos: { x: 0, y: 0 },
    lastTap: 0,
    initialDistance: 0,
    initialScale: 1,
    isPinching: false
  });

  const [isGesturing, setIsGesturing] = useState(false);

  const getTouchDistance = useCallback((touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }, []);

  const getTouchCenter = useCallback((touches: React.TouchList): { x: number; y: number } => {
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  }, []);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const now = Date.now();
    const touch = event.touches[0];
    
    touchState.current.startTime = now;
    touchState.current.startPos = { x: touch.clientX, y: touch.clientY };
    
    if (event.touches.length === 1) {
      // Single touch - check for double tap
      const timeDiff = now - touchState.current.lastTap;
      if (timeDiff < doubleTapDelay && timeDiff > 0) {
        event.preventDefault();
        onDoubleTap?.();
        touchState.current.lastTap = 0; // Reset to prevent triple tap
      } else {
        touchState.current.lastTap = now;
      }
    } else if (event.touches.length === 2) {
      // Pinch gesture start
      touchState.current.isPinching = true;
      touchState.current.initialDistance = getTouchDistance(event.touches);
      touchState.current.initialScale = 1;
      setIsGesturing(true);
      onPinchStart?.();
    }
  }, [doubleTapDelay, onDoubleTap, onPinchStart, getTouchDistance]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (event.touches.length === 2 && touchState.current.isPinching) {
      // Pinch gesture
      event.preventDefault();
      const currentDistance = getTouchDistance(event.touches);
      const scale = currentDistance / touchState.current.initialDistance;
      const center = getTouchCenter(event.touches);
      
      onPinchMove?.(scale, center);
    }
  }, [getTouchDistance, getTouchCenter, onPinchMove]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchState.current.startTime;
    
    if (touchState.current.isPinching) {
      // End pinch gesture
      touchState.current.isPinching = false;
      setIsGesturing(false);
      onPinchEnd?.();
      return;
    }
    
    if (event.changedTouches.length === 1 && touchDuration < 500) {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchState.current.startPos.x;
      const deltaY = touch.clientY - touchState.current.startPos.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      
      // Check for swipe gestures
      if (absDeltaX > swipeThreshold || absDeltaY > swipeThreshold) {
        event.preventDefault();
        
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      } else if (absDeltaX < 10 && absDeltaY < 10) {
        // Single tap (no significant movement)
        const now = Date.now();
        const timeSinceLastTap = now - touchState.current.lastTap;
        
        // Only trigger single tap if it's not part of a double tap sequence
        if (timeSinceLastTap > doubleTapDelay) {
          onSingleTap?.();
        }
      }
    }
  }, [swipeThreshold, doubleTapDelay, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onSingleTap, onPinchEnd]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isGesturing
  };
};

export default useTouchGestures;