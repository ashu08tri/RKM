import api from './api';

const API_URL = '/api/information';

const getInformationItems = () => {
  return api.get(API_URL);
};

const createInformationItem = (itemData) => {
  return api.post(API_URL, itemData);
};

const updateInformationItem = (id, itemData) => {
  return api.put(`${API_URL}/${id}`, itemData);
};

const deleteInformationItem = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

const informationService = {
  getInformationItems,
  createInformationItem,
  updateInformationItem,
  deleteInformationItem,
};

export default informationService;
