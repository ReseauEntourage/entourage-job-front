import React, { useState } from 'react';

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
    loadOptions: async (inputValue, callback) => {
      if (inputValue.length > 0) {
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
      }
      callback([]);
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
  const [value, setValue] = useState();

  return (
    <SelectAsync
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
};

export default meta;