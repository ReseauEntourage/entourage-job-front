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

const ProgramBullet: {
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
    bullets: {
      label: string;
      icon: React.ReactNode;
    }[];
    description: string;
  })[];
} = {
  [USER_ROLES.CANDIDATE]: [
    {
      value: Programs.THREE_SIXTY,
      label: 'Format 360',
      bullets: ProgramBullet.three_sixty,
      description:
        "Je souhaite bénéficier d'un accompagnement personnalisé avec un coach dédié (définition de mon projet, création de mon CV, recherches, préparation aux entretiens...)",
    },
    {
      value: Programs.BOOST,
      label: 'Format Coup de pouce',
      bullets: ProgramBullet.boost,
      description:
        "Je souhaite profiter de coups de pouces ponctuels pour m'aider dans ma recherche d'emploi (atelier CV et entretiens, partage de réseau, conseils pour la recherche, partage d'expérience...)",
    },
  ],
  [USER_ROLES.COACH]: [
    {
      value: Programs.THREE_SIXTY,
      label: 'Format 360',
      bullets: ProgramBullet.three_sixty,
      description:
        "Je souhaite me consacrer à l'accompagnement personnalisé d'un(e) candidat(e) : définition de son projet, création de son CV, aide dans les recherches, préparation aux entretiens...",
    },
    {
      value: Programs.BOOST,
      label: 'Format Coup de pouce',
      bullets: ProgramBullet.boost,
      description:
        "Je souhaite proposer des coups des pouces ponctuels pour aider des candidat(e)s dans leurs recherches : atelier CV et entretiens, partage de réseau, conseils pour les recherches, partage d'expérience...",
    },
  ],
};
