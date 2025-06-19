import React, { useState } from 'react';
import Breadcrumb from 'components/ui/Breadcrumb';
import TabNavigation from './components/TabNavigation';
import MediaCarousel from './components/MediaCarousel';
import ProgramsCarousel from './components/ProgramsCarousel';
import UpcomingProjectsCarousel from './components/UpcomingProjectsCarousel';
import ContentModal from './components/ContentModal';
import Icon from 'components/AppIcon';
import MemberRegistrationModal from '../member-registration-modal';
import YouthLeadershipProgramModal from '../youth-leadership-program-modal';

const OurVisionMissionPage = () => {
  const [activeTab, setActiveTab] = useState('media');
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMemberRegistration, setShowMemberRegistration] = useState(false);
  const [showYouthProgram, setShowYouthProgram] = useState(false);

  const tabs = [
    { id: 'media', label: 'Media', icon: 'Camera' },
    { id: 'programs', label: 'Programs', icon: 'Target' },
    { id: 'upcoming', label: 'Upcoming Projects', icon: 'Calendar' }
  ];

  const handleCardClick = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const renderActiveCarousel = () => {
    switch (activeTab) {
      case 'media':
        return <MediaCarousel onCardClick={handleCardClick} />;
      case 'programs':
        return <ProgramsCarousel onCardClick={handleCardClick} />;
      case 'upcoming':
        return <UpcomingProjectsCarousel onCardClick={handleCardClick} />;
      default:
        return <MediaCarousel onCardClick={handleCardClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container-custom py-8">
        <Breadcrumb />
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
            <Icon name="Eye" size={32} color="white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Our Vision & Mission
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto font-body">
            Discover our commitment to agricultural excellence, community empowerment, and sustainable farming practices that drive positive change across rural India.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="card-elevated">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                <Icon name="Eye" size={24} color="white" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-primary">Our Vision</h2>
            </div>
            <p className="text-text-secondary leading-relaxed font-body">
              To create a thriving agricultural ecosystem where every farmer has access to modern technology, fair markets, and sustainable practices that ensure food security and prosperity for rural communities across India.
            </p>
          </div>

          <div className="card-elevated">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
                <Icon name="Target" size={24} color="white" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-primary">Our Mission</h2>
            </div>
            <p className="text-text-secondary leading-relaxed font-body">
              To empower farmers through education, advocacy, and collective action while promoting sustainable agricultural practices, ensuring fair pricing, and building strong rural communities that can adapt to changing global challenges.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content Area */}
        <div className="mt-8">
          {renderActiveCarousel()}
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 text-center">
          <div className="card bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-xl">
            <h3 className="text-2xl font-heading font-semibold mb-4">
              Join Our Movement
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Be part of the change you want to see in agriculture. Together, we can build a stronger farming community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowMemberRegistration(true)}
                className="bg-white text-primary px-6 py-3 rounded-md font-medium transition-all duration-200 hover:bg-gray-100 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
                Become a Member
              </button>
              <button 
                onClick={() => setShowYouthProgram(true)}
                className="border-2 border-white text-white px-6 py-3 rounded-md font-medium transition-all duration-200 hover:bg-white hover:text-primary focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
                Youth Leadership Program
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Modal */}
      <ContentModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        content={modalContent}
      />

      {/* Member Registration Modal */}
      {showMemberRegistration && <MemberRegistrationModal onClose={() => setShowMemberRegistration(false)} />}

      {/* Youth Leadership Program Modal */}
      {showYouthProgram && <YouthLeadershipProgramModal onClose={() => setShowYouthProgram(false)} />}
    </div>
  );
};

export default OurVisionMissionPage;