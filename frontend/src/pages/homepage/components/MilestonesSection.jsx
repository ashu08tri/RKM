import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const MilestonesSection = ({ language }) => {
  const content = {
    en: {
      title: "Our Journey",
      subtitle: "Key milestones in our mission to transform agriculture",
      viewTimeline: "View Complete Timeline",
      milestones: [
        {
          year: "2003",
          title: "Foundation",
          description: "Kisan Andolan was established with a vision to empower farmers and transform rural communities."
        },
        {
          year: "2010",
          title: "First Training Center",
          description: "Opened our first agricultural training center, reaching over 1,000 farmers in the first year."
        },
        {
          year: "2015",
          title: "Technology Integration",
          description: "Launched digital platforms and mobile apps to connect farmers with markets and resources."
        },
        {
          year: "2020",
          title: "Pandemic Response",
          description: "Adapted programs to support farmers during COVID-19, ensuring food security and livelihoods."
        },
        {
          year: "2024",
          title: "Sustainable Future",
          description: "Expanding renewable energy projects and climate-smart agriculture across 500+ villages."
        }
      ]
    },
    hi: {
      title: "हमारी यात्रा",
      subtitle: "कृषि को बदलने के हमारे मिशन में मुख्य मील के पत्थर",
      viewTimeline: "पूरी समयसीमा देखें",
      milestones: [
        {
          year: "2003",
          title: "स्थापना",
          description: "किसान आंदोलन की स्थापना किसानों को सशक्त बनाने और ग्रामीण समुदायों को बदलने के दृष्टिकोण के साथ की गई।"
        },
        {
          year: "2010",
          title: "पहला प्रशिक्षण केंद्र",
          description: "हमारा पहला कृषि प्रशिक्षण केंद्र खोला, पहले वर्ष में 1,000 से अधिक किसानों तक पहुंचे।"
        },
        {
          year: "2015",
          title: "प्रौद्योगिकी एकीकरण",
          description: "किसानों को बाजारों और संसाधनों से जोड़ने के लिए डिजिटल प्लेटफॉर्म और मोबाइल ऐप लॉन्च किए।"
        },
        {
          year: "2020",
          title: "महामारी प्रतिक्रिया",
          description: "COVID-19 के दौरान किसानों का समर्थन करने के लिए कार्यक्रमों को अनुकूलित किया, खाद्य सुरक्षा और आजीविका सुनिश्चित की।"
        },
        {
          year: "2024",
          title: "टिकाऊ भविष्य",
          description: "500+ गांवों में नवीकरणीय ऊर्जा परियोजनाओं और जलवायु-स्मार्ट कृषि का विस्तार।"
        }
      ]
    }
  };

  // Create pairs of milestones for the desktop view
  const createMilestonePairs = (milestones) => {
    const pairs = [];
    for (let i = 0; i < milestones.length; i += 2) {
      // Create a pair with the current milestone and the next one (if exists)
      pairs.push({
        left: milestones[i],
        right: i + 1 < milestones.length ? milestones[i + 1] : null
      });
    }
    return pairs;
  };

  const milestonePairs = createMilestonePairs(content[language].milestones);

  return (
    <section className="py-16 md:pt-3 md:pb-24 bg-surface">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
            {content[language].title}
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto mb-8">
            {content[language].subtitle}
          </p>
          
          <Link
            to="/andolan-timeline-page"
            className="btn-outline inline-flex items-center space-x-2"
          >
            <Icon name="Clock" size={20} />
            <span>{content[language].viewTimeline}</span>
          </Link>
        </div>

        {/* Desktop Timeline */}
        <div className="relative hidden md:block">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-accent h-full" />
          
          <div className="space-y-24">
            {milestonePairs.map((pair, pairIndex) => (
              <div key={`pair-${pairIndex}`} className="relative">
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-6 h-6 bg-primary rounded-full border-4 border-surface shadow-lg" />
                </div>
                
                {/* Content - arranged in two columns */}
                <div className="flex justify-between items-center">
                  {/* Left Content */}
                  <div className="w-5/12 pr-16 text-right">
                    <div className="card p-4 bg-white rounded-lg shadow-sm">
                      <div className="mb-4">
                        <span className="inline-block bg-primary text-white px-4 py-2 rounded-full text-lg font-bold">
                          {pair.left.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">
                        {pair.left.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {pair.left.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Right Content */}
                  <div className="w-5/12 pl-16 text-left">
                    {pair.right && (
                      <div className="card p-4 bg-white rounded-lg shadow-sm">
                        <div className="mb-4">
                          <span className="inline-block bg-primary text-white px-4 py-2 rounded-full text-lg font-bold">
                            {pair.right.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">
                          {pair.right.title}
                        </h3>
                        <p className="text-text-secondary leading-relaxed">
                          {pair.right.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-8">
          {content[language].milestones.map((milestone) => (
            <div key={milestone.year} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {milestone.year.slice(-2)}
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-primary">{milestone.year}</span>
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MilestonesSection;