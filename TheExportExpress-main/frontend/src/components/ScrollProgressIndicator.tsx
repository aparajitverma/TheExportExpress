import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ScrollProgressIndicatorProps {
  className?: string;
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
  showPercentage?: boolean;
  style?: 'line' | 'circle' | 'dots';
}

export const ScrollProgressIndicator: React.FC<ScrollProgressIndicatorProps> = ({
  className = '',
  color = '#5C3D2E',
  height = 4,
  position = 'top',
  showPercentage = false,
  style = 'line'
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (style === 'line') {
    return (
      <motion.div
        className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 ${className}`}
        style={{
          height: `${height}px`,
          backgroundColor: `${color}20`,
        }}
      >
        <motion.div
          className="h-full origin-left"
          style={{
            scaleX,
            backgroundColor: color,
          }}
        />
        {showPercentage && (
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-medium"
            style={{ color }}
          >
            <motion.span>
              {Math.round(scrollYProgress.get() * 100)}%
            </motion.span>
          </motion.div>
        )}
      </motion.div>
    );
  }

  if (style === 'circle') {
    return (
      <motion.div
        className={`fixed bottom-8 right-8 z-50 ${className}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="relative w-16 h-16">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={`${color}20`}
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              style={{
                pathLength: scrollYProgress,
                strokeDasharray: "283", // 2 * π * 45
                strokeDashoffset: 0,
              }}
            />
          </svg>
          {showPercentage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-xs font-bold"
                style={{ color }}
              >
                {Math.round(scrollYProgress.get() * 100)}%
              </motion.span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (style === 'dots') {
    const dotCount = 10;
    const dots = Array.from({ length: dotCount }, (_, i) => i);

    return (
      <motion.div
        className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-2 ${className}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        {dots.map((dot, index) => (
          <motion.div
            key={dot}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: scrollYProgress.get() > index / dotCount ? color : `${color}30`,
              scale: scrollYProgress.get() > index / dotCount ? 1.2 : 1,
            }}
          />
        ))}
      </motion.div>
    );
  }

  return null;
};

export const ScrollToTopButton: React.FC<{
  className?: string;
  color?: string;
  threshold?: number;
}> = ({
  className = '',
  color = '#5C3D2E',
  threshold = 0.2
}) => {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setIsVisible(latest > threshold);
    });

    return unsubscribe;
  }, [scrollYProgress, threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      className={`fixed bottom-8 left-8 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${className}`}
      style={{
        backgroundColor: color,
        color: 'white',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={scrollToTop}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </motion.button>
  );
};

export const SectionProgressIndicator: React.FC<{
  sections: string[];
  className?: string;
  color?: string;
}> = ({
  sections,
  className = '',
  color = '#5C3D2E'
}) => {
  const [activeSection, setActiveSection] = React.useState(0);

  React.useEffect(() => {
    const sectionElements = sections.map(id => document.getElementById(id)).filter(Boolean);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionElements.findIndex(el => el === entry.target);
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    sectionElements.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(sections[index]);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <motion.div
      className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-50 ${className}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5 }}
    >
      <div className="flex flex-col space-y-4">
        {sections.map((section, index) => (
          <motion.button
            key={section}
            className="relative group"
            onClick={() => scrollToSection(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeSection
                  ? 'scale-125'
                  : 'scale-100 opacity-50'
              }`}
              style={{
                backgroundColor: index === activeSection ? color : `${color}50`,
              }}
            />
            <div
              className={`absolute right-6 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                index === activeSection
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
              style={{
                backgroundColor: color,
                color: 'white',
              }}
            >
              {section.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};