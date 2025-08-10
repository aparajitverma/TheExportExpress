import React from 'react';

export const TestHero: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-black">THE EXPORT EXPRESS</h1>
        <p className="text-xl mb-8 text-gray-600">Established Import Export Company</p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-4 bg-black text-white">
            Start Trading
          </button>
          <button className="px-8 py-4 border border-black text-black">
            View Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestHero;