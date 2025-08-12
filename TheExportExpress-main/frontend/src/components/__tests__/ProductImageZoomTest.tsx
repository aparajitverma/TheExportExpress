import React from 'react';
import ProductImageGallery from '../ProductImageGallery';

// Test component to verify zoom functionality
const ProductImageZoomTest: React.FC = () => {
  // Sample product images for testing zoom functionality
  const sampleImages = [
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=800&fit=crop',
      alt: 'High Resolution Product Image 1',
      type: 'main' as const,
      order: 0
    },
    {
      id: 'img-2', 
      url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&h=800&fit=crop',
      alt: 'High Resolution Product Image 2',
      type: 'main' as const,
      order: 1
    },
    {
      id: 'img-3',
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop',
      alt: 'High Resolution Product Image 3', 
      type: 'main' as const,
      order: 2
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Interactive Zoom Functionality Test
          </h1>
        </div>

        {/* Test 1: Desktop Zoom with Magnifying Glass */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Test 1: Desktop Zoom with Magnifying Glass
          </h2>
          <div className="max-w-2xl">
            <ProductImageGallery
              images={sampleImages}
              productName="Desktop Zoom Test Product"
              enableZoom={true}
              className="test-zoom-desktop"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Desktop Instructions:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Hover over image to see magnifying glass effect</li>
              <li>Click image to open full zoom modal</li>
              <li>Use mouse wheel to zoom in/out in modal</li>
              <li>Drag to pan when zoomed in</li>
              <li>Double-click to toggle zoom level</li>
            </ul>
          </div>
        </div>

        {/* Test 2: Mobile Touch Gestures */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Test 2: Mobile Touch Gestures
          </h2>
          <div className="max-w-2xl">
            <ProductImageGallery
              images={sampleImages}
              productName="Mobile Touch Test Product"
              enableZoom={true}
              className="test-zoom-mobile"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Mobile Instructions:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Double-tap image to open zoom modal</li>
              <li>Pinch to zoom in/out in modal</li>
              <li>Drag to pan when zoomed in</li>
              <li>Swipe left/right to navigate between images</li>
              <li>Single tap to toggle basic zoom</li>
            </ul>
          </div>
        </div>

        {/* Test 3: Zoom Disabled */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Test 3: Zoom Disabled (Control Test)
          </h2>
          <div className="max-w-2xl">
            <ProductImageGallery
              images={sampleImages}
              productName="No Zoom Test Product"
              enableZoom={false}
              className="test-no-zoom"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Expected Behavior:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>No zoom indicator should appear</li>
              <li>No magnifying glass on hover</li>
              <li>Click should not open zoom modal</li>
              <li>Only basic image navigation should work</li>
            </ul>
          </div>
        </div>

        {/* Feature Summary */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Implemented Zoom Features:
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Desktop Features:</h4>
              <ul className="text-sm space-y-1">
                <li>✅ Hover-based magnifying glass effect</li>
                <li>✅ Click-to-zoom modal with pan controls</li>
                <li>✅ Mouse wheel zoom in/out</li>
                <li>✅ Drag to pan when zoomed</li>
                <li>✅ Double-click zoom toggle</li>
                <li>✅ Keyboard navigation (arrows, +/-, 0, Esc)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Mobile Features:</h4>
              <ul className="text-sm space-y-1">
                <li>✅ Touch gesture support for zoom and pan</li>
                <li>✅ Pinch-to-zoom in modal</li>
                <li>✅ Double-tap to open zoom modal</li>
                <li>✅ Single-tap basic zoom toggle</li>
                <li>✅ Swipe navigation between images</li>
                <li>✅ Touch-optimized controls</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Performance Notes */}
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            Performance & Accessibility:
          </h3>
          <ul className="text-yellow-800 text-sm space-y-1">
            <li>✅ Respects prefers-reduced-motion settings</li>
            <li>✅ GPU-accelerated animations</li>
            <li>✅ Lazy loading for performance</li>
            <li>✅ ARIA labels for screen readers</li>
            <li>✅ Keyboard navigation support</li>
            <li>✅ High contrast mode support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductImageZoomTest;