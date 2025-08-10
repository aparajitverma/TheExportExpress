import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface ParticleSystemProps {
  particleCount?: number;
  mouseInteraction?: boolean;
  colors?: string[];
  className?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  particleCount = 50,
  mouseInteraction = true,
  colors = ['#5C3D2E', '#8B6F47', '#6B4E71', '#A8B5A2'],
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles
  const initializeParticles = useCallback(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    particlesRef.current = particles;
  }, [particleCount, dimensions, colors]);

  // Update canvas dimensions
  const updateDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setDimensions({ width: rect.width, height: rect.height });
    canvas.width = rect.width;
    canvas.height = rect.height;
  }, []);

  // Handle mouse movement
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!mouseInteraction) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, [mouseInteraction]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      // Mouse interaction
      if (mouseInteraction) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += (dx / distance) * force * 0.01;
          particle.vy += (dy / distance) * force * 0.01;
        }
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary collision
      if (particle.x < 0 || particle.x > dimensions.width) {
        particle.vx *= -0.8;
        particle.x = Math.max(0, Math.min(dimensions.width, particle.x));
      }
      if (particle.y < 0 || particle.y > dimensions.height) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(dimensions.height, particle.y));
      }

      // Apply friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Draw particle
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [dimensions, mouseInteraction]);

  // Setup and cleanup
  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions]);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initializeParticles();
    }
  }, [initializeParticles]);

  useEffect(() => {
    if (particlesRef.current.length > 0) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    if (mouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [handleMouseMove, mouseInteraction]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Floating geometric shapes component
export const FloatingShapes: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shapes = [
    { id: 1, size: 60, delay: 0, duration: 8 },
    { id: 2, size: 40, delay: 2, duration: 10 },
    { id: 3, size: 80, delay: 4, duration: 12 },
    { id: 4, size: 30, delay: 1, duration: 9 },
    { id: 5, size: 50, delay: 3, duration: 11 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute opacity-10"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            background: 'linear-gradient(135deg, #5C3D2E, #6B4E71)',
            borderRadius: shape.id % 2 === 0 ? '50%' : '0%',
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  );
};