import React, { useState } from 'react';
import { Checkbox } from './CheckBox';

const meta = {
  title: 'Checkbox',
  component: Checkbox,
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
            width: 0,
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

const Template = (args) => {
  const [value, setValue] = useState();

  return (
    <Checkbox
      {...args}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      value={value}
      checked={value}
    />
  );
};

export const Default = {
  render: Template,
};

export default meta;
