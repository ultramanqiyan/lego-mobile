import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS, CHARACTER_EMOJIS } from '../../utils/constants';

const CardDeck = ({
  title,
  items,
  selectedId,
  onSelect,
  iconKey = 'icon',
  nameKey = 'name',
  emoji,
}) => {
  const getIcon = (item, index) => {
    if (item[iconKey]) return item[iconKey];
    if (emoji) return emoji[index % emoji.length];
    return '🎭';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.deckContainer}>
        {items.map((item, index) => {
          const isSelected = selectedId === item.id;
          const rotateAngle = (index - (items.length - 1) / 2) * 8;
          
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
                { transform: [{ rotate: `${rotateAngle}deg` }] },
              ]}
              onPress={() => onSelect(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardIcon}>{getIcon(item, index)}</Text>
              <Text style={styles.cardName} numberOfLines={1}>
                {item[nameKey]}
              </Text>
              {isSelected && <View style={styles.selectedBadge} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  deckContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: 70,
    height: 90,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -8,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSelected: {
    borderColor: COLORS.legoYellow,
    borderWidth: 3,
    backgroundColor: COLORS.legoYellow,
    transform: [{ scale: 1.1 }],
    zIndex: 10,
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.legoGreen,
  },
});

export default CardDeck;
