import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';

const TimelineNode = ({ year, isSelected, isKeyMilestone, onClick, index }) => {
  return (
    <div className="relative">
      {/* Mobile Layout */}
      <div className="lg:hidden flex items-center">
        <motion.button
          onClick={onClick}
          className={`relative z-20 w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 touch-target ${
            isSelected 
              ? 'bg-primary border-primary text-white shadow-lg scale-110' 
              : isKeyMilestone
                ? 'bg-secondary border-secondary text-white hover:bg-primary hover:border-primary' :'bg-surface border-accent text-primary hover:border-primary hover:bg-background'
          }`}
          whileHover={{ scale: isSelected ? 1.1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          {isKeyMilestone && (
            <Icon name="Star" size={20} className="absolute -top-1 -right-1 text-warning" />
          )}
          <span className="text-sm font-heading font-bold">{year}</span>
        </motion.button>
        
        <div className="ml-6 flex-1">
          <motion.div
            className={`text-lg font-heading font-semibold transition-colors duration-300 ${
              isSelected ? 'text-primary' : 'text-text-primary'
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
          >
            {year}
          </motion.div>
          {isKeyMilestone && (
            <motion.div
              className="text-sm text-warning font-caption font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
            >
              Key Milestone
            </motion.div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block text-center">
        <motion.button
          onClick={onClick}
          className={`relative z-20 w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 mx-auto mb-4 touch-target ${
            isSelected 
              ? 'bg-primary border-primary text-white shadow-xl scale-110' 
              : isKeyMilestone
                ? 'bg-secondary border-secondary text-white hover:bg-primary hover:border-primary' :'bg-surface border-accent text-primary hover:border-primary hover:bg-background'
          }`}
          whileHover={{ scale: isSelected ? 1.1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          {isKeyMilestone && (
            <Icon name="Star" size={16} className="absolute -top-2 -right-2 text-warning bg-surface rounded-full p-1" />
          )}
          <span className="text-base font-heading font-bold">{year}</span>
        </motion.button>
        
        <motion.div
          className={`text-lg font-heading font-semibold transition-colors duration-300 ${
            isSelected ? 'text-primary' : 'text-text-primary'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
        >
          {year}
        </motion.div>
        
        {isKeyMilestone && (
          <motion.div
            className="text-sm text-warning font-caption font-medium mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
          >
            Key Milestone
          </motion.div>
        )}
      </div>

      {/* Pulse Animation for Key Milestones */}
      {isKeyMilestone && !isSelected && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-warning opacity-30"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
};

export default TimelineNode;