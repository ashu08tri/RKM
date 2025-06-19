import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const TeamStructure = () => {
  const [activeTab, setActiveTab] = useState('structure');

  const organizationalStructure = [
    {
      role: 'Board of Directors',
      members: 7,
      description: 'Provides strategic guidance and governance oversight for the organization',
      responsibilities: ['Policy approval', 'Financial oversight', 'Strategic planning', 'Appointment of leadership'],
      icon: 'Briefcase'
    },
    {
      role: 'Executive Committee',
      members: 5,
      description: 'Responsible for day-to-day management and program implementation',
      responsibilities: ['Operations management', 'Program execution', 'Staff supervision', 'Budget administration'],
      icon: 'Users'
    },
    {
      role: 'Advisory Council',
      members: 12,
      description: 'Expert panel providing specialized guidance on agricultural and policy matters',
      responsibilities: ['Technical advice', 'Research guidance', 'Policy recommendations', 'Industry connections'],
      icon: 'Lightbulb'
    },
    {
      role: 'Regional Coordinators',
      members: 18,
      description: 'Manage organization activities and member engagement across different states',
      responsibilities: ['Regional implementation', 'Local partnerships', 'Farmer engagement', 'Feedback collection'],
      icon: 'Map'
    },
    {
      role: 'Program Teams',
      members: 35,
      description: 'Specialized teams focused on different program areas and initiatives',
      responsibilities: ['Training delivery', 'Resource development', 'Impact assessment', 'Innovation testing'],
      icon: 'Target'
    }
  ];

  const governanceFramework = {
    principles: [
      'Transparency in decision-making and financial management',
      'Inclusive representation of diverse farming communities',
      'Accountability through regular reporting and member feedback',
      'Integrity in all operations and external partnerships',
      'Sustainability in organizational practices and programs'
    ],
    processes: [
      'Annual General Meeting with voting rights for all members',
      'Quarterly Board meetings with published minutes',
      'Open election process for Board positions every three years',
      'Regular financial audits with published results',
      'Grievance redressal mechanism for member concerns'
    ]
  };

  return (
    <section className="mb-20">
      <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">Organizational Framework</h2>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-border mb-8">
        <button
          onClick={() => setActiveTab('structure')}
          className={`pb-3 px-4 text-lg font-medium relative ${activeTab === 'structure' ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}
        >
          Organizational Structure
          {activeTab === 'structure' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
        </button>
        <button
          onClick={() => setActiveTab('governance')}
          className={`pb-3 px-4 text-lg font-medium relative ${activeTab === 'governance' ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}
        >
          Governance Framework
          {activeTab === 'governance' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
        </button>
      </div>
      
      {/* Structure Content */}
      {activeTab === 'structure' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizationalStructure.map((item, index) => (
              <div key={index} className="card hover:shadow-md transition-smooth">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={24} color="#4a7c59" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-primary mb-1">{item.role}</h3>
                    <p className="text-sm text-text-secondary mb-3">
                      <span className="font-medium">{item.members}</span> members | {item.description}
                    </p>
                    <div className="space-y-1">
                      {item.responsibilities.map((resp, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs text-text-secondary">
                          <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></div>
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Organizational Chart */}
          <div className="p-6 bg-surface rounded-xl shadow-md mt-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-heading font-semibold text-primary">Organizational Chart</h3>
              <p className="text-text-secondary">Our integrated leadership structure ensures efficient decision-making and accountability</p>
            </div>
            
            <div className="relative">
              {/* This would be a more detailed org chart in the actual implementation */}
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col items-center">
                  <div className="w-48 p-3 bg-primary text-white rounded-lg text-center mb-4">
                    <div className="font-medium">Board of Directors</div>
                  </div>
                  
                  <Icon name="ArrowDown" size={24} className="mb-4 text-primary" />
                  
                  <div className="w-48 p-3 bg-secondary text-white rounded-lg text-center mb-4">
                    <div className="font-medium">Executive Committee</div>
                  </div>
                  
                  <Icon name="ArrowDown" size={24} className="mb-4 text-primary" />
                  
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="p-3 bg-accent text-secondary rounded-lg text-center">
                      <div className="font-medium">Program Teams</div>
                    </div>
                    <div className="p-3 bg-accent text-secondary rounded-lg text-center">
                      <div className="font-medium">Regional Coordinators</div>
                    </div>
                    <div className="p-3 bg-accent text-secondary rounded-lg text-center">
                      <div className="font-medium">Advisory Council</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Governance Content */}
      {activeTab === 'governance' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Governance Principles */}
            <div className="card-elevated">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Shield" size={24} color="white" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold text-primary mb-2">Governance Principles</h3>
                  <p className="text-text-secondary">The core values that guide our organizational governance</p>
                </div>
              </div>
              <div className="space-y-4">
                {governanceFramework.principles.map((principle, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-text-secondary">{principle}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Governance Processes */}
            <div className="card-elevated">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="GitPullRequest" size={24} color="white" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold text-primary mb-2">Governance Processes</h3>
                  <p className="text-text-secondary">Our established procedures for ensuring transparent operations</p>
                </div>
              </div>
              <div className="space-y-4">
                {governanceFramework.processes.map((process, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-text-secondary">{process}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Policy Framework */}
          <div className="bg-surface p-6 rounded-xl shadow-md">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="FileText" size={24} color="white" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold text-primary mb-2">Policy Framework</h3>
                <p className="text-text-secondary">Key policies that guide our organizational decision-making</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded-lg hover:shadow-sm transition-smooth">
                <h4 className="font-medium text-primary mb-2">Financial Policy</h4>
                <p className="text-sm text-text-secondary">Guidelines for financial management, reporting, and transparency</p>
              </div>
              
              <div className="p-4 bg-background rounded-lg hover:shadow-sm transition-smooth">
                <h4 className="font-medium text-primary mb-2">Membership Policy</h4>
                <p className="text-sm text-text-secondary">Rules for membership eligibility, rights, and responsibilities</p>
              </div>
              
              <div className="p-4 bg-background rounded-lg hover:shadow-sm transition-smooth">
                <h4 className="font-medium text-primary mb-2">Ethics Policy</h4>
                <p className="text-sm text-text-secondary">Standards for ethical conduct, conflict resolution, and integrity</p>
              </div>
              
              <div className="p-4 bg-background rounded-lg hover:shadow-sm transition-smooth">
                <h4 className="font-medium text-primary mb-2">Partnership Policy</h4>
                <p className="text-sm text-text-secondary">Framework for establishing and managing external collaborations</p>
              </div>
              
              <div className="p-4 bg-background rounded-lg hover:shadow-sm transition-smooth">
                <h4 className="font-medium text-primary mb-2">Program Policy</h4>
                <p className="text-sm text-text-secondary">Approach to program development, implementation, and evaluation</p>
              </div>
              
              <div className="p-4 bg-background rounded-lg hover:shadow-sm transition-smooth">
                <h4 className="font-medium text-primary mb-2">Communication Policy</h4>
                <p className="text-sm text-text-secondary">Guidelines for internal and external communications</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TeamStructure;