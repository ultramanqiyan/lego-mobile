import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useToast, getToastColor } from '../../context/ToastContext';
import { COLORS } from '../../utils/constants';

const Toast = () => {
  const { toast, hideToast } = useToast();
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (toast?.visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [toast?.visible]);

  if (!toast) return null;

  const backgroundColor = getToastColor(toast.type);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity onPress={hideToast} style={styles.content}>
        <Text style={styles.text}>{toast.message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Toast;
