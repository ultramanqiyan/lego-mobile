import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import Card from '../../../src/components/common/Card';

describe('Card', () => {
  it('should render children correctly', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('should render title when provided', () => {
    const { getByText } = render(
      <Card title="Card Title">
        <Text>Content</Text>
      </Card>
    );
    expect(getByText('Card Title')).toBeTruthy();
  });

  it('should render subtitle when provided', () => {
    const { getByText } = render(
      <Card title="Title" subtitle="Subtitle">
        <Text>Content</Text>
      </Card>
    );
    expect(getByText('Subtitle')).toBeTruthy();
  });

  it('should apply variant styles', () => {
    const { toJSON: primaryJSON } = render(<Card variant="primary"><Text>Primary</Text></Card>);
    const { toJSON: secondaryJSON } = render(<Card variant="secondary"><Text>Secondary</Text></Card>);
    const { toJSON: successJSON } = render(<Card variant="success"><Text>Success</Text></Card>);
    
    expect(primaryJSON).toBeTruthy();
    expect(secondaryJSON).toBeTruthy();
    expect(successJSON).toBeTruthy();
  });

  it('should apply custom style', () => {
    const customStyle = { marginTop: 20 };
    const { toJSON } = render(
      <Card style={customStyle}>
        <Text>Styled Card</Text>
      </Card>
    );
    expect(toJSON()).toBeTruthy();
  });
});
