import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_ID: 'userId',
  USERNAME: 'username',
  THEME: 'theme',
  FONT_SIZE: 'fontSize',
};

export const storage = {
  async getUserId() {
    return AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
  },

  async setUserId(userId) {
    return AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  },

  async getUsername() {
    return AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
  },

  async setUsername(username) {
    return AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username);
  },

  async getTheme() {
    return AsyncStorage.getItem(STORAGE_KEYS.THEME);
  },

  async setTheme(theme) {
    return AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  async getFontSize() {
    const size = await AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE);
    return size ? parseInt(size, 10) : 16;
  },

  async setFontSize(size) {
    return AsyncStorage.setItem(STORAGE_KEYS.FONT_SIZE, size.toString());
  },

  async clearUserData() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.USERNAME,
    ]);
  },

  async clearAll() {
    return AsyncStorage.clear();
  },
};

export default storage;
