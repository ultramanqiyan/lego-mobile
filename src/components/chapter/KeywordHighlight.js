import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, ROLE_COLORS } from '../../utils/constants';

const KeywordHighlight = ({ content, characters = [] }) => {
  if (!content) return null;

  const keywords = [];

  characters.forEach((char) => {
    if (char.custom_name) {
      keywords.push({
        text: char.custom_name,
        type: 'character',
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

  const getHighlightStyle = (keyword) => {
    switch (keyword.type) {
      case 'character':
        const roleColor = ROLE_COLORS[keyword.role] || ROLE_COLORS.supporting;
        return {
          backgroundColor: roleColor.background,
          color: roleColor.text,
          fontWeight: 'bold',
        };
      case 'action':
        return {
          backgroundColor: '#E8F5E9',
          color: COLORS.legoGreen,
          fontWeight: '600',
        };
      case 'emotion':
        return {
          backgroundColor: '#F3E5F5',
          color: COLORS.legoPurple,
          fontWeight: '600',
        };
      case 'location':
        return {
          backgroundColor: '#E3F2FD',
          color: COLORS.legoBlue,
          fontWeight: '600',
        };
      default:
        return {};
    }
  };

  const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const renderContent = () => {
    let parts = [content];
    
    keywords.forEach((keyword) => {
      const newParts = [];
      parts.forEach((part) => {
        if (typeof part === 'string') {
          const regex = new RegExp(`(${escapeRegex(keyword.text)})`, 'g');
          const split = part.split(regex);
          split.forEach((segment) => {
            if (segment === keyword.text) {
              newParts.push({ text: segment, keyword });
            } else if (segment) {
              newParts.push(segment);
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return parts.map((part, index) => {
      if (typeof part === 'string') {
        return <Text key={index} style={styles.normalText}>{part}</Text>;
      }
      const style = getHighlightStyle(part.keyword);
      return (
        <Text key={index} style={[styles.highlightedText, style]}>
          {part.text}
        </Text>
      );
    });
  };

  return (
    <Text style={styles.container}>
      {renderContent()}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    fontSize: 18,
    lineHeight: 32,
    color: COLORS.text,
  },
  normalText: {
    color: COLORS.text,
  },
  highlightedText: {
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 4,
  },
});

export default KeywordHighlight;
