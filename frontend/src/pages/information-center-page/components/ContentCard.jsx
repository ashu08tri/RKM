import React from 'react';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';

const ContentCard = ({ item, toggleBookmark, bookmarkedResources, onCardClick }) => {
  const isBookmarked = bookmarkedResources.includes(item.id);
  const date = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const isVideo = item.fileType === 'video';

  // Handle card click to show details
  const handleCardClick = (e) => {
    // Prevent triggering when clicking bookmark button or view link
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    
    if (onCardClick) {
      onCardClick(item);
    }
  };

  return (
    <div 
      className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" 
      onClick={handleCardClick}
    >
      <div className="flex flex-col h-full">
        {/* Image/Video Thumbnail */}
        <div className="h-48 rounded-t-lg overflow-hidden mb-4 relative">
          <Image 
            src={item.thumbnailUrl || item.thumbnailPath || item.thumbnail || item.image || item.filePath} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isVideo && (
            <>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-60">
                <div className="bg-white bg-opacity-80 rounded-full p-3">
                  <Icon name="Play" size={24} color="#00712d" />
                </div>
              </div>
              {item.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-xs">
                  {item.duration}
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <span className="inline-block bg-accent bg-opacity-30 text-secondary text-xs px-2 py-1 rounded">
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                toggleBookmark(item.id);
              }}
              className="text-text-secondary hover:text-primary transition-smooth"
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Icon name={isBookmarked ? "Bookmark" : "BookmarkPlus"} size={18} />
            </button>
          </div>
          
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
            {item.title}
          </h3>
          
          <p className="text-text-secondary text-sm mb-4 flex-1">
            {item.description}
          </p>
          
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
            <span className="text-xs text-text-secondary">
              {date}
            </span>
            
            <div className="flex items-center space-x-3">
              <span className="flex items-center text-xs text-text-secondary">
                <Icon name={isVideo ? "Eye" : "BarChart2"} size={14} className="mr-1" />
                {isVideo ? (item.viewCount || 0) : item.engagementMetric?.toLocaleString() || 0}
              </span>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  if (onCardClick) onCardClick(item);
                }}
                className="inline-flex items-center text-primary hover:text-secondary transition-smooth"
              >
                <span className="text-sm">View</span>
                <Icon name="ArrowRight" size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;