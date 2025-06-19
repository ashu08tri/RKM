import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const MilestoneCard = ({ 
  title, 
  date, 
  description, 
  category, 
  impact, 
  images = [],
  testimonial, 
  isKeyMilestone,
  position
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const getCategoryIcon = (categoryValue) => {
    const iconMap = {
      'achievements': 'Trophy',
      'programs': 'BookOpen',
      'partnerships': 'Handshake',
      'policy changes': 'FileText',
      'upcoming projects': 'Rocket'
    };
    return iconMap[categoryValue] || 'Calendar';
  };

  const getCategoryColor = (categoryValue) => {
    const colorMap = {
      'achievements': 'text-success',
      'programs': 'text-primary',
      'partnerships': 'text-secondary',
      'policy changes': 'text-warning',
      'upcoming projects': 'text-error'
    };
    return colorMap[categoryValue] || 'text-primary';
  };

  return (
    <motion.div 
      className="bg-surface rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg bg-background ${getCategoryColor(category)}`}>
              <Icon name={getCategoryIcon(category)} size={20} />
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-heading font-bold text-text-primary">
                {title}
              </h3>
              <p className="text-sm text-text-secondary font-caption">
                {date}
              </p>
            </div>
          </div>

          {isKeyMilestone && (
            <div className="inline-flex items-center space-x-2 bg-warning bg-opacity-10 text-warning px-3 py-1 rounded-full text-sm font-medium">
              <Icon name="Star" size={14} />
              <span>Key Milestone</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Description and Impact */}
        <div className="lg:col-span-3">
          {/* Description */}
          <div className="mb-6">
            <p className="text-text-primary font-body leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
          
          {/* Impact */}
          {impact && (
            <div className="mb-6 p-4 bg-background rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="TrendingUp" size={18} className="text-success" />
                <h4 className="font-heading font-semibold text-text-primary">Impact</h4>
              </div>
              <p className="text-success font-medium">{impact}</p>
            </div>
          )}
          
          {/* Testimonial - Only shown on small screens */}
          {testimonial && (
            <div className="lg:hidden border-l-4 border-primary pl-4 py-2 bg-primary bg-opacity-5 rounded-r-lg mb-6">
              <blockquote className="text-text-primary font-body italic mb-2">
                "{testimonial.quote}"
              </blockquote>
              <cite className="text-text-secondary font-caption font-medium">
                — {testimonial.author}
              </cite>
            </div>
          )}
        </div>
        
        {/* Right Column: Images and Testimonial */}
        <div className="lg:col-span-2">
          {/* Images Gallery Grid */}
          {images?.length > 0 && (
            <div className="mb-6">
              {/* Gallery Title */}
              <h4 className="font-heading font-semibold text-text-primary mb-3 flex items-center">
                <Icon name="Camera" size={16} className="mr-2" />
                Gallery ({images.length} {images.length === 1 ? 'Image' : 'Images'})
              </h4>

              {/* Gallery Grid */}
              <div className={`grid gap-2 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                {images.map((image, index) => (
                  <div 
                    key={index}
                    onClick={() => handleImageClick(index)}
                    className={`relative rounded-lg overflow-hidden cursor-pointer
                      ${images.length === 1 ? 'h-64' : 'h-40 md:h-48'}
                      ${images.length > 4 && index >= 4 ? 'hidden md:block' : ''}
                      hover:opacity-95 transition-opacity`}
                  >
                    <Image
                      src={image}
                      alt={`${title} - Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Expand button overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-black/60 text-white p-2 rounded-full">
                        <Icon name="Maximize" size={16} />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show more button if there are more than 4 images on mobile */}
                {images.length > 4 && (
                  <div className="md:hidden relative h-40 rounded-lg overflow-hidden cursor-pointer bg-primary/10"
                    onClick={() => handleImageClick(4)}>
                    <div className="absolute inset-0 flex items-center justify-center text-primary">
                      <div className="text-center">
                        <Icon name="Plus" size={24} className="mx-auto mb-1" />
                        <p className="text-sm font-medium">+{images.length - 4} more</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* View all images button if there are many */}
              {images.length > 6 && (
                <button
                  onClick={() => handleImageClick(0)}
                  className="w-full mt-2 py-2 text-sm text-center text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors flex items-center justify-center"
                >
                  <Icon name="Images" size={16} className="mr-1" />
                  View All {images.length} Images
                </button>
              )}
            </div>
          )}
          
          {/* Testimonial - Only shown on large screens */}
          {testimonial && (
            <div className="hidden lg:block border-l-4 border-primary pl-4 py-2 bg-primary bg-opacity-5 rounded-r-lg">
              <blockquote className="text-text-primary font-body italic mb-2">
                "{testimonial.quote}"
              </blockquote>
              <cite className="text-text-secondary font-caption font-medium">
                — {testimonial.author}
              </cite>
            </div>
          )}
        </div>
      </div>
      
      {/* Fullscreen Image Modal */}
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
                src={images[selectedImageIndex]}
                alt={`${title} - Full size`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
              />

              {/* Navigation */}
              {images.length > 1 && (
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
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MilestoneCard;