import { useState, useEffect } from 'react';
import { useDeviceDetection } from './useDeviceDetection';

interface TypographyScale {
  mobile: Record<string, string>;
  tablet: Record<string, string>;
  desktop: Record<string, string>;
}

/**
 * Custom hook for responsive typography scaling
 * Requirements: 7.2 - Add responsive typography scaling for different screen sizes
 */
export const useResponsiveTypography = () => {
  const { deviceType } = useDeviceDetection();
  const [typographyScale, setTypographyScale] = useState<TypographyScale>({
    mobile: {
      'text-xs': '0.7rem',
      'text-sm': '0.8rem',
      'text-base': '0.9rem',
      'text-lg': '1rem',
      'text-xl': '1.125rem',
      'text-2xl': '1.25rem',
      'text-3xl': '1.5rem',
      'text-4xl': '1.875rem',
      'text-5xl': '2.25rem',
      'text-6xl': '2.75rem',
      'text-7xl': '3.25rem',
      'text-8xl': '4rem',
      'text-9xl': '5rem',
    },
    tablet: {
      'text-xs': '0.75rem',
      'text-sm': '0.875rem',
      'text-base': '1rem',
      'text-lg': '1.125rem',
      'text-xl': '1.25rem',
      'text-2xl': '1.5rem',
      'text-3xl': '1.875rem',
      'text-4xl': '2.25rem',
      'text-5xl': '2.75rem',
      'text-6xl': '3.25rem',
      'text-7xl': '3.75rem',
      'text-8xl': '5rem',
      'text-9xl': '6.5rem',
    },
    desktop: {
      'text-xs': '0.75rem',
      'text-sm': '0.875rem',
      'text-base': '1rem',
      'text-lg': '1.125rem',
      'text-xl': '1.25rem',
      'text-2xl': '1.5rem',
      'text-3xl': '1.875rem',
      'text-4xl': '2.25rem',
      'text-5xl': '3rem',
      'text-6xl': '3.75rem',
      'text-7xl': '4.5rem',
      'text-8xl': '6rem',
      'text-9xl': '8rem',
    },
  });

  /**
   * Get the appropriate font size for the current device
   */
  const getFontSize = (size: string): string => {
    const currentScale = typographyScale[deviceType];
    return currentScale[size] || size;
  };

  /**
   * Get responsive class names for a given size
   */
  const getResponsiveClasses = (
    mobileSize: string,
    tabletSize?: string,
    desktopSize?: string
  ): string => {
    const classes = [mobileSize];
    
    if (tabletSize) {
      classes.push(`md:${tabletSize}`);
    }
    
    if (desktopSize) {
      classes.push(`lg:${desktopSize}`);
    }
    
    return classes.join(' ');
  };

  /**
   * Apply responsive typography styles dynamically
   */
  const applyResponsiveStyles = () => {
    const root = document.documentElement;
    const currentScale = typographyScale[deviceType];
    
    Object.entries(currentScale).forEach(([className, size]) => {
      const cssVariable = `--${className}`;
      root.style.setProperty(cssVariable, size);
    });
  };

  useEffect(() => {
    applyResponsiveStyles();
  }, [deviceType, typographyScale]);

  return {
    deviceType,
    typographyScale,
    getFontSize,
    getResponsiveClasses,
    applyResponsiveStyles,
  };
};

/**
 * Hook for getting optimal line height based on font size and device
 */
export const useResponsiveLineHeight = () => {
  const { deviceType } = useDeviceDetection();

  const getLineHeight = (fontSize: string): number => {
    const sizeMap: Record<string, number> = {
      'text-xs': deviceType === 'mobile' ? 1.4 : 1.3,
      'text-sm': deviceType === 'mobile' ? 1.5 : 1.4,
      'text-base': deviceType === 'mobile' ? 1.6 : 1.5,
      'text-lg': deviceType === 'mobile' ? 1.6 : 1.5,
      'text-xl': deviceType === 'mobile' ? 1.5 : 1.4,
      'text-2xl': deviceType === 'mobile' ? 1.4 : 1.3,
      'text-3xl': deviceType === 'mobile' ? 1.3 : 1.25,
      'text-4xl': deviceType === 'mobile' ? 1.2 : 1.1,
      'text-5xl': deviceType === 'mobile' ? 1.1 : 1.0,
      'text-6xl': deviceType === 'mobile' ? 1.0 : 0.9,
    };

    return sizeMap[fontSize] || 1.5;
  };

  return { getLineHeight };
};

/**
 * Hook for managing typography spacing based on device
 */
export const useResponsiveSpacing = () => {
  const { deviceType } = useDeviceDetection();

  const getSpacing = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'): string => {
    const spacingMap: Record<string, Record<string, string>> = {
      mobile: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2.5rem',
        '3xl': '3rem',
      },
      tablet: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1.25rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      desktop: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2.5rem',
        xl: '3rem',
        '2xl': '4rem',
        '3xl': '5rem',
      },
    };

    return spacingMap[deviceType][size] || spacingMap.desktop[size];
  };

  const getMarginClasses = (
    mobileSize: string,
    tabletSize?: string,
    desktopSize?: string
  ): string => {
    const classes = [`m-${mobileSize}`];
    
    if (tabletSize) {
      classes.push(`md:m-${tabletSize}`);
    }
    
    if (desktopSize) {
      classes.push(`lg:m-${desktopSize}`);
    }
    
    return classes.join(' ');
  };

  const getPaddingClasses = (
    mobileSize: string,
    tabletSize?: string,
    desktopSize?: string
  ): string => {
    const classes = [`p-${mobileSize}`];
    
    if (tabletSize) {
      classes.push(`md:p-${tabletSize}`);
    }
    
    if (desktopSize) {
      classes.push(`lg:p-${desktopSize}`);
    }
    
    return classes.join(' ');
  };

  return {
    getSpacing,
    getMarginClasses,
    getPaddingClasses,
  };
};