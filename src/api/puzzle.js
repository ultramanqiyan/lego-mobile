import apiClient from './client';

export const puzzleAPI = {
  async submit(puzzleId, userId, userAnswer) {
    return apiClient.post('/puzzle', {
      puzzleId,
      userId,
      userAnswer,
    });
  },
};

export const plotOptionsAPI = {
  async get() {
    return apiClient.get('/plot-options');
  },
};

export default puzzleAPI;
