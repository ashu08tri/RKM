import React, { useState, useEffect } from 'react';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import informationService from 'services/informationService';
import Image from 'components/AppImage';
import ContentCard from './components/ContentCard';
import ContentModal from '../our-vision-mission-page/components/ContentModal';

const InformationCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [regionFilter, setRegionFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [governmentSchemes, setGovernmentSchemes] = useState([]);
  const [agriculturalResources, setAgriculturalResources] = useState([]);
  const [educationalMaterials, setEducationalMaterials] = useState([]);
  const [newsUpdates, setNewsUpdates] = useState([]);
  const [flattenedInformation, setFlattenedInformation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sections = [
    { title: "Government Schemes", group: "governmentSchemes" },
    { title: "Agricultural Resources", group: "agriculturalResources" },
    { title: "Educational Materials", group: "educationalMaterials" },
    { title: "News & Updates", group: "newsUpdates" },
  ];


  useEffect(() => {
    const fetchInformation = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await informationService.getInformationItems();
        const groups = response.data?.data || [];

        const flatList = [];

        groups.forEach(group => {
          const itemsWithGroupTitle = (group.items || []).map(item => ({
            ...item,
            groupTitle: group.groupTitle,
          }));

          flatList.push(...itemsWithGroupTitle);
        });

        setFlattenedInformation(flatList);
      } catch (err) {
        console.error('Failed to fetch information items:', err);
        setError('Unable to load information.');
      } finally {
        setLoading(false);
      }
    };

    fetchInformation();
  }, []);

  // Filter and search functionality
  const filterContent = (content) => {
    return content.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Region filter
      if (regionFilter !== 'all' && item.region !== regionFilter && item.region !== 'all') {
        return false;
      }

      // Search query
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  };

  const sortContent = (content) => {
    switch (sortBy) {
      case 'date':
        return [...content].sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'engagement':
        return [...content].sort((a, b) => b.engagementMetric - a.engagementMetric);
      default: // 'relevance' - we'll assume default order is by relevance
        return content;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const toggleBookmark = (resourceId) => {
    if (bookmarkedResources.includes(resourceId)) {
      setBookmarkedResources(bookmarkedResources.filter(id => id !== resourceId));
    } else {
      setBookmarkedResources([...bookmarkedResources, resourceId]);
    }
  };

  const handleCardClick = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container-custom py-8">
        <Breadcrumb customItems={[
          { label: 'Home', path: '/homepage', isActive: false },
          { label: 'Information Center', path: '/information-center-page', isActive: true }
        ]} />

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
            <Icon name="Library" size={32} color="white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Information Center
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Access comprehensive agricultural resources, government schemes, and educational content to enhance your farming knowledge and productivity.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-surface rounded-xl p-6 shadow-md mb-12">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <label htmlFor="search" className="form-label">Search Resources</label>
                <div className="relative">
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for schemes, guides, resources..."
                    className="form-input pl-10 pr-4 py-3 w-full"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="Search" size={18} className="text-text-secondary" />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-48">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Categories</option>
                  <option value="subsidy">Subsidies</option>
                  <option value="certification">Certification</option>
                  <option value="insurance">Insurance</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="sustainable">Sustainable</option>
                  <option value="weather">Weather</option>
                  <option value="pdf">PDF Guides</option>
                  <option value="video">Videos</option>
                  <option value="infographic">Infographics</option>
                  <option value="policy">Policy</option>
                  <option value="market">Market</option>
                  <option value="event">Events</option>
                </select>
              </div>

              {/* Region Filter */}
              <div className="w-full md:w-48">
                <label htmlFor="region" className="form-label">Region</label>
                <select
                  id="region"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Regions</option>
                  <option value="national">National</option>
                  <option value="north">North India</option>
                  <option value="south">South India</option>
                  <option value="east">East India</option>
                  <option value="west">West India</option>
                  <option value="central">Central India</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="w-full md:w-auto">
                <button
                  type="submit"
                  className="btn-primary w-full md:w-auto flex items-center justify-center space-x-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="Search" size={18} />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-text-primary">Sort by:</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setSortBy('relevance')}
                    className={`px-3 py-1 text-sm rounded-full transition-smooth ${sortBy === 'relevance' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:bg-accent'}`}
                  >
                    Relevance
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('date')}
                    className={`px-3 py-1 text-sm rounded-full transition-smooth ${sortBy === 'date' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:bg-accent'}`}
                  >
                    Latest
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('engagement')}
                    className={`px-3 py-1 text-sm rounded-full transition-smooth ${sortBy === 'engagement' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:bg-accent'}`}
                  >
                    Most Viewed
                  </button>
                </div>
              </div>

              <div className="flex items-center mt-4 md:mt-0">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setRegionFilter('all');
                    setSortBy('relevance');
                  }}
                  className="text-sm text-primary hover:text-secondary transition-smooth flex items-center space-x-1"
                >
                  <Icon name="RefreshCw" size={14} />
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Quick Access Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-semibold text-text-primary mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-surface rounded-lg border border-border hover:shadow-md transition-smooth flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-3">
                <Icon name="FileText" size={24} color="#4a7c59" />
              </div>
              <span className="text-text-primary font-medium text-sm">Loan Applications</span>
            </button>

            <button className="p-4 bg-surface rounded-lg border border-border hover:shadow-md transition-smooth flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-3">
                <Icon name="Award" size={24} color="#4a7c59" />
              </div>
              <span className="text-text-primary font-medium text-sm">Certification Process</span>
            </button>

            <button className="p-4 bg-surface rounded-lg border border-border hover:shadow-md transition-smooth flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-3">
                <Icon name="CalendarCheck" size={24} color="#4a7c59" />
              </div>
              <span className="text-text-primary font-medium text-sm">Seasonal Calendars</span>
            </button>

            <button className="p-4 bg-surface rounded-lg border border-border hover:shadow-md transition-smooth flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-3">
                <Icon name="HelpCircle" size={24} color="#4a7c59" />
              </div>
              <span className="text-text-primary font-medium text-sm">FAQ & Support</span>
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center my-10 text-gray-500 font-medium">
            Loading information content...
          </div>
        )}

        {error && (
          <div className="text-center my-10 text-red-500 font-medium">
            {error}
          </div>
        )}

        {!loading && !error && flattenedInformation.length === 0 && (
          <div className="text-center my-10 text-gray-500 font-medium">
            No content available at the moment.
          </div>
        )}

        {!loading && !error && sections.map(section => {
          const filteredItems = sortContent(
            filterContent(flattenedInformation.filter(item => item.groupTitle === section.group))
          );

          if (filteredItems.length === 0) return null;

          return (
            <section className="mb-16" key={section.group}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-semibold text-text-primary">
                  {section.title}
                </h2>
                <button className="text-primary hover:text-secondary transition-smooth flex items-center space-x-1">
                  <span>View All</span>
                  <Icon name="ArrowRight" size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <ContentCard
                    key={item._id}
                    item={item}
                    toggleBookmark={toggleBookmark}
                    bookmarkedResources={bookmarkedResources}
                    onCardClick={handleCardClick}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Community Contribution Section */}
        <section className="bg-surface rounded-xl p-8 shadow-md mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-semibold text-text-primary mb-3">
              Share Your Knowledge
            </h2>
            <p className="text-text-secondary max-w-3xl mx-auto">
              Have agricultural insights, local farming tips, or resources to share with the community? Contribute to our knowledge base and help fellow farmers.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <button className="btn-primary flex items-center space-x-2">
              <Icon name="Upload" size={18} />
              <span>Submit a Resource</span>
            </button>

            <button className="btn-outline flex items-center space-x-2">
              <Icon name="MessageSquare" size={18} />
              <span>Join Discussion Forum</span>
            </button>
          </div>
        </section>

        {/* Bookmark Reminder */}
        <div className="rounded-lg bg-accent bg-opacity-30 p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
              <Icon name="Bookmark" size={24} color="white" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-text-primary">Save resources for later</h3>
              <p className="text-sm text-text-secondary">Bookmark content to create your personalized resource library</p>
            </div>
          </div>

          <button className="btn-secondary flex items-center space-x-2">
            <Icon name="Bookmark" size={18} />
            <span>View Bookmarks</span>
          </button>
        </div>

        {/* Content Modal */}
        <ContentModal
          isOpen={isModalOpen}
          onClose={closeModal}
          content={modalContent}
        />
      </div>
    </div>
  );
};

export default InformationCenterPage;