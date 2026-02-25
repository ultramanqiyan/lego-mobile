import apiClient from './client';

export const shareAPI = {
  async create(bookId, userId) {
    return apiClient.post('/share', { bookId, userId });
  },

  async get(bookId) {
    return apiClient.get(`/share?bookId=${bookId}`);
  },
};

export default shareAPI;
