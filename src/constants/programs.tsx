import React from 'react';

import { ProgramCalendar, ProgramMap, ProgramTime } from 'assets/icons/icons';
import { NormalUserRole, USER_ROLES } from './users';
import { FilterConstant } from './utils';

export const Programs = {
  BOOST: 'boost',
  THREE_SIXTY: 'three_sixty',
} as const;

export type Program = (typeof Programs)[keyof typeof Programs];

const calendarIconSizeProps = { width: 20, height: 22 };
const timeIconSizeProps = { width: 17, height: 17 };
const mapIconSizeProps = { width: 21, height: 21 };

interface ProgramBullet {
  label: string;
  icon: React.ReactNode;
}

export const ProgramBullet: {
  [K in Program]: ProgramBullet[];
} = {
  [Programs.THREE_SIXTY]: [
    {
      icon: <ProgramCalendar {...calendarIconSizeProps} />,
      label: 'Durée de 6 mois',
    },
    {
      icon: <ProgramTime {...timeIconSizeProps} />,
      label: '2 heures par semaine',
    },
    {
      icon: <ProgramMap {...mapIconSizeProps} />,
      label: 'En physique',
    },
  ],
  [Programs.BOOST]: [
    {
      icon: <ProgramCalendar {...calendarIconSizeProps} />,
      label: 'Ponctuel',
    },
    {
      icon: <ProgramTime {...timeIconSizeProps} />,
      label: 'Selon vos besoins',
    },
    {
      icon: <ProgramMap {...mapIconSizeProps} />,
      label: 'En physique ou en visio',
    },
  ],
};

export const ProgramOptions: {
  [K in NormalUserRole]: (FilterConstant<Program> & {
    inputId: string;
  })[];
} = {
  [USER_ROLES.CANDIDATE]: [
    {
      value: Programs.THREE_SIXTY,
      label: 'Oui',
      inputId: 'radio-input-three-sixty',
    },
    {
      value: Programs.BOOST,
      label: 'Non',
      inputId: 'radio-input-boost',
    },
  ],
  [USER_ROLES.COACH]: [
    {
      value: Programs.THREE_SIXTY,
      label:
        'Je préfère accompagner un seul candidat de manière régulière, une heure par semaine, pendant 3 à 6 mois',
      inputId: 'radio-input-three-sixty',
    },
    {
      value: Programs.BOOST,
      label:
        'Je préfère accompagner plusieurs candidats de manière ponctuelle et sans engagement',
      inputId: 'radio-input-boost',
    },
  ],
};
