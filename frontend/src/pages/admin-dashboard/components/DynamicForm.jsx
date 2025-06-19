import React, { useState, useEffect, useRef } from 'react';

const DynamicForm = ({ fieldsConfig, initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({});
  const [previews, setPreviews] = useState({});
  const [multipleFiles, setMultipleFiles] = useState({});
  // Keep track of accumulated files for multiple file inputs
  const filesAccumulator = useRef({});

  useEffect(() => {
    // Handle form data initialization when editing an existing item
    const defaultData = {};
    const initialPreviews = {};
    const initialMultipleFiles = {};

    console.log('Initial data for form:', initialData);
    
    if (initialData?.fileType === 'video') {
      console.log('Video file detected:', {
        fileType: initialData.fileType,
        filePath: initialData.filePath,
        mediaUrl: initialData.mediaUrl,
        thumbnailPath: initialData.thumbnailPath,
        thumbnailUrl: initialData.thumbnailUrl
      });
    }

    fieldsConfig.forEach(field => {
      if (field.type === 'file') {
        defaultData[field.name] = null; // Initialize file fields to null
        
        if (initialData) {
          // For media files, check filePath, mediaUrl, and other fields
          if (field.name === 'mediafile') {
            initialPreviews[field.name] = initialData.mediaUrl || initialData.filePath;
          }
          // For thumbnail files
          else if (field.name === 'thumbnail') {
            initialPreviews[field.name] = initialData.thumbnailUrl || initialData.thumbnailPath;
          }
          // For other image fields
          else {
            initialPreviews[field.name] = initialData[`${field.name}Url`] || 
                         initialData[field.name] || 
                         initialData.filePath;
          }
        }
      } 
      else if (field.type === 'file-multiple') {
        // Initialize multiple file fields
        defaultData[field.name] = [];
        filesAccumulator.current[field.name] = []; // Initialize accumulator for this field
        
        // If we have gallery data from the backend
        if (field.name === 'gallery' && initialData?.gallery) {
          console.log('Gallery data found in initialData:', initialData.gallery);
          // Set gallery preview images
          const galleryImages = Array.isArray(initialData.gallery) 
            ? initialData.gallery 
            : (initialData.gallery ? [initialData.gallery] : []);
          
          // Enhanced processing of gallery images
          initialMultipleFiles[field.name] = galleryImages.map(img => {
            if (typeof img === 'string') return img;
            if (img && typeof img === 'object') {
              // If object has url property, use that
              if (img.url) return img.url;
              // If object has publicId but no url, construct a URL
              if (img.publicId) return `/uploads/${img.publicId}`;
              // Try other common properties
              if (img.path) return img.path;
              if (img.filePath) return img.filePath;
            }
            return null;
          }).filter(Boolean); // Remove any null/undefined entries
          
          console.log('Processed gallery images for display:', initialMultipleFiles[field.name]);
        } else {
          // Initialize with empty array to ensure we don't get [object Object] issues
          initialMultipleFiles[field.name] = [];
          console.log(`Initialized empty gallery for new ${field.name}`);
        }
      }
      else if (field.type === 'date' && initialData?.[field.name]) {
        // Format date for input field (YYYY-MM-DD)
        const date = new Date(initialData[field.name]);
        if (!isNaN(date.getTime())) {
          defaultData[field.name] = date.toISOString().split('T')[0];
        } else {
          defaultData[field.name] = '';
        }
      }
      else if (field.name === 'gallery' && initialData?.gallery && field.type !== 'file-multiple') {
        // Convert gallery array to comma-separated string for editing (for textarea type galleries)
        defaultData[field.name] = Array.isArray(initialData.gallery) 
          ? initialData.gallery.map(img => typeof img === 'string' ? img : img.url || '').join(', ')
          : initialData.gallery;
      }
      else if (field.name === 'type' && initialData?.fileType) {
        // Map fileType back to type for select fields
        if (initialData.fileType === 'document') {
          defaultData[field.name] = 'News Article';
        } 
        else if (initialData.fileType === 'video') {
          // Default to first video type option
          const videoOption = field.options.find(opt => 
            opt === 'Documentary' || opt === 'Video Series' || opt === 'Video'
          );
          defaultData[field.name] = videoOption || 'Documentary';
        }
        else {
          defaultData[field.name] = initialData[field.name] || '';
        }
      }
      // Handle program name/title field mapping
      else if ((field.name === 'name' || field.name === 'title') && initialData) {
        // If we have a name field but title in the data (or vice versa)
        defaultData[field.name] = initialData[field.name] || initialData['title'] || initialData['name'] || '';
      }
      else {
        defaultData[field.name] = initialData?.[field.name] || '';
      }
    });

    setFormData(defaultData);
    setPreviews(initialPreviews);
    setMultipleFiles(initialMultipleFiles);
  }, [initialData, fieldsConfig]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      // Check if this is a multiple file field
      if (e.target.multiple) {
        // Convert FileList to array
        const newFiles = Array.from(files);
        
        if (newFiles.length === 0) return; // No files selected
        
        // Create preview URLs for the newly selected files
        const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
        
        // Accumulate files for this field
        const existingFiles = filesAccumulator.current[name] || [];
        const combinedFiles = [...existingFiles, ...newFiles];
        
        // Update the file accumulator reference
        filesAccumulator.current[name] = combinedFiles;
        
        // Instead of creating a custom FileList-like object,
        // just use the array of files directly.
        // FormData will handle this better when iterating.
        setFormData(prev => ({ 
          ...prev, 
          [name]: combinedFiles
        }));
        
        // Update preview URLs in the state (showing all files)
        const existingPreviews = multipleFiles[name] || [];
        
        console.log(`Adding ${newPreviewUrls.length} new images to ${existingPreviews.length} existing images for ${name}`);
        
        setMultipleFiles(prev => ({
          ...prev,
          [name]: [...existingPreviews, ...newPreviewUrls]
        }));
        
        console.log(`Updated ${name} file list:`, combinedFiles);
        console.log(`Updated ${name} preview list:`, [...existingPreviews, ...newPreviewUrls]);
      } else {
        // Handle single file
        const file = files[0];
        setFormData(prev => ({ ...prev, [name]: file }));
        if (file) {
          setPreviews(prev => ({
            ...prev,
            [name]: URL.createObjectURL(file)
          }));
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add functionality to remove individual files from multiple selections
  const handleRemoveFile = (fieldName, index) => {
    // Remove the file from the accumulator
    if (filesAccumulator.current[fieldName]) {
      const updatedFiles = [...filesAccumulator.current[fieldName]];
      updatedFiles.splice(index, 1);
      filesAccumulator.current[fieldName] = updatedFiles;
      
      // Update form data with the array directly
      setFormData(prev => ({ 
        ...prev, 
        [fieldName]: updatedFiles.length > 0 ? updatedFiles : [] 
      }));
    }
    
    // Remove the preview
    setMultipleFiles(prev => {
      const updatedPreviews = [...(prev[fieldName] || [])];
      updatedPreviews.splice(index, 1);
      return { ...prev, [fieldName]: updatedPreviews };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass both formData and additional data (including multipleFiles) to onSubmit
    onSubmit(formData, { multipleFiles });
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      onChange: handleChange,
      required: field.required,
      disabled: isLoading,
      className: 'mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm',
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} value={formData[field.name] || ''} rows={4} placeholder={field.placeholder || ''}></textarea>;
      case 'select':
        return (
          <select {...commonProps} value={formData[field.name] || ''}>
            <option value="">Select...</option>
            {field.options.map(option => (
              typeof option === 'object' 
                ? <option key={option.value} value={option.value}>{option.label}</option>
                : <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'file-multiple':
        return (
          <div>
            <input 
              {...commonProps} 
              type="file" 
              accept="image/*"
              multiple
            />
            
            {/* Show selected gallery images */}
            {multipleFiles[field.name] && multipleFiles[field.name].length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Selected images ({multipleFiles[field.name].length}):</span>
                  {field.maxCount && ` (max ${field.maxCount})`}
                </p>
                <div className="flex flex-wrap gap-3 p-2 border border-gray-200 rounded bg-gray-50">
                  {multipleFiles[field.name].map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="border-2 border-green-500 rounded overflow-hidden">
                        <img 
                          src={url} 
                          alt={`Gallery ${index + 1}`} 
                          className="h-20 w-20 object-cover"
                          onError={(e) => {
                            console.log(`Failed to load image at URL: ${url}`);
                            e.target.src = "/assets/images/no_image.png";
                          }}
                        />
                      </div>
                      {index === 0 && (
                        <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded-br">
                          Cover
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(field.name, index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 relative">
                    <label htmlFor={`${field.name}-additional`} className="absolute inset-0 flex items-center justify-center cursor-pointer">
                      <span className="text-3xl">+</span>
                    </label>
                    <input
                      id={`${field.name}-additional`}
                      name={field.name}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {!multipleFiles[field.name] || multipleFiles[field.name].length === 0 ? (
              <p className="mt-2 text-xs text-gray-500 italic">
                {field.maxCount ? `You can upload up to ${field.maxCount} images` : 'Upload multiple images'}. 
                The first image will be used as the cover if no cover image is provided.
              </p>
            ) : null}
          </div>
        );
      case 'file':
        // Determine accept type based on field name
        const acceptType = field.name === 'mediafile' ? "*/*" : "image/*";
        const previewUrl = previews[field.name];
        
        // Log preview information for debugging
        if (field.name === 'mediafile' && previewUrl) {
          console.log('Rendering preview for media file:', {
            fieldName: field.name,
            previewUrl,
            isVideo: initialData?.fileType === 'video' || previewUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/),
            fileType: initialData?.fileType,
            poster: initialData?.thumbnailUrl || initialData?.thumbnailPath
          });
        }
        
        return (
          <div>
            <input 
              {...commonProps} 
              type="file" 
              accept={acceptType}
            />
            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">
                  Current file {!field.required && "(will be kept if no new file is selected)"}:
                </p>
                {(field.name === 'mediafile' && (initialData?.fileType === 'video' || previewUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/))) ? (
                  <div className="relative">
                    <video 
                      src={previewUrl} 
                      className="max-w-full h-auto object-contain rounded"
                      style={{ maxHeight: '200px' }}
                      controls
                      preload="metadata"
                      poster={initialData?.thumbnailUrl || initialData?.thumbnailPath}
                    />
                    <div className="text-xs mt-1 text-gray-500">Video Preview</div>
                  </div>
                ) : (
                  <img src={previewUrl} alt="Preview" className="h-32 w-auto object-cover rounded"/>
                )}
              </div>
            )}
            {!field.required && !previewUrl && (
              <p className="mt-2 text-xs text-gray-500 italic">This field is optional</p>
            )}
          </div>
        );
      case 'text':
      case 'number':
      default:
        return <input {...commonProps} type={field.type} value={formData[field.name] || ''} placeholder={field.placeholder || ''} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fieldsConfig.map(field => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
          {renderField(field)}
        </div>
      ))}
      <div className="flex justify-end space-x-4 pt-4">
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={isLoading}
          className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isLoading}
          className={`px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 flex items-center justify-center min-w-[120px] ${
            isLoading ? 'opacity-80 cursor-wait' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
