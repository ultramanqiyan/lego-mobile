import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { COLORS } from '../../utils/constants';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: COLORS.legoYellow,
          borderColor: COLORS.legoOrange,
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.legoBlue,
          borderColor: COLORS.legoBlue,
        };
      case 'success':
        return {
          backgroundColor: COLORS.legoGreen,
          borderColor: COLORS.legoGreen,
        };
      case 'danger':
        return {
          backgroundColor: COLORS.error,
          borderColor: COLORS.error,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: COLORS.legoBlue,
          borderWidth: 2,
        };
      default:
        return {
          backgroundColor: COLORS.legoYellow,
          borderColor: COLORS.legoOrange,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'md':
        return { paddingVertical: 12, paddingHorizontal: 24 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return COLORS.legoBlue;
    if (variant === 'primary') return COLORS.text;
    return COLORS.white;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              size === 'lg' && styles.textLarge,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textLarge: {
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
