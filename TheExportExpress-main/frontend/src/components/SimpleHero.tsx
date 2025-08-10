import React from 'react';

interface SimpleHeroProps {
  className?: string;
}

export const SimpleHero: React.FC<SimpleHeroProps> = ({
  className = ''
}) => {
  return (
    <section className={`min-h-screen bg-white text-black flex items-center justify-center ${className}`}>
      <div className="text-center">
        <h1 className="text-6xl font-light mb-4">THE EXPORT EXPRESS</h1>
        <p className="text-xl font-light mb-8">Established Import Export Company</p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-4 bg-black text-white font-light">
            Start Trading
          </button>
          <button className="px-8 py-4 border border-black text-black font-light">
            View Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default SimpleHero;