import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#181818] to-[#212121] flex flex-col items-center justify-center px-4 text-white" style={{ fontFamily: 'Montserrat, Roboto, "DIN Next Pro", Arial, sans-serif' }}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-7xl font-bold uppercase tracking-widest bg-gradient-to-r from-white to-[#CCCCCC] bg-clip-text text-transparent mb-6 text-center"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl text-[#CCCCCC] mb-8 text-center font-light"
      >
        Sorry, the page you are looking for does not exist.
      </motion.p>
      <Link
        to="/"
        className="px-8 py-3 bg-[#D32F2F] text-white rounded-full hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-2xl font-bold uppercase tracking-widest text-lg"
      >
        Go Home
      </Link>
    </div>
  );
}