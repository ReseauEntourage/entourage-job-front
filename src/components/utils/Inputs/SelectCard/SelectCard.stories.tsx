import React, { useState } from 'react';

import { Card } from 'src/components/utils/Cards/Card';
import { ProgramOptions } from 'src/constants/programs';
import { USER_ROLES } from 'src/constants/users';
import { SelectCard } from './SelectCard';

const meta = {
  title: 'Select Card',
  component: SelectCard,
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
    options: ProgramOptions[USER_ROLES.CANDIDATE],
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            maxWidth: '600px',
          }}
        >
          <Card>
            <Story />
          </Card>
        </div>
      );
    },
  ],
};
const Template = (args) => {
  const [programs, setPrograms] = useState<string[]>([]);

  return (
    <SelectCard
      value={programs}
      onChange={(values) => {
        setPrograms(values);
      }}
      {...args}
    />
  );
};

export const Default = {
  render: Template,
};

export default meta;
