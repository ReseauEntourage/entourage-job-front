import React, { useState } from 'react';
import { TextInput } from './TextInput';

const meta = {
  title: 'Text Input',
  component: TextInput,
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

const Template = (args) => {
  const [value, setValue] = useState('');

  return (
    <TextInput
      {...args}
      onChange={(updatedValue) => {
        setValue(updatedValue);
      }}
      value={value}
    />
  );
};

export const Default = {
  render: Template,
  args: {
    title: 'A short story to tell',
  },
};

export const WithLabel = {
  render: Template,
  args: {
    title: 'A short story to tell',
    showLabel: true,
    placeholder: 'Tell us everything',
  },
};

export const Password = {
  render: Template,
  args: {
    title: 'A secret story to tell',
    type: 'password',
  },
};

export const Email = {
  render: Template,
  args: {
    title: 'Share your email',
    type: 'email',
  },
};

export const Secondary = {
  render: Template,
  args: {
    title: 'Secondary, used for Newsletter',
    style: 'secondary',
  },
};

export default meta;
