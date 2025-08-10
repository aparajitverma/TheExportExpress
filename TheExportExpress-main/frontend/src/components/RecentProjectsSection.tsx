import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

// Project data interface
interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  client: string;
  completionDate: string;
  value: string;
  location: string;
  tags: string[];
  featured: boolean;
}

// Sample project data
const projectsData: Project[] = [
  {
    id: '1',
    title: 'Agricultural Equipment Export to Southeast Asia',
    category: 'Agriculture',
    description: 'Successfully facilitated the export of advanced agricultural machinery to multiple Southeast Asian markets, including custom documentation and logistics coordination.',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/250', '/api/placeholder/400/350'],
    client: 'AgriTech Solutions Ltd.',
    completionDate: '2024-01',
    value: '$2.5M',
    location: 'Thailand, Vietnam, Malaysia',
    tags: ['Machinery', 'Documentation', 'Logistics'],
    featured: true
  },
  {
    id: '2',
    title: 'Textile Manufacturing Export Program',
    category: 'Textiles',
    description: 'Comprehensive export solution for premium textile products, including quality assurance, customs clearance, and international shipping.',
    images: ['/api/placeholder/400/280', '/api/placeholder/400/320'],
    client: 'Premium Fabrics Inc.',
    completionDate: '2023-12',
    value: '$1.8M',
    location: 'Europe, North America',
    tags: ['Quality Control', 'Customs', 'Shipping'],
    featured: false
  },
  {
    id: '3',
    title: 'Electronics Component Distribution',
    category: 'Electronics',
    description: 'Streamlined export process for high-tech electronic components with specialized packaging and temperature-controlled logistics.',
    images: ['/api/placeholder/400/260', '/api/placeholder/400/300', '/api/placeholder/400/280', '/api/placeholder/400/320'],
    client: 'TechCore Electronics',
    completionDate: '2024-02',
    value: '$3.2M',
    location: 'Global Distribution',
    tags: ['Technology', 'Specialized Handling', 'Global'],
    featured: true
  },
  {
    id: '4',
    title: 'Pharmaceutical Export Compliance',
    category: 'Pharmaceuticals',
    description: 'Complex regulatory compliance and export facilitation for pharmaceutical products with strict quality and documentation requirements.',
    images: ['/api/placeholder/400/290', '/api/placeholder/400/310'],
    client: 'MediCore Pharmaceuticals',
    completionDate: '2023-11',
    value: '$4.1M',
    location: 'FDA Approved Markets',
    tags: ['Compliance', 'Regulatory', 'Quality'],
    featured: false
  },
  {
    id: '5',
    title: 'Automotive Parts Export Initiative',
    category: 'Automotive',
    description: 'Large-scale automotive parts export program with just-in-time delivery and comprehensive supply chain management.',
    images: ['/api/placeholder/400/270', '/api/placeholder/400/330', '/api/placeholder/400/290'],
    client: 'AutoParts Global',
    completionDate: '2024-01',
    value: '$5.7M',
    location: 'Americas, Europe',
    tags: ['Supply Chain', 'JIT Delivery', 'Automotive'],
    featured: true
  },
  {
    id: '6',
    title: 'Food & Beverage Export Solutions',
    category: 'Food & Beverage',
    description: 'Specialized export services for perishable food products with cold chain logistics and international food safety compliance.',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/280'],
    client: 'Fresh Foods International',
    completionDate: '2023-10',
    value: '$1.9M',
    location: 'Middle East, Asia',
    tags: ['Cold Chain', 'Food Safety', 'Perishables'],
    featured: false
  }
];

// Filter categories
const categories = ['All', 'Agriculture', 'Textiles', 'Electronics', 'Pharmaceuticals', 'Automotive', 'Food & Beverage'];

const RecentProjectsSection: React.FC = () => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter projects based on active category
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projectsData);
    } else {
      setFilteredProjects(projectsData.filter(project => project.category === activeFilter));
    }
  }, [activeFilter]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };



  const overlayVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-green-200 to-blue-200 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Recent Success Stories
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover how we've helped businesses achieve their global trade goals through our comprehensive export solutions
          </motion.p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid - Masonry Layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="break-inside-avoid mb-6"
                layout
              >
                <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Main Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Image Gallery Indicator */}
                    {project.images.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                        +{project.images.length - 1}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {project.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(project.completionDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Project Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Value:</span>
                        <span className="font-semibold text-green-600 ml-1">{project.value}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Client:</span>
                        <span className="font-medium ml-1">{project.client}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-gray-500 text-sm">Location:</span>
                      <span className="text-gray-700 text-sm ml-1">{project.location}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* View Details Button */}
                    <motion.button
                      onClick={() => setSelectedProject(project)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="relative">
                  <img
                    src={selectedProject.images[0]}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    ✕
                  </button>
                  {selectedProject.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured Project
                      </span>
                    </div>
                  )}
                </div>

                {/* Modal Content */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                      {selectedProject.category}
                    </span>
                    <span className="text-gray-500">
                      Completed: {new Date(selectedProject.completionDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedProject.title}
                  </h2>

                  <p className="text-gray-600 text-lg mb-6">
                    {selectedProject.description}
                  </p>

                  {/* Project Details Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Project Value</h4>
                        <p className="text-2xl font-bold text-green-600">{selectedProject.value}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Client</h4>
                        <p className="text-gray-700">{selectedProject.client}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Markets</h4>
                        <p className="text-gray-700">{selectedProject.location}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Gallery */}
                  {selectedProject.images.length > 1 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Project Gallery</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedProject.images.slice(1).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${selectedProject.title} - Image ${index + 2}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RecentProjectsSection;