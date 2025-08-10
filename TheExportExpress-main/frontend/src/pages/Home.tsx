import { useEffect } from 'react';
import { RobustImportExportHero } from '../components/RobustImportExportHero';
import { TradeCredentials } from '../components/TradeCredentials';
import EnhancedStatsSection from '../components/EnhancedStatsSection';
import AboutUsSection from '../components/AboutUsSection';
import ServicesOverviewSection from '../components/ServicesOverviewSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ProcessOverviewSection from '../components/ProcessOverviewSection';
import TeamSection from '../components/TeamSection';
import RecentProjectsSection from '../components/RecentProjectsSection';
import ContactLocationSection from '../components/ContactLocationSection';
import { 
  ScrollProgressIndicator, 
  ScrollToTopButton, 
  SectionProgressIndicator 
} from '../components/ScrollProgressIndicator';
import { 
  ParallaxBackground 
} from '../components/ScrollAnimationWrapper';
import { ResponsiveAnimationWrapper } from '../components/ResponsiveAnimationWrapper';
import { useScrollPerformance } from '../hooks/useScrollAnimations';
import { useResponsiveAnimations } from '../hooks/useResponsiveAnimations';

export default function Home() {
  // Performance monitoring for scroll animations
  const { isOptimized } = useScrollPerformance();
  
  // Responsive animation configuration
  const { deviceInfo, animationConfig } = useResponsiveAnimations();

  // Section IDs for navigation
  const sections = [
    'hero',
    'stats',
    'about',
    'services',
    'why-choose-us',
    'testimonials',
    'process',
    'team',
    'projects',
    'contact'
  ];

  useEffect(() => {
    // Set smooth scroll behavior only if animations are enabled
    if (animationConfig.duration > 0.01) {
      document.documentElement.style.scrollBehavior = 'smooth';
    } else {
      document.documentElement.style.scrollBehavior = 'auto';
    }
    
    // Add performance and device-specific classes
    const bodyClasses: string[] = [];
    
    if (isOptimized) {
      bodyClasses.push('scroll-optimized', 'reduced-animations');
    }
    
    if (deviceInfo.type === 'mobile') {
      bodyClasses.push('mobile-optimized');
    }
    
    if (deviceInfo.touchCapability === 'touch') {
      bodyClasses.push('touch-optimized');
    }
    
    if (deviceInfo.prefersReducedMotion) {
      bodyClasses.push('reduced-motion');
    }
    
    bodyClasses.forEach(cls => document.body.classList.add(cls));

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      bodyClasses.forEach(cls => document.body.classList.remove(cls));
    };
  }, [isOptimized, deviceInfo, animationConfig]);

  return (
    <div className="relative min-h-screen bg-white text-gray-900 font-cosmic">
      {/* Scroll Progress Indicators */}
      <ScrollProgressIndicator 
        position="top" 
        height={4} 
        color="#000000"
      />
      
      <ScrollToTopButton 
        color="#000000" 
        threshold={0.2}
      />
      
      <SectionProgressIndicator 
        sections={sections}
        color="#000000"
      />

      {/* Robust Import Export Hero Section */}
      <RobustImportExportHero />

      {/* Trade Credentials & Certifications */}
      <TradeCredentials />

      {/* Enhanced Stats Section with Counting Animations */}
      <ResponsiveAnimationWrapper
        animation="slideUp"
        enableParallax={animationConfig.enableParallax}
        parallaxSpeed={0.3}
        className="relative"
      >
        <div id="stats">
          {animationConfig.enableParallax && (
            <ParallaxBackground speed={0.3} className="absolute inset-0 -z-10">
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-50" />
            </ParallaxBackground>
          )}
          <EnhancedStatsSection />
        </div>
      </ResponsiveAnimationWrapper>

      {/* About Us Section with Company Story and Timeline */}
      <ResponsiveAnimationWrapper
        animation="fadeIn"
        enableParallax={animationConfig.enableParallax}
        parallaxSpeed={0.4}
        className="relative"
        delay={0.1}
      >
        <div id="about">
          {animationConfig.enableParallax && (
            <ParallaxBackground speed={0.4} className="absolute inset-0 -z-10">
              <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 opacity-30" />
            </ParallaxBackground>
          )}
          <AboutUsSection />
        </div>
      </ResponsiveAnimationWrapper>

      {/* Services Overview Section with Detailed Service Categories */}
      <ResponsiveAnimationWrapper
        animation="slideUp"
        enableParallax={animationConfig.enableParallax}
        parallaxSpeed={0.2}
        className="relative"
        delay={0.2}
      >
        <div id="services">
          {animationConfig.enableParallax && (
            <ParallaxBackground speed={0.2} className="absolute inset-0 -z-10">
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white opacity-40" />
            </ParallaxBackground>
          )}
          <ServicesOverviewSection />
        </div>
      </ResponsiveAnimationWrapper>

      {/* Why Choose Us Section with Competitive Advantages */}
      <ResponsiveAnimationWrapper
        animation="slideLeft"
        enableParallax={animationConfig.enableParallax}
        parallaxSpeed={0.5}
        className="relative"
        delay={0.15}
      >
        <div id="why-choose-us">
          {animationConfig.enableParallax && (
            <ParallaxBackground speed={0.5} className="absolute inset-0 -z-10">
              <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 opacity-35" />
            </ParallaxBackground>
          )}
          <WhyChooseUsSection />
        </div>
      </ResponsiveAnimationWrapper>

      {/* Client Testimonials Section with 3D Carousel */}
      <ResponsiveAnimationWrapper
        animation="scale"
        enableParallax={animationConfig.enableParallax}
        parallaxSpeed={0.3}
        className="relative"
        delay={0.1}
      >
        <div id="testimonials">
          {animationConfig.enableParallax && (
            <ParallaxBackground speed={0.3} className="absolute inset-0 -z-10">
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-30" />
            </ParallaxBackground>
          )}
          <TestimonialsSection />
        </div>
      </ResponsiveAnimationWrapper>

      {/* Process Overview Section with Workflow Visualization */}
      <ResponsiveAnimationWrapper
        animation="slideRight"
        enableParallax={animationConfig.enableParallax}
        parallaxSpeed={0.4}
        className="relative"
        delay={0.2}
      >
        <div id="process">
          {animationConfig.enableParallax && (
            <ParallaxBackground speed={0.4} className="absolute inset-0 -z-10">
              <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 opacity-40" />
            </ParallaxBackground>
          )}
          <ProcessOverviewSection />
        </div>
      </ResponsiveAnimationWrapper>

      {/* Team Section with Member Showcases */}
      <ResponsiveAnimationWrapper
        animation="fadeIn"
        enableParallax={animationConfig.enableParallax}
        parallaxSpeed={0.2}
        className="relative"
        delay={0.15}
      >
        <div id="team">
          {animationConfig.enableParallax && (
            <ParallaxBackground speed={0.2} className="absolute inset-0 -z-10">
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white opacity-35" />
            </ParallaxBackground>
          )}
          <TeamSection />
        </div>
      </ResponsiveAnimationWrapper>

      {/* Recent Projects Section with Filterable Gallery */}
      <ResponsiveAnimationWrapper
        animation="slideUp"
        enableParallax={animationConfig.enableParallax}
        parallaxSpeed={0.3}
        className="relative"
        delay={0.1}
      >
        <div id="projects">
          {animationConfig.enableParallax && (
            <ParallaxBackground speed={0.3} className="absolute inset-0 -z-10">
              <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 opacity-30" />
            </ParallaxBackground>
          )}
          <RecentProjectsSection />
        </div>
      </ResponsiveAnimationWrapper>

      {/* Contact & Location Section with Multiple Contact Methods */}
      <ResponsiveAnimationWrapper
        animation="fadeIn"
        enableParallax={animationConfig.enableParallax}
        parallaxSpeed={0.5}
        className="relative"
        delay={0.2}
      >
        <div id="contact">
          {animationConfig.enableParallax && (
            <ParallaxBackground speed={0.5} className="absolute inset-0 -z-10">
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-40" />
            </ParallaxBackground>
          )}
          <ContactLocationSection />
        </div>
      </ResponsiveAnimationWrapper>
      
    </div>
  );
}
