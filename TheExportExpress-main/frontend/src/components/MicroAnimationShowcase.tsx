import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RippleButton, AnimatedPattern } from './MicroAnimations';
import { 
  InteractiveLink, 
  InteractiveInput, 
  InteractiveCardEnhanced, 
  InteractiveIcon,
  LoadingState 
} from './InteractiveElements';
import { AnimatedButton, CTAButton } from './AnimatedButton';

const MicroAnimationShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-center mb-12 text-gradient bg-gradient-to-r from-[#5C3D2E] to-[#6B4E71] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Micro-Animations Showcase
        </motion.h1>

        {/* Button Animations Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">Interactive Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Enhanced Animated Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Enhanced Buttons</h3>
              <AnimatedButton 
                variant="primary" 
                morphShape={true}
                multiRipple={true}
                hoverAnimation="lift"
              >
                Morphing Button
              </AnimatedButton>
              
              <AnimatedButton 
                variant="secondary" 
                hoverAnimation="tilt"
                glowEffect={true}
              >
                Tilt & Glow
              </AnimatedButton>
              
              <AnimatedButton 
                variant="ghost" 
                hoverAnimation="bounce"
                morphShape={true}
              >
                Bouncing Ghost
              </AnimatedButton>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">CTA Buttons</h3>
              <CTAButton 
                pulse={true}
                morphingIcon={true}
                icon={<InteractiveIcon icon="fas fa-star" animation="spin" />}
              >
                Pulsing CTA
              </CTAButton>
              
              <CTAButton 
                icon={<InteractiveIcon icon="fas fa-rocket" animation="bounce" />}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                Rocket Launch
              </CTAButton>
            </div>

            {/* Ripple Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Ripple Effects</h3>
              <RippleButton 
                variant="primary"
                morphShape={true}
              >
                Multi-Ripple
              </RippleButton>
              
              <RippleButton 
                variant="secondary"
                rippleColor="rgba(147, 51, 234, 0.6)"
              >
                Purple Ripple
              </RippleButton>
            </div>
          </div>
        </section>

        {/* Interactive Cards Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">Interactive Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <InteractiveCardEnhanced
              backgroundPattern="dots"
              hoverEffect="lift"
              className="p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl"
            >
              <InteractiveIcon 
                icon="fas fa-magic" 
                animation="pulse" 
                size="xl" 
                className="mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">Dotted Pattern</h3>
              <p className="text-gray-600">Card with animated dot pattern background</p>
            </InteractiveCardEnhanced>

            <InteractiveCardEnhanced
              backgroundPattern="waves"
              hoverEffect="tilt"
              className="p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl"
            >
              <InteractiveIcon 
                icon="fas fa-water" 
                animation="bounce" 
                size="xl" 
                className="mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">Wave Pattern</h3>
              <p className="text-gray-600">Card with animated wave pattern background</p>
            </InteractiveCardEnhanced>

            <InteractiveCardEnhanced
              backgroundPattern="geometric"
              hoverEffect="glow"
              className="p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl"
            >
              <InteractiveIcon 
                icon="fas fa-shapes" 
                animation="morph" 
                size="xl" 
                className="mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">Geometric Pattern</h3>
              <p className="text-gray-600">Card with animated geometric pattern</p>
            </InteractiveCardEnhanced>
          </div>
        </section>

        {/* Form Elements Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">Interactive Form Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-6">
              <InteractiveInput
                label="Animated Input"
                placeholder="Type something..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                icon={<InteractiveIcon icon="fas fa-user" animation="pulse" />}
                animatedPlaceholder={true}
              />
              
              <InteractiveInput
                label="Email Input"
                type="email"
                placeholder="Enter your email"
                icon={<InteractiveIcon icon="fas fa-envelope" animation="bounce" />}
                animatedPlaceholder={true}
              />
              
              <InteractiveInput
                label="Error State"
                placeholder="This field has an error"
                error="This field is required"
                icon={<InteractiveIcon icon="fas fa-exclamation-triangle" animation="pulse" />}
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-700">Interactive Links</h3>
              <div className="space-y-4">
                <InteractiveLink href="#" underlineAnimation={true}>
                  Animated Underline Link
                </InteractiveLink>
                
                <InteractiveLink href="#" external={true} iconAnimation={true}>
                  External Link with Icon
                </InteractiveLink>
                
                <InteractiveLink href="#" className="text-purple-600">
                  Custom Styled Link
                </InteractiveLink>
              </div>
            </div>
          </div>
        </section>

        {/* Loading States Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">Loading States</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Dots Loading</h3>
              <LoadingState type="dots" size="lg" />
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => setShowLoading(!showLoading)}
              >
                Toggle Loading
              </button>
            </div>

            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Spinner Loading</h3>
              <LoadingState type="spinner" size="lg" />
              <AnimatePresence>
                {showLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-sm text-gray-600"
                  >
                    Loading content...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Pulse Loading</h3>
              <LoadingState type="pulse" size="lg" />
              <div className="text-sm text-gray-600">
                Pulse animation
              </div>
            </div>
          </div>
        </section>

        {/* Background Patterns Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">Animated Background Patterns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {(['dots', 'lines', 'waves', 'geometric'] as const).map((pattern) => (
              <div 
                key={pattern}
                className="relative h-32 rounded-lg overflow-hidden border border-gray-200"
              >
                <AnimatedPattern 
                  pattern={pattern}
                  className="absolute inset-0"
                  color="#5C3D2E"
                  opacity={0.2}
                  speed={1.5}
                />
                <div className="relative z-10 flex items-center justify-center h-full">
                  <span className="text-sm font-medium text-gray-700 capitalize bg-white/80 px-3 py-1 rounded">
                    {pattern}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Icon Animations Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">Interactive Icons</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            
            {[
              { icon: 'fas fa-heart', animation: 'pulse' as const },
              { icon: 'fas fa-star', animation: 'spin' as const },
              { icon: 'fas fa-bell', animation: 'bounce' as const },
              { icon: 'fas fa-cog', animation: 'morph' as const },
              { icon: 'fas fa-rocket', animation: 'bounce' as const },
              { icon: 'fas fa-magic', animation: 'pulse' as const },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-2">
                <InteractiveIcon 
                  icon={item.icon}
                  animation={item.animation}
                  size="xl"
                  className="mx-auto"
                />
                <span className="text-xs text-gray-600 capitalize">
                  {item.animation}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Accessibility Notice */}
        <section className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            <InteractiveIcon icon="fas fa-universal-access" className="mr-2" />
            Accessibility Features
          </h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• All animations respect <code>prefers-reduced-motion</code> settings</li>
            <li>• Focus indicators are keyboard navigation friendly</li>
            <li>• High contrast mode support included</li>
            <li>• Screen reader compatible with proper ARIA labels</li>
            <li>• Performance monitoring prevents animation overload</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default MicroAnimationShowcase;