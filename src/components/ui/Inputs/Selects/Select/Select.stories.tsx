import React, { useState } from 'react';

import { FilterConstant } from 'src/constants/utils';
import { Select } from './Select';

const meta = {
  component: Select,
  parameters: {
    controls: {
      include: ['isMulti', 'isDisabled'],
    },
  },
  argTypes: {
    isMulti: {
      control: 'boolean',
      defaultValue: false,
    },
    isDisabled: {
      control: 'boolean',
      defaultValue: false,
    },
  },
  args: {
    id: 'select-stories',
    options: [
      [
        {
          value: '1',
          label: 'Emile Bex',
        },
        {
          value: '2',
          label: 'Paul Carillon',
        },
        {
          value: '3',
          label: 'Alice Bertaut',
        },
      ],
    ],
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
  const [value, setValue] = useState<FilterConstant | FilterConstant[]>();

  return (
    <Select
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

export default meta;
