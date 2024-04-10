import React, { useState } from 'react';
import { Typography } from 'src/components/utils';
import { Program, ProgramOptions, Programs } from 'src/constants/programs';
import { USER_ROLES } from 'src/constants/users';
import { SelectCard, SelectCardProps } from './SelectCard';

const meta = {
  title: 'Select Card',
  component: SelectCard,
  parameters: {
    controls: {
      include: ['isMulti', 'disableOption'],
    },
  },
  argTypes: {
    isMulti: {
      control: 'boolean',
      defaultValue: true,
    },
    disableOption: {
      control: 'boolean',
      defaultValue: false,
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
          <Story />
        </div>
      );
    },
  ],
};

const disabledOptionMessage = (
  <>
    <Typography size="small" weight="bold">
      Pour l&apos;instant, le Programme 360 est uniquement disponible pour les
      moins de 30 ans résidant dans certaines villes et département définies
    </Typography>
    <Typography size="small" variant="italic">
      (Paris, Seine-Saint-Denis, Hauts-de-Seine, Lille, Lyon et Rennes).
    </Typography>
  </>
);

const Template = (args) => {
  const [programs, setPrograms] = useState<string[]>([]);

  let optionsToDisable: SelectCardProps<Program>['optionsToDisable'] = [];

  const { disableOption } = args;
  if (disableOption) {
    optionsToDisable = [
      {
        option: Programs.THREE_SIXTY,
        message: disabledOptionMessage,
      },
    ];
  }

  return (
    <SelectCard
      optionsToDisable={optionsToDisable}
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
