import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import EmptyState from '../../../src/components/common/EmptyState';

describe('EmptyState', () => {
  it('should render with default props', () => {
    const { getByText } = render(<EmptyState />);
    expect(getByText('暂无数据')).toBeTruthy();
  });

  it('should render custom icon', () => {
    const { getByText } = render(<EmptyState icon="📭" />);
    expect(getByText('📭')).toBeTruthy();
  });

  it('should render custom title', () => {
    const { getByText } = render(<EmptyState title="No Items" />);
    expect(getByText('No Items')).toBeTruthy();
  });

  it('should render description', () => {
    const { getByText } = render(
      <EmptyState description="No items found in the list" />
    );
    expect(getByText('No items found in the list')).toBeTruthy();
  });

  it('should render action button', () => {
    const ActionButton = () => <Text>Add Item</Text>;
    const { getByText } = render(<EmptyState action={<ActionButton />} />);
    expect(getByText('Add Item')).toBeTruthy();
  });

  it('should render all props together', () => {
    const ActionButton = () => <Text>Click Me</Text>;
    const { getByText } = render(
      <EmptyState
        icon="📭"
        title="Empty List"
        description="There are no items"
        action={<ActionButton />}
      />
    );
    
    expect(getByText('📭')).toBeTruthy();
    expect(getByText('Empty List')).toBeTruthy();
    expect(getByText('There are no items')).toBeTruthy();
    expect(getByText('Click Me')).toBeTruthy();
  });
});
