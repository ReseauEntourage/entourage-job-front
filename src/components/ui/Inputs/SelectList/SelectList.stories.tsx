import React, { useState } from 'react';
import { ParametresNudgeCardContents } from '@/src/constants/nudges';
import { UserRoles } from 'src/constants/users';
import { SelectList } from './SelectList';

const meta = {
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
    options: ParametresNudgeCardContents[UserRoles.CANDIDATE],
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
  const [nudges, setNudges] = useState<string[]>([]);

  return (
    <SelectList
      value={nudges}
      onChange={(values) => {
        setNudges(values);
      }}
      {...args}
    />
  );
};

export const Default = {
  render: Template,
};

export default meta;
