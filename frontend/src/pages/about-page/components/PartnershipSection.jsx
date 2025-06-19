import React from 'react';
import Icon from 'components/AppIcon';

const PartnershipSection = () => {
  const partnerCategories = [
    {
      category: "Government Partners",
      partners: [
        "Ministry of Agriculture & Farmers Welfare",
        "State Agricultural Universities",
        "Indian Council of Agricultural Research",
        "National Bank for Agriculture and Rural Development"
      ],
      icon: "Landmark"
    },
    {
      category: "Academic & Research Partners",
      partners: [
        "Punjab Agricultural University",
        "Indian Agricultural Research Institute",
        "National Centre for Agricultural Economics",
        "Centre for Sustainable Agriculture"
      ],
      icon: "GraduationCap"
    },
    {
      category: "NGO Partners",
      partners: [
        "Foundation for Ecological Security",
        "Professional Assistance for Development Action",
        "Action for Food Production",
        "Watershed Support Services"
      ],
      icon: "Globe"
    },
    {
      category: "Corporate Partners",
      partners: [
        "National Agricultural Cooperative Federation",
        "Indian Farmers Fertiliser Cooperative",
        "Agricultural Technology Solutions Ltd.",
        "Rural Financial Institutions Network"
      ],
      icon: "Building"
    },
    {
      category: "International Organizations",
      partners: [
        "Food and Agriculture Organization",
        "International Fund for Agricultural Development",
        "Global Alliance for Improved Nutrition",
        "World Bank Rural Development Programs"
      ],
      icon: "Globe2"
    }
  ];

  return (
    <section className="mb-20">
      <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">Our Partners</h2>
      
      <div className="space-y-8">
        <p className="text-center text-text-secondary max-w-3xl mx-auto">
          We collaborate with a diverse range of organizations to amplify our impact and bring comprehensive solutions to agricultural communities across India.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerCategories.map((category, index) => (
            <div key={index} className="card hover:shadow-md transition-smooth">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={category.icon} size={24} color="#4a7c59" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-primary">
                    {category.category}
                  </h3>
                </div>
              </div>
              
              <ul className="space-y-2 pl-16">
                {category.partners.map((partner, i) => (
                  <li key={i} className="text-text-secondary">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></div>
                      <span>{partner}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Partnership Approach */}
        <div className="mt-12 bg-accent bg-opacity-20 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
            <div className="md:w-1/3">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Icon name="Handshake" size={32} color="white" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-primary mb-2">Our Partnership Approach</h3>
              <p className="text-text-secondary">
                We believe in collaborative solutions that leverage the strengths of diverse organizations to create sustainable impact for farming communities.
              </p>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-surface p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-primary mb-2 flex items-center">
                  <Icon name="Target" size={18} className="mr-2" />
                  Aligned Values
                </h4>
                <p className="text-sm text-text-secondary">
                  We partner with organizations that share our commitment to farmer welfare, sustainability, and community empowerment.
                </p>
              </div>
              
              <div className="bg-surface p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-primary mb-2 flex items-center">
                  <Icon name="BarChart2" size={18} className="mr-2" />
                  Measurable Impact
                </h4>
                <p className="text-sm text-text-secondary">
                  All partnerships are evaluated based on tangible outcomes and positive impact for farming communities.
                </p>
              </div>
              
              <div className="bg-surface p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-primary mb-2 flex items-center">
                  <Icon name="Refresh" size={18} className="mr-2" />
                  Long-term Commitment
                </h4>
                <p className="text-sm text-text-secondary">
                  We focus on sustainable, long-term relationships rather than short-term projects or initiatives.
                </p>
              </div>
              
              <div className="bg-surface p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-primary mb-2 flex items-center">
                  <Icon name="Zap" size={18} className="mr-2" />
                  Innovation Focus
                </h4>
                <p className="text-sm text-text-secondary">
                  We seek partners who bring innovative solutions and approaches to agricultural challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Partnership CTA */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-heading font-semibold text-primary mb-4">Interested in Partnering With Us?</h3>
        <p className="text-text-secondary mb-6 max-w-xl mx-auto">
          We're always open to new collaborations that align with our mission and values. Reach out to explore partnership opportunities.
        </p>
        <button className="btn-primary inline-flex items-center space-x-2">
          <Icon name="MessageSquare" size={18} />
          <span>Contact Our Partnership Team</span>
        </button>
      </div>
    </section>
  );
};

export default PartnershipSection;