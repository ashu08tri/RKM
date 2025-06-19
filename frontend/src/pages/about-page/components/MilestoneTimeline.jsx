import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const MilestoneTimeline = () => {
  const keyMilestones = [
    {
      year: 2003,
      title: "Foundation",
      description: "Kisan Andolan founded by Dr. Rajesh Kumar in Uttar Pradesh",
      icon: "Flag"
    },
    {
      year: 2007,
      title: "First Training Center",
      description: "Opened our first farmer training center in Lucknow",
      icon: "Home"
    },
    {
      year: 2012,
      title: "National Expansion",
      description: "Expanded operations to 8 states across India",
      icon: "Map"
    },
    {
      year: 2015,
      title: "Policy Influence",
      description: "Successfully advocated for changes to the national agricultural policy",
      icon: "FileText"
    },
    {
      year: 2018,
      title: "Sustainability Initiative",
      description: "Launched comprehensive program for sustainable farming practices",
      icon: "Leaf"
    },
    {
      year: 2023,
      title: "Digital Transformation",
      description: "Implemented digital platforms to reach 100,000+ farmers",
      icon: "Smartphone"
    }
  ];

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-heading font-bold text-primary">Key Milestones</h2>
        <Link 
          to="/andolan-timeline-page" 
          className="text-primary hover:text-secondary transition-smooth flex items-center space-x-2"
        >
          <span>View Full Timeline</span>
          <Icon name="ArrowRight" size={18} />
        </Link>
      </div>
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute top-0 bottom-0 left-8 md:left-1/2 w-px bg-accent -ml-px z-0"></div>
        
        <div className="space-y-12">
          {keyMilestones.map((milestone, index) => (
            <div key={index} className="relative z-10">
              <div className={`flex flex-col md:flex-row items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Timeline Node */}
                <div className="flex-shrink-0 relative z-10 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                  <div className="w-16 h-16 rounded-full bg-surface border-4 border-primary flex items-center justify-center shadow-md">
                    <Icon name={milestone.icon} size={24} className="text-primary" />
                  </div>
                </div>
                
                {/* Content */}
                <div className={`ml-24 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:pr-12 text-right' : 'md:pl-12'}`}>
                  <div className="bg-surface rounded-lg p-6 shadow-md">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-full mb-4">
                      <span className="text-lg font-bold text-primary">{milestone.year}</span>
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-primary mb-2">{milestone.title}</h3>
                    <p className="text-text-secondary">{milestone.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MilestoneTimeline;