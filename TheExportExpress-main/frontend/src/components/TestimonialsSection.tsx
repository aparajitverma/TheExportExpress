import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationTrigger } from '../hooks/useIntersectionObserver';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  position: string;
  company: string;
  rating: number;
  image?: string;
  location?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
  position: 'prev' | 'current' | 'next';
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, position }) => {
  const getCardTransform = () => {
    switch (position) {
      case 'prev':
        return {
          x: -300,
          rotateY: -45,
          scale: 0.8,
          opacity: 0.4,
          z: -200
        };
      case 'current':
        return {
          x: 0,
          rotateY: 0,
          scale: 1,
          opacity: 1,
          z: 0
        };
      case 'next':
        return {
          x: 300,
          rotateY: 45,
          scale: 0.8,
          opacity: 0.4,
          z: -200
        };
      default:
        return {
          x: 0,
          rotateY: 0,
          scale: 0.6,
          opacity: 0,
          z: -400
        };
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <motion.i
        key={index}
        className={`fas fa-star text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          type: "spring",
          stiffness: 200
        }}
      />
    ));
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={getCardTransform()}
      transition={{
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      style={{ perspective: 1000 }}
    >
      <div className="relative w-full max-w-2xl mx-4">
        {/* Glassmorphism card */}
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center">
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-xl border border-white/30 rounded-3xl"></div>
          
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 transition-opacity duration-500 rounded-3xl group-hover:opacity-100"></div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 shadow-2xl shadow-purple-500/20 group-hover:opacity-100"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Animated quote marks */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <i className="fas fa-quote-left text-4xl text-purple-400/60"></i>
            </motion.div>
            
            {/* Quote text */}
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed font-medium"
            >
              "{testimonial.quote}"
            </motion.blockquote>
            
            {/* Star rating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center space-x-1 mb-6"
            >
              {renderStars(testimonial.rating)}
            </motion.div>
            
            {/* Author info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col items-center"
            >
              {/* Author photo placeholder or initials */}
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
                {testimonial.image ? (
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  testimonial.author.split(' ').map(n => n[0]).join('')
                )}
              </div>
              
              <h4 className="text-xl font-bold text-gray-800 mb-1">
                {testimonial.author}
              </h4>
              <p className="text-purple-600 font-medium mb-1">
                {testimonial.position}
              </p>
              <p className="text-gray-600">
                {testimonial.company}
              </p>
              {testimonial.location && (
                <p className="text-sm text-gray-500 mt-1">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  {testimonial.location}
                </p>
              )}
            </motion.div>
            
            {/* Closing quote marks */}
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-6 flex justify-end"
            >
              <i className="fas fa-quote-right text-4xl text-purple-400/60"></i>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection: React.FC = () => {
  const [sectionRef, isVisible] = useAnimationTrigger({
    threshold: 0.2,
    rootMargin: '-50px'
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Sample testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "The Export Express has revolutionized our international trade operations. Their AI-powered insights helped us identify new markets and increase our export volume by 300% in just one year.",
      author: "Rajesh Kumar",
      position: "Export Director",
      company: "Global Spices Ltd.",
      rating: 5,
      location: "Mumbai, India"
    },
    {
      id: 2,
      quote: "Outstanding service and support! The platform's real-time market intelligence has been invaluable for making informed decisions. We've expanded to 15 new countries with their guidance.",
      author: "Sarah Chen",
      position: "International Trade Manager",
      company: "TechExport Solutions",
      rating: 5,
      location: "Singapore"
    },
    {
      id: 3,
      quote: "The Export Express team understands the complexities of global trade. Their comprehensive approach and cutting-edge technology have streamlined our entire export process.",
      author: "Mohammed Al-Rashid",
      position: "CEO",
      company: "Middle East Trading Co.",
      rating: 5,
      location: "Dubai, UAE"
    },
    {
      id: 4,
      quote: "Exceptional platform with incredible results. The automated workflows and intelligent routing have reduced our processing time by 60% while improving accuracy significantly.",
      author: "Elena Rodriguez",
      position: "Operations Head",
      company: "Latin America Exports",
      rating: 5,
      location: "São Paulo, Brazil"
    },
    {
      id: 5,
      quote: "Working with The Export Express has been a game-changer. Their expertise in global markets and innovative solutions have helped us achieve unprecedented growth in international sales.",
      author: "James Thompson",
      position: "International Sales Director",
      company: "European Trade Partners",
      rating: 5,
      location: "London, UK"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isVisible, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    const total = testimonials.length;
    
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + total) % total;
      const position = i === -1 ? 'prev' : i === 0 ? 'current' : 'next';
      visible.push({
        testimonial: testimonials[index],
        position: position as 'prev' | 'current' | 'next',
        index
      });
    }
    
    return visible;
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 px-4 overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50/30"></div>
      
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Background testimonial text as decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl font-bold text-purple-100/30 transform -rotate-12">
          "Excellence"
        </div>
        <div className="absolute bottom-20 right-20 text-4xl font-bold text-blue-100/30 transform rotate-12">
          "Trusted"
        </div>
        <div className="absolute top-1/3 right-10 text-5xl font-bold text-purple-100/20 transform rotate-45">
          "Global"
        </div>
        <div className="absolute bottom-1/3 left-20 text-3xl font-bold text-blue-100/25 transform -rotate-45">
          "Innovation"
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how businesses worldwide are transforming their export operations with The Export Express
          </p>
        </motion.div>

        {/* 3D Carousel */}
        <div className="relative h-96 md:h-[500px] mb-12" style={{ perspective: '1000px' }}>
          <AnimatePresence mode="wait">
            {getVisibleTestimonials().map(({ testimonial, position }) => (
              <TestimonialCard
                key={`${testimonial.id}-${currentIndex}`}
                testimonial={testimonial}
                isActive={position === 'current'}
                position={position}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center items-center space-x-8"
        >
          {/* Previous button */}
          <motion.button
            onClick={prevTestimonial}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-chevron-left"></i>
          </motion.button>

          {/* Dots indicator */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Next button */}
          <motion.button
            onClick={nextTestimonial}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-chevron-right"></i>
          </motion.button>
        </motion.div>

        {/* Auto-play indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center mt-8"
        >
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <i className={`fas ${isAutoPlaying ? 'fa-play' : 'fa-pause'} text-purple-500`}></i>
            <span>
              {isAutoPlaying ? 'Auto-playing' : 'Paused'} • Hover to pause
            </span>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex justify-center mt-16"
        >
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;