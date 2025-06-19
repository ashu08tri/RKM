import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from 'components/ui/Breadcrumb';


import TimelineNode from './components/TimelineNode';
import MilestoneCard from './components/MilestoneCard';
import FilterControls from './components/FilterControls';
import ProgressIndicator from './components/ProgressIndicator';

const AndolanTimelinePage = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDecade, setSelectedDecade] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'decade'

  const timelineData = [
    {
      year: 2003,
      date: "15 March 2003",
      title: "Foundation of Kisan Andolan",
      description: `The Kisan Andolan movement was officially founded with the vision to unite farmers across the nation and fight for their fundamental rights. Starting with just 50 dedicated farmers from 5 villages, this grassroots movement aimed to address the pressing issues of agricultural policies, fair pricing, and farmer welfare.

The foundation ceremony was held in the heart of rural Punjab, where farmers from different communities came together to pledge their commitment to the cause. The founding principles emphasized unity, non-violence, and sustainable agricultural practices.`,
      category: "achievements",
      impact: "50 founding members from 5 villages",
      images: [
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800",
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"
      ],
      isKeyMilestone: true,
      testimonial: {
        quote: "This was the beginning of a revolution that would change the lives of millions of farmers.",
        author: "Rajesh Kumar, Founding Member"
      }
    },
    {
      year: 2005,
      date: "22 August 2005",
      title: "First Major Policy Victory",
      description: `After two years of persistent advocacy and peaceful protests, the movement achieved its first major policy victory with the implementation of the Minimum Support Price (MSP) reform. This landmark achievement ensured that farmers received fair compensation for their crops and protected them from market exploitation.

The victory came after months of negotiations with government officials and extensive documentation of farmer grievances. The movement organized over 100 peaceful demonstrations across 12 states, gathering support from more than 10,000 farmers.`,
      category: "policy changes",
      impact: "MSP reform benefiting 10,000+ farmers",
      images: [
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800"
      ],
      isKeyMilestone: false
    },
    {
      year: 2008,
      date: "10 June 2008",
      title: "Expansion to 15 States",
      description: `The movement experienced unprecedented growth, expanding its reach to 15 states across India. This expansion marked a significant milestone in the organization's journey, demonstrating the universal appeal of farmer rights and agricultural reform.

Regional chapters were established in each state, with local leadership trained in advocacy, community organizing, and sustainable farming practices. The expansion was supported by a comprehensive training program that equipped local leaders with the skills needed to address region-specific agricultural challenges.`,
      category: "achievements",
      impact: "15 states, 500+ local chapters",
      images: [
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
        "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800"
      ],
      isKeyMilestone: false
    },
    {
      year: 2012,
      date: "5 September 2012",
      title: "Launch of Organic Farming Initiative",
      description: `Recognizing the importance of sustainable agriculture, the movement launched its comprehensive Organic Farming Initiative. This program aimed to educate farmers about organic farming techniques, provide access to organic seeds and fertilizers, and create market linkages for organic produce.

The initiative included partnerships with agricultural universities, research institutions, and organic certification bodies. Training workshops were conducted in over 200 villages, reaching more than 5,000 farmers in the first year alone.`,
      category: "programs",
      impact: "5,000 farmers trained in organic methods",
      images: [
        "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800"
      ],
      isKeyMilestone: false
    },
    {
      year: 2015,
      date: "18 November 2015",
      title: "Digital Agriculture Platform Launch",
      description: `Embracing technology for agricultural advancement, the movement launched its Digital Agriculture Platform. This innovative platform provided farmers with access to weather forecasts, market prices, expert advice, and government scheme information through a user-friendly mobile application.

The platform was developed in collaboration with leading technology companies and agricultural experts. It featured multilingual support, offline capabilities, and voice-based interactions to ensure accessibility for farmers with varying levels of digital literacy.`,
      category: "programs",
      impact: "50,000+ app downloads in first month",
      images: [
        "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800"
      ],
      isKeyMilestone: true,
      testimonial: {
        quote: "The digital platform revolutionized how we access information and connect with markets.",
        author: "Priya Sharma, Progressive Farmer"
      }
    },
    {
      year: 2018,
      date: "12 April 2018",
      title: "Youth Leadership Program Establishment",
      description: `Understanding the critical role of youth in agricultural transformation, the movement established the Kisan Youth Leadership Program. This comprehensive program aimed to engage young farmers and agricultural graduates in leadership roles within the movement.

The program included leadership training, mentorship opportunities, exposure visits to successful farming enterprises, and platforms for youth to voice their ideas and innovations. Special focus was placed on encouraging young women's participation in agricultural leadership.`,
      category: "programs",
      impact: "1,000+ youth leaders trained",
      images: [
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
      ],
      isKeyMilestone: false
    },
    {
      year: 2020,
      date: "25 March 2020",
      title: "COVID-19 Relief Operations",
      description: `During the unprecedented COVID-19 pandemic, the movement quickly mobilized to provide essential support to farming communities. Relief operations included distribution of food supplies, medical assistance, and financial support to affected farmers and their families.

The movement coordinated with government agencies, NGOs, and international organizations to ensure comprehensive support. Special attention was given to migrant workers returning to villages and small-scale farmers who faced severe economic hardships during the lockdown period.`,
      category: "achievements",
      impact: "25,000 families supported during pandemic",
      images: [
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800"
      ],
      isKeyMilestone: true,
      testimonial: {
        quote: "When the world stopped, Kisan Andolan stood by us. Their support saved our families.",
        author: "Ramesh Patel, Beneficiary Farmer"
      }
    },
    {
      year: 2022,
      date: "8 October 2022",
      title: "International Recognition and Awards",
      description: `The movement received international recognition for its outstanding contribution to sustainable agriculture and farmer welfare. The United Nations Food and Agriculture Organization (FAO) honored the movement with the Excellence in Agricultural Innovation Award.

This recognition highlighted the movement's innovative approaches to addressing agricultural challenges, its commitment to sustainable farming practices, and its success in empowering farming communities. The award ceremony was attended by representatives from 50 countries.`,
      category: "achievements",
      impact: "International recognition from UN FAO",
      images: [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
      ],
      isKeyMilestone: false
    },
    {
      year: 2024,
      date: "15 January 2024",
      title: "Climate Resilient Agriculture Initiative",
      description: `Launching into 2024, the movement introduced its most ambitious project yet - the Climate Resilient Agriculture Initiative. This comprehensive program addresses climate change challenges through drought-resistant crop varieties, water conservation techniques, and renewable energy adoption in farming.

The initiative represents a collaboration with international climate organizations, research institutions, and technology companies. It aims to prepare farming communities for future climate challenges while maintaining agricultural productivity and sustainability.`,
      category: "upcoming projects",
      impact: "100,000 farmers to be trained by 2025",
      images: [
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800",
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800"
      ],
      isKeyMilestone: true,
      testimonial: {
        quote: "This initiative will secure the future of farming for generations to come.",
        author: "Dr. Sunita Verma, Agricultural Scientist"
      }
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: 'Grid3X3' },
    { value: 'achievements', label: 'Achievements', icon: 'Trophy' },
    { value: 'programs', label: 'Programs', icon: 'BookOpen' },
    { value: 'partnerships', label: 'Partnerships', icon: 'Handshake' },
    { value: 'policy changes', label: 'Policy Changes', icon: 'FileText' },
    { value: 'upcoming projects', label: 'Upcoming Projects', icon: 'Rocket' }
  ];

  const decades = [
    { value: '2000s', label: '2000-2009', years: [2003, 2005, 2008] },
    { value: '2010s', label: '2010-2019', years: [2012, 2015, 2018] },
    { value: '2020s', label: '2020-2029', years: [2020, 2022, 2024] }
  ];

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
      document.getElementById(`year-${firstYear}`)?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const getCurrentProgress = () => {
    if (!selectedYear) return 0;
    const currentIndex = timelineData.findIndex(item => item.year === selectedYear);
    return ((currentIndex + 1) / timelineData.length) * 100;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const currentIndex = timelineData.findIndex(item => item.year === selectedYear);
        if (currentIndex !== -1) {
          const newIndex = event.key === 'ArrowLeft' 
            ? Math.max(0, currentIndex - 1)
            : Math.min(timelineData.length - 1, currentIndex + 1);
          setSelectedYear(timelineData[newIndex].year);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedYear, timelineData]);

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
          decades={decades}
          selectedCategory={selectedCategory}
          selectedDecade={selectedDecade}
          viewMode={viewMode}
          onCategoryChange={setSelectedCategory}
          onDecadeJump={handleDecadeJump}
          onViewModeChange={setViewMode}
        />

        {/* Progress Indicator */}
        <ProgressIndicator 
          progress={getCurrentProgress()}
          currentYear={selectedYear}
          totalMilestones={filteredData.length}
        />

        {/* Timeline Container */}
        <div className="relative">
          {/* Desktop Timeline Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-accent transform -translate-y-1/2 z-10"></div>
          
          {/* Mobile Timeline Line */}
          <div className="lg:hidden absolute left-8 top-0 bottom-0 w-1 bg-accent z-10"></div>

          {/* Timeline Items */}
          <div className="space-y-8 lg:space-y-0 lg:flex lg:justify-between lg:items-center lg:min-h-[400px]">
            {filteredData.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                id={`year-${milestone.year}`}
                className="relative lg:flex-1 lg:max-w-xs"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TimelineNode
                  year={milestone.year}
                  isSelected={selectedYear === milestone.year}
                  isKeyMilestone={milestone.isKeyMilestone}
                  onClick={() => handleYearSelect(milestone.year)}
                  index={index}
                />
                
                <AnimatePresence>
                  {selectedYear === milestone.year && (
                    <div>
                      <MilestoneCard
                        milestone={milestone}
                        onClose={() => setSelectedYear(null)}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Navigation */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-xl font-heading font-semibold text-text-primary mb-6">
            Quick Navigation
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {decades.map((decade) => (
              <button
                key={decade.value}
                onClick={() => handleDecadeJump(decade.value)}
                className={`btn-outline text-sm px-4 py-2 transition-smooth ${
                  selectedDecade === decade.value ? 'bg-primary text-white' : ''
                }`}
              >
                {decade.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Statistics Summary */}
        <motion.div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-primary mb-2">21</div>
            <div className="text-sm text-text-secondary font-caption">Years of Impact</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-primary mb-2">15</div>
            <div className="text-sm text-text-secondary font-caption">States Reached</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-primary mb-2">1M+</div>
            <div className="text-sm text-text-secondary font-caption">Farmers Impacted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-text-secondary font-caption">Local Chapters</div>
          </div>
        </motion.div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-surface rounded-lg p-6 flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-text-primary font-medium">Loading milestone...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AndolanTimelinePage;