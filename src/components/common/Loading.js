import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

const Loading = ({ message = '加载中...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLORS.legoYellow} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <ActivityIndicator size="small" color={COLORS.legoYellow} />
      {message && <Text style={styles.messageSmall}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.white,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  messageSmall: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default Loading;
