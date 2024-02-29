import React, { useState } from 'react';

import { Card } from 'src/components/utils/Cards/Card';
import { ParametresHelpCardContents } from 'src/constants/helps';
import { USER_ROLES } from 'src/constants/users';
import { SelectList as SelectListComponent } from './SelectList';

const meta = {
  title: 'Select List',
  component: SelectListComponent,
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
          <Card>
            <Story />
          </Card>
        </div>
      );
    },
  ],
};
const Template = (args) => {
  const [helps, setHelps] = useState<{ name: string }[]>([]);

  return (
    <SelectListComponent
      value={helps.map(({ name }) => name)}
      onChange={(values) => {
        setHelps(
          values.map((help) => {
            return { name: help };
          })
        );
      }}
      {...args}
    />
  );
};

export const Default = {
  render: Template,
};

export default meta;
