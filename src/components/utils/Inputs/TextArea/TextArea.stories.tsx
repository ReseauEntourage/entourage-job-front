import React, { useState } from 'react';
import { TextArea } from './TextArea';

const meta = {
  title: 'Text Area',
  component: TextArea,
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
    <TextArea
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
    title: 'A long story to tell',
  },
};

export default meta;
