import React, { useEffect, useState } from 'react';
import Modal from 'components/ui/Modal';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import axios from 'axios';

const ContentModal = ({ isOpen, onClose, content }) => {
  if (!content) return null;
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);


  const openGallery = (images, index) => {
    const normalized = images.map(img =>
      typeof img === 'string'
        ? img
        : img?.url || `/uploads/${img?.publicId || ''}`
    );

    setGalleryImages(normalized);
    setCurrentIndex(index);
    setIsGalleryOpen(true);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEndX(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped left 
      setCurrentIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
    } else if (distance < -minSwipeDistance) {
      // Swiped right
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGalleryOpen) return;

      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setIsGalleryOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, galleryImages.length]);



  // Log the entire content object when modal opens to debug gallery property
  // useEffect(() => {
  //   if (isOpen && content) {
  //     console.log('ContentModal content:', content);
  //     console.log('ContentModal gallery:', content.gallery);
  //   }
  // }, [isOpen, content]);

  // Increment view count when modal is opened (for videos only)
  useEffect(() => {
    if (isOpen && content._id && content.fileType === 'video') {
      const incrementViewCount = async () => {
        try {
          const response = await axios.put(`/api/media/${content._id}/view`);
          console.log('View count updated:', response.data);
        } catch (error) {
          console.error('Error updating view count:', error);
        }
      };

      incrementViewCount();
    }
  }, [isOpen, content._id, content.fileType]);

  const renderVideo = () => {
    if (content.fileType !== 'video' || !content.filePath) return null;

    return (
      <div className="mb-6">
        <div className="relative overflow-hidden rounded-lg">
          <video
            src={content.filePath}
            className="w-full"
            controls
            poster={content.thumbnailUrl || content.thumbnailPath || content.thumbnail || content.image}
            autoPlay={false}
            preload="metadata"
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-sm text-text-secondary">
          <div className="flex items-center">
            <Icon name="Eye" size={16} className="mr-1" />
            <span>{content.viewCount || 0} views</span>
          </div>
          {content.duration && (
            <div className="flex items-center">
              <Icon name="Clock" size={16} className="mr-1" />
              <span>{content.duration}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGallery = () => {
    if (!content.gallery || content.gallery.length === 0) {
      console.log('No gallery found or empty gallery');
      return null;
    }

    console.log('Rendering gallery with', content.gallery.length, 'images:', content.gallery);

    return (
      <div className="mb-6">
        <h4 className="text-lg font-heading font-semibold text-primary mb-4">Gallery</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {content.gallery.map((image, index) => {
            // Enhanced image URL extraction with debugging
            let imageUrl = '';

            // Handle various image formats
            if (typeof image === 'string') {
              imageUrl = image;
              console.log(`Gallery image ${index} is string:`, imageUrl);
            } else if (image && typeof image === 'object') {
              if (image.url) {
                imageUrl = image.url;
                console.log(`Gallery image ${index} has url property:`, imageUrl);
              } else if (image.publicId) {
                // Try to construct URL from publicId
                imageUrl = `/uploads/${image.publicId}`;
                console.log(`Gallery image ${index} using publicId:`, imageUrl);
              }
            }

            console.log(`Gallery image ${index} final URL:`, imageUrl);

            if (!imageUrl) {
              console.log(`Gallery image ${index} has no valid URL, skipping`);
              return null;
            }

            return (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg group cursor-pointer"
                onClick={() => openGallery(content.gallery, index)} // assuming content.gallery is an array of image URLs
              >
                <Image
                  src={imageUrl}
                  alt={`${content.title || content.name} gallery ${index + 1}`}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Icon name="ZoomIn" size={20} color="white" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Removed the renderMilestones function as requested

  const renderStats = () => {
    const stats = [];

    if (content.viewCount) stats.push({ label: 'Views', value: content.viewCount, icon: 'Eye' });
    if (content.photos) stats.push({ label: 'Photos', value: content.photos, icon: 'Image' });
    if (content.articles) stats.push({ label: 'Articles', value: content.articles, icon: 'FileText' });
    if (content.beneficiaries) stats.push({ label: 'Beneficiaries', value: content.beneficiaries, icon: 'Users' });
    if (content.duration) stats.push({ label: 'Duration', value: content.duration, icon: 'Clock' });
    if (content.programDuration) stats.push({ label: 'Program Duration', value: content.programDuration, icon: 'Calendar' });
    if (content.budget) stats.push({ label: 'Budget', value: content.budget, icon: 'IndianRupee' });
    if (content.targetFarms) stats.push({ label: 'Target Farms', value: content.targetFarms, icon: 'MapPin' });
    if (content.location) stats.push({ label: 'Location', value: content.location, icon: 'MapPin' });

    if (stats.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-lg font-heading font-semibold text-primary mb-4">Key Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-background p-4 rounded-lg text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full mx-auto mb-2">
                <Icon name={stat.icon} size={20} color="white" />
              </div>
              <p className="text-lg font-semibold text-primary">{stat.value}</p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={content.title || content.name}
      size="5xl"
    >
      <div className="max-h-96 overflow-y-auto">
        {/* Video Content */}
        {content.fileType === 'video' && renderVideo()}

        {/* Content Image (if not video) */}
        {(content.fileType !== 'video' && (content.thumbnailUrl || content.thumbnailPath || content.thumbnail || content.image || content.coverImage || content.filePath)) && (
          <div className="mb-6">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={content.thumbnailUrl || content.thumbnailPath || content.thumbnail || content.image || content.coverImage || content.filePath}
                alt={content.title || content.name}
                className="w-full object-cover"
              />
              {/* {content.category && (
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {content.category}
                  </span>
                </div>
              )}
              {(content.status || content.type) && (
                <div className="absolute top-4 right-4">
                  <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {content.status || content.type}
                  </span>
                </div>
              )} */}
            </div>
          </div>
        )}

        {/* Description */}
        {content.description && (
          <div className="mb-6">
            <p className="text-text-secondary font-body leading-relaxed">
              {content.description}
            </p>
          </div>
        )}

        {/* Stats */}
        {renderStats()}

        {/* Removed Milestones section as requested */}

        {/* Detailed Content */}
        {content.content && content.content !== content.description && (
          <div className="mb-6">
            <h4 className="text-lg font-heading font-semibold text-primary mb-4">Details</h4>
            <div className="prose prose-sm max-w-none text-text-secondary">
              <p className="leading-relaxed">{content.content}</p>
            </div>
          </div>
        )}

        {/* Gallery - Make sure this is always rendered when gallery exists */}
        {renderGallery()}
      </div>

      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setIsGalleryOpen(false)}
          >
            &times;
          </button>

          <div className="relative max-w-4xl w-full px-4">
            {/* Left Navigation */}
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))
              }
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full z-10"
              title="Previous"
            >
              <Icon name="ChevronLeft" size={24} color="white" />
            </button>

            {/* Image */}
            <Image
              src={galleryImages[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              className="w-full max-h-[80vh] object-contain mx-auto"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />

            {/* Right Navigation */}
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full z-10"
              title="Next"
            >
              <Icon name="ChevronRight" size={24} color="white" />
            </button>
          </div>

        </div>
      )}

    </Modal>
  );
};

export default ContentModal;