import React, { useState } from 'react';
import { PhoneInput } from './PhoneInput';

const meta = {
  title: 'Phone Input',
  component: PhoneInput,
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
            width: 100,
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
    <PhoneInput
      {...args}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      value={value}
    />
  );
};

export const Default = {
  render: Template,
  args: {
    title: 'Numéro de téléphone',
  },
};

export default meta;
