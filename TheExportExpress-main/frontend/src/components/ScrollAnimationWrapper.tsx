import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation, useParallax, useDeviceAnimations } from '../hooks/useScrollAnimations';

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate' | 'custom';
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
  parallax?: boolean;
  parallaxSpeed?: number;
  stagger?: boolean;
  staggerDelay?: number;
  customVariants?: {
    hidden: any;
    visible: any;
  };
}

export const ScrollAnimationWrapper: React.FC<ScrollAnimationWrapperProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration,
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  parallax = false,
  parallaxSpeed = 0.5,
  stagger = false,
  staggerDelay = 0.1,
  customVariants
}) => {
  const [ref, isVisible] = useScrollAnimation({
    threshold,
    triggerOnce
  });

  const { deviceType, reducedMotion, getAnimationConfig } = useDeviceAnimations();
  const animConfig = getAnimationConfig();
  
  const finalDuration = duration || animConfig.duration;
  const finalStaggerDelay = stagger ? (staggerDelay || animConfig.stagger) : 0;

  const parallaxProps = useParallax(parallaxSpeed);

  // Animation variants
  const variants = customVariants || {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideUp: {
      hidden: { opacity: 0, y: 60 },
      visible: { opacity: 1, y: 0 }
    },
    slideDown: {
      hidden: { opacity: 0, y: -60 },
      visible: { opacity: 1, y: 0 }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 60 },
      visible: { opacity: 1, x: 0 }
    },
    slideRight: {
      hidden: { opacity: 0, x: -60 },
      visible: { opacity: 1, x: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    rotate: {
      hidden: { opacity: 0, rotate: -180, scale: 0.8 },
      visible: { opacity: 1, rotate: 0, scale: 1 }
    }
  }[animation] || customVariants;

  const motionProps = {
    ref: parallax ? parallaxProps.ref : ref,
    className,
    initial: "hidden",
    animate: isVisible ? "visible" : "hidden",
    variants,
    transition: {
      duration: finalDuration,
      delay: delay + finalStaggerDelay,
      ease: animConfig.ease,
      ...(reducedMotion && { duration: 0.01, ease: 'linear' })
    },
    ...(parallax && {
      style: {
        y: parallaxProps.y,
        opacity: parallaxProps.opacity
      }
    })
  };

  return (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  );
};

export const StaggeredScrollAnimation: React.FC<{
  children: React.ReactNode[];
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale';
  staggerDelay?: number;
  threshold?: number;
  className?: string;
}> = ({
  children,
  animation = 'slideUp',
  staggerDelay = 0.1,
  threshold = 0.1,
  className = ''
}) => {
  const [ref, isVisible] = useScrollAnimation({ threshold, triggerOnce: true });
  const { getAnimationConfig } = useDeviceAnimations();
  const animConfig = getAnimationConfig();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay || animConfig.stagger
      }
    }
  };

  const itemVariants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideUp: {
      hidden: { opacity: 0, y: 60 },
      visible: { opacity: 1, y: 0 }
    },
    slideDown: {
      hidden: { opacity: 0, y: -60 },
      visible: { opacity: 1, y: 0 }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 60 },
      visible: { opacity: 1, x: 0 }
    },
    slideRight: {
      hidden: { opacity: 0, x: -60 },
      visible: { opacity: 1, x: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    }
  }[animation];

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          transition={{
            duration: animConfig.duration,
            ease: animConfig.ease
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export const ParallaxBackground: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
  offset?: [string, string];
}> = ({
  children,
  speed = 0.5,
  className = '',
  offset = ["start end", "end start"]
}) => {
  const { ref, y, opacity } = useParallax(speed, offset);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  );
};

export const ScrollRevealText: React.FC<{
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}> = ({
  text,
  className = '',
  delay = 0,
  staggerDelay = 0.05
}) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.5, triggerOnce: true });
  const { getAnimationConfig } = useDeviceAnimations();
  const animConfig = getAnimationConfig();

  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay
      }
    }
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: animConfig.duration,
        ease: animConfig.ease
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export const ScrollTriggeredCounter: React.FC<{
  from: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}> = ({
  from,
  to,
  duration = 2,
  className = '',
  suffix = '',
  prefix = ''
}) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.5, triggerOnce: true });
  const [count, setCount] = React.useState(from);

  React.useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function (ease out quart)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(from + (to - from) * easeOutQuart);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, from, to, duration]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.div>
  );
};