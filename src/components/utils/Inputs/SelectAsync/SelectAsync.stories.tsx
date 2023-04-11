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
    defaultOptions: [
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
    (Story, { args }) => {
      const [value, setValue] = useState(
        args.value || (args.isMulti ? [] : null)
      );

      return (
        <div
          style={{
            display: 'flex',
            padding: 8,
            width: 100,
          }}
        >
          <Story
            {...args}
            onChange={(event) => {
              setValue(event);
            }}
            value={value}
          />
        </div>
      );
    },
  ],
};

export const Default = {};

export default meta;
