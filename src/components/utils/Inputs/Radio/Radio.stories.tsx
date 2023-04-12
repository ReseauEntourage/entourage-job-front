import React, { useState } from 'react';
import { Radio } from './Radio';

const meta = {
  title: 'Radio',
  component: Radio,
  parameters: {
    controls: {
      exclude: /.*/g,
    },
  },
};

const Template = (args) => {
  const [value, setValue] = useState('');

  return (
    <Radio
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
    legend: 'An exclusive choice to make (default to one)',
    options: [
      {
        inputId: 'one',
        label: "I'll take one",
        value: 'one',
        checked: true,
      },
      {
        inputId: 'two',
        label: "I'll always take more than one",
        value: 'two',
      },
      {
        inputId: 'three',
        label: "Two's not enough",
        value: 'three',
      },
    ],
  },
};

export default meta;
