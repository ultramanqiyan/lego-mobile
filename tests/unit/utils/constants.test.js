import { COLORS, ROLE_COLORS, PLOT_ICONS, CHARACTER_EMOJIS, PLOT_TYPES, ROLE_TYPES, THEMES } from '../../../src/utils/constants';

describe('COLORS', () => {
  it('should have lego colors defined', () => {
    expect(COLORS.legoRed).toBe('#E3000B');
    expect(COLORS.legoBlue).toBe('#006BA6');
    expect(COLORS.legoYellow).toBe('#FFD100');
    expect(COLORS.legoGreen).toBe('#00A651');
    expect(COLORS.legoOrange).toBe('#FF6B00');
    expect(COLORS.legoPurple).toBe('#8B5CF6');
  });

  it('should have semantic colors defined', () => {
    expect(COLORS.error).toBe('#E74C3C');
    expect(COLORS.success).toBe('#27AE60');
    expect(COLORS.warning).toBe('#F39C12');
    expect(COLORS.info).toBe('#3498DB');
  });

  it('should have background colors defined', () => {
    expect(COLORS.background).toBe('#FFF8E7');
    expect(COLORS.white).toBe('#FFFFFF');
    expect(COLORS.black).toBe('#000000');
  });
});

describe('ROLE_COLORS', () => {
  it('should have colors for all role types', () => {
    expect(ROLE_COLORS.protagonist).toBeDefined();
    expect(ROLE_COLORS.supporting).toBeDefined();
    expect(ROLE_COLORS.antagonist).toBeDefined();
    expect(ROLE_COLORS.bystander).toBeDefined();
  });

  it('should have background and text colors for each role', () => {
    Object.values(ROLE_COLORS).forEach((roleColor) => {
      expect(roleColor.background).toBeDefined();
      expect(roleColor.text).toBeDefined();
    });
  });
});

describe('PLOT_ICONS', () => {
  it('should have icons for all categories', () => {
    expect(PLOT_ICONS.weather).toBeDefined();
    expect(PLOT_ICONS.adventureType).toBeDefined();
    expect(PLOT_ICONS.terrain).toBeDefined();
    expect(PLOT_ICONS.equipment).toBeDefined();
  });

  it('should have correct weather icons', () => {
    expect(PLOT_ICONS.weather.sunny).toBe('☀️');
    expect(PLOT_ICONS.weather.rainy).toBe('🌧️');
    expect(PLOT_ICONS.weather.snow).toBe('❄️');
  });
});

describe('CHARACTER_EMOJIS', () => {
  it('should be an array of emojis', () => {
    expect(Array.isArray(CHARACTER_EMOJIS)).toBe(true);
    expect(CHARACTER_EMOJIS.length).toBeGreaterThan(0);
  });

  it('should contain valid emoji strings', () => {
    CHARACTER_EMOJIS.forEach((emoji) => {
      expect(typeof emoji).toBe('string');
      expect(emoji.length).toBeGreaterThan(0);
    });
  });
});

describe('PLOT_TYPES', () => {
  it('should be an array of plot types', () => {
    expect(Array.isArray(PLOT_TYPES)).toBe(true);
    expect(PLOT_TYPES.length).toBeGreaterThan(0);
  });

  it('should have required properties for each plot type', () => {
    PLOT_TYPES.forEach((plot) => {
      expect(plot.id).toBeDefined();
      expect(plot.name).toBeDefined();
      expect(plot.icon).toBeDefined();
      expect(plot.desc).toBeDefined();
    });
  });
});

describe('ROLE_TYPES', () => {
  it('should be an array of role types', () => {
    expect(Array.isArray(ROLE_TYPES)).toBe(true);
    expect(ROLE_TYPES.length).toBe(4);
  });

  it('should have value and label for each role type', () => {
    ROLE_TYPES.forEach((role) => {
      expect(role.value).toBeDefined();
      expect(role.label).toBeDefined();
    });
  });
});

describe('THEMES', () => {
  it('should be an array of themes', () => {
    expect(Array.isArray(THEMES)).toBe(true);
    expect(THEMES.length).toBe(6);
  });

  it('should have required properties for each theme', () => {
    THEMES.forEach((theme) => {
      expect(theme.id).toBeDefined();
      expect(theme.name).toBeDefined();
      expect(theme.primaryColor).toBeDefined();
    });
  });

  it('should include lego theme', () => {
    const legoTheme = THEMES.find((t) => t.id === 'lego');
    expect(legoTheme).toBeDefined();
    expect(legoTheme.primaryColor).toBe(COLORS.legoYellow);
  });
});
