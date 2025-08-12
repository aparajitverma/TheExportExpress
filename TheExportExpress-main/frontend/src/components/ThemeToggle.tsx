import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon 
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'button' | 'dropdown' | 'segmented';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md',
  showLabel = false,
  variant = 'button'
}) => {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const themes = [
    { 
      id: 'light' as const, 
      label: 'Light', 
      icon: SunIcon,
      description: 'Light theme'
    },
    { 
      id: 'dark' as const, 
      label: 'Dark', 
      icon: MoonIcon,
      description: 'Dark theme'
    },
    { 
      id: 'system' as const, 
      label: 'System', 
      icon: ComputerDesktopIcon,
      description: 'Follow system preference'
    }
  ];

  const currentTheme = themes.find(t => t.id === theme);
  const CurrentIcon = currentTheme?.icon || SunIcon;

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <div className="group">
          <button
            onClick={toggleTheme}
            className={`
              ${sizeClasses[size]} 
              rounded-lg border border-gray-200 dark:border-gray-700 
              bg-white dark:bg-gray-800 
              text-gray-700 dark:text-gray-300
              hover:bg-gray-50 dark:hover:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-all duration-200
              touch-manipulation
            `}
            aria-label={`Current theme: ${currentTheme?.label}. Click to cycle themes.`}
            title={currentTheme?.description}
          >
            <motion.div
              key={theme}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentIcon className={iconSizeClasses[size]} />
            </motion.div>
          </button>
          
          {showLabel && (
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentTheme?.label}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'segmented') {
    return (
      <div className={`inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 ${className}`}>
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isActive = theme === themeOption.id;
          
          return (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`
                relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                touch-manipulation
                ${isActive 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }
              `}
              aria-label={themeOption.description}
              title={themeOption.description}
            >
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                {showLabel && <span>{themeOption.label}</span>}
              </div>
              
              {isActive && (
                <motion.div
                  layoutId="activeTheme"
                  className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md shadow-sm -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default button variant
  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={toggleTheme}
        className={`
          ${sizeClasses[size]} 
          rounded-lg border border-gray-200 dark:border-gray-700 
          bg-white dark:bg-gray-800 
          text-gray-700 dark:text-gray-300
          hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-all duration-200
          touch-manipulation
          relative overflow-hidden
        `}
        aria-label={`Current theme: ${currentTheme?.label}. Click to cycle themes.`}
        title={currentTheme?.description}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <CurrentIcon className={iconSizeClasses[size]} />
          </motion.div>
        </AnimatePresence>
        
        {/* Theme indicator */}
        <div className={`
          absolute bottom-0 right-0 w-2 h-2 rounded-full
          ${actualTheme === 'dark' ? 'bg-blue-500' : 'bg-yellow-500'}
          transition-colors duration-200
        `} />
      </button>
      
      {showLabel && (
        <motion.span 
          key={theme}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {currentTheme?.label}
        </motion.span>
      )}
    </div>
  );
};

export default ThemeToggle;