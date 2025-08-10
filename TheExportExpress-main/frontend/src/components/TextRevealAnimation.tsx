import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  trigger?: 'viewport' | 'immediate';
  threshold?: number;
}

export const TextRevealAnimation: React.FC<TextRevealAnimationProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 1.5,
  direction = 'right',
  trigger = 'viewport',
  threshold = 0.1
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const [shouldAnimate, setShouldAnimate] = useState(trigger === 'immediate');

  useEffect(() => {
    if (trigger === 'viewport' && isInView) {
      setShouldAnimate(true);
    }
  }, [isInView, trigger]);

  const getRevealDirection = () => {
    switch (direction) {
      case 'left':
        return { x: '-100%' };
      case 'right':
        return { x: '100%' };
      case 'up':
        return { y: '-100%' };
      case 'down':
        return { y: '100%' };
      default:
        return { x: '100%' };
    }
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden inline-block ${className}`}
    >
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.1, delay: delay + duration }}
      >
        {children}
      </motion.div>
      
      <motion.div
        className="absolute inset-0 z-20 bg-gradient-to-r from-[#5C3D2E] via-[#8B6F47] to-[#6B4E71]"
        initial={getRevealDirection()}
        animate={shouldAnimate ? { 
          x: direction === 'left' ? '100%' : direction === 'right' ? '100%' : 0,
          y: direction === 'up' ? '100%' : direction === 'down' ? '100%' : 0
        } : getRevealDirection()}
        transition={{
          duration,
          delay,
          ease: [0.4, 0, 0.2, 1]
        }}
      />
    </div>
  );
};

interface StaggeredTextRevealProps {
  text: string;
  className?: string;
  wordDelay?: number;
  revealDuration?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  trigger?: 'viewport' | 'immediate';
  threshold?: number;
}

export const StaggeredTextReveal: React.FC<StaggeredTextRevealProps> = ({
  text,
  className = '',
  wordDelay = 0.1,
  revealDuration = 0.8,
  direction = 'right',
  trigger = 'viewport',
  threshold = 0.1
}) => {
  const words = text.split(' ');

  return (
    <div className={`inline-block ${className}`}>
      {words.map((word, index) => (
        <span key={index} className="inline-block mr-2">
          <TextRevealAnimation
            delay={index * wordDelay}
            duration={revealDuration}
            direction={direction}
            trigger={trigger}
            threshold={threshold}
          >
            {word}
          </TextRevealAnimation>
        </span>
      ))}
    </div>
  );
};

interface CharacterRevealProps {
  text: string;
  className?: string;
  charDelay?: number;
  revealDuration?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  trigger?: 'viewport' | 'immediate';
  threshold?: number;
}

export const CharacterReveal: React.FC<CharacterRevealProps> = ({
  text,
  className = '',
  charDelay = 0.05,
  revealDuration = 0.6,
  direction = 'right',
  trigger = 'viewport',
  threshold = 0.1
}) => {
  const characters = text.split('');

  return (
    <div className={`inline-block ${className}`}>
      {characters.map((char, index) => (
        <span key={index} className="inline-block">
          <TextRevealAnimation
            delay={index * charDelay}
            duration={revealDuration}
            direction={direction}
            trigger={trigger}
            threshold={threshold}
          >
            {char === ' ' ? '\u00A0' : char}
          </TextRevealAnimation>
        </span>
      ))}
    </div>
  );
};

interface LineRevealProps {
  lines: string[];
  className?: string;
  lineDelay?: number;
  revealDuration?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  trigger?: 'viewport' | 'immediate';
  threshold?: number;
}

export const LineReveal: React.FC<LineRevealProps> = ({
  lines,
  className = '',
  lineDelay = 0.3,
  revealDuration = 1.2,
  direction = 'right',
  trigger = 'viewport',
  threshold = 0.1
}) => {
  return (
    <div className={className}>
      {lines.map((line, index) => (
        <div key={index} className="block">
          <TextRevealAnimation
            delay={index * lineDelay}
            duration={revealDuration}
            direction={direction}
            trigger={trigger}
            threshold={threshold}
          >
            {line}
          </TextRevealAnimation>
        </div>
      ))}
    </div>
  );
};

export default TextRevealAnimation;