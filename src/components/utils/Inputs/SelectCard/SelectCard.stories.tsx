import React, { useState } from 'react';
import { Typography } from 'src/components/utils';
import { Program, ProgramBullet, Programs } from 'src/constants/programs';
import { SelectCard, SelectCardProps } from './SelectCard';

// Cannot use ProgramOptions[USER_ROLES.CANDIDATE] because we switched to usinghg radio component
// Keeping the story if we need it later
const candidateProgramOptions = [
  {
    value: Programs.THREE_SIXTY,
    label: 'Format 360',
    bullets: ProgramBullet.three_sixty,
    description:
      "Je souhaite bénéficier d'un accompagnement personnalisé avec un coach dédié (définition de mon projet, création de mon CV, recherches, préparation aux entretiens...)",
    inputId: 'radio-input-three-sixty',
  },
  {
    value: Programs.BOOST,
    label: 'Format Coup de pouce',
    bullets: ProgramBullet.boost,
    description:
      "Je souhaite profiter de coups de pouces ponctuels pour m'aider dans ma recherche d'emploi (atelier CV et entretiens, partage de réseau, conseils pour la recherche, partage d'expérience...)",
    inputId: 'radio-input-boost',
  },
];

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
    options: candidateProgramOptions,
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
      Pour l&apos;instant, le Format 360 est uniquement disponible pour les
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
