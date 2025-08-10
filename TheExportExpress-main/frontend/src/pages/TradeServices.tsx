import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { motion, Variants, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  GlobeAltIcon,
  DocumentTextIcon,
  TruckIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  ChartBarIcon,
  CommandLineIcon,
  ChartPieIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// TypeScript interfaces for service data and animations
interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'logistics' | 'documentation' | 'compliance';
}

interface SectorItem {
  id: string;
  name: string;
  category: string;
  animationDelay: number;
}

interface Achievement {
  id: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  metric?: {
    value: string;
    label: string;
  };
}

interface LoadingState {
  isLoading: boolean;
  progress: number;
}

interface InteractionState {
  hoveredCard: string | null;
  focusedCard: string | null;
  activeSection: string | null;
}



// Error Boundary Component for Animation Components
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class AnimationErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Animation component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.props.children;
    }

    return this.props.children;
  }
}

// Enhanced loading component with smooth transitions
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-purple-200 border-t-purple-600 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      aria-label="Loading"
    />
  );
};

// Micro-interaction component for subtle feedback
const MicroInteraction: React.FC<{ 
  children: React.ReactNode; 
  type: 'pulse' | 'glow' | 'bounce' | 'shake';
  trigger?: boolean;
  delay?: number;
}> = ({ children, type, trigger = true, delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) return <>{children}</>;

  const animations = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.6, delay, ease: "easeInOut" }
    },
    glow: {
      boxShadow: [
        "0 0 0 rgba(147, 51, 234, 0)",
        "0 0 20px rgba(147, 51, 234, 0.3)",
        "0 0 0 rgba(147, 51, 234, 0)"
      ],
      transition: { duration: 1.5, delay, ease: "easeInOut" }
    },
    bounce: {
      y: [0, -10, 0],
      transition: { duration: 0.5, delay, ease: "easeOut" }
    },
    shake: {
      x: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.5, delay, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      animate={trigger ? animations[type] : {}}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
};

// Performance-optimized animation variants with enhanced easing and micro-interactions
const createAnimationVariants = (shouldReduceMotion: boolean, isMobile: boolean = false) => ({
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: shouldReduceMotion 
        ? { duration: 0.1 }
        : {
            staggerChildren: isMobile ? 0.08 : 0.12, // Fine-tuned stagger timing
            delayChildren: isMobile ? 0.05 : 0.1,
            ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic-bezier for smoother feel
          }
    }
  } as Variants,

  itemVariants: {
    hidden: { 
      y: shouldReduceMotion ? 0 : (isMobile ? 12 : 24), // Fine-tuned movement
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.95 // Subtle scale for polish
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: shouldReduceMotion 
        ? { duration: 0.1 }
        : { 
            duration: isMobile ? 0.4 : 0.6, // Slightly longer for smoothness
            ease: [0.25, 0.46, 0.45, 0.94] // Custom easing curve
          }
    }
  } as Variants,

  heroVariants: {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : (isMobile ? 20 : 40),
      scale: shouldReduceMotion ? 1 : 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: shouldReduceMotion 
        ? { duration: 0.1 }
        : {
            duration: isMobile ? 0.8 : 1.0, // Longer for dramatic effect
            staggerChildren: isMobile ? 0.15 : 0.25,
            ease: [0.25, 0.46, 0.45, 0.94] // Smooth custom easing
          }
    }
  } as Variants,

  heroTitleVariants: {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : (isMobile ? 15 : 25),
      scale: shouldReduceMotion ? 1 : 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: shouldReduceMotion 
        ? { duration: 0.1 }
        : {
            duration: isMobile ? 0.6 : 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            stiffness: 100,
            damping: 15
          }
    }
  } as Variants,

  heroSubtitleVariants: {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : (isMobile ? 15 : 25),
      scale: shouldReduceMotion ? 1 : 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: shouldReduceMotion 
        ? { duration: 0.1 }
        : {
            duration: isMobile ? 0.6 : 0.8,
            delay: isMobile ? 0.15 : 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            stiffness: 80,
            damping: 12
          }
    }
  } as Variants,

  // New variants for enhanced micro-interactions
  cardHoverVariants: {
    rest: { 
      scale: 1, 
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    },
    hover: { 
      scale: isMobile ? 1.02 : 1.05, 
      y: isMobile ? -2 : -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        duration: 0.3, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  } as Variants,

  iconSpinVariants: {
    rest: { rotate: 0 },
    hover: { 
      rotate: shouldReduceMotion ? 0 : 360,
      transition: { 
        duration: 0.8, 
        ease: "easeInOut" 
      }
    }
  } as Variants
});

// Service data configuration with icons
const servicesData: ServiceItem[] = [
  {
    id: 'global-sourcing',
    title: 'Global Sourcing',
    description: 'Curated supplier network across India with quality benchmarking and audits.',
    icon: GlobeAltIcon,
    category: 'logistics'
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Commercial invoices, COO, FSSAI/AYUSH certificates, LC/DA/DP handling.',
    icon: DocumentTextIcon,
    category: 'documentation'
  },
  {
    id: 'freight-logistics',
    title: 'Freight & Logistics',
    description: 'Air/Sea, consolidations, multimodal routing, insurance and tracking.',
    icon: TruckIcon,
    category: 'logistics'
  },
  {
    id: 'customs-clearance',
    title: 'Customs & Clearance',
    description: 'Broker coordination, HS code guidance, duties/taxes optimization.',
    icon: ShieldCheckIcon,
    category: 'compliance'
  },
  {
    id: 'warehousing',
    title: 'Warehousing',
    description: 'Bonded and non-bonded facilities with inventory visibility.',
    icon: BuildingStorefrontIcon,
    category: 'logistics'
  },
  {
    id: 'last-mile-delivery',
    title: 'Last-Mile Delivery',
    description: 'Port-to-client execution with PODs and SLA governance.',
    icon: MapPinIcon,
    category: 'logistics'
  }
];

// Sector data with animation delays
const sectorsData: SectorItem[] = [
  { id: 'spices', name: 'Spices & Botanicals', category: 'food', animationDelay: 0 },
  { id: 'agri', name: 'Agri Commodities', category: 'agriculture', animationDelay: 0.1 },
  { id: 'gems', name: 'Gems & Jewelry', category: 'luxury', animationDelay: 0.2 },
  { id: 'ayurvedic', name: 'Ayurvedic & Wellness', category: 'health', animationDelay: 0.3 },
  { id: 'engineering', name: 'Engineering Goods', category: 'industrial', animationDelay: 0.4 },
  { id: 'textiles', name: 'Textiles', category: 'fashion', animationDelay: 0.5 },
  { id: 'handicrafts', name: 'Handicrafts', category: 'art', animationDelay: 0.6 },
  { id: 'chemicals', name: 'Chemicals', category: 'industrial', animationDelay: 0.7 }
];

// Achievement data with icons and enhanced statistics
const achievementsData: Achievement[] = [
  {
    id: 'portfolio',
    text: 'Portfolio across 50+ countries and 10,000+ shipments executed with 99.5% on-time delivery',
    icon: ChartBarIcon,
    metric: { value: '50+', label: 'Countries' }
  },
  {
    id: 'shipments',
    text: 'Successfully executed shipments with comprehensive tracking and documentation',
    icon: TruckIcon,
    metric: { value: '10K+', label: 'Shipments' }
  },
  {
    id: 'command-center',
    text: 'Unified command center with live order tracking and exception handling across all operations',
    icon: CommandLineIcon,
    metric: { value: '24/7', label: 'Monitoring' }
  },
  {
    id: 'compliance',
    text: 'Compliance-first operations with verifiable certifications and regulatory adherence',
    icon: ShieldCheckIcon,
    metric: { value: '99.5%', label: 'Compliance Rate' }
  },
  {
    id: 'analytics',
    text: 'Predictive analytics for pricing, demand forecasting, and risk management',
    icon: ChartPieIcon
  },
  {
    id: 'experience',
    text: 'Years of operational excellence in international trade and logistics',
    icon: GlobeAltIcon,
    metric: { value: '15+', label: 'Years Experience' }
  }
];

export default function TradeServices() {
  // Performance optimization: Check for reduced motion preference
  const shouldReduceMotion = useReducedMotion();
  
  // Enhanced state management for interactions and loading
  const [isMobile, setIsMobile] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: true, progress: 0 });
  const [interactionState, setInteractionState] = useState<InteractionState>({
    hoveredCard: null,
    focusedCard: null,
    activeSection: null
  });
  
  // Loading simulation with smooth progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingState({ isLoading: false, progress: 100 });
    }, 800);
    
    // Simulate loading progress
    const progressTimer = setInterval(() => {
      setLoadingState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + 10, 90)
      }));
    }, 80);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);
  
  // Responsive design: Detect mobile viewport with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkViewport = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        setIsMobile(width < 768); // md breakpoint
      }, 100); // Debounce for performance
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => {
      window.removeEventListener('resize', checkViewport);
      clearTimeout(timeoutId);
    };
  }, []);

  // Performance monitoring and scroll optimization
  useEffect(() => {
    // Performance monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure' && entry.duration > 16) {
            console.warn(`Performance warning: ${entry.name} took ${entry.duration}ms`);
          }
        });
      });
      
      try {
        observer.observe({ entryTypes: ['measure'] });
      } catch (e) {
        // Fallback for browsers that don't support PerformanceObserver
        console.log('PerformanceObserver not supported');
      }
      
      // Scroll performance optimization
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            // Update active section based on scroll position
            const sections = document.querySelectorAll('section[role="region"]');
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            sections.forEach((section) => {
              const rect = section.getBoundingClientRect();
              const sectionTop = rect.top + window.scrollY;
              const sectionBottom = sectionTop + rect.height;
              
              if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                const sectionId = section.getAttribute('aria-labelledby');
                setInteractionState(prev => ({ ...prev, activeSection: sectionId }));
              }
            });
            
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  // Memoize animation variants to prevent unnecessary re-renders with responsive support
  const animationVariants = useMemo(
    () => createAnimationVariants(shouldReduceMotion || false, isMobile),
    [shouldReduceMotion, isMobile]
  );

  // Enhanced hover handlers with micro-interactions
  const createHoverHandler = useCallback((scale: number = 1.05, cardId?: string) => {
    if (shouldReduceMotion) return {};
    
    return {
      scale: isMobile ? Math.min(scale, 1.02) : scale,
      y: isMobile ? -2 : -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        duration: 0.3, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 300,
        damping: 20
      },
      onHoverStart: () => {
        if (cardId) {
          setInteractionState(prev => ({ ...prev, hoveredCard: cardId }));
        }
      },
      onHoverEnd: () => {
        setInteractionState(prev => ({ ...prev, hoveredCard: null }));
      }
    };
  }, [shouldReduceMotion, isMobile]);

  // Enhanced touch interaction handler with haptic feedback simulation
  const createTouchHandler = useCallback((cardId?: string) => ({
    onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => {
      if (isMobile) {
        const element = e.currentTarget as HTMLElement;
        element.style.transform = 'scale(0.97)';
        element.style.transition = 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Simulate haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
        
        if (cardId) {
          setInteractionState(prev => ({ ...prev, focusedCard: cardId }));
        }
      }
    },
    onTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => {
      if (isMobile) {
        const element = e.currentTarget as HTMLElement;
        element.style.transform = 'scale(1)';
        element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        setTimeout(() => {
          setInteractionState(prev => ({ ...prev, focusedCard: null }));
        }, 200);
      }
    }
  }), [isMobile]);

  // Loading state component
  if (loadingState.isLoading) {
    return (
      <div className="relative min-h-screen bg-white text-gray-900 font-cosmic flex items-center justify-center">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <LoadingSpinner size="lg" />
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Loading Trade Services...
          </motion.p>
          <motion.div 
            className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 192 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${loadingState.progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="relative min-h-screen bg-white text-gray-900 font-cosmic overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Subtle animated background pattern */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
          />
        </div>
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-8 sm:space-y-12 py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Hero Section with Animations */}
        <AnimationErrorBoundary fallback={
          <header className="relative space-y-6 text-center py-12">
            <h1 
              className="mb-6"
              style={{ fontSize: 'var(--fs-h1-d)', lineHeight: 'var(--lh-h1)', fontWeight: 700, color: 'var(--color-primary-dark)' }}
            >
              End-to-End Import-Export Services
            </h1>
            <p 
              className="mt-2 max-w-4xl mx-auto mb-8"
              style={{ fontSize: '1.25rem', fontWeight: 400, color: '#6B7280' }}
            >
              Decades of operational excellence across sourcing, documentation, logistics, compliance, and delivery — with real-time visibility and SLAs.
            </p>
          </header>
        }>
          <motion.header 
            className="relative space-y-4 sm:space-y-6 text-center py-8 sm:py-12"
            variants={animationVariants.heroVariants}
            initial="hidden"
            animate="visible"
            role="banner"
            aria-label="Trade Services Hero Section"
          >
            {/* Subtle background enhancement */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent rounded-3xl blur-3xl -z-10"
              aria-hidden="true"
            />
            
            <motion.h1 
              className="mb-4 sm:mb-6 px-2"
              variants={animationVariants.heroTitleVariants}
              style={{ 
                fontSize: isMobile ? 'var(--fs-h1-m)' : 'var(--fs-h1-d)', 
                lineHeight: 'var(--lh-h1)', 
                fontWeight: 700, 
                color: 'var(--color-primary-dark)' 
              }}
              aria-label="Main heading: End-to-End Import-Export Services"
            >
              End-to-End Import-Export Services
            </motion.h1>
            
            <motion.p 
              className="mt-2 max-w-4xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0"
              variants={animationVariants.heroSubtitleVariants}
              style={{ 
                fontSize: isMobile ? '1.125rem' : '1.25rem', 
                fontWeight: 400, 
                color: '#6B7280',
                lineHeight: isMobile ? '1.6' : '1.5'
              }}
              aria-label="Service description: Decades of operational excellence across sourcing, documentation, logistics, compliance, and delivery"
            >
              Decades of operational excellence across sourcing, documentation, logistics, compliance, and delivery — with real-time visibility and SLAs.
            </motion.p>
          </motion.header>
        </AnimationErrorBoundary>

        {/* Animated Services Grid Layout with Scroll-Triggered Effects */}
        <AnimationErrorBoundary fallback={
          <section className="relative py-12">
            <div className="section-divider"></div>
            <h2 
              className="text-center mb-16"
              style={{ fontSize: 'var(--fs-h2-d)', lineHeight: 'var(--lh-h2)', fontWeight: 700, color: 'var(--color-primary-dark)' }}
            >
              Our Comprehensive Services
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {servicesData.map((service) => {
                const IconComponent = service.icon;
                return (
                  <div key={service.id} className="card group cursor-pointer">
                    <div className="relative z-10">
                      <div className="h-14 w-14 mb-6 rounded-xl flex items-center justify-center border border-gray-200 bg-white text-[var(--color-primary)]">
                        <IconComponent className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        }>
          <motion.section 
            className="relative py-8 sm:py-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: isMobile ? 0.1 : 0.2 }}
            variants={animationVariants.containerVariants}
            role="region"
            aria-labelledby="services-heading"
          >
            {/* Section divider */}
            <div className="section-divider" aria-hidden="true"></div>
            
            <motion.h2 
              id="services-heading"
              className="text-center mb-8 sm:mb-12 lg:mb-16 px-4"
              style={{ 
                fontSize: isMobile ? 'var(--fs-h2-m)' : 'var(--fs-h2-d)', 
                lineHeight: 'var(--lh-h2)', 
                fontWeight: 700, 
                color: 'var(--color-primary-dark)' 
              }}
              variants={animationVariants.itemVariants}
            >
              Our Comprehensive Services
            </motion.h2>

            {/* Responsive Services Grid with Staggered Animations */}
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
              role="list"
              aria-label="List of trade services"
            >
              {servicesData.map((service) => {
                const IconComponent = service.icon;
                return (
                  <motion.div
                    key={service.id}
                    variants={animationVariants.itemVariants}
                    whileHover={createHoverHandler(1.05, service.id)}
                    className="card group cursor-pointer touch-manipulation relative overflow-hidden"
                    role="listitem"
                    aria-label={`Service: ${service.title}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        // Handle service selection if needed
                      }
                    }}
                    {...createTouchHandler(service.id)}
                    style={{ 
                      minHeight: isMobile ? '200px' : 'auto',
                      padding: isMobile ? '1.25rem' : '1.5rem',
                      willChange: shouldReduceMotion ? 'auto' : 'transform'
                    }}
                  >
                    {/* Animated background particles for enhanced visual appeal */}
                    <AnimatePresence>
                      {interactionState.hoveredCard === service.id && !shouldReduceMotion && (
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-purple-400 rounded-full"
                              style={{
                                left: `${20 + i * 30}%`,
                                top: `${20 + i * 20}%`,
                              }}
                              animate={{
                                y: [0, -20, 0],
                                opacity: [0.3, 1, 0.3],
                                scale: [0.5, 1, 0.5]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="relative z-10">
                      {/* Enhanced Service Icon with micro-interactions */}
                      <MicroInteraction type="pulse" trigger={interactionState.hoveredCard === service.id}>
                        <motion.div 
                          className={`${isMobile ? 'h-12 w-12 mb-4' : 'h-14 w-14 mb-6'} rounded-xl flex items-center justify-center border border-gray-200 bg-white text-[var(--color-primary)] group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
                          aria-hidden="true"
                          style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
                          whileHover={shouldReduceMotion ? {} : {
                            rotate: [0, -5, 5, 0],
                            transition: { duration: 0.5, ease: "easeInOut" }
                          }}
                        >
                          {/* Icon glow effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100"
                            transition={{ duration: 0.3 }}
                          />
                          <motion.div
                            variants={animationVariants.iconSpinVariants}
                            initial="rest"
                            whileHover="hover"
                            className="relative z-10"
                          >
                            <IconComponent className={isMobile ? 'h-6 w-6' : 'h-7 w-7'} />
                          </motion.div>
                        </motion.div>
                      </MicroInteraction>
                      
                      {/* Enhanced Service Title with subtle animation */}
                      <motion.h3 
                        className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-2 transition-colors duration-300 group-hover:text-purple-700`}
                        style={{ color: '#111827' }}
                        aria-level={3}
                        whileHover={shouldReduceMotion ? {} : {
                          x: 2,
                          transition: { duration: 0.2, ease: "easeOut" }
                        }}
                      >
                        {service.title}
                      </motion.h3>
                      
                      {/* Enhanced Service Description with staggered character animation */}
                      <motion.p 
                        className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300"
                        style={{ 
                          fontSize: isMobile ? '0.9rem' : '1rem',
                          lineHeight: isMobile ? '1.6' : '1.5'
                        }}
                        whileHover={shouldReduceMotion ? {} : {
                          x: 2,
                          transition: { duration: 0.2, ease: "easeOut", delay: 0.05 }
                        }}
                      >
                        {service.description}
                      </motion.p>

                      {/* Service category indicator */}
                      <motion.div
                        className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          {service.category}
                        </span>
                      </motion.div>
                    </div>
                    
                    {/* Enhanced hover glow effect overlay with multiple layers */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" 
                      aria-hidden="true"
                      whileHover={shouldReduceMotion ? {} : {
                        background: [
                          "linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, transparent 50%, rgba(147, 51, 234, 0.05) 100%)",
                          "linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, transparent 50%, rgba(147, 51, 234, 0.1) 100%)",
                          "linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, transparent 50%, rgba(147, 51, 234, 0.05) 100%)"
                        ],
                        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    />
                    
                    {/* Subtle border animation */}
                    <motion.div
                      className="absolute inset-0 rounded-xl border border-transparent group-hover:border-purple-200/50 transition-all duration-300"
                      whileHover={shouldReduceMotion ? {} : {
                        borderColor: ["rgba(147, 51, 234, 0)", "rgba(147, 51, 234, 0.3)", "rgba(147, 51, 234, 0)"],
                        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                      }}
                      aria-hidden="true"
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        </AnimationErrorBoundary>

        {/* Enhanced Sector Expertise Section */}
        <AnimationErrorBoundary fallback={
          <section className="relative py-12">
            <div className="section-divider"></div>
            <h2 
              className="text-center mb-16"
              style={{ fontSize: 'var(--fs-h2-d)', lineHeight: 'var(--lh-h2)', fontWeight: 700, color: 'var(--color-primary-dark)' }}
            >
              Sector Expertise
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {sectorsData.map((sector) => (
                <div 
                  key={sector.id} 
                  className="glass-base text-center group cursor-pointer relative overflow-hidden rounded-xl p-6"
                >
                  <div className="relative z-10">
                    <h3 
                      className="font-semibold" 
                      style={{ color: '#111827' }}
                    >
                      {sector.name}
                    </h3>
                    <div className="mt-2">
                      <span className="text-xs text-purple-600 font-medium uppercase tracking-wider">
                        {sector.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        }>
          <motion.section 
            className="relative py-8 sm:py-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: isMobile ? 0.1 : 0.2 }}
            variants={animationVariants.containerVariants}
            role="region"
            aria-labelledby="sectors-heading"
          >
            {/* Section divider */}
            <div className="section-divider" aria-hidden="true"></div>
            
            <motion.h2 
              id="sectors-heading"
              className="text-center mb-8 sm:mb-12 lg:mb-16 px-4"
              style={{ 
                fontSize: isMobile ? 'var(--fs-h2-m)' : 'var(--fs-h2-d)', 
                lineHeight: 'var(--lh-h2)', 
                fontWeight: 700, 
                color: 'var(--color-primary-dark)' 
              }}
              variants={animationVariants.itemVariants}
            >
              Sector Expertise
            </motion.h2>
            
            {/* Animated Sector Grid with Staggered Entrance */}
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              role="list"
              aria-label="List of sector expertise areas"
            >
              {sectorsData.map((sector) => (
                <motion.div 
                  key={sector.id} 
                  className={`glass-base text-center group cursor-pointer relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg touch-manipulation ${isMobile ? 'p-4' : 'p-6'}`}
                  initial={{ 
                    opacity: 0, 
                    y: shouldReduceMotion ? 0 : (isMobile ? 15 : 30) 
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    transition: shouldReduceMotion 
                      ? { duration: 0.1 }
                      : { 
                          duration: isMobile ? 0.4 : 0.6,
                          delay: isMobile ? sector.animationDelay * 0.5 : sector.animationDelay,
                          ease: "easeOut"
                        }
                  }}
                  viewport={{ once: true, amount: isMobile ? 0.2 : 0.3 }}
                  whileHover={shouldReduceMotion || isMobile ? {} : { 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  role="listitem"
                  aria-label={`Sector expertise: ${sector.name} in ${sector.category}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // Handle sector selection if needed
                    }
                  }}
                  {...createTouchHandler()}
                  style={{ 
                    willChange: shouldReduceMotion ? 'auto' : 'transform',
                    minHeight: isMobile ? '100px' : 'auto'
                  }}
                >
                  {/* Background gradient overlay for hover effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-purple-600/0 group-hover:from-purple-500/10 group-hover:via-blue-500/5 group-hover:to-purple-600/10 transition-all duration-500 rounded-xl" 
                    aria-hidden="true"
                  />
                  
                  {/* Animated border effect */}
                  <div 
                    className="absolute inset-0 rounded-xl border border-transparent group-hover:border-purple-300/30 transition-all duration-300" 
                    aria-hidden="true"
                  />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 
                      className={`font-semibold transition-colors duration-300 group-hover:text-purple-700 ${isMobile ? 'text-sm' : 'text-base'}`}
                      style={{ color: '#111827' }}
                      aria-level={3}
                    >
                      {sector.name}
                    </h3>
                    
                    {/* Subtle category indicator - always visible on mobile for better UX */}
                    <div className={`mt-2 transition-opacity duration-300 ${isMobile ? 'opacity-70' : 'opacity-0 group-hover:opacity-100'}`}>
                      <span 
                        className={`text-purple-600 font-medium uppercase tracking-wider ${isMobile ? 'text-xs' : 'text-xs'}`}
                        aria-label={`Category: ${sector.category}`}
                      >
                        {sector.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_30px_rgba(147,51,234,0.15)]" 
                    aria-hidden="true"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        </AnimationErrorBoundary>

        {/* Enhanced Statistics Section with Icons and Animations */}
        <AnimationErrorBoundary fallback={
          <section className="relative py-12">
            <div className="section-divider"></div>
            <h2 
              className="text-center mb-16"
              style={{ fontSize: 'var(--fs-h2-d)', lineHeight: 'var(--lh-h2)', fontWeight: 700, color: 'var(--color-primary-dark)' }}
            >
              Why Choose Us
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievementsData.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div key={achievement.id} className="card group relative overflow-hidden">
                    <div className="flex items-start space-x-4 relative z-10">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center border border-gray-200 bg-white text-[var(--color-primary)] flex-shrink-0">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600 leading-relaxed">
                          {achievement.text}
                        </p>
                        {achievement.metric && (
                          <div className="mt-3">
                            <span 
                              className="text-3xl font-bold block"
                              style={{ color: 'var(--color-primary-dark)' }}
                            >
                              {achievement.metric.value}
                            </span>
                            <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                              {achievement.metric.label}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        }>
          <motion.section 
            className="relative py-8 sm:py-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: isMobile ? 0.1 : 0.2 }}
            variants={animationVariants.containerVariants}
            role="region"
            aria-labelledby="achievements-heading"
          >
            {/* Section divider */}
            <div className="section-divider" aria-hidden="true"></div>
            
            <motion.h2 
              id="achievements-heading"
              className="text-center mb-8 sm:mb-12 lg:mb-16 px-4"
              style={{ 
                fontSize: isMobile ? 'var(--fs-h2-m)' : 'var(--fs-h2-d)', 
                lineHeight: 'var(--lh-h2)', 
                fontWeight: 700, 
                color: 'var(--color-primary-dark)' 
              }}
              variants={animationVariants.itemVariants}
            >
              Why Choose Us
            </motion.h2>
            
            {/* Enhanced Statistics Grid with Scroll-Triggered Animations */}
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
              role="list"
              aria-label="List of company achievements and capabilities"
            >
              {achievementsData.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    className="card group hover:bg-purple-500/10 relative overflow-hidden touch-manipulation"
                    initial={{ 
                      opacity: 0, 
                      y: shouldReduceMotion ? 0 : (isMobile ? 25 : 50), 
                      scale: shouldReduceMotion ? 1 : (isMobile ? 0.95 : 0.9) 
                    }}
                    whileInView={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: shouldReduceMotion 
                        ? { duration: 0.1 }
                        : { 
                            duration: isMobile ? 0.4 : 0.6,
                            delay: isMobile ? index * 0.1 : index * 0.15,
                            ease: "easeOut"
                          }
                    }}
                    viewport={{ once: true, amount: isMobile ? 0.2 : 0.3 }}
                    whileHover={shouldReduceMotion || isMobile ? {} : { 
                      scale: 1.02,
                      y: -5,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    role="listitem"
                    aria-label={`Achievement: ${achievement.text}`}
                    {...createTouchHandler(achievement.id)}
                    style={{ 
                      willChange: shouldReduceMotion ? 'auto' : 'transform',
                      padding: isMobile ? '1.25rem' : '1.5rem'
                    }}
                  >
                    {/* Animated background glow effect */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-purple-600/0 group-hover:from-purple-500/5 group-hover:via-blue-500/3 group-hover:to-purple-600/5 transition-all duration-500 rounded-xl" 
                      aria-hidden="true"
                    />
                    
                    {/* Enhanced border animation */}
                    <div 
                      className="absolute inset-0 rounded-xl border border-transparent group-hover:border-purple-300/20 transition-all duration-300" 
                      aria-hidden="true"
                    />
                    
                    <div className="flex items-start space-x-4 relative z-10">
                      {/* Enhanced Icon with Animation */}
                      <motion.div 
                        className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} rounded-xl flex items-center justify-center border border-gray-200 bg-white text-[var(--color-primary)] group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 flex-shrink-0`}
                        initial={{ 
                          rotate: shouldReduceMotion ? 0 : (isMobile ? -5 : -10), 
                          scale: shouldReduceMotion ? 1 : (isMobile ? 0.9 : 0.8) 
                        }}
                        whileInView={{ 
                          rotate: 0, 
                          scale: 1,
                          transition: shouldReduceMotion 
                            ? { duration: 0.1 }
                            : { 
                                duration: isMobile ? 0.3 : 0.5,
                                delay: isMobile ? index * 0.1 + 0.1 : index * 0.15 + 0.2,
                                ease: "easeOut"
                              }
                        }}
                        viewport={{ once: true }}
                        whileHover={shouldReduceMotion || isMobile ? {} : { 
                          rotate: 5,
                          transition: { duration: 0.2 }
                        }}
                        aria-hidden="true"
                        style={{ willChange: shouldReduceMotion ? 'auto' : 'transform' }}
                      >
                        <IconComponent className={isMobile ? 'h-5 w-5' : 'h-6 w-6'} />
                      </motion.div>
                      
                      <div className="flex-1">
                        {/* Achievement Text with Staggered Animation */}
                        <motion.p 
                          className="text-gray-600 leading-relaxed"
                          style={{
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            lineHeight: isMobile ? '1.6' : '1.5'
                          }}
                          initial={{ 
                            opacity: 0, 
                            x: shouldReduceMotion ? 0 : (isMobile ? 10 : 20) 
                          }}
                          whileInView={{ 
                            opacity: 1, 
                            x: 0,
                            transition: shouldReduceMotion 
                              ? { duration: 0.1 }
                              : { 
                                  duration: isMobile ? 0.3 : 0.5,
                                  delay: isMobile ? index * 0.1 + 0.2 : index * 0.15 + 0.3,
                                  ease: "easeOut"
                                }
                          }}
                          viewport={{ once: true }}
                        >
                          {achievement.text}
                        </motion.p>
                        
                        {/* Enhanced Metric Animation */}
                        {achievement.metric && (
                          <motion.div 
                            className="mt-3"
                            initial={{ 
                              opacity: 0, 
                              scale: shouldReduceMotion ? 1 : 0.8 
                            }}
                            whileInView={{ 
                              opacity: 1, 
                              scale: 1,
                              transition: shouldReduceMotion 
                                ? { duration: 0.1 }
                                : { 
                                    duration: 0.6,
                                    delay: index * 0.15 + 0.4,
                                    ease: "easeOut"
                                  }
                            }}
                            viewport={{ once: true }}
                            role="group"
                            aria-label={`Metric: ${achievement.metric.value} ${achievement.metric.label}`}
                          >
                            <motion.span 
                              className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold block`}
                              style={{ color: 'var(--color-primary-dark)' }}
                              whileHover={shouldReduceMotion || isMobile ? {} : { 
                                scale: 1.1,
                                transition: { duration: 0.2 }
                              }}
                              aria-label={`Value: ${achievement.metric.value}`}
                            >
                              {achievement.metric.value}
                            </motion.span>
                            <motion.span 
                              className={`text-gray-500 font-medium uppercase tracking-wider ${isMobile ? 'text-xs' : 'text-sm'}`}
                              initial={{ opacity: 0 }}
                              whileInView={{ 
                                opacity: 1,
                                transition: shouldReduceMotion 
                                  ? { duration: 0.1 }
                                  : { 
                                      duration: isMobile ? 0.3 : 0.4,
                                      delay: isMobile ? index * 0.1 + 0.4 : index * 0.15 + 0.6
                                    }
                              }}
                              viewport={{ once: true }}
                              aria-label={`Label: ${achievement.metric.label}`}
                            >
                              {achievement.metric.label}
                            </motion.span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
                    {/* Enhanced pulse effect and interaction indicators */}
                    {achievement.metric && !shouldReduceMotion && (
                      <motion.div
                        className="absolute top-4 right-4 w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        aria-hidden="true"
                      />
                    )}

                    {/* Interaction state indicator */}
                    <AnimatePresence>
                      {(interactionState.hoveredCard === achievement.id || interactionState.focusedCard === achievement.id) && (
                        <motion.div
                          className="absolute top-2 right-2"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <SparklesIcon className="w-4 h-4 text-purple-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        </AnimationErrorBoundary>
      </div>
    </motion.div>
  );
}


