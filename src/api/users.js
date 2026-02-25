import apiClient from './client';

export const usersAPI = {
  async createOrLogin(username, email = null) {
    return apiClient.post('/users', { username, email });
  },

  async getUser(userId) {
    return apiClient.get(`/users?userId=${userId}`);
  },

  async updateTimeUsage(userId, minutes) {
    return apiClient.put('/users', { userId, timeUsed: minutes });
  },

  async updateTimeLimit(userId, dailyTimeLimit) {
    return apiClient.put('/users', { userId, dailyTimeLimit });
  },
};

export default usersAPI;
