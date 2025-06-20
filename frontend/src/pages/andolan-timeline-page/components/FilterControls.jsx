import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';

const FilterControls = ({
  categories,
  decades,
  selectedAchievement,
  selectedCategory,
  selectedDecade,
  viewMode,
  onAchievementChange,
  onCategoryChange,
  onDecadeJump,
  onViewModeChange
}) => {
  return (
    <motion.div
      className="mb-12 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-surface border border-border rounded-lg p-1 inline-flex">
          <button
            onClick={() => onViewModeChange('timeline')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 touch-target ${viewMode === 'timeline' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            <Icon name="Timeline" size={16} className="inline mr-2" />
            Timeline View
          </button>
          <button
            onClick={() => onViewModeChange('decade')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 touch-target ${viewMode === 'decade' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            <Icon name="Calendar" size={16} className="inline mr-2" />
            Decade View
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="text-center">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Filter by Category
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <motion.button
              key={category.value}
              onClick={() => onCategoryChange(category.value)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-target ${selectedCategory === category.value
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon name={category.icon} size={16} />
              <span>{category.label}</span>
              {selectedCategory === category.value && (
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Filter by Achievement
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            'all',
            'Debt Relief Assistance',
            'Organic Farming Training',
            'Access to Agricultural Equipment',
            'Farmer Market Linkage Programs',
            'Crop Insurance Enrollment Drive',
            'Children’s Education Support',
            'Water Conservation & Irrigation Projects',
            'Rural Health Camps & Mental Health Support'
          ].map((achievement, i) => (
            <motion.button
              key={i}
              onClick={() => onAchievementChange(achievement)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-target ${selectedAchievement === achievement
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{achievement === 'all' ? 'All Achievements' : achievement}</span>
              {selectedAchievement === achievement && (
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Decade Quick Jump */}
      <div className="text-center">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Jump to Decade
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {decades.map((decade) => (
            <motion.button
              key={decade.value}
              onClick={() => onDecadeJump(decade.value)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 touch-target ${selectedDecade === decade.value
                ? 'bg-secondary text-white shadow-md'
                : 'bg-surface border border-border text-text-secondary hover:border-secondary hover:text-secondary'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-base font-bold">{decade.label}</div>
              <div className="text-xs opacity-80">
                {decade.years.length} milestone{decade.years.length !== 1 ? 's' : ''}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'all' || selectedDecade) && (
        <motion.div
          className="flex flex-wrap justify-center items-center gap-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm text-text-secondary font-caption">Active filters:</span>

          {selectedCategory !== 'all' && (
            <div className="inline-flex items-center space-x-1 bg-primary text-white px-3 py-1 rounded-full text-sm">
              <span>{categories.find(c => c.value === selectedCategory)?.label}</span>
              <button
                onClick={() => onCategoryChange('all')}
                className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {selectedDecade && (
            <div className="inline-flex items-center space-x-1 bg-secondary text-white px-3 py-1 rounded-full text-sm">
              <span>{decades.find(d => d.value === selectedDecade)?.label}</span>
              <button
                onClick={() => onDecadeJump(null)}
                className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {selectedAchievement && selectedAchievement !== 'all' && (
            <div className="inline-flex items-center space-x-1 bg-primary text-white px-3 py-1 rounded-full text-sm">
              <span>{selectedAchievement}</span>
              <button
                onClick={() => onAchievementChange('all')}
                className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}


          <button
            onClick={() => {
              onCategoryChange('all');
              onAchievementChange('all'); // NEW
              onDecadeJump(null);
            }}
            className="text-sm text-text-secondary hover:text-primary transition-colors underline"
          >
            Clear all
          </button>

        </motion.div>
      )}
    </motion.div>
  );
};

export default FilterControls;