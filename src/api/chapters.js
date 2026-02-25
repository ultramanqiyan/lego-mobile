import apiClient from './client';

export const chaptersAPI = {
  async getDetail(chapterId, userId) {
    return apiClient.get(`/chapters?id=${chapterId}&userId=${userId || ''}`);
  },

  async create(bookId, title, content, puzzle = null) {
    return apiClient.post('/chapters', {
      bookId,
      title,
      content,
      puzzle,
    });
  },

  async complete(bookId, chapterId, userId) {
    return apiClient.post(`/chapters-complete/books/${bookId}/chapters/${chapterId}`, {
      userId,
    });
  },

  async generate(bookId, userId, plotSelection = null) {
    const body = { userId };
    if (plotSelection) {
      body.plotSelection = plotSelection;
    }
    return apiClient.post(`/chapters-generate/books/${bookId}`, body);
  },
};

export default chaptersAPI;
