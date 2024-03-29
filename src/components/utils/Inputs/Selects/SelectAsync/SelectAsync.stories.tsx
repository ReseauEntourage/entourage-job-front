import React, { useState } from 'react';

import { FilterConstant } from 'src/constants/utils';
import { asyncTimeout } from 'src/utils/asyncTimeout';
import { SelectAsync } from './SelectAsync';

const meta = {
  title: 'SelectAsync',
  component: SelectAsync,
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
    id: 'select-async-stories',
    loadOptions: async (callback) => {
      await asyncTimeout(2000);
      callback([
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
      ]);
      callback([]);
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
  const [value, setValue] = useState<FilterConstant | FilterConstant[]>();

  return (
    <SelectAsync
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
