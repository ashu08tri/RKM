import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import api from 'services/api';

const TeamSection = ({ language }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/team');
        // Sort by createdAt as we don't have displayOrder anymore
        const sortedMembers = response.data.sort((a, b) =>
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        setTeamMembers(sortedMembers);
        setError(null);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const content = {
    en: {
      title: "Our Leadership",
      subtitle: "Meet the dedicated team driving agricultural transformation",
      viewAllTeam: "View All Team Members",
    },
    hi: {
      title: "हमारा नेतृत्व",
      subtitle: "कृषि परिवर्तन को आगे बढ़ाने वाली समर्पित टीम से मिलें",
      viewAllTeam: "सभी टीम सदस्यों को देखें",
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom text-center">
          <p>Loading team members...</p>
        </div>
      </section>
    );
  }

  // Handle error state
  if (error) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  // If we have no team members, display a message
  if (teamMembers.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom text-center">
          <p>No team members found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-background">
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
            to="/team-leadership-page"
            className="btn-outline inline-flex items-center space-x-2"
          >
            <Icon name="Users" size={20} />
            <span>{content[language].viewAllTeam}</span>
          </Link>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.slice(0, 5).map((member) => (
              <Link
                key={member._id}
                to="/team-leadership-page"
                state={{ selectedMember: member }} 
                className="group text-center cursor-pointer transition-transform transform hover:-translate-y-2"
              >
                <div className="w-56 h-56 mx-auto rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-base font-semibold text-text-primary">
                    {member.name}
                  </h4>
                  <p className="text-sm text-primary font-medium">
                    {member.role}
                  </p>
                </div>
              </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;