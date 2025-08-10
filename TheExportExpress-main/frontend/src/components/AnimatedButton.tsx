import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  useRippleEffect, 
  useHoverState, 
  useFocusState, 
  useMorphingShape,
  usePerformanceAwareAnimations,
  useAccessibleFocus 
} from '../hooks/useMicroAnimations';

interface AnimatedButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  morphShape?: boolean;
  multiRipple?: boolean;
  glowEffect?: boolean;
  hoverAnimation?: 'lift' | 'tilt' | 'bounce' | 'scale';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  morphShape = false,
  multiRipple = false,
  glowEffect = true,
  hoverAnimation = 'lift',
}) => {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  
  // Use custom hooks for micro-animations
  const { ripples, createRipple } = useRippleEffect();
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverState();
  const { isFocusVisible, handleFocus, handleBlur } = useFocusState();
  const { startMorphing, stopMorphing } = useMorphingShape(['circle', 'square'], 300);
  const { getAnimationConfig } = usePerformanceAwareAnimations();
  const { getFocusClasses } = useAccessibleFocus();

  const handleMouseEnterWithRipple = () => {
    handleMouseEnter();
    if (morphShape) startMorphing();
  };

  const handleMouseLeaveWithRipple = () => {
    handleMouseLeave();
    if (morphShape) stopMorphing();
  };

  const handleClickWithRipple = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      createRipple(event);
      onClick?.();
    }
  };

  const baseClasses = getFocusClasses(`
    relative overflow-hidden font-medium transition-all duration-300 
    disabled:opacity-50 disabled:cursor-not-allowed
    ${hoverAnimation === 'lift' ? 'hover-lift' : ''}
    ${hoverAnimation === 'tilt' ? 'hover-tilt' : ''}
    ${hoverAnimation === 'bounce' ? 'hover-bounce' : ''}
    ${hoverAnimation === 'scale' ? 'micro-scale' : ''}
    ${glowEffect ? 'micro-glow' : ''}
    ${morphShape ? 'morph-circle' : ''}
    button-press
    ${className}
  `);

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#5C3D2E] to-[#6B4E71] text-white 
      hover:from-[#4A2F22] hover:to-[#5A4260] 
      focus:ring-[#5C3D2E] shadow-lg hover:shadow-xl
      border border-transparent
    `,
    secondary: `
      bg-gradient-to-r from-[#F5E9D4] to-[#FFF8E8] text-[#5C3D2E] 
      hover:from-[#E8D5B7] hover:to-[#F5E9D4] 
      focus:ring-[#F5E9D4] shadow-md hover:shadow-lg
      border border-[#D4C2A6]
    `,
    ghost: `
      bg-transparent text-[#5C3D2E] 
      hover:bg-[#F5E9D4] hover:bg-opacity-50
      focus:ring-[#5C3D2E] border border-[#5C3D2E]
    `,
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;

  const buttonContent = (
    <>
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        animate={getAnimationConfig({
          scale: isHovered ? 1.02 : 1,
        })}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.span>

      {/* Enhanced Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <React.Fragment key={ripple.id}>
            {/* Primary ripple */}
            <motion.span
              className="absolute rounded-full bg-white bg-opacity-40 pointer-events-none"
              style={{
                left: ripple.x - 15,
                top: ripple.y - 15,
                width: 30,
                height: 30,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={getAnimationConfig({ duration: 0.5, ease: "easeOut" })}
            />
            
            {/* Secondary ripple for multi-ripple effect */}
            {multiRipple && (
              <>
                <motion.span
                  className="absolute rounded-full bg-white bg-opacity-20 pointer-events-none"
                  style={{
                    left: ripple.x - 20,
                    top: ripple.y - 20,
                    width: 40,
                    height: 40,
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={getAnimationConfig({ duration: 0.7, ease: "easeOut", delay: 0.1 })}
                />
                <motion.span
                  className="absolute rounded-full bg-white bg-opacity-10 pointer-events-none"
                  style={{
                    left: ripple.x - 25,
                    top: ripple.y - 25,
                    width: 50,
                    height: 50,
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={getAnimationConfig({ duration: 0.9, ease: "easeOut", delay: 0.2 })}
                />
              </>
            )}
          </React.Fragment>
        ))}
      </AnimatePresence>

      {/* Enhanced Glow effect */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
          style={{
            background: variant === 'primary' 
              ? 'linear-gradient(135deg, rgba(92, 61, 46, 0.4), rgba(107, 78, 113, 0.4))'
              : 'linear-gradient(135deg, rgba(245, 233, 212, 0.6), rgba(255, 248, 232, 0.6))',
            filter: 'blur(12px)',
          }}
          animate={getAnimationConfig({
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.08 : 1,
          })}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Focus indicator for accessibility */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none border-2 border-transparent"
        animate={{
          borderColor: isFocusVisible ? '#5C3D2E' : 'transparent',
          boxShadow: isFocusVisible 
            ? '0 0 0 2px white, 0 0 0 4px #5C3D2E' 
            : '0 0 0 0px transparent',
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );

  const commonProps = {
    ref: buttonRef as any,
    className: buttonClasses,
    onMouseDown: handleClickWithRipple,
    onMouseEnter: handleMouseEnterWithRipple,
    onMouseLeave: handleMouseLeaveWithRipple,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onClick: handleClickWithRipple,
    disabled,
    'aria-pressed': isHovered,
    'aria-describedby': disabled ? 'button-disabled' : undefined,
  };

  if (to) {
    return (
      <Link to={to} {...commonProps}>
        {buttonContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} {...commonProps}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button {...commonProps}>
      {buttonContent}
    </button>
  );
};

// Specialized CTA button with enhanced animations
export const CTAButton: React.FC<Omit<AnimatedButtonProps, 'variant'> & {
  icon?: React.ReactNode;
  pulse?: boolean;
  morphingIcon?: boolean;
}> = ({ children, icon, pulse = false, morphingIcon = false, className = '', ...props }) => {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverState();
  const { getAnimationConfig } = usePerformanceAwareAnimations();

  return (
    <motion.div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={getAnimationConfig({ y: -4, scale: 1.02 })}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Pulse effect background */}
      {pulse && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#5C3D2E] to-[#6B4E71] rounded-lg opacity-75"
          animate={getAnimationConfig({
            scale: [1, 1.08, 1],
            opacity: [0.75, 0.4, 0.75],
          })}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Enhanced glow ring */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#5C3D2E] to-[#6B4E71] rounded-lg opacity-0"
        animate={getAnimationConfig({
          opacity: isHovered ? 0.3 : 0,
          scale: isHovered ? 1.1 : 1,
        })}
        style={{ filter: 'blur(20px)' }}
        transition={{ duration: 0.3 }}
      />
      
      <AnimatedButton
        variant="primary"
        className={`relative z-10 pulse-glow ${className}`}
        morphShape={true}
        multiRipple={true}
        hoverAnimation="lift"
        {...props}
      >
        {icon && (
          <motion.span 
            className={`mr-2 ${morphingIcon ? 'icon-bounce' : ''}`}
            animate={getAnimationConfig({
              rotate: isHovered && morphingIcon ? [0, 10, -10, 0] : 0,
              scale: isHovered && morphingIcon ? 1.1 : 1,
            })}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.span>
        )}
        {children}
      </AnimatedButton>
    </motion.div>
  );
};