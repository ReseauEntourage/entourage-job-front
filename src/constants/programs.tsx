import React from 'react';
import ProgramCalendarIcon from 'assets/icons/program-calendar.svg';
import ProgramMapIcon from 'assets/icons/program-map.svg';
import ProgramTimeIcon from 'assets/icons/program-time.svg';
import { NormalUserRole, USER_ROLES } from './users';
import { FilterConstant } from './utils';

export type Programs = 'short' | 'long';

const calendarIconSizeProps = { width: 20, height: 22 };
const timeIconSizeProps = { width: 17, height: 17 };
const mapIconSizeProps = { width: 21, height: 21 };

export const ProgramOptions: {
  [K in NormalUserRole]: (FilterConstant<Programs> & {
    bullets: {
      label: string;
      icon: React.ReactNode;
    }[];
    description: string;
  })[];
} = {
  [USER_ROLES.CANDIDATE]: [
    {
      value: 'long',
      label: 'Programme 360',
      bullets: [
        {
          icon: <ProgramCalendarIcon {...calendarIconSizeProps} />,
          label: 'Durée de 6 mois',
        },
        {
          icon: <ProgramTimeIcon {...timeIconSizeProps} />,
          label: '2 heures par semaine',
        },
        {
          icon: <ProgramMapIcon {...mapIconSizeProps} />,
          label: 'En physique',
        },
      ],
      description:
        "Je souhaite bénéficier d'un accompagnement personnalisé avec un coach dédié (définition de mon projet, création de mon CV, recherches, préparation aux entretiens...)",
    },
    {
      value: 'short',
      label: 'Programme Coup de pouce',
      bullets: [
        {
          icon: <ProgramCalendarIcon {...calendarIconSizeProps} />,
          label: 'Ponctuel',
        },
        {
          icon: <ProgramTimeIcon {...timeIconSizeProps} />,
          label: 'Selon vos besoins',
        },
        {
          icon: <ProgramMapIcon {...mapIconSizeProps} />,
          label: 'En physique ou en visio',
        },
      ],
      description:
        "Je souhaite profiter de coups de pouces ponctuels pour m'aider dans ma recherche d'emploi (atelier CV et entretiens, partage de réseau, conseils pour la recherche, partage d'expérience...)",
    },
  ],
  [USER_ROLES.COACH]: [
    {
      value: 'long',
      label: 'Programme 360',
      bullets: [
        {
          icon: <ProgramCalendarIcon {...calendarIconSizeProps} />,
          label: 'Durée de 6 mois',
        },
        {
          icon: <ProgramTimeIcon {...timeIconSizeProps} />,
          label: '2 heures par semaine',
        },
        {
          icon: <ProgramMapIcon {...mapIconSizeProps} />,
          label: 'En physique',
        },
      ],
      description:
        "Je souhaite me consacrer à l'accompagnement personnalisé d'un(e) candidat(e) : définition de son projet, création de son CV, aide dans les recherches, préparation aux entretiens...",
    },
    {
      value: 'short',
      label: 'Programme Coup de pouce',
      bullets: [
        {
          icon: <ProgramCalendarIcon {...calendarIconSizeProps} />,
          label: 'Ponctuel',
        },
        {
          icon: <ProgramTimeIcon {...timeIconSizeProps} />,
          label: 'Selon vos besoins',
        },
        {
          icon: <ProgramMapIcon {...mapIconSizeProps} />,
          label: 'En physique ou en visio',
        },
      ],
      description:
        "Je souhaite proposer des coups des pouces ponctuels pour aider des candidat(e)s dans leurs recherches : atelier CV et entretiens, partage de réseau, conseils pour les recherches, partage d'expérience...",
    },
  ],
};
