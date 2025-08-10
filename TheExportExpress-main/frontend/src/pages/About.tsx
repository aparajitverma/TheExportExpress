import React from 'react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-4 pt-20 pb-20 space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-3">
          <h1 className="mx-auto" style={{ fontSize: 'var(--fs-h1-d)', lineHeight: 'var(--lh-h1)', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
            About TheExportExpress
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Connecting India&apos;s finest products to global markets with trust, consistency, and operational excellence.
          </p>
        </header>

        {/* Our Story */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card-strong">
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-primary-dark)' }}>Our Story</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Founded with a passion for showcasing the rich tapestry of Indian produce and craftsmanship, TheExportExpress bridges the gap between India&apos;s artisans, manufacturers, and discerning global buyers.
            </p>
            <p>
              From humble beginnings, we’ve grown into a trusted name in exports by championing quality, transparency, and long-term partnerships.
            </p>
          </div>
        </motion.section>

        {/* Mission and Vision */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="card-strong">
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-primary-dark)' }}>Our Mission</h2>
            <p className="text-gray-700">To empower Indian businesses with seamless access to global markets, driving sustainable growth with uncompromising quality.</p>
          </motion.section>
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="card-strong">
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-primary-dark)' }}>Our Vision</h2>
            <p className="text-gray-700">To be the most reliable and innovative conduit for Indian exports, celebrated for excellence and sustainability.</p>
          </motion.section>
        </div>

        {/* Values */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="card-strong">
          <h2 className="text-lg font-semibold mb-4 text-center" style={{ color: 'var(--color-primary-dark)' }}>Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Quality', text: 'Every product and service adheres to rigorous standards to meet international requirements.' },
              { title: 'Sustainability', text: 'We champion responsible sourcing and ethical trade across our supply chain.' },
              { title: 'Transparency', text: 'Clear communication and traceability from sourcing to shipment.' }
            ].map(v => (
              <div key={v.title} className="card">
                <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-primary-dark)' }}>{v.title}</h3>
                <p className="text-sm text-gray-700">{v.text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Certifications */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="card-strong">
          <h2 className="text-lg font-semibold mb-3 text-center" style={{ color: 'var(--color-primary-dark)' }}>Certifications & Accreditations</h2>
          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-600 text-sm">
            <span className="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">FSSAI</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">AYUSH</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">ISO 9001</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">EU Compliance</span>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;