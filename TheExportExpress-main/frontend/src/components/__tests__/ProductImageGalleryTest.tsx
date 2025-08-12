import React from 'react';
import ProductImageGallery from '../ProductImageGallery';

// Test component to verify ProductImageGallery functionality
const ProductImageGalleryTest: React.FC = () => {
  // Sample product images for testing
  const sampleImages = [
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
      alt: 'Product Image 1',
      type: 'main' as const,
      order: 0
    },
    {
      id: 'img-2', 
      url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop',
      alt: 'Product Image 2',
      type: 'main' as const,
      order: 1
    },
    {
      id: 'img-3',
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      alt: 'Product Image 3', 
      type: 'main' as const,
      order: 2
    },
    {
      id: 'img-4',
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
      alt: 'Product Image 4',
      type: 'main' as const,
      order: 3
    }
  ];

  const stringImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            ProductImageGallery Component Test
          </h1>
        </div>

        {/* Test 1: Basic Gallery with Object Images */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Test 1: Basic Gallery with Object Images
          </h2>
          <div className="max-w-2xl">
            <ProductImageGallery
              images={sampleImages}
              productName="Sample Product"
              className="test-gallery-1"
            />
          </div>
        </div>

        {/* Test 2: Gallery with String Images */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Test 2: Gallery with String Images
          </h2>
          <div className="max-w-2xl">
            <ProductImageGallery
              images={stringImages}
              productName="String Images Product"
              className="test-gallery-2"
            />
          </div>
        </div>

        {/* Test 3: Gallery with Auto-play */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Test 3: Gallery with Auto-play (3 second interval)
          </h2>
          <div className="max-w-2xl">
            <ProductImageGallery
              images={sampleImages}
              productName="Auto-play Product"
              autoPlay={true}
              autoPlayInterval={3000}
              className="test-gallery-3"
            />
          </div>
        </div>

        {/* Test 4: Gallery without Zoom */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Test 4: Gallery without Zoom
          </h2>
          <div className="max-w-2xl">
            <ProductImageGallery
              images={sampleImages}
              productName="No Zoom Product"
              enableZoom={false}
              className="test-gallery-4"
            />
          </div>
        </div>

        {/* Test 5: Single Image */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Test 5: Single Image
          </h2>
          <div className="max-w-2xl">
            <ProductImageGallery
              images={[sampleImages[0]]}
              productName="Single Image Product"
              className="test-gallery-5"
            />
          </div>
        </div>

        {/* Test 6: Empty Gallery */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Test 6: Empty Gallery
          </h2>
          <div className="max-w-2xl">
            <ProductImageGallery
              images={[]}
              productName="Empty Product"
              className="test-gallery-6"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Testing Instructions:
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Click on thumbnails to switch images</li>
            <li>• Use arrow keys for keyboard navigation (focus on main image first)</li>
            <li>• Hover over main image to see zoom indicator and magnifying glass</li>
            <li>• Click main image or press Enter/Space to toggle zoom</li>
            <li>• Press Escape to exit zoom mode</li>
            <li>• Test auto-play gallery - hover to pause, move away to resume</li>
            <li>• Test on mobile devices for touch interactions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGalleryTest;