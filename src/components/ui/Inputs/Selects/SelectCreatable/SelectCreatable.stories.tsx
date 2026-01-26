import React, { useState } from 'react';

import { FilterConstant } from 'src/constants/utils';
import { SelectCreatable } from './SelectCreatable';

const meta = {
  component: SelectCreatable,
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
    id: 'select-creatable-stories',
    options: [
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
  const [value, setValue] = useState<FilterConstant | FilterConstant[] | null>(
    null
  );

  return (
    <SelectCreatable
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
