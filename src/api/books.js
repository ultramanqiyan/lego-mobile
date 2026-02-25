import apiClient from './client';

export const booksAPI = {
  async getList(userId) {
    return apiClient.get(`/books?userId=${userId}`);
  },

  async getDetail(bookId, userId) {
    return apiClient.get(`/books?bookId=${bookId}&userId=${userId || ''}`);
  },

  async create(userId, title) {
    return apiClient.post('/books', { userId, title });
  },

  async update(bookId, data) {
    return apiClient.put('/books', { bookId, ...data });
  },

  async delete(bookId) {
    return apiClient.delete(`/books?id=${bookId}`);
  },
};

export const bookCharactersAPI = {
  async add(bookId, characterId, customName, roleType) {
    return apiClient.post('/book-characters', {
      bookId,
      characterId,
      customName,
      roleType,
    });
  },

  async update(id, customName, roleType) {
    return apiClient.put('/book-characters', {
      id,
      customName,
      roleType,
    });
  },

  async delete(id) {
    return apiClient.delete(`/book-characters?id=${id}`);
  },
};

export default booksAPI;
