import React from 'react';
import ProductImageGallery from '../ProductImageGallery';

// Mock 360-degree images - in a real implementation, these would be actual 360° product photos
const mock360Images = [
  'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Frame+1',
  'https://via.placeholder.com/600x400/4ECDC4/FFFFFF?text=Frame+2',
  'https://via.placeholder.com/600x400/45B7D1/FFFFFF?text=Frame+3',
  'https://via.placeholder.com/600x400/96CEB4/FFFFFF?text=Frame+4',
  'https://via.placeholder.com/600x400/FFEAA7/FFFFFF?text=Frame+5',
  'https://via.placeholder.com/600x400/DDA0DD/FFFFFF?text=Frame+6',
  'https://via.placeholder.com/600x400/98D8C8/FFFFFF?text=Frame+7',
  'https://via.placeholder.com/600x400/F7DC6F/FFFFFF?text=Frame+8',
  'https://via.placeholder.com/600x400/BB8FCE/FFFFFF?text=Frame+9',
  'https://via.placeholder.com/600x400/85C1E9/FFFFFF?text=Frame+10',
  'https://via.placeholder.com/600x400/F8C471/FFFFFF?text=Frame+11',
  'https://via.placeholder.com/600x400/82E0AA/FFFFFF?text=Frame+12',
  'https://via.placeholder.com/600x400/F1948A/FFFFFF?text=Frame+13',
  'https://via.placeholder.com/600x400/85C1E9/FFFFFF?text=Frame+14',
  'https://via.placeholder.com/600x400/D7BDE2/FFFFFF?text=Frame+15',
  'https://via.placeholder.com/600x400/A3E4D7/FFFFFF?text=Frame+16',
  'https://via.placeholder.com/600x400/F9E79F/FFFFFF?text=Frame+17',
  'https://via.placeholder.com/600x400/AED6F1/FFFFFF?text=Frame+18',
  'https://via.placeholder.com/600x400/F5B7B1/FFFFFF?text=Frame+19',
  'https://via.placeholder.com/600x400/A9DFBF/FFFFFF?text=Frame+20',
  'https://via.placeholder.com/600x400/F4D03F/FFFFFF?text=Frame+21',
  'https://via.placeholder.com/600x400/AED6F1/FFFFFF?text=Frame+22',
  'https://via.placeholder.com/600x400/D5A6BD/FFFFFF?text=Frame+23',
  'https://via.placeholder.com/600x400/A9CCE3/FFFFFF?text=Frame+24',
  'https://via.placeholder.com/600x400/F7DC6F/FFFFFF?text=Frame+25',
  'https://via.placeholder.com/600x400/85C1E9/FFFFFF?text=Frame+26',
  'https://via.placeholder.com/600x400/D7BDE2/FFFFFF?text=Frame+27',
  'https://via.placeholder.com/600x400/A3E4D7/FFFFFF?text=Frame+28',
  'https://via.placeholder.com/600x400/F9E79F/FFFFFF?text=Frame+29',
  'https://via.placeholder.com/600x400/AED6F1/FFFFFF?text=Frame+30',
  'https://via.placeholder.com/600x400/F5B7B1/FFFFFF?text=Frame+31',
  'https://via.placeholder.com/600x400/A9DFBF/FFFFFF?text=Frame+32',
  'https://via.placeholder.com/600x400/F4D03F/FFFFFF?text=Frame+33',
  'https://via.placeholder.com/600x400/AED6F1/FFFFFF?text=Frame+34',
  'https://via.placeholder.com/600x400/D5A6BD/FFFFFF?text=Frame+35',
  'https://via.placeholder.com/600x400/A9CCE3/FFFFFF?text=Frame+36'
];

const mockRegularImages = [
  'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Main+Image+1',
  'https://via.placeholder.com/600x400/4ECDC4/FFFFFF?text=Main+Image+2',
  'https://via.placeholder.com/600x400/45B7D1/FFFFFF?text=Main+Image+3',
  'https://via.placeholder.com/600x400/96CEB4/FFFFFF?text=Main+Image+4'
];

const Product360ViewTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            360° Product View Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test the interactive 360-degree product view with drag controls and touch gestures.
            Click the "360°" button to switch between regular gallery and 360° view.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Gallery with 360 View */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Enhanced Product Gallery
              </h2>
              <p className="text-sm text-gray-600">
                Features both regular image gallery and 360° view
              </p>
              <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                <ProductImageGallery
                  images={mockRegularImages}
                  productName="Test Product with 360° View"
                  className="h-full"
                  enableZoom={true}
                  enable360View={true}
                  images360={mock360Images}
                />
              </div>
            </div>

            {/* Regular Gallery for Comparison */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Regular Product Gallery
              </h2>
              <p className="text-sm text-gray-600">
                Standard image gallery without 360° functionality
              </p>
              <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                <ProductImageGallery
                  images={mockRegularImages}
                  productName="Test Product Regular View"
                  className="h-full"
                  enableZoom={true}
                  enable360View={false}
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              How to Test 360° View
            </h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Click the "360°" button in the top-left corner to activate 360° view</li>
              <li>• Drag horizontally to rotate the product</li>
              <li>• On mobile: swipe left/right to rotate</li>
              <li>• Use arrow keys for keyboard navigation</li>
              <li>• Click the play/pause button to toggle auto-rotation</li>
              <li>• Click the reset button to return to the starting position</li>
              <li>• The progress bar shows current rotation angle and frame</li>
            </ul>
          </div>

          {/* Technical Details */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Technical Implementation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h4 className="font-medium mb-1">Features Implemented:</h4>
                <ul className="space-y-1">
                  <li>✓ 360-degree image sequence loading</li>
                  <li>✓ Drag-based rotation controls</li>
                  <li>✓ Touch gesture support</li>
                  <li>✓ Smooth animations with Framer Motion</li>
                  <li>✓ Auto-rotation with play/pause controls</li>
                  <li>✓ Keyboard navigation</li>
                  <li>✓ Progress indicator</li>
                  <li>✓ Accessibility support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Requirements Satisfied:</h4>
                <ul className="space-y-1">
                  <li>✓ Requirement 1.4: 360-degree product view</li>
                  <li>✓ Requirement 7.1: Touch-friendly interactions</li>
                  <li>✓ Requirement 7.2: Mobile gesture support</li>
                  <li>✓ Smooth animations and transitions</li>
                  <li>✓ Responsive design</li>
                  <li>✓ Performance optimized</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product360ViewTest;