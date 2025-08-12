import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ProductImageZoomModal from './ProductImageZoomModal';
import Product360View from './Product360View';
import useTouchGestures from '../hooks/useTouchGestures';
import '../styles/Product360View.css';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  type: 'main' | 'thumbnail' | '360' | 'lifestyle' | 'detail';
  order: number;
}

interface ProductImageGalleryProps {
  images: string[] | ProductImage[];
  productName: string;
  uploadsUrl?: string;
  className?: string;
  enableZoom?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  enable360View?: boolean;
  images360?: string[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
  uploadsUrl = '',
  className = '',
  enableZoom = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  enable360View = false,
  images360 = []
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [is360ViewActive, setIs360ViewActive] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Convert images to consistent format
  const processedImages = images.map((image, index) => {
    if (typeof image === 'string') {
      return {
        id: `image-${index}`,
        url: image,
        alt: `${productName} - Image ${index + 1}`,
        type: 'main' as const,
        order: index
      };
    }
    return image;
  });

  // Get image URL with fallback
  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
      return imageUrl;
    }
    return uploadsUrl ? `${uploadsUrl}/${imageUrl}` : imageUrl;
  };

  // Preload images for smooth transitions
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = processedImages.map((image, index) => {
        return new Promise<number>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(index);
          img.onerror = () => reject(index);
          img.src = getImageUrl(image.url);
        });
      });

      try {
        const loadedIndices = await Promise.allSettled(imagePromises);
        const successfullyLoaded = new Set<number>();
        
        loadedIndices.forEach((result) => {
          if (result.status === 'fulfilled') {
            successfullyLoaded.add(result.value);
          }
        });
        
        setLoadedImages(successfullyLoaded);
        setIsLoading(false);
      } catch (error) {
        console.error('Error preloading images:', error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [processedImages, uploadsUrl]);

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    if (autoPlay && processedImages.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setSelectedImageIndex((prev) => 
          prev === processedImages.length - 1 ? 0 : prev + 1
        );
      }, autoPlayInterval);
    }
  }, [autoPlay, autoPlayInterval, processedImages.length]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // Navigation functions
  const goToNext = useCallback(() => {
    setSelectedImageIndex((prev) => 
      prev === processedImages.length - 1 ? 0 : prev + 1
    );
  }, [processedImages.length]);

  const goToPrevious = useCallback(() => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? processedImages.length - 1 : prev - 1
    );
  }, [processedImages.length]);

  const goToImage = useCallback((index: number) => {
    if (index >= 0 && index < processedImages.length) {
      setSelectedImageIndex(index);
    }
  }, [processedImages.length]);

  // Zoom functionality
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableZoom || !isHovering) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  }, [enableZoom, isHovering]);

  const handleMouseEnter = useCallback(() => {
    if (enableZoom) {
      setIsHovering(true);
    }
  }, [enableZoom]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsZoomed(false);
  }, []);

  const toggleZoom = useCallback(() => {
    if (enableZoom) {
      setIsZoomed(!isZoomed);
    }
  }, [enableZoom, isZoomed]);

  const openZoomModal = useCallback(() => {
    if (enableZoom) {
      setIsZoomModalOpen(true);
    }
  }, [enableZoom]);

  const closeZoomModal = useCallback(() => {
    setIsZoomModalOpen(false);
  }, []);

  const toggle360View = useCallback(() => {
    if (enable360View && images360.length > 0) {
      setIs360ViewActive(!is360ViewActive);
      // Stop auto-play when switching to 360 view
      if (!is360ViewActive) {
        stopAutoPlay();
      }
    }
  }, [enable360View, images360.length, is360ViewActive, stopAutoPlay]);

  // Touch gesture handling
  const touchGestures = useTouchGestures({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    onDoubleTap: openZoomModal,
    onSingleTap: toggleZoom,
    swipeThreshold: 50,
    doubleTapDelay: 300
  });

  // Auto-play effect
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  // Pause auto-play on hover
  useEffect(() => {
    if (isHovering) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }, [isHovering, startAutoPlay, stopAutoPlay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!mainImageRef.current?.contains(document.activeElement)) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case 'Home':
          event.preventDefault();
          goToImage(0);
          break;
        case 'End':
          event.preventDefault();
          goToImage(processedImages.length - 1);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          openZoomModal();
          break;
        case 'Escape':
          event.preventDefault();
          setIsZoomed(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, goToImage, processedImages.length, openZoomModal]);

  // Auto-scroll thumbnails to keep selected thumbnail visible
  useEffect(() => {
    if (thumbnailsRef.current) {
      const selectedThumbnail = thumbnailsRef.current.children[selectedImageIndex] as HTMLElement;
      if (selectedThumbnail) {
        selectedThumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedImageIndex]);

  // Enhanced touch move for magnifying glass on mobile
  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!enableZoom || !isHovering || touchGestures.isGesturing) return;
    
    const touch = event.touches[0];
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  }, [enableZoom, isHovering, touchGestures.isGesturing]);

  // Animation variants
  const imageVariants = {
    enter: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  const thumbnailVariants = {
    inactive: {
      opacity: 0.7,
      scale: 1,
      borderColor: 'transparent',
      transition: { 
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    active: {
      opacity: 1,
      scale: 1.05,
      borderColor: '#3b82f6',
      transition: { 
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    hover: {
      opacity: 0.9,
      scale: 1.02,
      transition: { 
        duration: 0.15,
        ease: 'easeOut'
      }
    }
  };

  const zoomIndicatorVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  if (processedImages.length === 0) {
    return (
      <div className={`product-image-gallery-empty ${className}`}>
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-image-gallery ${className}`}>
      {/* Main Image Display */}
      <div 
        ref={mainImageRef}
        className={`main-image-container ${isZoomed ? 'zoomed' : ''} ${isHovering ? 'hovering' : ''} ${is360ViewActive ? 'view-360-active' : ''}`}
        tabIndex={0}
        role="img"
        aria-label={is360ViewActive 
          ? `360-degree product view of ${productName}` 
          : `Product image ${selectedImageIndex + 1} of ${processedImages.length}: ${processedImages[selectedImageIndex].alt}`}
        aria-describedby="image-gallery-instructions"
        onMouseMove={!is360ViewActive ? handleMouseMove : undefined}
        onMouseEnter={!is360ViewActive ? handleMouseEnter : undefined}
        onMouseLeave={!is360ViewActive ? handleMouseLeave : undefined}
        onClick={!is360ViewActive ? openZoomModal : undefined}
        onTouchStart={!is360ViewActive ? touchGestures.handleTouchStart : undefined}
        onTouchMove={!is360ViewActive ? (e) => {
          touchGestures.handleTouchMove(e);
          handleTouchMove(e);
        } : undefined}
        onTouchEnd={!is360ViewActive ? touchGestures.handleTouchEnd : undefined}
      >
        {is360ViewActive && enable360View && images360.length > 0 ? (
          /* 360-Degree View */
          <Product360View
            images={images360}
            productName={productName}
            uploadsUrl={uploadsUrl}
            className="w-full h-full"
            autoRotate={false}
            enableDrag={true}
            enableTouch={true}
            frameRate={Math.min(images360.length, 36)}
          />
        ) : (
          /* Regular Image Gallery */
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImageIndex}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="main-image-wrapper"
            >
              {isLoading || !loadedImages.has(selectedImageIndex) ? (
                <div className="image-loading-placeholder">
                  <div className="animate-pulse bg-gray-200 w-full h-full rounded-lg"></div>
                </div>
              ) : (
                <motion.img
                  src={getImageUrl(processedImages[selectedImageIndex].url)}
                  alt={processedImages[selectedImageIndex].alt}
                  className="main-image"
                  loading="eager"
                  style={{
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                  animate={{
                    scale: isZoomed ? 2.5 : (isHovering && enableZoom ? 1.05 : 1),
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* 360 View Toggle Button */}
        {enable360View && images360.length > 0 && (
          <motion.button
            onClick={toggle360View}
            className={`view-toggle-button ${is360ViewActive ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={is360ViewActive ? 'Switch to regular view' : 'Switch to 360° view'}
            type="button"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span className="text-xs">360°</span>
          </motion.button>
        )}

        {/* Zoom Indicator */}
        {enableZoom && !isZoomed && !is360ViewActive && (
          <motion.div
            className="zoom-indicator"
            variants={zoomIndicatorVariants}
            initial="hidden"
            animate={isHovering ? "visible" : "hidden"}
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </motion.div>
        )}

        {/* Magnifying Glass Effect */}
        {enableZoom && isHovering && !isZoomed && !is360ViewActive && (
          <motion.div
            className="magnifying-glass"
            style={{
              left: `${zoomPosition.x}%`,
              top: `${zoomPosition.y}%`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="magnified-content"
              style={{
                backgroundImage: `url(${getImageUrl(processedImages[selectedImageIndex].url)})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundSize: '250%',
              }}
            />
          </motion.div>
        )}

        {/* Navigation Arrows */}
        {processedImages.length > 1 && !is360ViewActive && (
          <>
            <button
              onClick={goToPrevious}
              className="nav-arrow nav-arrow-left"
              aria-label="Previous image"
              type="button"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="nav-arrow nav-arrow-right"
              aria-label="Next image"
              type="button"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {!is360ViewActive && (
          <div className="image-counter">
            {selectedImageIndex + 1} / {processedImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Carousel */}
      {processedImages.length > 1 && !is360ViewActive && (
        <div className="thumbnail-carousel">
          <div 
            ref={thumbnailsRef}
            className="thumbnail-container"
            role="tablist"
            aria-label="Product image thumbnails"
          >
            {processedImages.map((image, index) => (
              <motion.button
                key={image.id}
                variants={thumbnailVariants}
                initial="inactive"
                animate={index === selectedImageIndex ? "active" : "inactive"}
                whileHover="hover"
                onClick={() => goToImage(index)}
                className={`thumbnail ${index === selectedImageIndex ? 'thumbnail-active' : ''}`}
                role="tab"
                aria-selected={index === selectedImageIndex}
                aria-controls="main-image-container"
                aria-label={`View image ${index + 1}: ${image.alt}`}
                type="button"
              >
                {loadedImages.has(index) ? (
                  <img
                    src={getImageUrl(image.url)}
                    alt={image.alt}
                    className="thumbnail-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="thumbnail-loading">
                    <div className="animate-pulse bg-gray-200 w-full h-full rounded"></div>
                  </div>
                )}
                {index === selectedImageIndex && (
                  <motion.div
                    className="thumbnail-indicator"
                    layoutId="thumbnail-indicator"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Screen Reader Instructions */}
      <div id="image-gallery-instructions" className="sr-only">
        Use arrow keys to navigate between images. Press Home to go to first image, End to go to last image.
        {enableZoom && ' Press Enter or Space to open zoom modal. Double-tap on mobile to zoom.'}
        {autoPlay && ' Auto-play is enabled. Hover over the image to pause auto-play.'}
      </div>

      {/* Zoom Modal */}
      {enableZoom && (
        <ProductImageZoomModal
          isOpen={isZoomModalOpen}
          onClose={closeZoomModal}
          imageUrl={getImageUrl(processedImages[selectedImageIndex].url)}
          imageAlt={processedImages[selectedImageIndex].alt}
          productName={productName}
        />
      )}
    </div>
  );
};

export default ProductImageGallery;