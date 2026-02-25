import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, CHARACTER_EMOJIS } from '../../utils/constants';
import WeatherEffect from './WeatherEffect';

const StagePreview = ({
  characters = [],
  weather = 'sunny',
  terrain = null,
}) => {
  const getTerrainEmoji = () => {
    const terrains = {
      forest: '🌲',
      castle: '🏰',
      ocean: '🌊',
      desert: '🏜️',
      mountain: '⛰️',
      glacier: '🧊',
      volcano: '🌋',
      city: '🏙️',
    };
    return terrains[terrain] || '🌿';
  };

  const getCharacterPositions = () => {
    const positions = [
      { x: '20%', y: '60%' },
      { x: '50%', y: '50%' },
      { x: '80%', y: '60%' },
      { x: '35%', y: '75%' },
      { x: '65%', y: '75%' },
    ];
    return positions.slice(0, characters.length);
  };

  return (
    <View style={styles.container}>
      <WeatherEffect weather={weather}>
        <View style={styles.stage}>
          <View style={styles.background}>
            <Text style={styles.terrainEmoji}>{getTerrainEmoji()}</Text>
            <Text style={styles.terrainEmoji}>{getTerrainEmoji()}</Text>
            <Text style={styles.terrainEmoji}>{getTerrainEmoji()}</Text>
          </View>
          
          <View style={styles.characterLayer}>
            {characters.map((char, index) => {
              const positions = getCharacterPositions();
              const pos = positions[index] || { x: '50%', y: '50%' };
              
              return (
                <View
                  key={char.character_id || index}
                  style={[
                    styles.characterSlot,
                    { left: pos.x, top: pos.y },
                  ]}
                >
                  <Text style={styles.characterEmoji}>
                    {CHARACTER_EMOJIS[index % CHARACTER_EMOJIS.length]}
                  </Text>
                  <Text style={styles.characterName} numberOfLines={1}>
                    {char.custom_name || char.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </WeatherEffect>
      
      <View style={styles.labelContainer}>
        <Text style={styles.label}>🎬 舞台预览</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLORS.legoBlue,
  },
  stage: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  terrainEmoji: {
    fontSize: 40,
    opacity: 0.5,
  },
  characterLayer: {
    flex: 1,
    position: 'relative',
  },
  characterSlot: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -25 }, { translateY: -30 }],
  },
  characterEmoji: {
    fontSize: 36,
  },
  characterName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.text,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  labelContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  label: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default StagePreview;
