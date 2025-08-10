import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnimationTrigger } from '../hooks/useIntersectionObserver';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  department: string;
  image?: string;
  bio: string;
  expertise: string[];
  skills: { name: string; level: number }[];
  certifications: string[];
  contact: {
    email?: string;
    linkedin?: string;
    phone?: string;
  };
  experience: string;
  location: string;
}

interface TeamCardProps {
  member: TeamMember;
  index: number;
  isVisible: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, index, isVisible }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      className="team-card-container"
    >
      <div 
        className={`team-card ${isFlipped ? 'flipped' : ''}`}
        onClick={handleCardClick}
        onKeyPress={handleKeyPress}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${member.name}`}
      >
        {/* Front of card */}
        <div className="team-card-front">
          <div className="relative overflow-hidden rounded-2xl h-full">
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-xl border border-white/30 rounded-2xl"></div>
            
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 transition-opacity duration-500 rounded-2xl group-hover:opacity-100"></div>
            
            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col items-center text-center">
              {/* Profile image */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative mb-4"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                
                {/* Online status indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-lg">
                  <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </motion.div>
              
              {/* Name and position */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-gray-800 mb-1"
              >
                {member.name}
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-blue-600 font-medium mb-1"
              >
                {member.position}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-sm mb-4"
              >
                {member.department}
              </motion.p>
              
              {/* Experience and location */}
              <div className="flex flex-col space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <i className="fas fa-briefcase mr-2 text-blue-500"></i>
                  <span>{member.experience}</span>
                </div>
                <div className="flex items-center justify-center">
                  <i className="fas fa-map-marker-alt mr-2 text-purple-500"></i>
                  <span>{member.location}</span>
                </div>
              </div>
              
              {/* Expertise tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {member.expertise.slice(0, 3).map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + skillIndex * 0.1 }}
                    className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs rounded-full border border-blue-200"
                  >
                    {skill}
                  </motion.span>
                ))}
                {member.expertise.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{member.expertise.length - 3}
                  </span>
                )}
              </div>
              
              {/* Flip indicator */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="mt-auto text-gray-400 text-sm flex items-center"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                <span>Click to flip</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="team-card-back">
          <div className="relative overflow-hidden rounded-2xl h-full">
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl border border-white/40 rounded-2xl"></div>
            
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-100 rounded-2xl"></div>
            
            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col">
              {/* Header */}
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold text-gray-800 mb-1">{member.name}</h4>
                <p className="text-purple-600 font-medium text-sm">{member.position}</p>
              </div>
              
              {/* Bio */}
              <div className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed">{member.bio}</p>
              </div>
              
              {/* Skills with animated bars */}
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <i className="fas fa-chart-bar mr-2 text-blue-500"></i>
                  Skills
                </h5>
                <div className="space-y-2">
                  {member.skills.slice(0, 4).map((skill, skillIndex) => (
                    <div key={skillIndex} className="skill-bar-container">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">{skill.name}</span>
                        <span className="text-xs text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isFlipped ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ 
                            duration: 1, 
                            delay: skillIndex * 0.2,
                            ease: "easeOut"
                          }}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full relative overflow-hidden"
                        >
                          <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              ease: "linear",
                              delay: skillIndex * 0.2 + 1
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Certifications */}
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <i className="fas fa-certificate mr-2 text-purple-500"></i>
                  Certifications
                </h5>
                <div className="space-y-1">
                  {member.certifications.slice(0, 3).map((cert, certIndex) => (
                    <motion.div
                      key={certIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isFlipped ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: certIndex * 0.1 + 0.5 }}
                      className="flex items-center text-xs text-gray-600"
                    >
                      <i className="fas fa-check-circle mr-2 text-green-500"></i>
                      <span>{cert}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Contact information */}
              <div className="mt-auto">
                <h5 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <i className="fas fa-address-card mr-2 text-green-500"></i>
                  Contact
                </h5>
                <div className="flex justify-center space-x-4">
                  {member.contact.email && (
                    <motion.a
                      href={`mailto:${member.contact.email}`}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
                      aria-label={`Email ${member.name}`}
                    >
                      <i className="fas fa-envelope text-sm"></i>
                    </motion.a>
                  )}
                  {member.contact.linkedin && (
                    <motion.a
                      href={member.contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <i className="fab fa-linkedin-in text-sm"></i>
                    </motion.a>
                  )}
                  {member.contact.phone && (
                    <motion.a
                      href={`tel:${member.contact.phone}`}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
                      aria-label={`Call ${member.name}`}
                    >
                      <i className="fas fa-phone text-sm"></i>
                    </motion.a>
                  )}
                </div>
              </div>
              
              {/* Flip back indicator */}
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-center mt-2 text-gray-400 text-xs flex items-center justify-center"
              >
                <i className="fas fa-undo mr-2"></i>
                <span>Click to flip back</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TeamSection: React.FC = () => {
  const [sectionRef, isVisible] = useAnimationTrigger({
    threshold: 0.2,
    rootMargin: '-50px'
  });

  // Sample team data
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Rajesh Kumar",
      position: "Chief Executive Officer",
      department: "Executive Leadership",
      bio: "Visionary leader with 15+ years in international trade, driving The Export Express to become a global leader in export solutions.",
      expertise: ["Strategic Planning", "International Trade", "Business Development", "Market Expansion"],
      skills: [
        { name: "Leadership", level: 95 },
        { name: "Strategy", level: 90 },
        { name: "Trade Finance", level: 85 },
        { name: "Negotiations", level: 88 }
      ],
      certifications: [
        "MBA International Business",
        "Certified Export Manager",
        "Trade Finance Specialist"
      ],
      contact: {
        email: "rajesh.kumar@exportexpress.com",
        linkedin: "https://linkedin.com/in/rajeshkumar",
        phone: "+91-98765-43210"
      },
      experience: "15+ Years",
      location: "Mumbai, India"
    },
    {
      id: 2,
      name: "Sarah Chen",
      position: "Head of Operations",
      department: "Operations & Logistics",
      bio: "Operations expert specializing in supply chain optimization and logistics management for seamless global trade operations.",
      expertise: ["Supply Chain", "Logistics", "Process Optimization", "Quality Management"],
      skills: [
        { name: "Operations", level: 92 },
        { name: "Logistics", level: 88 },
        { name: "Quality Control", level: 85 },
        { name: "Team Management", level: 90 }
      ],
      certifications: [
        "Six Sigma Black Belt",
        "Supply Chain Management",
        "ISO 9001 Lead Auditor"
      ],
      contact: {
        email: "sarah.chen@exportexpress.com",
        linkedin: "https://linkedin.com/in/sarahchen",
        phone: "+65-9876-5432"
      },
      experience: "12+ Years",
      location: "Singapore"
    },
    {
      id: 3,
      name: "Mohammed Al-Rashid",
      position: "Director of Business Development",
      department: "Sales & Marketing",
      bio: "Dynamic business development leader with extensive experience in Middle East and African markets, driving growth and partnerships.",
      expertise: ["Market Development", "Client Relations", "Strategic Partnerships", "Regional Expansion"],
      skills: [
        { name: "Business Development", level: 93 },
        { name: "Market Analysis", level: 87 },
        { name: "Client Relations", level: 95 },
        { name: "Cultural Intelligence", level: 90 }
      ],
      certifications: [
        "International Business Development",
        "Cross-Cultural Communication",
        "Export Marketing Specialist"
      ],
      contact: {
        email: "mohammed.alrashid@exportexpress.com",
        linkedin: "https://linkedin.com/in/mohammedalrashid",
        phone: "+971-50-123-4567"
      },
      experience: "10+ Years",
      location: "Dubai, UAE"
    },
    {
      id: 4,
      name: "Elena Rodriguez",
      position: "Technology Director",
      department: "Information Technology",
      bio: "Tech innovator leading digital transformation initiatives and developing cutting-edge solutions for modern export challenges.",
      expertise: ["Digital Transformation", "AI/ML", "System Architecture", "Data Analytics"],
      skills: [
        { name: "Software Development", level: 90 },
        { name: "AI/ML", level: 85 },
        { name: "System Design", level: 88 },
        { name: "Data Science", level: 82 }
      ],
      certifications: [
        "AWS Solutions Architect",
        "Google Cloud Professional",
        "Certified Scrum Master"
      ],
      contact: {
        email: "elena.rodriguez@exportexpress.com",
        linkedin: "https://linkedin.com/in/elenarodriguez",
        phone: "+55-11-9876-5432"
      },
      experience: "8+ Years",
      location: "São Paulo, Brazil"
    },
    {
      id: 5,
      name: "James Thompson",
      position: "Compliance & Legal Head",
      department: "Legal & Compliance",
      bio: "Legal expert ensuring regulatory compliance across international markets with deep expertise in trade law and customs regulations.",
      expertise: ["Trade Law", "Compliance", "Risk Management", "Regulatory Affairs"],
      skills: [
        { name: "Legal Expertise", level: 94 },
        { name: "Compliance", level: 96 },
        { name: "Risk Assessment", level: 89 },
        { name: "Documentation", level: 91 }
      ],
      certifications: [
        "International Trade Law",
        "Customs Compliance Specialist",
        "Risk Management Professional"
      ],
      contact: {
        email: "james.thompson@exportexpress.com",
        linkedin: "https://linkedin.com/in/jamesthompson",
        phone: "+44-20-7123-4567"
      },
      experience: "14+ Years",
      location: "London, UK"
    },
    {
      id: 6,
      name: "Priya Sharma",
      position: "Customer Success Manager",
      department: "Customer Relations",
      bio: "Customer-focused professional dedicated to ensuring client satisfaction and success through personalized support and strategic guidance.",
      expertise: ["Customer Success", "Account Management", "Training", "Support"],
      skills: [
        { name: "Customer Relations", level: 96 },
        { name: "Problem Solving", level: 92 },
        { name: "Training", level: 88 },
        { name: "Communication", level: 94 }
      ],
      certifications: [
        "Customer Success Management",
        "Certified Trainer",
        "Service Excellence"
      ],
      contact: {
        email: "priya.sharma@exportexpress.com",
        linkedin: "https://linkedin.com/in/priyasharma",
        phone: "+91-98765-43211"
      },
      experience: "7+ Years",
      location: "Delhi, India"
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 px-4 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50/30"></div>
      
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl font-bold text-blue-100/30 transform -rotate-12">
          "Team"
        </div>
        <div className="absolute bottom-20 right-20 text-4xl font-bold text-purple-100/30 transform rotate-12">
          "Excellence"
        </div>
        <div className="absolute top-1/3 right-10 text-5xl font-bold text-blue-100/20 transform rotate-45">
          "Expert"
        </div>
        <div className="absolute bottom-1/3 left-20 text-3xl font-bold text-purple-100/25 transform -rotate-45">
          "Leaders"
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
            Meet Our Expert Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our diverse team of international trade experts brings decades of combined experience to help your business succeed globally
          </p>
        </motion.div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamCard
              key={member.id}
              member={member}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-16"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Work with Our Team?
            </h3>
            <p className="text-gray-600 mb-6">
              Connect with our experts to discuss how we can help accelerate your global trade success
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <i className="fas fa-users mr-2"></i>
              Contact Our Team
            </motion.button>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="flex justify-center mt-16"
        >
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
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

export default TeamSection;