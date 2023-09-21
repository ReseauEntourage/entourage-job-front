import React, { useState } from 'react';
import { CheckBox } from './CheckBox';

const meta = {
  title: 'CheckBox',
  component: CheckBox,
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
            display: 'flex',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

const Template = (args) => {
  const [value, setValue] = useState(false);

  return (
    <CheckBox
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
};

export const WithLabel = {
  render: Template,
  args: {
    title: 'Click on me',
  },
};

export default meta;
