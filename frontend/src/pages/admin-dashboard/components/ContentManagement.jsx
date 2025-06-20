import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'components/AppIcon';
import teamService from 'services/teamService';
import informationService from 'services/informationService';
import mediaService from 'services/mediaService';
import programService from 'services/programService';
import projectService from 'services/projectService';
import { formatDistanceToNow } from 'date-fns';
import EditModal from './EditModal';
import DynamicForm from './DynamicForm';
import ConfirmModal from './ConfirmModal';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('media');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [teamMembers, setTeamMembers] = useState([]);
  const [informationContent, setInformationContent] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [projects, setProjects] = useState([]);

  const contentSections = [
    { id: 'media', title: 'Media Gallery', icon: 'Image', description: 'Manage photos and videos' },
    { id: 'programs', title: 'Programs', icon: 'Activity', description: 'Manage ongoing programs' },
    { id: 'projects', title: 'Upcoming Projects', icon: 'Zap', description: 'Manage future projects' },
    { id: 'team', title: 'Team Profiles', icon: 'Users', description: 'Manage team member information' },
    { id: 'information', title: 'Information Center', icon: 'FileText', description: 'Update articles and content' }
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      switch (activeTab) {
        case 'media':
          response = await mediaService.getMediaItems();
          console.log('Media items response:', response);
          setMediaItems(Array.isArray(response.data) ? response.data : (response.data?.data || []));
          break;
        case 'programs':
          response = await programService.getPrograms();
          setPrograms(Array.isArray(response.data) ? response.data : (response.data?.data || []));
          break;
        case 'projects':
          response = await projectService.getProjects();
          setProjects(Array.isArray(response.data) ? response.data : (response.data?.data || []));
          break;
        case 'team':
          response = await teamService.getTeamMembers();
          setTeamMembers(Array.isArray(response.data) ? response.data : (response.data?.data || []));
          break;
        case 'information':
          response = await informationService.getInformationItems();
          console.log('Information response:', response);

          const infoGroups = Array.isArray(response.data)
            ? response.data
            : (response.data?.data || []);

          const flattened = infoGroups.flatMap(group =>
            group.items.map(item => ({
              ...item,
              groupTitle: group.groupTitle,
            }))
          );

          setInformationContent(flattened);
          break;
        default:
          break;
      }
    } catch (err) {
      setError(`Failed to fetch ${activeTab} data.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddNew = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    console.log('Editing item:', item);

    // Create a copy of the item to avoid modifying the original data
    const itemForEdit = { ...item };

    // For media items, ensure type field is properly mapped from fileType
    if (activeTab === 'media') {
      // Map fileType to type for the form
      if (itemForEdit.fileType === 'document') {
        itemForEdit.type = 'News Article';
      } else if (itemForEdit.fileType === 'video') {
        // Default to first video option
        itemForEdit.type = 'Documentary';
      }

      // Ensure mediaUrl is set from filePath if needed
      if (!itemForEdit.mediaUrl && itemForEdit.filePath) {
        itemForEdit.mediaUrl = itemForEdit.filePath;
      }

      // Ensure thumbnailUrl is set for video thumbnails
      if (itemForEdit.fileType === 'video') {
        if (!itemForEdit.thumbnailUrl && itemForEdit.thumbnailPath) {
          itemForEdit.thumbnailUrl = itemForEdit.thumbnailPath;
        }
      }
    }

    console.log('Prepared for edit:', itemForEdit);
    setCurrentItem(itemForEdit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setError(null);
  };

  const handleDelete = (item) => {
    console.log('Preparing to delete item:', item);
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    console.log(itemToDelete);
    
    if (!itemToDelete || !itemToDelete._id) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`Attempting to delete ${activeTab} item with ID: ${itemToDelete._id}`);

      let response;
      switch (activeTab) {
        case 'media':
          response = await mediaService.deleteMediaItem(itemToDelete._id);
          break;
        case 'programs':
          response = await programService.deleteProgram(itemToDelete._id);
          break;
        case 'projects':
          response = await projectService.deleteProject(itemToDelete._id);
          break;
        case 'team':
          response = await teamService.deleteTeamMember(itemToDelete._id);
          break;
        case 'information':
          response = await informationService.deleteInformationItem(itemToDelete.groupTitle, itemToDelete._id);
          break;
        default:
          throw new Error('Invalid content type for delete operation');
      }

      console.log(`Deletion response:`, response);

      // Close the modal
      handleCloseDeleteModal();

      // Refresh data after a short delay to ensure the backend has time to complete the deletion
      setTimeout(() => {
        fetchData();
      }, 500);

    } catch (err) {
      console.error(`Error deleting ${activeTab} item:`, err);
      setError(`Failed to delete item. ${err.response?.data?.message || err.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData, additionalData = {}, infoItemID) => {
    setLoading(true);
    setError(null);

    const isRawFormData = formData instanceof FormData;
    const data = isRawFormData ? formData : new FormData();
    const { multipleFiles } = additionalData;

    // Only do this if formData is not already FormData (i.e., raw object)
    if (!isRawFormData) {
      console.log('Form data before processing:', formData);
      console.log('Additional form data:', additionalData);

      const isEditing = currentItem && currentItem._id;
      const fileFieldsToSkip = [];

      if (isEditing) {
        const fileFields = ['mediafile', 'photo', 'image', 'coverImage', 'imageUrl', 'photoUrl'];
        fileFields.forEach(field => {
          if (field in formData && !formData[field]) {
            fileFieldsToSkip.push(field);
          }
        });
      }

      // Gallery handling
      const galleryFiles = formData.gallery;
      delete formData.gallery;

      if (galleryFiles && galleryFiles.length > 0) {
        for (let i = 0; i < galleryFiles.length; i++) {
          const file = galleryFiles[i];
          if (file instanceof File) {
            data.append('gallery', file);
          }
        }
        if (isEditing) {
          data.append('replaceGallery', 'true');
        }
      } else if (isEditing) {
        if (multipleFiles?.gallery?.length === 0) {
          data.append('clearGallery', 'true');
        } else if (multipleFiles?.gallery?.length > 0) {
          const existingImages = multipleFiles.gallery
            .filter(url => !url.startsWith('blob:'))
            .map(url => ({
              url: url,
              publicId: url.split('/').pop().split('.')[0]
            }));

          if (existingImages.length > 0) {
            data.append('existingGallery', JSON.stringify(existingImages));
          } else {
            data.append('replaceGallery', 'true');
          }
        }
      }

      // Convert expectedStartDate to ISO
      if (formData.expectedStartDate) {
        const date = new Date(formData.expectedStartDate);
        if (!isNaN(date.getTime())) {
          formData.expectedStartDate = date.toISOString();
        }
      }

      if ((activeTab === 'programs' || activeTab === 'projects') && formData.title && !formData.name) {
        formData.name = formData.title;
        delete formData.title;
      }

      Object.keys(formData).forEach(key => {
        if (isEditing && fileFieldsToSkip.includes(key)) return;
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
    } else {
      console.log('Using FormData instance directly, skipping conversion.');
    }

    try {
      if (currentItem && currentItem._id) {   
        switch (activeTab) {
          case 'media': await mediaService.updateMediaItem(currentItem._id, data); break;
          case 'programs': await programService.updateProgram(currentItem._id, data); break;
          case 'projects': await projectService.updateProject(currentItem._id, data); break;
          case 'team': await teamService.updateTeamMember(currentItem._id, data); break;
          case 'information': await informationService.updateInformationItem(currentItem.groupTitle, currentItem._id, data);break;
          default: throw new Error('Invalid content type for update');
        }
      } else {
        switch (activeTab) {
          case 'media': await mediaService.createMediaItem(data); break;
          case 'programs': await programService.createProgram(data); break;
          case 'projects': await projectService.createProject(data); break;
          case 'team': await teamService.createTeamMember(data); break;
          case 'information': await informationService.createInformationItem(data); break;
          default: throw new Error('Invalid content type for create');
        }
      }

      handleCloseModal();
      fetchData();
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.response?.data?.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };


  const getFormConfig = (contentType) => {
    // Determine if we're editing or creating new 
    const isEditing = !!currentItem;

    switch (contentType) {
      case 'media':
        return [
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'type', label: 'Media Type', type: 'select', options: ['News Article', 'Documentary', 'Video Series'], required: true },
          { name: 'mediafile', label: isEditing ? 'Media File (only if changing)' : 'Media File', type: 'file', required: !isEditing },
          { name: 'thumbnail', label: 'Thumbnail Image (for videos)', type: 'file', required: false },
          { name: 'gallery', label: 'Gallery Images URLs (comma separated)', type: 'textarea', placeholder: 'https://example.com/image1.jpg, https://example.com/image2.jpg', required: false },
          { name: 'category', label: 'Category', type: 'text', required: false },
          { name: 'uploadDate', label: 'Date', type: 'date', required: false },
        ];
      case 'programs':
        return [
          { name: 'name', label: 'Program Name', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'beneficiaries', label: 'Beneficiaries', type: 'text', required: false },
          { name: 'programDuration', label: 'Program Duration', type: 'text', required: false, placeholder: 'e.g., 3 months, 1 year' },
          { name: 'coverImage', label: isEditing ? 'Cover Image (only if changing)' : 'Cover Image', type: 'file', required: !isEditing },
          { name: 'gallery', label: 'Gallery Images (up to 10)', type: 'file-multiple', maxCount: 10, required: false },
          { name: 'status', label: 'Status', type: 'select', options: ['Ongoing', 'Completed', 'Upcoming', 'Draft'], required: true },
          { name: 'uploadDate', label: 'Date', type: 'date', required: false },
        ];
      case 'projects':
        return [
          { name: 'name', label: 'Project Name', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'budget', label: 'Budget', type: 'text', required: true, placeholder: 'e.g., ₹2.5 Crores' },
          { name: 'targetFarms', label: 'Target Farms', type: 'text', required: true, placeholder: 'e.g., 500' },
          { name: 'coverImage', label: isEditing ? 'Cover Image (only if changing)' : 'Cover Image', type: 'file', required: !isEditing },
          { name: 'gallery', label: 'Gallery Images (up to 10)', type: 'file-multiple', maxCount: 10, required: false },
          { name: 'expectedStartDate', label: 'Expected Start Date', type: 'date', required: false },
          { name: 'location', label: 'Location', type: 'text', required: false },
          { name: 'status', label: 'Status', type: 'select', options: ['Planned', 'In Progress', 'On Hold', 'Completed', 'Cancelled', 'Draft'], required: true },
          { name: 'uploadDate', label: 'Date', type: 'date', required: false },
        ];
      case 'team':
        return [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'role', label: 'Role', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: false },
          { name: 'email', label: 'Email', type: 'email', required: false },
          { name: 'phone', label: 'Phone Number', type: 'text', required: false },
          { name: 'photo', label: isEditing ? 'Photo (only if changing)' : 'Photo', type: 'file', required: !isEditing },
        ];
      case 'information':
        return [
          { name: 'groupTitle', label: 'Group Title', type: 'select', options: ['governmentSchemes', 'agriculturalResources', 'educationalMaterials', 'newsUpdates'], required: true },
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'image', label: isEditing ? 'Image (only if changing)' : 'Image', type: 'file', required: !isEditing },
          { name: 'category', label: 'Category', type: 'select', options: ['subsidy', 'certification', 'insurance', 'seasonal', 'sustainable', 'weather'], required: true },
          { name: 'region', label: 'Region', type: 'select', options: ['national', 'north', 'south', 'east', 'west', 'all'], required: true },
          { name: 'date', label: 'Date', type: 'date', required: true },
          { name: 'engagementMetric', label: 'Engagement Metric', type: 'number', required: false },
          { name: 'fileType', label: 'File Type', type: 'select', options: ['document', 'image', 'video'], required: true },
        ];
      default:
        return [];
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'px-2 py-0.5 text-xs font-medium rounded-full';
    if (status === 'Published') return <span className={`${baseClasses} bg-green-100 text-green-800`}>Published</span>;
    if (status === 'Draft') return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Draft</span>;
    return null;
  };

  const renderGenericListItem = (item, imageUrlKey, titleKey) => {
    const formatDate = (date) => {
      if (!date) return null;
      try {
        const dateObj = new Date(date);
        return !isNaN(dateObj.getTime()) ? formatDistanceToNow(dateObj, { addSuffix: true }) : null;
      } catch (error) {
        return null;
      }
    };

    // Get the most recent date between updatedAt and createdAt
    const dateText = formatDate(item.updatedAt) || formatDate(item.createdAt) || formatDate(item.uploadDate) || 'Update date unavailable';

    // Format the actual date for display
    const formattedDate = item.updatedAt || item.createdAt || item.uploadDate ?
      new Date(item.updatedAt || item.createdAt || item.uploadDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : '';

    // Determine the best image URL to use
    let imageUrl = item[imageUrlKey];

    // For videos, prefer thumbnail if available
    if (item.fileType === 'video') {
      imageUrl = item.thumbnailUrl || item.thumbnailPath || imageUrl;
    }

    return (
      <div key={item._id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {imageUrl && <img src={imageUrl} alt={item[titleKey]} className="w-24 h-16 rounded object-cover" />}
          <div>
            {item && item.groupTitle && <p className="text-xs text-gray-400 mt-1">Group: {item.groupTitle}</p>}
            <h3 className="text-lg font-medium text-gray-900">{item[titleKey] || 'Untitled'}</h3>
            <p className="text-sm text-gray-500">
              <span className="inline-block mr-2">{formattedDate}</span> •
              <span className="inline-block ml-2 italic">{dateText}</span>
            </p>
            {item.fileType === 'video' && (
              <p className="text-xs text-gray-500 mt-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Video {item.duration && `• ${item.duration}`}
                </span>
              </p>
            )}
            {(item.beneficiaries || item.programDuration) && (
              <div className="flex flex-wrap gap-2 mt-1">
                {item.beneficiaries && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                    <Icon name="Users" size={12} className="mr-1" />
                    {item.beneficiaries} beneficiaries
                  </span>
                )}
                {item.programDuration && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                    <Icon name="Clock" size={12} className="mr-1" />
                    {item.programDuration}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(item)}
            className="p-2 rounded-md hover:bg-gray-100"
            title="Edit"
          >
            <Icon name="Edit" size={16} />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="p-2 rounded-md hover:bg-gray-100 text-red-500"
            title="Delete"
          >
            <Icon name="Trash2" size={16} />
          </button>
        </div>
      </div>
    );
  };

  const renderContentList = () => {
    if (loading) {
      return (
        <div className="text-center py-12 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      );
    }
    if (error) {
      return <div className="text-center py-12 text-red-500">{error}</div>;
    }

    const renderList = (items, renderItem, emptyMessage) => {
      if (!items || items.length === 0) {
        return <div className="text-center py-12 text-gray-500">{emptyMessage}</div>;
      }
      return <div className="space-y-4">{items.filter(Boolean).map(renderItem)}</div>;
    };

    switch (activeTab) {
      case 'media':
        return renderList(mediaItems, item => renderGenericListItem(item, 'mediaUrl', 'title'), 'No media content available yet.');
      case 'programs':
        return renderList(programs, item => renderGenericListItem(item, 'coverImage', 'name'), 'No programs available yet.');
      case 'projects':
        return renderList(projects, item => renderGenericListItem(item, 'coverImage', 'name'), 'No projects available yet.');
      case 'team':
        return renderList(teamMembers, (member) => (
          <div key={member._id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                </div>
                <div className="text-sm text-gray-500">
                  {member.role}
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                  {member.email && (
                    <span className="flex items-center">
                      <Icon name="Mail" size={12} className="mr-1" />
                      {member.email}
                    </span>
                  )}
                  {member.phone && (
                    <span className="flex items-center">
                      <Icon name="Phone" size={12} className="mr-1" />
                      {member.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEdit(member)}
                className="p-2 rounded-md hover:bg-gray-100"
                title="Edit"
              >
                <Icon name="Edit" size={16} />
              </button>
              <button
                onClick={() => handleDelete(member)}
                className="p-2 rounded-md hover:bg-gray-100 text-red-500"
                title="Delete"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          </div>
        ), 'No team members available yet.');
      case 'information':
        return renderList(informationContent, item => renderGenericListItem(item, 'image', 'title'), 'No information content available yet.');
      default:
        return <div className="text-center py-12">Select a category to manage content.</div>;
    }
  };

  const modalTitle = currentItem
    ? `Edit ${contentSections.find(s => s.id === activeTab)?.title}`
    : `Add New ${contentSections.find(s => s.id === activeTab)?.title}`;

  // Add global loading indicator that shows during API requests
  const GlobalLoadingIndicator = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
      <div className="fixed top-0 left-0 w-full h-1 bg-green-100 overflow-hidden z-50">
        <div className="h-full bg-green-700 animate-loadingBar"></div>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">
      <GlobalLoadingIndicator isVisible={loading} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {contentSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveTab(section.id)}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition-all text-left ${activeTab === section.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Icon name={section.icon} size={20} className={activeTab === section.id ? 'text-green-700' : 'text-gray-500'} />
              <h3 className="font-medium text-gray-800">{section.title}</h3>
            </div>
            <p className="text-sm text-gray-500">{section.description}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {contentSections.find((s) => s.id === activeTab)?.title}
          </h2>
          <p className="text-gray-500">
            {contentSections.find((s) => s.id === activeTab)?.description}
          </p>
        </div>
        <button
          className={`bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 flex items-center space-x-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          onClick={handleAddNew}
          disabled={loading}
        >
          <Icon name="Plus" size={16} />
          <span>Add New</span>
        </button>
      </div>

      {renderContentList()}

      <EditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
      >
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
        <DynamicForm
          key={currentItem?._id || 'new'}
          fieldsConfig={getFormConfig(activeTab)}
          initialData={currentItem}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          isLoading={loading}
        />
      </EditModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this ${activeTab === 'media' ? 'media item' :
          activeTab === 'programs' ? 'program' :
            activeTab === 'projects' ? 'project' :
              activeTab === 'team' ? 'team member' : 'information item'
          }?`}
        isLoading={loading}
      />
    </div>
  );
};

export default ContentManagement;