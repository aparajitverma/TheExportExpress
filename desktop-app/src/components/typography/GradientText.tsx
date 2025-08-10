import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  animated?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * GradientText component for gradient text effects
 * Requirements: 2.2 - Implement gradient text effects with CSS classes and animations
 */
export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  gradient = 'primary',
  animated = true,
  as: Component = 'span',
}) => {
  const gradientClass = animated 
    ? `text-gradient-${gradient}` 
    : 'text-gradient-static';

  return (
    <Component className={`${gradientClass} ${className}`.trim()}>
      {children}
    </Component>
  );
};

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-large' | 'body-normal' | 'body-small' | 'caption' | 'label';
  gradient?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  animated?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Enhanced Typography component with gradient and shadow effects
 * Requirements: 2.1, 2.2 - Enhanced font hierarchy with gradient text effects
 */
export const Typography: React.FC<TypographyProps> = ({
  children,
  className = '',
  variant = 'body-normal',
  gradient,
  animated = true,
  shadow,
  as,
}) => {
  // Determine the appropriate HTML element based on variant
  const getDefaultElement = (variant: string): keyof JSX.IntrinsicElements => {
    switch (variant) {
      case 'hero':
      case 'h1':
        return 'h1';
      case 'h2':
        return 'h2';
      case 'h3':
        return 'h3';
      case 'h4':
        return 'h4';
      case 'h5':
        return 'h5';
      case 'h6':
        return 'h6';
      case 'caption':
      case 'label':
        return 'span';
      default:
        return 'p';
    }
  };

  const Component = as || getDefaultElement(variant);
  
  // Build class names
  const variantClass = `heading-${variant}` || variant;
  const gradientClass = gradient 
    ? (animated ? `text-gradient-${gradient}` : 'text-gradient-static')
    : '';
  const shadowClass = shadow ? `text-shadow-${shadow}` : '';

  const combinedClassName = [
    variantClass,
    gradientClass,
    shadowClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={combinedClassName}>
      {children}
    </Component>
  );
};

interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  sizes: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  as?: keyof JSX.IntrinsicElements;
}

/**
 * ResponsiveText component for responsive typography scaling
 * Requirements: 7.2 - Add responsive typography scaling for different screen sizes
 */
export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  className = '',
  sizes,
  as: Component = 'span',
}) => {
  // Generate responsive classes
  const responsiveClasses = [
    sizes.mobile && `text-${sizes.mobile}`,
    sizes.tablet && `md:text-${sizes.tablet}`,
    sizes.desktop && `lg:text-${sizes.desktop}`,
  ].filter(Boolean).join(' ');

  return (
    <Component className={`${responsiveClasses} ${className}`.trim()}>
      {children}
    </Component>
  );
};

// Preset typography components for common use cases
export const HeroTitle: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="hero" as="h1" />
);

export const SectionTitle: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="h2" as="h2" />
);

export const SubsectionTitle: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="h3" as="h3" />
);

export const BodyText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="body-normal" as="p" />
);

export const LargeText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="body-large" as="p" />
);

export const SmallText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="body-small" as="p" />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="caption" as="span" />
);

export const Label: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="label" as="span" />
);