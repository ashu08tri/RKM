import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import HeroSection from './components/HeroSection';
import MissionHighlights from './components/MissionHighlights';
import MilestonesSection from './components/MilestonesSection';
import TeamSection from './components/TeamSection';
import OurVisionSection from './components/OurVisionSection';
import Footer from './components/Footer';

const Homepage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const navigate = useNavigate();

  const handleMemberRegistration = () => {
    navigate('/member-registration-modal');
  };

  const handleYouthLeadership = () => {
    navigate('/youth-leadership-program-modal');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Language Selector */}
      <Header toggleLanguage={() => setSelectedLanguage(selectedLanguage === 'en' ? 'hi' : 'en')} selectedLanguage={selectedLanguage} />

      {/* Hero Section */}
      <HeroSection 
        onMemberRegistration={handleMemberRegistration}
        onYouthLeadership={handleYouthLeadership}
        language={selectedLanguage}
      />

      {/* Mission Highlights */}
      <MissionHighlights language={selectedLanguage} />

      {/* Milestones Section */}
      <MilestonesSection language={selectedLanguage} />

      {/* Our Vision Section */}
      <OurVisionSection language={selectedLanguage} />

      {/* Team Section */}
      <TeamSection language={selectedLanguage} />

      {/* Footer */}
      <Footer language={selectedLanguage} />
    </div>
  );
};

export default Homepage;