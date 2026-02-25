export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}小时${mins}分钟`;
  }
  return `${mins}分钟`;
};

export const getRoleLabel = (roleType) => {
  const roles = {
    protagonist: '⭐ 主角',
    supporting: '🎭 配角',
    antagonist: '👿 反派',
    bystander: '🚶 路人',
  };
  return roles[roleType] || '🎭 配角';
};

export const getPlotNameDisplay = (category, id) => {
  const plotNames = {
    weather: {
      sunny: '晴天',
      rainy: '下雨',
      thunder: '打雷',
      snow: '下雪',
      fog: '大雾',
      wind: '狂风',
      rainbow: '彩虹',
      starry: '星夜',
    },
    adventureType: {
      friendship: '友谊考验',
      adventure: '冒险之旅',
      wisdom: '智慧挑战',
      courage: '勇气试炼',
      treasure: '寻宝探险',
      rescue: '救援任务',
      mystery: '神秘探索',
      competition: '竞技比赛',
    },
    terrain: {
      forest: '森林',
      castle: '城堡',
      ocean: '海洋',
      desert: '沙漠',
      mountain: '山峰',
      glacier: '冰川',
      volcano: '火山',
      city: '城市',
    },
    equipment: {
      wand: '魔法杖',
      shield: '盾牌',
      map: '地图',
      telescope: '望远镜',
      sword: '宝剑',
      potion: '药水',
      flyer: '飞行器',
      cloak: '隐身斗篷',
    },
  };

  return (plotNames[category] && plotNames[category][id]) || id;
};

export const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const highlightKeywords = (content, characters) => {
  if (!content) return '';
  
  const keywords = [];
  
  characters.forEach((char) => {
    if (char.custom_name) {
      keywords.push({
        text: char.custom_name,
        role: char.role_type,
      });
    }
  });

  const actionWords = ['飞向', '跳跃', '奔跑', '战斗', '探索', '发现', '拯救', '追逐', '攀爬', '游泳', '飞翔', '旋转', '冲刺', '躲闪', '攻击', '防御', '寻找', '收集', '建造', '修复'];
  actionWords.forEach((word) => {
    keywords.push({ text: word, type: 'action' });
  });

  const emotionWords = ['开心', '快乐', '勇敢', '害怕', '兴奋', '紧张', '感动', '惊讶', '愤怒', '悲伤', '期待', '满足', '自豪', '担心', '安心', '激动', '欣慰', '坚定', '犹豫'];
  emotionWords.forEach((word) => {
    keywords.push({ text: word, type: 'emotion' });
  });

  const locationWords = ['城堡', '森林', '太空', '海底', '沙漠', '雪山', '火山', '洞穴', '城市', '村庄', '花园', '岛屿', '山脉', '河流', '星空', '云层', '迷宫', '宝藏', '遗迹', '基地'];
  locationWords.forEach((word) => {
    keywords.push({ text: word, type: 'location' });
  });

  keywords.sort((a, b) => b.text.length - a.text.length);

  let result = content;
  keywords.forEach((kw) => {
    const regex = new RegExp(`(${escapeRegex(kw.text)})`, 'g');
    result = result.replace(regex, `**${kw.text}**`);
  });

  return result;
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
