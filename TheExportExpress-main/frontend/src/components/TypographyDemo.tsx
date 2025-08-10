import React from 'react';
import { Typography, AnimatedHeading, GradientText, ResponsiveText, TypographyShowcase } from './EnhancedTypography';
import { TextRevealAnimation, StaggeredTextReveal, CharacterReveal, LineReveal } from './TextRevealAnimation';

interface TypographyDemoProps {
  className?: string;
}

export const TypographyDemo: React.FC<TypographyDemoProps> = ({
  className = ''
}) => {
  const sampleLines = [
    "Excellence in every export",
    "Innovation drives our success",
    "Global partnerships, local expertise"
  ];

  return (
    <div className={`max-w-6xl mx-auto px-4 py-16 space-y-16 ${className}`}>
      {/* Hero Section Typography Demo */}
      <section className="text-center space-y-8">
        <AnimatedHeading
          level={1}
          gradient="hero"
          animation="reveal"
          className="mb-6"
        >
          Enhanced Typography System
        </AnimatedHeading>
        
        <Typography
          variant="body-hero"
          animation="fade-in"
          animationDelay={0.5}
          className="text-gray-600 max-w-3xl mx-auto"
        >
          Discover the power of our enhanced typography system with gradient effects, 
          smooth animations, and responsive scaling designed for modern web experiences.
        </Typography>

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <GradientText gradient="primary" className="font-medium">Gradient Effects</GradientText>
          <span className="text-gray-400">•</span>
          <GradientText gradient="secondary" className="font-medium">Text Animations</GradientText>
          <span className="text-gray-400">•</span>
          <GradientText gradient="accent" className="font-medium">Responsive Design</GradientText>
          <span className="text-gray-400">•</span>
          <GradientText gradient="success" className="font-medium">Accessibility</GradientText>
        </div>
      </section>

      {/* Heading Hierarchy Demo */}
      <section className="space-y-8">
        <Typography variant="h2" gradient="primary" className="text-center mb-12">
          Typography Hierarchy
        </Typography>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Typography variant="caption" className="text-gray-500 mb-2">HERO HEADING</Typography>
              <AnimatedHeading level={1} gradient="hero" animation="staggered">
                Hero Level Heading
              </AnimatedHeading>
            </div>
            
            <div>
              <Typography variant="caption" className="text-gray-500 mb-2">HEADING 1</Typography>
              <Typography variant="h1" gradient="primary" shadow="sm">
                Primary Heading Level 1
              </Typography>
            </div>
            
            <div>
              <Typography variant="caption" className="text-gray-500 mb-2">HEADING 2</Typography>
              <Typography variant="h2" gradient="secondary">
                Secondary Heading Level 2
              </Typography>
            </div>
            
            <div>
              <Typography variant="caption" className="text-gray-500 mb-2">HEADING 3</Typography>
              <Typography variant="h3" gradient="accent" animation="shimmer">
                Accent Heading Level 3
              </Typography>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <Typography variant="caption" className="text-gray-500 mb-2">BODY HERO</Typography>
              <Typography variant="body-hero" shadow="md">
                Hero body text for important introductory content that needs to stand out.
              </Typography>
            </div>
            
            <div>
              <Typography variant="caption" className="text-gray-500 mb-2">BODY LARGE</Typography>
              <Typography variant="body-large">
                Large body text for emphasis and improved readability in key sections.
              </Typography>
            </div>
            
            <div>
              <Typography variant="caption" className="text-gray-500 mb-2">BODY NORMAL</Typography>
              <Typography variant="body-normal">
                Standard body text that forms the foundation of most content throughout the application.
              </Typography>
            </div>
            
            <div>
              <Typography variant="caption" className="text-gray-500 mb-2">LABELS & CAPTIONS</Typography>
              <div className="space-y-2">
                <Typography variant="label-large" className="text-gray-700 block">Large Label Text</Typography>
                <Typography variant="label" className="text-gray-600 block">Standard Label</Typography>
                <Typography variant="caption" className="text-gray-500 block">Caption Text</Typography>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Effects Demo */}
      <section className="space-y-8">
        <Typography variant="h2" gradient="secondary" className="text-center mb-12">
          Gradient Text Effects
        </Typography>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <Typography variant="h3">
              <GradientText gradient="primary">Primary Gradient</GradientText>
            </Typography>
            <Typography variant="body-small" className="text-gray-600">
              Brand primary colors with smooth animation
            </Typography>
          </div>
          
          <div className="text-center space-y-4">
            <Typography variant="h3">
              <GradientText gradient="secondary">Secondary Gradient</GradientText>
            </Typography>
            <Typography variant="body-small" className="text-gray-600">
              Warm secondary tones for supporting content
            </Typography>
          </div>
          
          <div className="text-center space-y-4">
            <Typography variant="h3">
              <GradientText gradient="accent">Accent Gradient</GradientText>
            </Typography>
            <Typography variant="body-small" className="text-gray-600">
              Bold accent colors for emphasis
            </Typography>
          </div>
          
          <div className="text-center space-y-4">
            <Typography variant="h3">
              <GradientText gradient="hero">Hero Gradient</GradientText>
            </Typography>
            <Typography variant="body-small" className="text-gray-600">
              Multi-color hero gradient for impact
            </Typography>
          </div>
          
          <div className="text-center space-y-4">
            <Typography variant="h3">
              <GradientText gradient="success">Success Gradient</GradientText>
            </Typography>
            <Typography variant="body-small" className="text-gray-600">
              Success states and positive messaging
            </Typography>
          </div>
          
          <div className="text-center space-y-4">
            <Typography variant="h3">
              <GradientText gradient="rainbow">Rainbow Gradient</GradientText>
            </Typography>
            <Typography variant="body-small" className="text-gray-600">
              Full spectrum for special occasions
            </Typography>
          </div>
        </div>
      </section>

      {/* Animation Effects Demo */}
      <section className="space-y-8">
        <Typography variant="h2" gradient="accent" className="text-center mb-12">
          Text Animation Effects
        </Typography>
        
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <Typography variant="caption" className="text-gray-500">TEXT REVEAL ANIMATION</Typography>
            <Typography variant="h3">
              <TextRevealAnimation delay={0.2}>
                Text reveals with smooth overlay effect
              </TextRevealAnimation>
            </Typography>
          </div>
          
          <div className="text-center space-y-4">
            <Typography variant="caption" className="text-gray-500">STAGGERED WORD REVEAL</Typography>
            <Typography variant="h3">
              <StaggeredTextReveal
                text="Each word appears with perfect timing"
                className="text-gradient-primary"
                wordDelay={0.2}
                revealDuration={0.8}
              />
            </Typography>
          </div>
          
          <div className="text-center space-y-4">
            <Typography variant="caption" className="text-gray-500">CHARACTER BY CHARACTER</Typography>
            <Typography variant="h3">
              <CharacterReveal
                text="Character reveal animation"
                className="text-gradient-secondary"
                charDelay={0.08}
                revealDuration={0.6}
              />
            </Typography>
          </div>
          
          <div className="text-center space-y-4">
            <Typography variant="caption" className="text-gray-500">LINE BY LINE REVEAL</Typography>
            <div className="max-w-md mx-auto">
              <LineReveal
                lines={sampleLines}
                className="text-gradient-accent text-xl font-semibold text-center"
                lineDelay={0.4}
                revealDuration={1}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Typography Demo */}
      <section className="space-y-8">
        <Typography variant="h2" gradient="success" className="text-center mb-12">
          Responsive Typography
        </Typography>
        
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <Typography variant="caption" className="text-gray-500">RESPONSIVE SCALING</Typography>
            <ResponsiveText
              mobileSize="text-lg"
              tabletSize="text-2xl"
              desktopSize="text-4xl"
              className="font-bold text-gradient-primary block"
            >
              Scales Perfectly Across Devices
            </ResponsiveText>
            <Typography variant="body-small" className="text-gray-600">
              Small on mobile → Medium on tablet → Large on desktop
            </Typography>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Typography variant="h4" className="text-gray-800">Mobile First</Typography>
              <Typography variant="body-small" className="text-gray-600">
                Optimized for touch interfaces with appropriate sizing
              </Typography>
            </div>
            
            <div className="space-y-2">
              <Typography variant="h4" className="text-gray-800">Tablet Ready</Typography>
              <Typography variant="body-small" className="text-gray-600">
                Balanced scaling for medium-sized screens
              </Typography>
            </div>
            
            <div className="space-y-2">
              <Typography variant="h4" className="text-gray-800">Desktop Enhanced</Typography>
              <Typography variant="body-small" className="text-gray-600">
                Full-scale typography for large displays
              </Typography>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="space-y-8">
        <Typography variant="h2" gradient="warning" className="text-center mb-12">
          Accessibility Features
        </Typography>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Typography variant="h4" className="text-gray-800">Reduced Motion Support</Typography>
            <Typography variant="body-normal" className="text-gray-600">
              Automatically respects user preferences for reduced motion, 
              disabling animations when requested while maintaining visual hierarchy.
            </Typography>
          </div>
          
          <div className="space-y-4">
            <Typography variant="h4" className="text-gray-800">High Contrast Mode</Typography>
            <Typography variant="body-normal" className="text-gray-600">
              Gradient effects are automatically disabled in high contrast mode, 
              ensuring text remains readable for users with visual impairments.
            </Typography>
          </div>
          
          <div className="space-y-4">
            <Typography variant="h4" className="text-gray-800">Screen Reader Friendly</Typography>
            <Typography variant="body-normal" className="text-gray-600">
              All animations preserve semantic meaning and don't interfere 
              with assistive technologies like screen readers.
            </Typography>
          </div>
          
          <div className="space-y-4">
            <Typography variant="h4" className="text-gray-800">Print Optimized</Typography>
            <Typography variant="body-normal" className="text-gray-600">
              Gradient effects and animations are automatically removed in print styles, 
              ensuring clean, readable printed documents.
            </Typography>
          </div>
        </div>
      </section>

      {/* Full Showcase */}
      <section>
        <TypographyShowcase className="bg-gray-50 rounded-2xl p-8" />
      </section>
    </div>
  );
};

export default TypographyDemo;