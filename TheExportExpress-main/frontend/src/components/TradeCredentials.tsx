import React from 'react';
import { motion } from 'framer-motion';

interface TradeCredentialsProps {
  className?: string;
}

export const TradeCredentials: React.FC<TradeCredentialsProps> = ({
  className = ''
}) => {
  const credentials = [
    {
      title: "ISO 9001:2015",
      subtitle: "Quality Management",
      description: "Certified quality management system ensuring consistent service delivery"
    },
    {
      title: "WTO MEMBER",
      subtitle: "World Trade Organization",
      description: "Authorized member with full compliance to international trade regulations"
    },
    {
      title: "FIATA MEMBER",
      subtitle: "International Freight",
      description: "Member of International Federation of Freight Forwarders Associations"
    },
    {
      title: "AEO CERTIFIED",
      subtitle: "Authorized Economic Operator",
      description: "Trusted trader status with customs authorities worldwide"
    }
  ];

  const partnerships = [
    "MAERSK LINE", "MSC", "CMA CGM", "COSCO SHIPPING", 
    "HAPAG-LLOYD", "ONE", "EVERGREEN", "YANG MING"
  ];

  return (
    <section className={`py-16 bg-gray-50 border-t border-black/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center space-x-4 border border-black/20 px-6 py-2 mb-8"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-1 h-1 bg-black"></div>
            <span className="text-xs tracking-[0.3em] font-light">TRADE CREDENTIALS & CERTIFICATIONS</span>
            <div className="w-1 h-1 bg-black"></div>
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-4">
            TRUSTED BY GLOBAL AUTHORITIES
          </h2>
          
          <p className="text-sm font-light text-gray-600 max-w-2xl mx-auto">
            Our certifications and memberships demonstrate our commitment to excellence 
            and compliance with international trade standards.
          </p>
        </motion.div>

        {/* Credentials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {credentials.map((credential, index) => (
            <motion.div
              key={index}
              className="bg-white border border-black/10 p-6 text-center group hover:border-black/30 transition-colors duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Credential Badge */}
              <motion.div
                className="w-16 h-16 border-2 border-black/20 mx-auto mb-4 flex items-center justify-center group-hover:border-black/50 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-xs font-black tracking-wider">
                  {credential.title.split(' ')[0]}
                </span>
              </motion.div>

              {/* Credential Info */}
              <h3 className="text-sm font-semibold tracking-wide mb-1">
                {credential.title}
              </h3>
              
              <p className="text-xs tracking-wider text-gray-600 mb-3">
                {credential.subtitle}
              </p>
              
              <p className="text-xs font-light text-gray-500 leading-relaxed">
                {credential.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Shipping Partners */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-sm tracking-[0.3em] font-light mb-8 text-gray-600">
            PREFERRED SHIPPING PARTNERS
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            {partnerships.map((partner, index) => (
              <motion.div
                key={index}
                className="text-xs tracking-[0.2em] font-light text-gray-400 hover:text-black transition-colors duration-300 cursor-default"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Decorative Line */}
        <motion.div
          className="w-32 h-[1px] bg-black/20 mx-auto mt-16"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          viewport={{ once: true }}
        />
      </div>
    </section>
  );
};

export default TradeCredentials;