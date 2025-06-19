import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from 'components/ui/Breadcrumb';
import { getTimelines } from 'services/timelineService';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import Icon from 'components/AppIcon';

import TimelineNode from './components/TimelineNode';
import MilestoneCard from './components/MilestoneCard';
import FilterControls from './components/FilterControls';
import ProgressIndicator from './components/ProgressIndicator';

const AndolanTimelinePage = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDecade, setSelectedDecade] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'decade'
  const [timelineData, setTimelineData] = useState([]);
  const [categories, setCategories] = useState([
    { value: 'all', label: 'All Categories', icon: 'Grid3X3' },
  ]);
  const [decades, setDecades] = useState([]);
  const [error, setError] = useState(null);
  const timelineRef = useRef(null);

  // Fetch timeline data from the API
  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        setIsLoading(true);
        const response = await getTimelines();
        
        if (response && response.data && response.data.length > 0) {
          // Process and format the timeline data
          const processedData = response.data.map(item => ({
            year: new Date(item.date).getFullYear(),
            date: new Date(item.date).toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            }),
            title: item.title,
            description: item.description,
            category: item.category || 'uncategorized',
            impact: item.impact || '',
            // Map gallery items to just their file paths for the images array
            images: item.gallery && item.gallery.length > 0 ? item.gallery.map(img => img.filePath) : [],
            isKeyMilestone: item.isKeyMilestone || false,
            testimonial: item.testimonial || null
          }));

          // Sort by year in ascending order
          const sortedData = processedData.sort((a, b) => a.year - b.year);
          setTimelineData(sortedData);
          
          // Extract and set unique categories
          const uniqueCategories = ['all'];
          const categoryIcons = {
            all: 'Grid3X3',
            achievements: 'Trophy',
            programs: 'BookOpen',
            partnerships: 'Handshake',
            'policy changes': 'FileText',
            'upcoming projects': 'Rocket',
            uncategorized: 'Tag'
          };
          
          sortedData.forEach(item => {
            if (item.category && !uniqueCategories.includes(item.category)) {
              uniqueCategories.push(item.category);
            }
          });
          
          const formattedCategories = uniqueCategories.map(category => ({
            value: category,
            label: category === 'all' ? 'All Categories' : 
              category.charAt(0).toUpperCase() + category.slice(1),
            icon: categoryIcons[category] || 'Tag'
          }));
          
          setCategories(formattedCategories);
          
          // Generate decades based on the years in the data
          const years = sortedData.map(item => item.year);
          const minYear = Math.min(...years);
          const maxYear = Math.max(...years);
          const minDecade = Math.floor(minYear / 10) * 10;
          const maxDecade = Math.floor(maxYear / 10) * 10;
          
          const decadesList = [];
          for (let decade = minDecade; decade <= maxDecade; decade += 10) {
            const decadeYears = years.filter(year => 
              year >= decade && year < decade + 10
            );
            
            if (decadeYears.length > 0) {
              decadesList.push({
                value: `${decade}s`,
                label: `${decade}-${decade + 9}`,
                years: decadeYears
              });
            }
          }
          
          setDecades(decadesList);
          
          // Set initial selections if data exists
          if (sortedData.length > 0) {
            setSelectedYear(sortedData[0].year);
          }
          
        } else {
          setTimelineData([]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching timeline data:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchTimelineData();
  }, []);

  const filteredData = timelineData.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const handleYearSelect = (year) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedYear(selectedYear === year ? null : year);
      setIsLoading(false);
    }, 300);
  };

  const handleDecadeJump = (decade) => {
    setSelectedDecade(decade);
    const firstYear = decades.find(d => d.value === decade)?.years[0];
    if (firstYear) {
      setSelectedYear(firstYear);
      // Find the node in the horizontal timeline
      const node = document.getElementById(`year-${firstYear}`);
      if (node && timelineRef.current) {
        // Calculate scroll position to center the node
        const nodeRect = node.getBoundingClientRect();
        const containerRect = timelineRef.current.getBoundingClientRect();
        const scrollLeft = nodeRect.left - containerRect.left - (containerRect.width / 2) + (nodeRect.width / 2);
        
        timelineRef.current.scrollTo({
          left: timelineRef.current.scrollLeft + scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  };

  const navigateTimeline = (direction) => {
    const currentIndex = filteredData.findIndex(item => item.year === selectedYear);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'left') {
      newIndex = Math.max(0, currentIndex - 1);
    } else {
      newIndex = Math.min(filteredData.length - 1, currentIndex + 1);
    }
    
    if (newIndex !== currentIndex) {
      const newYear = filteredData[newIndex].year;
      setSelectedYear(newYear);
      
      // Scroll to the selected year in horizontal timeline
      const node = document.getElementById(`year-${newYear}`);
      if (node && timelineRef.current) {
        node.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  const scrollTimeline = (direction) => {
    if (timelineRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      timelineRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getCurrentProgress = () => {
    if (!selectedYear || timelineData.length === 0) return 0;
    const currentIndex = timelineData.findIndex(item => item.year === selectedYear);
    return ((currentIndex + 1) / timelineData.length) * 100;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        navigateTimeline(event.key === 'ArrowLeft' ? 'left' : 'right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedYear, filteredData]);

  if (isLoading && timelineData.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container-custom py-8">
          <Breadcrumb />
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size={40} message="Loading timeline data..." />
          </div>
        </div>
      </div>
    );
  }

  if (error && timelineData.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container-custom py-8">
          <Breadcrumb />
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Timeline</h2>
            <p className="text-text-secondary">
              We encountered an error while loading the timeline. Please try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no data is available, show a message
  if (timelineData.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container-custom py-8">
          <Breadcrumb />
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-primary mb-4">No Timeline Data Available</h2>
            <p className="text-text-secondary">
              There is currently no timeline data to display.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container-custom py-8">
        <Breadcrumb />
        
        {/* Page Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Andolan Timeline
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto font-body">
            Journey through two decades of agricultural transformation, farmer empowerment, 
            and sustainable development initiatives that have shaped our movement.
          </p>
        </motion.div>

        {/* Filter Controls */}
        <FilterControls 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          decades={decades}
          selectedDecade={selectedDecade}
          onDecadeChange={handleDecadeJump}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        
        {/* Progress Bar */}
        <ProgressIndicator 
          progress={getCurrentProgress()} 
          totalMilestones={timelineData.length}
          currentIndex={timelineData.findIndex(item => item.year === selectedYear) + 1}
        />
        
        {/* Timeline View - Horizontal */}
        {viewMode === 'timeline' && (
          <div className="py-12 relative">
            {/* Navigation buttons - Timeline scroll */}
            <div className="absolute left-0 top-1/3 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => scrollTimeline('left')}
                className="bg-surface p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                aria-label="Scroll timeline left"
              >
                <Icon name="ChevronLeft" size={24} />
              </button>
            </div>
            <div className="absolute right-0 top-1/3 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => scrollTimeline('right')}
                className="bg-surface p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                aria-label="Scroll timeline right"
              >
                <Icon name="ChevronRight" size={24} />
              </button>
            </div>
            
            {/* Horizontal Timeline */}
            <div className="relative mx-12 overflow-hidden">
              {/* Timeline Line */}
              <div className="absolute left-0 right-0 top-[40px] h-1 bg-accent"></div>
              
              {/* Timeline Nodes */}
              <div 
                ref={timelineRef}
                className="flex space-x-16 px-8 overflow-x-auto scrollbar-hide py-4 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredData.map((item, index) => (
                  <div 
                    key={`timeline-${item.year}-${index}`} 
                    id={`year-${item.year}`}
                    className="flex-shrink-0"
                  >
                    <div className="flex flex-col items-center">
                      <TimelineNode 
                        year={item.year}
                        isSelected={selectedYear === item.year}
                        isKeyMilestone={item.isKeyMilestone}
                        onClick={() => handleYearSelect(item.year)}
                        index={index}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Selected Milestone Card */}
            <AnimatePresence>
              {selectedYear && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="mt-12 max-w-4xl mx-auto relative"
                >
                  {/* Milestone Navigation Controls */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-5 z-20">
                    <button 
                      onClick={() => navigateTimeline('left')}
                      className="bg-surface p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all"
                      aria-label="Previous milestone"
                      disabled={filteredData.findIndex(item => item.year === selectedYear) === 0}
                    >
                      <Icon 
                        name="ArrowLeft" 
                        size={20}
                        className={filteredData.findIndex(item => item.year === selectedYear) === 0 ? "opacity-50" : ""} 
                      />
                    </button>
                  </div>
                  
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-5 z-20">
                    <button 
                      onClick={() => navigateTimeline('right')}
                      className="bg-surface p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all"
                      aria-label="Next milestone"
                      disabled={filteredData.findIndex(item => item.year === selectedYear) === filteredData.length - 1}
                    >
                      <Icon 
                        name="ArrowRight" 
                        size={20} 
                        className={filteredData.findIndex(item => item.year === selectedYear) === filteredData.length - 1 ? "opacity-50" : ""}
                      />
                    </button>
                  </div>

                  {(() => {
                    const selectedItem = filteredData.find(item => item.year === selectedYear);
                    if (!selectedItem) return null;
                    
                    return (
                      <MilestoneCard 
                        title={selectedItem.title}
                        date={selectedItem.date}
                        description={selectedItem.description}
                        category={selectedItem.category}
                        impact={selectedItem.impact}
                        images={selectedItem.images}
                        testimonial={selectedItem.testimonial}
                        isKeyMilestone={selectedItem.isKeyMilestone}
                        position="center"
                      />
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Decade View */}
        {viewMode === 'decade' && (
          <div className="py-12">
            {decades.map((decade) => (
              <div key={decade.value} className="mb-16">
                <h2 className="text-3xl font-heading font-bold text-primary mb-8">
                  {decade.label}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData
                    .filter(item => decade.years.includes(item.year))
                    .map((item, index) => (
                      <div 
                        key={`decade-${item.year}-${index}`}
                        className="bg-surface rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg"
                      >
                        <div className="mb-4">
                          <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                            {item.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">
                          {item.title}
                        </h3>
                        <p className="text-text-secondary line-clamp-3 mb-4">
                          {item.description}
                        </p>
                        <button
                          onClick={() => {
                            setViewMode('timeline');
                            setSelectedYear(item.year);
                            setTimeout(() => {
                              const node = document.getElementById(`year-${item.year}`);
                              if (node && timelineRef.current) {
                                node.scrollIntoView({
                                  behavior: 'smooth',
                                  block: 'nearest',
                                  inline: 'center'
                                });
                              }
                            }, 100);
                          }}
                          className="text-primary hover:text-secondary transition-smooth flex items-center space-x-2"
                        >
                          <span>Read More</span>
                          <Icon name="ArrowRight" size={18} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* CSS for hiding scrollbars */}
        <style jsx>{`
          /* Hide scrollbar for Chrome, Safari and Opera */
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AndolanTimelinePage;