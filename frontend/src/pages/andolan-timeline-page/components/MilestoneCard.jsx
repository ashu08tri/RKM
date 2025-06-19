import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const MilestoneCard = ({ milestone, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === milestone.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? milestone.images.length - 1 : prev - 1
    );
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'achievements': 'Trophy',
      'programs': 'BookOpen',
      'partnerships': 'Handshake',
      'policy changes': 'FileText',
      'upcoming projects': 'Rocket'
    };
    return iconMap[category] || 'Calendar';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'achievements': 'text-success',
      'programs': 'text-primary',
      'partnerships': 'text-secondary',
      'policy changes': 'text-warning',
      'upcoming projects': 'text-error'
    };
    return colorMap[category] || 'text-primary';
  };

   useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto pt-28 px-4">
      <motion.div
        className="relative bg-white dark:bg-background card-elevated w-full max-w-3xl rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-background transition-smooth touch-target z-10"
          aria-label="Close milestone details"
        >
          <Icon name="X" size={20} />
        </button>

        {/* Card Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg bg-background ${getCategoryColor(milestone.category)}`}>
                <Icon name={getCategoryIcon(milestone.category)} size={20} />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-heading font-bold text-text-primary">
                  {milestone.title}
                </h3>
                <p className="text-sm text-text-secondary font-caption">
                  {milestone.date}
                </p>
              </div>
            </div>

            {milestone.isKeyMilestone && (
              <div className="inline-flex items-center space-x-2 bg-warning bg-opacity-10 text-warning px-3 py-1 rounded-full text-sm font-medium">
                <Icon name="Star" size={14} />
                <span>Key Milestone</span>
              </div>
            )}
          </div>
        </div>

        {/* Images Gallery */}
        {milestone.images?.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {milestone.images.map((image, index) => (
                <motion.div
                  key={index}
                  className="relative overflow-hidden rounded-lg cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleImageClick(index)}
                >
                  <Image
                    src={image}
                    alt={`${milestone.title} - Image ${index + 1}`}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Icon
                      name="ZoomIn"
                      size={24}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <p className="text-text-primary font-body leading-relaxed whitespace-pre-line">
            {milestone.description}
          </p>
        </div>

        {/* Impact */}
        <div className="mb-6 p-4 bg-background rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={18} className="text-success" />
            <h4 className="font-heading font-semibold text-text-primary">Impact</h4>
          </div>
          <p className="text-success font-medium">{milestone.impact}</p>
        </div>

        {/* Testimonial */}
        {milestone.testimonial && (
          <div className="border-l-4 border-primary pl-4 py-2 bg-primary bg-opacity-5 rounded-r-lg">
            <blockquote className="text-text-primary font-body italic mb-2">
              "{milestone.testimonial.quote}"
            </blockquote>
            <cite className="text-text-secondary font-caption font-medium">
              — {milestone.testimonial.author}
            </cite>
          </div>
        )}
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={milestone.images[selectedImageIndex]}
                alt={`${milestone.title} - Full size`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
              />

              {/* Navigation */}
              {milestone.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-all"
                  >
                    <Icon name="ChevronLeft" size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-all"
                  >
                    <Icon name="ChevronRight" size={24} />
                  </button>
                </>
              )}

              {/* Close */}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-all"
              >
                <Icon name="X" size={24} />
              </button>

              {/* Counter */}
              {milestone.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                  {selectedImageIndex + 1} / {milestone.images.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MilestoneCard;