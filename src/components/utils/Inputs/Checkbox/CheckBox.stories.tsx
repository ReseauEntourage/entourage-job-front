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
      handleClick={(event) => {
        setValue(event.target.checked);
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
