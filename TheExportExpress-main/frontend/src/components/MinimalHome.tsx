import React from 'react';
import { RobustImportExportHero } from './RobustImportExportHero';

export const MinimalHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <RobustImportExportHero />
      
      {/* Simple content section to test */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light mb-8">Our Services</h2>
          <p className="text-lg text-gray-600">
            Professional import/export services for global trade.
          </p>
        </div>
      </section>
    </div>
  );
};

export default MinimalHome;