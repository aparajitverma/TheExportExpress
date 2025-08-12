import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ArrowPathIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

interface Product360ViewProps {
  images: string[];
  productName: string;
  uploadsUrl?: string;
  className?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableDrag?: boolean;
  enableTouch?: boolean;
  frameRate?: number;
  onRotationChange?: (rotation: number) => void;
}

interface TouchState {
  startX: number;
  startRotation: number;
  isActive: boolean;
}

const Product360View: React.FC<Product360ViewProps> = ({
  images,
  productName,
  uploadsUrl = '',
  className = '',
  autoRotate = false,
  autoRotateSpeed = 2000, // milliseconds per full rotation
  enableDrag = true,
  enableTouch = true,
  frameRate = 36, // frames per 360 degrees
  onRotationChange
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartFrame, setDragStartFrame] = useState(0);
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startRotation: 0,
    isActive: false
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Calculate total frames based on available images or frameRate
  const totalFrames = useMemo(() => {
    return Math.min(images.length, frameRate);
  }, [images.length, frameRate]);

  // Get image URL with fallback
  const getImageUrl = useCallback((imageUrl: string) => {
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
      return imageUrl;
    }
    return uploadsUrl ? `${uploadsUrl}/${imageUrl}` : imageUrl;
  }, [uploadsUrl]);

  // Preload all 360 images
  useEffect(() => {
    const preloadImages = async () => {
      setIsLoading(true);
      const imagePromises = images.slice(0, totalFrames).map((image, index) => {
        return new Promise<number>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(index);
          img.onerror = () => reject(index);
          img.src = getImageUrl(image);
        });
      });

      try {
        const results = await Promise.allSettled(imagePromises);
        const successfullyLoaded = new Set<number>();
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successfullyLoaded.add(index);
          }
        });
        
        setLoadedImages(successfullyLoaded);
        setIsLoading(false);
      } catch (error) {
        console.error('Error preloading 360 images:', error);
        setIsLoading(false);
      }
    };

    if (images.length > 0) {
      preloadImages();
    }
  }, [images, totalFrames, getImageUrl]);

  // Auto-rotation functionality
  const startAutoRotation = useCallback(() => {
    if (!isAutoRotating || isDragging || touchState.isActive) return;

    const frameInterval = autoRotateSpeed / totalFrames;
    
    autoRotateRef.current = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, frameInterval);
  }, [isAutoRotating, isDragging, touchState.isActive, autoRotateSpeed, totalFrames]);

  const stopAutoRotation = useCallback(() => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
      autoRotateRef.current = null;
    }
  }, []);

  // Toggle auto-rotation
  const toggleAutoRotation = useCallback(() => {
    setIsAutoRotating(!isAutoRotating);
  }, [isAutoRotating]);

  // Auto-rotation effect
  useEffect(() => {
    if (isAutoRotating && !isDragging && !touchState.isActive) {
      startAutoRotation();
    } else {
      stopAutoRotation();
    }

    return () => stopAutoRotation();
  }, [isAutoRotating, isDragging, touchState.isActive, startAutoRotation, stopAutoRotation]);

  // Calculate rotation angle from frame
  const getRotationAngle = useCallback((frame: number) => {
    return (frame / totalFrames) * 360;
  }, [totalFrames]);

  // Handle drag start
  const handleDragStart = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!enableDrag) return;
    
    setIsDragging(true);
    setDragStartX(info.point.x);
    setDragStartFrame(currentFrame);
    stopAutoRotation();
  }, [enableDrag, currentFrame, stopAutoRotation]);

  // Handle drag
  const handleDrag = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!enableDrag || !isDragging) return;

    const deltaX = info.point.x - dragStartX;
    const sensitivity = 2; // Adjust sensitivity as needed
    const frameChange = Math.round(deltaX / sensitivity);
    const newFrame = (dragStartFrame + frameChange + totalFrames) % totalFrames;
    
    setCurrentFrame(newFrame);
    
    // Notify parent of rotation change
    if (onRotationChange) {
      onRotationChange(getRotationAngle(newFrame));
    }
  }, [enableDrag, isDragging, dragStartX, dragStartFrame, totalFrames, onRotationChange, getRotationAngle]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    
    // Resume auto-rotation if it was enabled
    if (autoRotate) {
      setTimeout(() => {
        if (isAutoRotating) {
          startAutoRotation();
        }
      }, 1000); // Wait 1 second before resuming
    }
  }, [autoRotate, isAutoRotating, startAutoRotation]);

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (!enableTouch) return;
    
    const touch = event.touches[0];
    setTouchState({
      startX: touch.clientX,
      startRotation: currentFrame,
      isActive: true
    });
    stopAutoRotation();
  }, [enableTouch, currentFrame, stopAutoRotation]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!enableTouch || !touchState.isActive) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchState.startX;
    const sensitivity = 3; // Adjust sensitivity for touch
    const frameChange = Math.round(deltaX / sensitivity);
    const newFrame = (touchState.startRotation + frameChange + totalFrames) % totalFrames;
    
    setCurrentFrame(newFrame);
    
    // Notify parent of rotation change
    if (onRotationChange) {
      onRotationChange(getRotationAngle(newFrame));
    }
  }, [enableTouch, touchState, totalFrames, onRotationChange, getRotationAngle]);

  const handleTouchEnd = useCallback(() => {
    setTouchState(prev => ({ ...prev, isActive: false }));
    
    // Resume auto-rotation if it was enabled
    if (autoRotate) {
      setTimeout(() => {
        if (isAutoRotating) {
          startAutoRotation();
        }
      }, 1000);
    }
  }, [autoRotate, isAutoRotating, startAutoRotation]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          setCurrentFrame((prev) => (prev - 1 + totalFrames) % totalFrames);
          break;
        case 'ArrowRight':
          event.preventDefault();
          setCurrentFrame((prev) => (prev + 1) % totalFrames);
          break;
        case 'Home':
          event.preventDefault();
          setCurrentFrame(0);
          break;
        case 'End':
          event.preventDefault();
          setCurrentFrame(totalFrames - 1);
          break;
        case ' ':
          event.preventDefault();
          toggleAutoRotation();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [totalFrames, toggleAutoRotation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoRotation();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stopAutoRotation]);

  if (images.length === 0) {
    return (
      <div className={`product-360-view-empty ${className}`}>
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No 360° images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-360-view ${className}`}>
      <div 
        ref={containerRef}
        className="product-360-view-container relative w-full h-full bg-gray-50 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        tabIndex={0}
        role="img"
        aria-label={`360-degree view of ${productName}. Frame ${currentFrame + 1} of ${totalFrames}. Use arrow keys to rotate or spacebar to toggle auto-rotation.`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <motion.div
                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-gray-600 text-sm">Loading 360° view...</p>
            </div>
          </div>
        )}

        {/* 360 Image Display */}
        <AnimatePresence mode="wait">
          {!isLoading && loadedImages.has(currentFrame) && (
            <motion.div
              key={currentFrame}
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <motion.img
                src={getImageUrl(images[currentFrame])}
                alt={`${productName} - 360° view frame ${currentFrame + 1}`}
                className="w-full h-full object-contain select-none"
                draggable={false}
                drag={enableDrag}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0}
                whileDrag={{ cursor: 'grabbing' }}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          {/* Auto-rotation toggle */}
          <motion.button
            onClick={toggleAutoRotation}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isAutoRotating 
                ? 'bg-blue-500 text-white' 
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isAutoRotating ? 'Pause auto-rotation' : 'Start auto-rotation'}
            type="button"
          >
            {isAutoRotating ? (
              <PauseIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
          </motion.button>

          {/* Reset to start */}
          <motion.button
            onClick={() => setCurrentFrame(0)}
            className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Reset to start position"
            type="button"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 min-w-0">
                {Math.round(getRotationAngle(currentFrame))}°
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-1">
                <motion.div
                  className="bg-blue-500 h-1 rounded-full"
                  style={{ width: `${(currentFrame / (totalFrames - 1)) * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span className="text-xs text-gray-600">
                {currentFrame + 1}/{totalFrames}
              </span>
            </div>
          </div>
        </div>

        {/* Drag Hint */}
        {!isDragging && !touchState.isActive && !isAutoRotating && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {enableDrag && enableTouch ? 'Drag or swipe to rotate' : 
               enableDrag ? 'Drag to rotate' : 
               enableTouch ? 'Swipe to rotate' : 'Use arrow keys to rotate'}
            </div>
          </motion.div>
        )}

        {/* Screen Reader Instructions */}
        <div className="sr-only">
          360-degree product view. Current rotation: {Math.round(getRotationAngle(currentFrame))} degrees.
          Use left and right arrow keys to rotate the product.
          Press spacebar to toggle auto-rotation.
          Press Home to go to start position, End to go to end position.
        </div>
      </div>
    </div>
  );
};

export default Product360View;