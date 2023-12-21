import React from 'react';
import { Card } from './Card';

const meta = {
  title: 'Grid Card',
  decorators: [
    (Story) => {
      return (
        <div>
          <Story />
        </div>
      );
    },
  ],
};

const SimpleCard = (args) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '30px',
      }}
    >
      <Card title="This is a simple card" {...args}>
        <ul>
          <li>Example</li>
          <li>Example</li>
          <li>Example</li>
          <li>Example</li>
          <li>Example</li>
        </ul>
      </Card>
      <Card
        title="This is an edit card"
        isLoading={false}
        editCallback={() => null}
        {...args}
      >
        <ul>
          <li>Example</li>
          <li>Example</li>
          <li>Example</li>
          <li>Example</li>
          <li>Example</li>
        </ul>
      </Card>

      <Card title="This is a loading card" isLoading {...args}>
        <ul>
          <li>Example</li>
          <li>Example</li>
          <li>Example</li>
          <li>Example</li>
          <li>Example</li>
        </ul>
      </Card>
    </div>
  );
};

export const GridCard = {
  render: SimpleCard,
};

export default meta;
