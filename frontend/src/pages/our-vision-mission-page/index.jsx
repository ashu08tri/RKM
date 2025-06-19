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
          {/* Vision Card */}
          <div className="card-elevated">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                <Icon name="Eye" size={24} color="white" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-primary">Our Vision</h2>
            </div>
            <ul className="list-disc list-inside text-text-secondary leading-relaxed font-body space-y-2">
              <li>To build a just, inclusive, and farmer-centric democracy.</li>
              <li>To ensure that farmers are not just voters, but respected policymakers and economically empowered citizens.</li>
              <li>To create a nation where every farmer enjoys dignity, income security, and access to quality education and healthcare.</li>
              <li>To realign the democratic discourse around agrarian issues, social justice, and constitutional rights.</li>
              <li>To establish a society where the backbone of the nation—the farmer—is recognized as a central force in India’s development.</li>
            </ul>
          </div>

          {/* Mission Card */}
          <div className="card-elevated">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
                <Icon name="Target" size={24} color="white" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-primary">Our Mission</h2>
            </div>
            <ul className="list-disc list-inside text-text-secondary leading-relaxed font-body space-y-2">
              <li>Advocate for constitutional guarantees such as:
                <ul className="list-disc ml-5 space-y-1">
                  <li>Legal enforcement of Minimum Support Price (MSP).</li>
                  <li>Formation of a National Farmers’ Commission with direct farmer representation.</li>
                  <li>Protection of land rights and resistance to unjust acquisition.</li>
                </ul>
              </li>
              <li>Promote equitable access to:
                <ul className="list-disc ml-5 space-y-1">
                  <li>Quality education free from privatization and inequality.</li>
                  <li>Universal healthcare that is accessible to rural and underprivileged communities.</li>
                </ul>
              </li>
              <li>Challenge political narratives based on religion or caste and redirect focus to:
                <ul className="list-disc ml-5 space-y-1">
                  <li>Income, public services, and social welfare.</li>
                  <li>Transparency and accountability in government spending.</li>
                </ul>
              </li>
              <li>Engage in:
                <ul className="list-disc ml-5 space-y-1">
                  <li>Policy research and solution-oriented activism.</li>
                  <li>Grassroots mobilization and public awareness campaigns.</li>
                  <li>Constructive dialogue with political parties, civil society, and media.</li>
                </ul>
              </li>
              <li>Uphold the constitutional values of equality, liberty, and fraternity in all actions and campaigns.</li>
            </ul>
          </div>

          {/* Political Mission Card */}
          <div className="card-elevated md:col-span-2 max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
                <Icon name="Users" size={24} color="white" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-primary">Our Political Mission</h2>
            </div>
            <ul className="list-disc list-inside text-text-secondary leading-relaxed font-body space-y-2">
              <li>To reclaim political space for farmers and rural citizens by bringing agrarian issues to the forefront of national and state-level political discourse.</li>
              <li>To challenge the dominance of communal, caste-based, and corporate-driven politics by promoting a value-based, development-oriented political alternative rooted in income, education, healthcare, and rural dignity.</li>
              <li>To build a strong, farmer-led political platform that not only demands policy reforms but actively participates in elections at local, state, and national levels to influence governance from within.</li>
              <li>To train and empower grassroots leadership from farming and rural communities, ensuring their representation in decision-making bodies and elected offices.</li>
              <li>To expose misuse of public funds on political luxuries and demand accountability in governance, redirecting state resources toward public welfare schemes.</li>
              <li>To engage in issue-based political alliances that uphold the principles of social justice, economic equality, and constitutional democracy, without being tied to any one party or ideology.</li>
              <li>To foster a new political consciousness among citizens that prioritizes public interest over populism, and evaluates leaders on their commitment to farmer welfare, rural development, and transparent governance.</li>
            </ul>
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