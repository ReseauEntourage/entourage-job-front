import React, { useState } from 'react';
import { Select } from './Select';

const meta = {
  title: 'Select',
  component: Select,
  parameters: {
    controls: {
      exclude: /.*/g,
    },
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            width: 500,
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

const options = [
  {
    value: 'first option',
    label: 'first option',
  },
  {
    value: 'second option',
    label: 'second option',
  },
  {
    value: 'third option',
    label: 'third option',
  },
  {
    value: 'forth option',
    label: 'forth option',
  },
  {
    value: 'fifth option',
    label: 'fifth option',
  },
  {
    value: 'sixth option',
    label: 'sixth option',
  },
];

const Template = (args) => {
  const [value, setValue] = useState('');

  return (
    <Select
      {...args}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      value={value}
    />
  );
};

export const Default = {
  render: Template,
  args: {
    options,
    title: 'title / placeholder',
  },
};

export const WithLabel = {
  render: Template,
  args: {
    title: 'A choice to make between different options',
    options,
    showLabel: true,
  },
};

export default meta;
