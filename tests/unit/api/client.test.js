import { apiClient } from '../../../src/api/client';

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiBaseUrl: 'https://test-api.example.com/api',
    },
  },
}));

global.fetch = jest.fn();

describe('APIClient', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('request', () => {
    it('should make a successful GET request', async () => {
      const mockData = { success: true, data: [] };
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await apiClient.get('/test');

      expect(fetch).toHaveBeenCalledWith(
        'https://test-api.example.com/api/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should make a successful POST request with body', async () => {
      const mockData = { success: true, id: '123' };
      const postData = { name: 'Test' };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await apiClient.post('/test', postData);

      expect(fetch).toHaveBeenCalledWith(
        'https://test-api.example.com/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should throw error on failed request', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValue({ error: 'Not found' }),
      });

      await expect(apiClient.get('/test')).rejects.toThrow('Not found');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network request failed'));

      await expect(apiClient.get('/test')).rejects.toThrow('网络连接失败，请检查网络');
    });
  });

  describe('HTTP methods', () => {
    it('should call request with GET method', async () => {
      const spy = jest.spyOn(apiClient, 'request').mockResolvedValue({});
      await apiClient.get('/test');
      expect(spy).toHaveBeenCalledWith('/test', { method: 'GET' });
    });

    it('should call request with POST method', async () => {
      const spy = jest.spyOn(apiClient, 'request').mockResolvedValue({});
      await apiClient.post('/test', { data: 'test' });
      expect(spy).toHaveBeenCalledWith('/test', { method: 'POST', body: { data: 'test' } });
    });

    it('should call request with PUT method', async () => {
      const spy = jest.spyOn(apiClient, 'request').mockResolvedValue({});
      await apiClient.put('/test', { data: 'test' });
      expect(spy).toHaveBeenCalledWith('/test', { method: 'PUT', body: { data: 'test' } });
    });

    it('should call request with DELETE method', async () => {
      const spy = jest.spyOn(apiClient, 'request').mockResolvedValue({});
      await apiClient.delete('/test');
      expect(spy).toHaveBeenCalledWith('/test', { method: 'DELETE' });
    });
  });
});
