import { storage } from '../../../src/utils/storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
  clear: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserId', () => {
    it('should get user ID from storage', async () => {
      AsyncStorage.getItem.mockResolvedValue('user123');
      const result = await storage.getUserId();
      expect(result).toBe('user123');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('userId');
    });

    it('should return null if no user ID', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      const result = await storage.getUserId();
      expect(result).toBeNull();
    });
  });

  describe('setUserId', () => {
    it('should set user ID in storage', async () => {
      await storage.setUserId('user123');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userId', 'user123');
    });
  });

  describe('getUsername', () => {
    it('should get username from storage', async () => {
      AsyncStorage.getItem.mockResolvedValue('testuser');
      const result = await storage.getUsername();
      expect(result).toBe('testuser');
    });
  });

  describe('setUsername', () => {
    it('should set username in storage', async () => {
      await storage.setUsername('testuser');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('username', 'testuser');
    });
  });

  describe('getTheme', () => {
    it('should get theme from storage', async () => {
      AsyncStorage.getItem.mockResolvedValue('lego');
      const result = await storage.getTheme();
      expect(result).toBe('lego');
    });
  });

  describe('setTheme', () => {
    it('should set theme in storage', async () => {
      await storage.setTheme('fairy');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('theme', 'fairy');
    });
  });

  describe('getFontSize', () => {
    it('should get font size from storage', async () => {
      AsyncStorage.getItem.mockResolvedValue('18');
      const result = await storage.getFontSize();
      expect(result).toBe(18);
    });

    it('should return default size if not set', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      const result = await storage.getFontSize();
      expect(result).toBe(16);
    });
  });

  describe('setFontSize', () => {
    it('should set font size in storage', async () => {
      await storage.setFontSize(20);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('fontSize', '20');
    });
  });

  describe('clearUserData', () => {
    it('should clear user data from storage', async () => {
      await storage.clearUserData();
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['userId', 'username']);
    });
  });

  describe('clearAll', () => {
    it('should clear all data from storage', async () => {
      await storage.clearAll();
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });
  });
});
