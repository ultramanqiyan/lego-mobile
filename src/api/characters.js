import apiClient from './client';

export const charactersAPI = {
  async getList(userId) {
    return apiClient.get(`/characters?userId=${userId || ''}`);
  },

  async create(data) {
    return apiClient.post('/characters', {
      name: data.name,
      description: data.description,
      personality: data.personality,
      speakingStyle: data.speakingStyle,
      creatorId: data.creatorId || 'user',
    });
  },

  async update(characterId, data) {
    return apiClient.put('/characters', {
      characterId,
      name: data.name,
      description: data.description,
      personality: data.personality,
      speakingStyle: data.speakingStyle,
    });
  },

  async delete(characterId, force = false) {
    const url = force 
      ? `/characters?id=${characterId}&force=true`
      : `/characters?id=${characterId}`;
    return apiClient.delete(url);
  },
};

export default charactersAPI;
