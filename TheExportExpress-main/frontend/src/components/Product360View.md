# Product 360° View Component

## Overview

The `Product360View` component provides an interactive 360-degree product viewing experience with drag controls, touch gestures, and smooth animations. It's designed to work seamlessly on both desktop and mobile devices.

## Features

- **360-degree image sequence loading and display**
- **Drag-based rotation controls** with smooth animations
- **Touch gesture support** for mobile rotation
- **Auto-rotation** with play/pause controls
- **Progress indicator** showing current rotation angle
- **Keyboard navigation** for accessibility
- **Reset functionality** to return to start position
- **Performance optimized** with image preloading
- **Responsive design** that works across all devices
- **Accessibility compliant** with ARIA labels and screen reader support

## Usage

### Basic Usage

```tsx
import Product360View from './Product360View';

const images360 = [
  'product-frame-001.jpg',
  'product-frame-002.jpg',
  // ... up to 36 frames for full 360° rotation
];

<Product360View
  images={images360}
  productName="Sample Product"
  uploadsUrl="/uploads"
  className="h-96"
/>
```

### With ProductImageGallery Integration

```tsx
import ProductImageGallery from './ProductImageGallery';

const regularImages = ['image1.jpg', 'image2.jpg'];
const images360 = ['frame1.jpg', 'frame2.jpg', /* ... */];

<ProductImageGallery
  images={regularImages}
  productName="Sample Product"
  enable360View={true}
  images360={images360}
  enableZoom={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `string[]` | **required** | Array of 360° image URLs |
| `productName` | `string` | **required** | Product name for accessibility |
| `uploadsUrl` | `string` | `''` | Base URL for image uploads |
| `className` | `string` | `''` | Additional CSS classes |
| `autoRotate` | `boolean` | `false` | Enable auto-rotation |
| `autoRotateSpeed` | `number` | `2000` | Auto-rotation speed (ms per full rotation) |
| `enableDrag` | `boolean` | `true` | Enable drag controls |
| `enableTouch` | `boolean` | `true` | Enable touch gestures |
| `frameRate` | `number` | `36` | Number of frames per 360° |
| `onRotationChange` | `function` | - | Callback when rotation changes |

## Controls

### Desktop
- **Drag horizontally** to rotate the product
- **Arrow keys** for keyboard navigation
- **Home/End keys** to jump to start/end
- **Spacebar** to toggle auto-rotation

### Mobile
- **Swipe left/right** to rotate
- **Touch and drag** for precise control
- **Tap controls** for play/pause and reset

### Accessibility
- **Screen reader support** with descriptive ARIA labels
- **Keyboard navigation** for all interactive elements
- **Reduced motion support** for users with motion sensitivity
- **High contrast mode** compatibility

## Image Requirements

### Optimal Setup
- **36 images** for smooth 360° rotation (10° per frame)
- **Consistent lighting** across all frames
- **Same camera position** and distance
- **High resolution** (recommended: 800x600 or higher)
- **Optimized file sizes** for fast loading

### Naming Convention
```
product-360-frame-001.jpg
product-360-frame-002.jpg
...
product-360-frame-036.jpg
```

## Performance Considerations

- Images are **preloaded** for smooth transitions
- **Lazy loading** prevents blocking the main thread
- **Animation optimization** with requestAnimationFrame
- **Memory efficient** with image caching
- **Responsive loading** based on device capabilities

## Browser Support

- **Modern browsers** with ES6+ support
- **Mobile browsers** with touch event support
- **Accessibility tools** and screen readers
- **Progressive enhancement** for older browsers

## Examples

### Auto-rotating Product Showcase
```tsx
<Product360View
  images={productFrames}
  productName="Premium Watch"
  autoRotate={true}
  autoRotateSpeed={3000}
  className="h-80 w-full"
/>
```

### Touch-optimized Mobile View
```tsx
<Product360View
  images={productFrames}
  productName="Smartphone"
  enableTouch={true}
  enableDrag={false} // Disable drag on mobile
  frameRate={24} // Fewer frames for mobile
  className="h-64"
/>
```

### Custom Rotation Handler
```tsx
<Product360View
  images={productFrames}
  productName="Jewelry"
  onRotationChange={(angle) => {
    console.log(`Product rotated to ${angle}°`);
    // Update other UI elements based on rotation
  }}
/>
```

## Styling

The component uses CSS classes that can be customized:

```css
.product-360-view {
  /* Main container */
}

.product-360-view-container {
  /* Inner container with controls */
}

.view-toggle-button {
  /* 360° toggle button in ProductImageGallery */
}
```

## Requirements Satisfied

✅ **Requirement 1.4**: 360-degree product view with drag controls  
✅ **Requirement 7.1**: Touch-friendly interactions  
✅ **Requirement 7.2**: Mobile gesture support  

## Integration Notes

- Works seamlessly with existing `ProductImageGallery`
- Compatible with `ProductImageZoomModal`
- Integrates with touch gesture system
- Supports all accessibility requirements
- Performance optimized for production use