import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/constants';

const Card = ({
  children,
  title,
  subtitle,
  onPress,
  variant = 'default',
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: COLORS.white, borderColor: COLORS.legoYellow };
      case 'secondary':
        return { backgroundColor: COLORS.white, borderColor: COLORS.legoBlue };
      case 'success':
        return { backgroundColor: COLORS.successLight, borderColor: COLORS.legoGreen };
      case 'warning':
        return { backgroundColor: COLORS.warningLight, borderColor: COLORS.legoOrange };
      case 'error':
        return { backgroundColor: COLORS.errorLight, borderColor: COLORS.error };
      default:
        return { backgroundColor: COLORS.white, borderColor: COLORS.border };
    }
  };

  const cardContent = (
    <View style={[styles.card, getVariantStyles(), style]}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
});

export default Card;
