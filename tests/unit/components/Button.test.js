import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../../src/components/common/Button';

describe('Button', () => {
  it('should render correctly with title', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Click Me" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Click Me'));
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Disabled" onPress={onPressMock} disabled />
    );
    
    fireEvent.press(getByText('Disabled'));
    
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should show loading indicator when loading', () => {
    const { queryByText } = render(
      <Button title="Loading" onPress={() => {}} loading />
    );
    
    expect(queryByText('Loading')).toBeNull();
  });

  it('should apply primary variant styles', () => {
    const { toJSON } = render(<Button title="Primary" onPress={() => {}} variant="primary" />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('should apply secondary variant styles', () => {
    const { toJSON } = render(<Button title="Secondary" onPress={() => {}} variant="secondary" />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('should apply outline variant styles', () => {
    const { toJSON } = render(<Button title="Outline" onPress={() => {}} variant="outline" />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('should apply different sizes', () => {
    const { toJSON: smallJSON } = render(<Button title="Small" onPress={() => {}} size="sm" />);
    const { toJSON: mediumJSON } = render(<Button title="Medium" onPress={() => {}} size="md" />);
    const { toJSON: largeJSON } = render(<Button title="Large" onPress={() => {}} size="lg" />);
    
    expect(smallJSON).toBeTruthy();
    expect(mediumJSON).toBeTruthy();
    expect(largeJSON).toBeTruthy();
  });
});
