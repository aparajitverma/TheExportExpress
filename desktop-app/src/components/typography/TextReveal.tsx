import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  speed?: 'fast' | 'normal' | 'slow';
  triggerOnce?: boolean;
  threshold?: number;
}

/**
 * TextReveal component with intersection observer trigger
 * Requirements: 2.4 - Create text reveal animation components and keyframes
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className = '',
  delay = 0,
  speed = 'normal',
  triggerOnce = true,
  threshold = 0.1,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const { ref, isIntersecting: isVisible } = useIntersectionObserver({ threshold, triggerOnce });

  useEffect(() => {
    if (isVisible && !isRevealed) {
      const timer = setTimeout(() => {
        setIsRevealed(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, delay, isRevealed]);

  const speedClass = speed === 'fast' ? 'text-reveal-fast' : speed === 'slow' ? 'text-reveal-slow' : '';
  const revealClass = isRevealed ? `text-reveal ${speedClass}` : '';

  return (
    <span
      ref={ref}
      className={`${revealClass} ${className}`.trim()}
    >
      {children}
    </span>
  );
};

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn';
  delay?: number;
  triggerOnce?: boolean;
  threshold?: number;
}

/**
 * AnimatedText component for various text entrance animations
 * Requirements: 2.4 - Create text reveal animation components and keyframes
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0,
  triggerOnce = true,
  threshold = 0.1,
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const { ref, isIntersecting: isVisible } = useIntersectionObserver({ threshold, triggerOnce });

  useEffect(() => {
    if (isVisible && !isAnimated) {
      const timer = setTimeout(() => {
        setIsAnimated(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, delay, isAnimated]);

  const animationClass = isAnimated ? `text-${animation}` : '';
  const delayClass = delay > 0 ? `text-${animation}-delay-${Math.min(Math.floor(delay / 200), 4)}` : '';

  return (
    <span
      ref={ref}
      className={`${animationClass} ${delayClass} ${className}`.trim()}
    >
      {children}
    </span>
  );
};

interface StaggeredTextProps {
  text: string;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn';
  staggerDelay?: number;
  triggerOnce?: boolean;
  threshold?: number;
  splitBy?: 'word' | 'character';
}

/**
 * StaggeredText component for staggered text animations
 * Requirements: 2.4 - Create text reveal animation components and keyframes
 */
export const StaggeredText: React.FC<StaggeredTextProps> = ({
  text,
  className = '',
  animation = 'fadeIn',
  staggerDelay = 100,
  triggerOnce = true,
  threshold = 0.1,
  splitBy = 'word',
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const { ref, isIntersecting: isVisible } = useIntersectionObserver({ threshold, triggerOnce });

  useEffect(() => {
    if (isVisible && !isAnimated) {
      setIsAnimated(true);
    }
  }, [isVisible, isAnimated]);

  const splitText = splitBy === 'word' ? text.split(' ') : text.split('');

  return (
    <span ref={ref} className={className}>
      {splitText.map((item, index) => {
        const delay = isAnimated ? index * staggerDelay : 0;
        const animationClass = isAnimated ? `text-${animation}` : '';
        const delayClass = delay > 0 ? `text-${animation}-delay-${Math.min(Math.floor(delay / 200), 4)}` : '';
        
        return (
          <span
            key={index}
            className={`${animationClass} ${delayClass}`.trim()}
            style={{ 
              animationDelay: `${delay}ms`,
              display: 'inline-block',
              marginRight: splitBy === 'word' ? '0.25em' : '0'
            }}
          >
            {item}
            {splitBy === 'word' && index < splitText.length - 1 && ' '}
          </span>
        );
      })}
    </span>
  );
};