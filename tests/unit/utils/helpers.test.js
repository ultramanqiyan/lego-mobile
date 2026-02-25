import {
  formatDate,
  truncateText,
  formatTime,
  getRoleLabel,
  getPlotNameDisplay,
  escapeRegex,
  generateId,
} from '../../../src/utils/helpers';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = '2024-01-15T10:30:00Z';
    const result = formatDate(date);
    expect(result).toContain('2024');
  });

  it('should handle invalid date', () => {
    const result = formatDate('invalid');
    expect(result).toBeDefined();
  });
});

describe('truncateText', () => {
  it('should truncate long text', () => {
    const longText = 'This is a very long text that needs to be truncated';
    const result = truncateText(longText, 20);
    expect(result.length).toBe(23);
    expect(result.endsWith('...')).toBe(true);
  });

  it('should not truncate short text', () => {
    const shortText = 'Short text';
    const result = truncateText(shortText, 50);
    expect(result).toBe(shortText);
  });

  it('should handle empty text', () => {
    const result = truncateText('', 50);
    expect(result).toBe('');
  });

  it('should handle null/undefined', () => {
    expect(truncateText(null)).toBe('');
    expect(truncateText(undefined)).toBe('');
  });
});

describe('formatTime', () => {
  it('should format minutes only', () => {
    const result = formatTime(45);
    expect(result).toBe('45分钟');
  });

  it('should format hours and minutes', () => {
    const result = formatTime(125);
    expect(result).toBe('2小时5分钟');
  });

  it('should handle zero', () => {
    const result = formatTime(0);
    expect(result).toBe('0分钟');
  });
});

describe('getRoleLabel', () => {
  it('should return correct label for protagonist', () => {
    expect(getRoleLabel('protagonist')).toBe('⭐ 主角');
  });

  it('should return correct label for supporting', () => {
    expect(getRoleLabel('supporting')).toBe('🎭 配角');
  });

  it('should return correct label for antagonist', () => {
    expect(getRoleLabel('antagonist')).toBe('👿 反派');
  });

  it('should return correct label for bystander', () => {
    expect(getRoleLabel('bystander')).toBe('🚶 路人');
  });

  it('should return default label for unknown role', () => {
    expect(getRoleLabel('unknown')).toBe('🎭 配角');
  });
});

describe('getPlotNameDisplay', () => {
  it('should return correct weather name', () => {
    expect(getPlotNameDisplay('weather', 'sunny')).toBe('晴天');
    expect(getPlotNameDisplay('weather', 'rainy')).toBe('下雨');
  });

  it('should return correct adventure type name', () => {
    expect(getPlotNameDisplay('adventureType', 'friendship')).toBe('友谊考验');
    expect(getPlotNameDisplay('adventureType', 'adventure')).toBe('冒险之旅');
  });

  it('should return correct terrain name', () => {
    expect(getPlotNameDisplay('terrain', 'forest')).toBe('森林');
    expect(getPlotNameDisplay('terrain', 'castle')).toBe('城堡');
  });

  it('should return correct equipment name', () => {
    expect(getPlotNameDisplay('equipment', 'wand')).toBe('魔法杖');
    expect(getPlotNameDisplay('equipment', 'shield')).toBe('盾牌');
  });

  it('should return id for unknown category/item', () => {
    expect(getPlotNameDisplay('unknown', 'test')).toBe('test');
  });
});

describe('escapeRegex', () => {
  it('should escape special regex characters', () => {
    expect(escapeRegex('test.*+?')).toBe('test\\.\\*\\+\\?');
  });

  it('should handle normal string', () => {
    expect(escapeRegex('normal')).toBe('normal');
  });

  it('should handle empty string', () => {
    expect(escapeRegex('')).toBe('');
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should generate string ID', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });
});
