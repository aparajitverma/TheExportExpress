import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', showTagline = false }) => {
  return (
    <Link to="/">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex flex-col ${className}`}
      >
        <div className="flex items-center space-x-2">
          {/* Logo Icon */}
          <div className="w-10 h-10 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#a259ff] to-white opacity-20 rounded-lg blur-sm"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <span className="text-2xl font-bold text-black">E</span>
            </div>
          </div>
          
          {/* Logo Text */}
          <div className="text-2xl font-bold bg-gradient-to-r from-white via-[#a259ff] to-white bg-clip-text text-transparent drop-shadow-[0_0_8px_#a259ff80]">
            <span className="text-[#a259ff]"></span>
          </div>
        </div>
        
        {showTagline && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm text-gray-400 mt-1"
          >
            Connecting Excellence Globally
          </motion.p>
        )}
      </motion.div>
    </Link>
  );
};

export default Logo;
