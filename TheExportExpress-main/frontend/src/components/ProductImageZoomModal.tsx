import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { XMarkIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';

interface ProductImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
  productName: string;
}

const ProductImageZoomModal: React.FC<ProductImageZoomModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageAlt,
  productName: _productName
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const minScale = 1;
  const maxScale = 4;
  const scaleStep = 0.5;

  // Reset zoom when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Handle keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case '+':
        case '=':
          event.preventDefault();
          zoomIn();
          break;
        case '-':
          event.preventDefault();
          zoomOut();
          break;
        case '0':
          event.preventDefault();
          resetZoom();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          panImage(-20, 0);
          break;
        case 'ArrowRight':
          event.preventDefault();
          panImage(20, 0);
          break;
        case 'ArrowUp':
          event.preventDefault();
          panImage(0, -20);
          break;
        case 'ArrowDown':
          event.preventDefault();
          panImage(0, 20);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, scale, position]);

  // Zoom functions
  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + scaleStep, maxScale));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => {
      const newScale = Math.max(prev - scaleStep, minScale);
      if (newScale === minScale) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setScale(minScale);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Pan function
  const panImage = useCallback((deltaX: number, deltaY: number) => {
    if (scale <= minScale) return;

    setPosition(prev => {
      const maxPanX = (scale - 1) * 200;
      const maxPanY = (scale - 1) * 150;
      
      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, prev.x + deltaX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, prev.y + deltaY))
      };
    });
  }, [scale]);

  // Handle wheel zoom
  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    
    if (event.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }, [zoomIn, zoomOut]);

  // Handle drag for panning
  const handleDragStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (scale <= minScale) return;
    
    setIsDragging(true);
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  }, [scale, position]);

  const handleDragMove = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || scale <= minScale) return;
    
    event.preventDefault();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;
    
    const maxPanX = (scale - 1) * 200;
    const maxPanY = (scale - 1) * 150;
    
    setPosition({
      x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, newY))
    });
  }, [isDragging, scale, dragStart]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle double-click/tap to zoom
  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    
    if (scale === minScale) {
      setScale(2);
      
      // Calculate zoom center based on click position
      const rect = imageRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = (event.clientX - rect.left - rect.width / 2) * 0.5;
        const centerY = (event.clientY - rect.top - rect.height / 2) * 0.5;
        setPosition({ x: -centerX, y: -centerY });
      }
    } else {
      resetZoom();
    }
  }, [scale, resetZoom]);

  // Touch gesture handling
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; distance: number } | null>(null);
  const [initialScale, setInitialScale] = useState(1);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  };

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    
    if (event.touches.length === 1) {
      // Single touch - start drag
      handleDragStart(event);
    } else if (event.touches.length === 2) {
      // Pinch gesture
      const distance = getTouchDistance(event.touches);
      const center = getTouchCenter(event.touches);
      
      setTouchStart({ x: center.x, y: center.y, distance });
      setInitialScale(scale);
      setInitialPosition(position);
      setIsDragging(false);
    }
  }, [scale, position, handleDragStart]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    
    if (event.touches.length === 1 && isDragging) {
      // Single touch drag
      handleDragMove(event);
    } else if (event.touches.length === 2 && touchStart) {
      // Pinch zoom
      const distance = getTouchDistance(event.touches);
      const center = getTouchCenter(event.touches);
      
      const scaleChange = distance / touchStart.distance;
      const newScale = Math.max(minScale, Math.min(maxScale, initialScale * scaleChange));
      
      setScale(newScale);
      
      // Adjust position to zoom towards touch center
      if (newScale > minScale) {
        const rect = imageRef.current?.getBoundingClientRect();
        if (rect) {
          const centerOffsetX = (center.x - rect.left - rect.width / 2) * (scaleChange - 1) * 0.5;
          const centerOffsetY = (center.y - rect.top - rect.height / 2) * (scaleChange - 1) * 0.5;
          
          const maxPanX = (newScale - 1) * 200;
          const maxPanY = (newScale - 1) * 150;
          
          setPosition({
            x: Math.max(-maxPanX, Math.min(maxPanX, initialPosition.x - centerOffsetX)),
            y: Math.max(-maxPanY, Math.min(maxPanY, initialPosition.y - centerOffsetY))
          });
        }
      } else {
        setPosition({ x: 0, y: 0 });
      }
    }
  }, [isDragging, touchStart, initialScale, initialPosition, handleDragMove]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    if (event.touches.length === 0) {
      setTouchStart(null);
      handleDragEnd();
    }
  }, [handleDragEnd]);

  // Framer Motion drag handlers
  const handleMotionDrag = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (scale <= minScale) return;
    
    const maxPanX = (scale - 1) * 200;
    const maxPanY = (scale - 1) * 150;
    
    setPosition({
      x: Math.max(-maxPanX, Math.min(maxPanX, info.offset.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, info.offset.y))
    });
  }, [scale]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        className="zoom-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        onWheel={handleWheel}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Controls */}
        <div className="zoom-modal-controls">
          <div className="zoom-controls">
            <button
              onClick={zoomOut}
              disabled={scale <= minScale}
              className="zoom-control-btn"
              aria-label="Zoom out"
            >
              <MagnifyingGlassMinusIcon className="w-5 h-5" />
            </button>
            
            <span className="zoom-level">
              {Math.round(scale * 100)}%
            </span>
            
            <button
              onClick={zoomIn}
              disabled={scale >= maxScale}
              className="zoom-control-btn"
              aria-label="Zoom in"
            >
              <MagnifyingGlassPlusIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={resetZoom}
              className="zoom-control-btn"
              aria-label="Reset zoom"
            >
              Reset
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="close-btn"
            aria-label="Close zoom modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Image Container */}
        <motion.div
          className="zoom-modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.img
            ref={imageRef}
            src={imageUrl}
            alt={imageAlt}
            className="zoom-modal-image"
            style={{
              cursor: scale > minScale ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
            }}
            animate={{
              scale,
              x: position.x,
              y: position.y
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            drag={scale > minScale}
            dragConstraints={{
              left: -(scale - 1) * 200,
              right: (scale - 1) * 200,
              top: -(scale - 1) * 150,
              bottom: (scale - 1) * 150
            }}
            dragElastic={0.1}
            onDrag={handleMotionDrag}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleDragStart}
            onTouchStart={handleTouchStart}
          />
        </motion.div>

        {/* Instructions */}
        <div className="zoom-modal-instructions">
          <p>
            Double-click to zoom • Drag to pan • Scroll to zoom • Arrow keys to pan
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductImageZoomModal;