import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS, CHARACTER_EMOJIS } from '../../utils/constants';

const WeatherEffect = ({ weather, children }) => {
  const particles = useRef([]);
  const animations = useRef([]);

  useEffect(() => {
    if (!weather || weather === 'sunny') return;

    particles.current = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 1000,
    }));

    animations.current = particles.current.map((_, i) => ({
      y: new Animated.Value(-10),
      x: new Animated.Value(particles.current[i].x),
      opacity: new Animated.Value(1),
    }));

    animations.current.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim.y, {
            toValue: 110,
            duration: 3000 + Math.random() * 2000,
            delay: particles.current[i].delay,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [weather]);

  const renderParticles = () => {
    if (!weather || weather === 'sunny' || !animations.current.length) return null;

    const getParticleStyle = (anim, i) => ({
      position: 'absolute',
      left: `${particles.current[i].x}%`,
      transform: [{ translateY: anim.y }],
      opacity: anim.opacity,
    });

    const getParticleContent = () => {
      switch (weather) {
        case 'rainy':
          return <View style={styles.raindrop} />;
        case 'thunder':
          return <Text style={styles.lightning}>⚡</Text>;
        case 'snow':
          return <Text style={styles.snowflake}>❄️</Text>;
        case 'fog':
          return <View style={styles.fogParticle} />;
        case 'wind':
          return <Text style={styles.windParticle}>💨</Text>;
        case 'rainbow':
          return <Text style={styles.rainbowParticle}>🌈</Text>;
        case 'starry':
          return <Text style={styles.star}>✨</Text>;
        default:
          return null;
      }
    };

    return animations.current.map((anim, i) => (
      <Animated.View key={i} style={getParticleStyle(anim, i)}>
        {getParticleContent()}
      </Animated.View>
    ));
  };

  const getBackgroundStyle = () => {
    switch (weather) {
      case 'rainy':
      case 'thunder':
        return { backgroundColor: 'rgba(100, 100, 120, 0.3)' };
      case 'snow':
        return { backgroundColor: 'rgba(200, 220, 255, 0.3)' };
      case 'starry':
        return { backgroundColor: 'rgba(20, 20, 50, 0.5)' };
      case 'sunny':
        return { backgroundColor: 'rgba(255, 230, 150, 0.3)' };
      default:
        return {};
    }
  };

  return (
    <View style={[styles.container, getBackgroundStyle()]}>
      {renderParticles()}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  raindrop: {
    width: 2,
    height: 15,
    backgroundColor: 'rgba(150, 200, 255, 0.8)',
    borderRadius: 1,
  },
  lightning: {
    fontSize: 24,
  },
  snowflake: {
    fontSize: 16,
  },
  fogParticle: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
    borderRadius: 15,
  },
  windParticle: {
    fontSize: 20,
  },
  rainbowParticle: {
    fontSize: 20,
  },
  star: {
    fontSize: 14,
  },
});

export default WeatherEffect;
