import React, { useState } from 'react';
import { ParametresHelpCardContents } from 'src/constants/helps';
import { USER_ROLES } from 'src/constants/users';
import { SelectList } from './SelectList';

const meta = {
  title: 'Select List',
  component: SelectList,
  parameters: {
    controls: {
      include: ['isMulti'],
    },
  },
  argTypes: {
    isMulti: {
      control: 'boolean',
      defaultValue: true,
    },
  },
  args: {
    id: 'select-list-stories',
    options: ParametresHelpCardContents[USER_ROLES.CANDIDATE],
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            maxWidth: '600px',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};
const Template = (args) => {
  const [helps, setHelps] = useState<string[]>([]);

  return (
    <SelectList
      value={helps}
      onChange={(values) => {
        setHelps(values);
      }}
      {...args}
    />
  );
};

export const Default = {
  render: Template,
};

export default meta;
