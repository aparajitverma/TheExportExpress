/**
 * Example component demonstrating the animation utilities
 */

import React from 'react';
import { Box, Text, VStack, HStack, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Import our custom hooks
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useTypewriter } from '../hooks/useTypewriter';
import { useCountingAnimation } from '../hooks/useCountingAnimation';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

// Import animation constants
import { MOTION_VARIANTS, ANIMATION_DURATIONS } from '../utils/animation-constants';

const MotionBox = motion(Box);
const MotionText = motion(Text);

export const AnimationExample: React.FC = () => {
  // Device detection
  const { deviceType, animationsDisabled } = useDeviceDetection();
  
  // Performance monitoring
  const { metrics } = usePerformanceMonitor({ autoStart: true });
  
  // Intersection observer for scroll animations
  const { ref: scrollRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true,
  });
  
  // Typewriter effect
  const typewriter = useTypewriter([
    'Welcome to Export Express',
    'Enhanced with Animations',
    'Built for Performance'
  ], {
    speed: 100,
    loop: true,
  });
  
  // Counting animation
  const counter = useCountingAnimation({
    start: 0,
    end: 1000,
    duration: ANIMATION_DURATIONS.slow,
  });

  return (
    <VStack spacing={8} p={8} maxW="800px" mx="auto">
      {/* Device Info */}
      <Box p={4} bg="gray.100" borderRadius="md" w="full">
        <Text fontSize="sm" color="gray.600">
          Device: {deviceType} | Animations: {animationsDisabled ? 'Disabled' : 'Enabled'} | 
          FPS: {metrics.fps} | Performance: {metrics.isLowPerformance ? 'Low' : 'Good'}
        </Text>
      </Box>

      {/* Typewriter Effect */}
      <Box textAlign="center">
        <Text fontSize="2xl" fontWeight="bold" minH="60px">
          {typewriter.displayText}
          {typewriter.showCursor && <Box as="span" opacity={0.7}>|</Box>}
        </Text>
        <HStack spacing={2} justify="center" mt={4}>
          <Button size="sm" onClick={typewriter.pause} disabled={typewriter.state !== 'running'}>
            Pause
          </Button>
          <Button size="sm" onClick={typewriter.resume} disabled={typewriter.state !== 'paused'}>
            Resume
          </Button>
          <Button size="sm" onClick={typewriter.reset}>
            Reset
          </Button>
        </HStack>
      </Box>

      {/* Counting Animation */}
      <Box textAlign="center">
        <Text fontSize="lg" mb={2}>Counter Animation:</Text>
        <Text fontSize="4xl" fontWeight="bold" color="blue.500">
          {counter.value.toLocaleString()}
        </Text>
        <HStack spacing={2} justify="center" mt={4}>
          <Button size="sm" onClick={counter.start} disabled={counter.state === 'running'}>
            Start
          </Button>
          <Button size="sm" onClick={counter.reset}>
            Reset
          </Button>
        </HStack>
      </Box>

      {/* Scroll-triggered Animation */}
      <Box h="200px" />
      <MotionBox
        ref={scrollRef}
        initial="hidden"
        animate={isIntersecting ? "visible" : "hidden"}
        variants={MOTION_VARIANTS.slideUp}
        transition={{ duration: 0.6 }}
        p={8}
        bg="blue.50"
        borderRadius="lg"
        textAlign="center"
      >
        <Text fontSize="xl" fontWeight="semibold">
          🎉 This box animates when it comes into view!
        </Text>
        <Text mt={2} color="gray.600">
          Scroll-triggered animations help create engaging user experiences.
        </Text>
      </MotionBox>

      {/* Performance-aware Animation */}
      <MotionBox
        whileHover={!animationsDisabled ? { scale: 1.05 } : {}}
        whileTap={!animationsDisabled ? { scale: 0.95 } : {}}
        p={6}
        bg="green.50"
        borderRadius="lg"
        cursor="pointer"
        textAlign="center"
        transition={{ duration: animationsDisabled ? 0 : 0.2 }}
      >
        <Text fontSize="lg" fontWeight="semibold">
          Performance-Aware Hover Effect
        </Text>
        <Text mt={2} color="gray.600" fontSize="sm">
          {animationsDisabled 
            ? 'Animations disabled for better performance' 
            : 'Hover me to see the effect!'
          }
        </Text>
      </MotionBox>

      <Box h="100px" />
    </VStack>
  );
};

export default AnimationExample;