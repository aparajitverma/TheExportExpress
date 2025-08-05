import React from 'react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden" style={{ fontFamily: 'Montserrat, Roboto, "DIN Next Pro", Arial, sans-serif', letterSpacing: '0.02em' }}>
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#a259ff] rounded-full filter blur-[128px] opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#a259ff] rounded-full filter blur-[128px] opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content Container */}
      <div className="relative">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div
            className="cosmic-card p-8 rounded-2xl shadow-xl bg-black/60 backdrop-blur-lg border border-[#a259ff]/30 relative overflow-hidden"
            style={{
              boxShadow: '0 0 40px 0 #a259ff33, 0 2px 24px 0 #000a',
            }}
          >
            {/* Purple Glow Orb */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#a259ff] opacity-20 rounded-full blur-3xl pointer-events-none"></div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-widest text-center bg-gradient-to-r from-white via-[#a259ff] to-white bg-clip-text text-transparent drop-shadow-[0_0_32px_#a259ff99] mb-4"
            >
              About TheExportExpress
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-200 text-center max-w-2xl mx-auto leading-relaxed"
            >
              Connecting India&apos;s Finest Products to the Global Market with <span className="text-[#a259ff] font-semibold">Trust</span> and <span className="text-[#a259ff] font-semibold">Excellence</span>.
            </motion.p>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="max-w-5xl mx-auto px-4 pb-20 space-y-12">
          {/* Our Story */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="backdrop-blur-lg bg-black/40 p-8 rounded-2xl border border-[#a259ff]/20 shadow-[0_0_32px_#a259ff20]"
          >
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white via-[#a259ff] to-white bg-clip-text text-transparent uppercase tracking-wider">Our Story</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Founded with a passion for showcasing the rich tapestry of Indian produce and craftsmanship, 
                TheExportExpress embarked on a journey to bridge the gap between local Indian artisans, farmers, 
                and manufacturers, and the discerning global buyer.
              </p>
              <p>
                From humble beginnings, we have grown into a trusted name in the export sector, driven by our 
                commitment to quality, transparency, and building lasting relationships. Our platform is more 
                than just a marketplace; it's a testament to the skill and dedication of our Indian partners.
              </p>
            </div>
          </motion.section>

          {/* Mission and Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="backdrop-blur-lg bg-black/40 p-8 rounded-2xl border border-[#a259ff]/20 shadow-[0_0_32px_#a259ff20]"
            >
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white via-[#a259ff] to-white bg-clip-text text-transparent uppercase tracking-wider">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                To be the premier export platform that empowers Indian businesses by providing seamless 
                access to global markets, fostering sustainable practices, and ensuring the highest standards 
                of quality and integrity in every transaction.
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="backdrop-blur-lg bg-black/40 p-8 rounded-2xl border border-[#a259ff]/20 shadow-[0_0_32px_#a259ff20]"
            >
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white via-[#a259ff] to-white bg-clip-text text-transparent uppercase tracking-wider">Our Vision</h2>
              <p className="text-gray-300 leading-relaxed">
                To be globally recognized as the most reliable and innovative conduit for Indian exports, 
                celebrated for our commitment to excellence, sustainability, and for significantly 
                contributing to the growth and global presence of Indian industries and artisans.
              </p>
            </motion.section>
          </div>

          {/* Our Values */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="backdrop-blur-lg bg-black/40 p-8 rounded-2xl border border-[#a259ff]/20 shadow-[0_0_32px_#a259ff20]"
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white via-[#a259ff] to-white bg-clip-text text-transparent text-center uppercase tracking-wider">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-center p-6 backdrop-blur-md bg-[#a259ff]/5 rounded-xl border border-[#a259ff]/20 hover:shadow-[0_0_32px_#a259ff40] transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold text-[#a259ff] mb-3 uppercase">Quality</h3>
                <p className="text-gray-300 leading-relaxed">
                  We are unwavering in our pursuit of excellence. Every product listed and every service 
                  offered is subject to rigorous quality checks to meet international standards.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-center p-6 backdrop-blur-md bg-[#a259ff]/5 rounded-xl border border-[#a259ff]/20 hover:shadow-[0_0_32px_#a259ff40] transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold text-[#a259ff] mb-3 uppercase">Sustainability</h3>
                <p className="text-gray-300 leading-relaxed">
                  We champion environmentally and socially responsible practices, promoting products from 
                  sustainable sources and encouraging ethical trade throughout our supply chain.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-center p-6 backdrop-blur-md bg-[#a259ff]/5 rounded-xl border border-[#a259ff]/20 hover:shadow-[0_0_32px_#a259ff40] transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold text-[#a259ff] mb-3 uppercase">Transparency</h3>
                <p className="text-gray-300 leading-relaxed">
                  We believe in open and honest communication. From product sourcing to shipment, we provide 
                  clear information, fostering trust and accountability with all our stakeholders.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Certifications & Accreditations */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="backdrop-blur-lg bg-black/40 p-8 rounded-2xl border border-[#a259ff]/20 shadow-[0_0_32px_#a259ff20]"
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white via-[#a259ff] to-white bg-clip-text text-transparent text-center uppercase tracking-wider">
              Certifications & Accreditations
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {/* Add certification logos or placeholder content here */}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;