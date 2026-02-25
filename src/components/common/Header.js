import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../utils/constants';

const Header = ({
  title,
  subtitle,
  leftButton,
  rightButton,
  transparent = false,
  backgroundColor,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 10 },
        transparent && styles.transparent,
        backgroundColor && { backgroundColor },
      ]}
    >
      <StatusBar
        barStyle={transparent ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor || COLORS.background}
      />
      <View style={styles.content}>
        <View style={styles.left}>{leftButton}</View>
        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.right}>{rightButton}</View>
      </View>
    </View>
  );
};

const BackButton = ({ onPress, color = COLORS.text }) => (
  <TouchableOpacity onPress={onPress} style={styles.backButton}>
    <Text style={[styles.backText, { color }]}>←</Text>
  </TouchableOpacity>
);

Header.BackButton = BackButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  transparent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  left: {
    width: 60,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 60,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Header;
