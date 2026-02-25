import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View key={index} style={styles.stepContainer}>
          <View
            style={[
              styles.step,
              index <= currentStep && styles.stepActive,
            ]}
          >
            <Text
              style={[
                styles.stepText,
                index <= currentStep && styles.stepTextActive,
              ]}
            >
              {index + 1}
            </Text>
          </View>
          {index < totalSteps - 1 && (
            <View
              style={[
                styles.line,
                index < currentStep && styles.lineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  stepActive: {
    backgroundColor: COLORS.legoYellow,
    borderColor: COLORS.legoOrange,
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMuted,
  },
  stepTextActive: {
    color: COLORS.text,
  },
  line: {
    width: 30,
    height: 3,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  lineActive: {
    backgroundColor: COLORS.legoYellow,
  },
});

export default StepIndicator;
