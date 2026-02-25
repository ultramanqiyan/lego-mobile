import Constants from 'expo-constants';

const API_BASE = Constants.expoConfig?.extra?.apiBaseUrl || 'https://lego-story.pages.dev/api';

class APIClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error('服务器返回格式错误');
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || '请求失败');
      }

      return data;
    } catch (error) {
      if (error.message === 'Network request failed') {
        throw new Error('网络连接失败，请检查网络');
      }
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new APIClient();
export default apiClient;
