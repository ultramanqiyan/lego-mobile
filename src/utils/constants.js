export const COLORS = {
  legoRed: '#E3000B',
  legoBlue: '#006BA6',
  legoYellow: '#FFD100',
  legoGreen: '#00A651',
  legoOrange: '#FF6B00',
  legoPurple: '#8B5CF6',
  
  background: '#FFF8E7',
  backgroundLight: '#FFFEF5',
  backgroundDark: '#F5E6C8',
  
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  
  white: '#FFFFFF',
  black: '#000000',
  
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  
  error: '#E74C3C',
  errorLight: '#FDEAEA',
  success: '#27AE60',
  successLight: '#E8F5E9',
  warning: '#F39C12',
  warningLight: '#FFF8E1',
  info: '#3498DB',
  infoLight: '#E3F2FD',
  
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const ROLE_COLORS = {
  protagonist: {
    background: '#FFF3E0',
    text: '#E65100',
  },
  supporting: {
    background: '#E3F2FD',
    text: '#1565C0',
  },
  antagonist: {
    background: '#FFEBEE',
    text: '#C62828',
  },
  bystander: {
    background: '#F3E5F5',
    text: '#7B1FA2',
  },
};

export const PLOT_ICONS = {
  weather: {
    sunny: '☀️',
    rainy: '🌧️',
    thunder: '⛈️',
    snow: '❄️',
    fog: '🌫️',
    wind: '💨',
    rainbow: '🌈',
    starry: '🌟',
  },
  adventureType: {
    friendship: '🤝',
    adventure: '🗺️',
    wisdom: '🧠',
    courage: '💪',
    treasure: '💎',
    rescue: '🦸',
    mystery: '🔮',
    competition: '🏆',
  },
  terrain: {
    forest: '🌲',
    castle: '🏰',
    ocean: '🌊',
    desert: '🏜️',
    mountain: '⛰️',
    glacier: '🧊',
    volcano: '🌋',
    city: '🏙️',
  },
  equipment: {
    wand: '🪄',
    shield: '🛡️',
    map: '🗺️',
    telescope: '🔭',
    sword: '⚔️',
    potion: '🧪',
    flyer: '🚀',
    cloak: '🧥',
  },
};

export const CHARACTER_EMOJIS = ['🦸', '🧙', '🧝', '🦹', '👸', '🤴', '🧛', '🧟', '🤖', '👻', '🧚', '🧜'];

export const PLOT_TYPES = [
  { id: 'adventure', name: '冒险之旅', icon: '🗺️', desc: '踏上未知旅程，探索神秘世界' },
  { id: 'mystery', name: '神秘谜团', icon: '🔍', desc: '发现并解开隐藏的谜题' },
  { id: 'friendship', name: '友谊考验', icon: '🤝', desc: '朋友间的互助与成长' },
  { id: 'hero', name: '英雄救美', icon: '🦸', desc: '拯救被困之人' },
  { id: 'treasure', name: '寻宝探险', icon: '💎', desc: '寻找珍贵宝藏' },
  { id: 'magic', name: '魔法奇遇', icon: '✨', desc: '遇到神奇魔法' },
];

export const ROLE_TYPES = [
  { value: 'protagonist', label: '⭐ 主角' },
  { value: 'supporting', label: '🎭 配角' },
  { value: 'antagonist', label: '👿 反派' },
  { value: 'bystander', label: '🚶 路人' },
];

export const THEMES = [
  { id: 'lego', name: '乐高经典', primaryColor: COLORS.legoYellow },
  { id: 'fairy', name: '童话世界', primaryColor: '#FF69B4' },
  { id: 'scifi', name: '科幻未来', primaryColor: '#00D4FF' },
  { id: 'nature', name: '自然森林', primaryColor: '#4CAF50' },
  { id: 'gamified', name: '游戏风格', primaryColor: '#9C27B0' },
  { id: 'immersive', name: '沉浸模式', primaryColor: '#1A1A2E' },
];
