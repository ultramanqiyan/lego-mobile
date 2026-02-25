import React from 'react';
import { render } from '@testing-library/react-native';
import StepIndicator from '../../../src/components/common/StepIndicator';

describe('StepIndicator', () => {
  it('should render correct number of steps', () => {
    const { toJSON } = render(<StepIndicator currentStep={0} totalSteps={4} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should highlight current step', () => {
    const { toJSON } = render(<StepIndicator currentStep={2} totalSteps={4} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should handle first step', () => {
    const { toJSON } = render(<StepIndicator currentStep={0} totalSteps={3} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should handle last step', () => {
    const { toJSON } = render(<StepIndicator currentStep={2} totalSteps={3} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should handle single step', () => {
    const { toJSON } = render(<StepIndicator currentStep={0} totalSteps={1} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should handle multiple steps', () => {
    const { toJSON } = render(<StepIndicator currentStep={1} totalSteps={5} />);
    expect(toJSON()).toBeTruthy();
  });
});
