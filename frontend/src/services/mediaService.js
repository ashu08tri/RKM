import api from './api';
import visionService from './visionService';

const API_URL = '/media';

const getMediaItems = (params) => api.get(API_URL, { params });
const getMediaItemById = (id) => api.get(`${API_URL}/${id}`);
const createMediaItem = (data) => api.post(API_URL, data);
const updateMediaItem = (id, data) => api.put(`${API_URL}/${id}`, data);
const deleteMediaItem = (id) => api.delete(`${API_URL}/${id}`);

// Function to fetch both media items and vision data
const getMediaAndVisionData = async () => {
  const mediaResponse = await getMediaItems();
  const visionResponse = await visionService.getVision();
  
  return {
    mediaItems: mediaResponse.data,
    visionData: visionResponse.data
  };
};

const mediaService = {
  getMediaItems,
  getMediaItemById,
  createMediaItem,
  updateMediaItem,
  deleteMediaItem,
  getMediaAndVisionData
};

export default mediaService;
