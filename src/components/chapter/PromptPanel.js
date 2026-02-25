import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/constants';

const PromptPanel = ({ prompts = [], title = '💡 故事创作提示' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!prompts || prompts.length === 0) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.content}>
          {prompts.map((prompt, index) => (
            <View key={index} style={styles.promptItem}>
              <Text style={styles.promptBullet}>•</Text>
              <Text style={styles.promptText}>{prompt}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.legoYellow,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.legoYellow,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  expandIcon: {
    fontSize: 14,
    color: COLORS.text,
  },
  content: {
    padding: 16,
    paddingTop: 12,
  },
  promptItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  promptBullet: {
    fontSize: 14,
    color: COLORS.legoOrange,
    marginRight: 8,
  },
  promptText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
});

export default PromptPanel;
