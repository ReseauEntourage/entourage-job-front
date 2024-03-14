import React from 'react';

import {
  IlluConversation,
  IlluCV,
  IlluMalette,
  IlluPoigneeDeMain,
  IlluReseauxSociaux,
} from 'assets/icons/icons';
import { NormalUserRole, USER_ROLES } from './users';
import { FilterConstant } from './utils';

export type HelpValue = 'tips' | 'interview' | 'cv' | 'network' | 'event';

const iconSizeProps = { width: 40, height: 40 };

export const ProfileHelps: (FilterConstant<HelpValue> & {
  icon: JSX.Element;
  shortTitle: {
    [K in NormalUserRole]: string;
  };
})[] = [
  {
    icon: <IlluPoigneeDeMain {...iconSizeProps} />,
    value: 'tips',
    label: 'Soutien',
    shortTitle: {
      [USER_ROLES.CANDIDATE]: 'Demander un conseil',
      [USER_ROLES.COACH]: 'Conseiller un(e) candidat(e)',
    },
  },
  {
    icon: <IlluMalette {...iconSizeProps} />,
    value: 'interview',
    label: 'Entretien',
    shortTitle: {
      [USER_ROLES.CANDIDATE]: 'Préparer un entretien',
      [USER_ROLES.COACH]: 'Aider à préparer un entretien',
    },
  },
  {
    icon: <IlluCV {...iconSizeProps} />,
    value: 'cv',
    label: 'CV',
    shortTitle: {
      [USER_ROLES.CANDIDATE]: 'Créer mon CV',
      [USER_ROLES.COACH]: 'Aider à réaliser un CV',
    },
  },
  {
    icon: <IlluConversation {...iconSizeProps} />,
    value: 'event',
    label: 'Événement',
    shortTitle: {
      [USER_ROLES.CANDIDATE]: 'Rencontrer la communauté',
      [USER_ROLES.COACH]: 'Rencontrer la communauté',
    },
  },
  {
    icon: <IlluReseauxSociaux {...iconSizeProps} />,
    value: 'network',
    label: 'Partage',
    shortTitle: {
      [USER_ROLES.CANDIDATE]: 'Développer mon réseau',
      [USER_ROLES.COACH]: 'Partager mon réseau',
    },
  },
];

export const ParametresHelpCardTitles: {
  [K in 'card' | 'modal']: {
    [R in NormalUserRole]: string;
  };
} = {
  card: {
    [USER_ROLES.COACH]: 'Vos propositions de coup de pouce',
    [USER_ROLES.CANDIDATE]: "Vos demandes d'aide",
  },
  modal: {
    [USER_ROLES.COACH]:
      'Sélectionnez les coups de pouce que vous souhaitez apporter aux candidats',
    [USER_ROLES.CANDIDATE]:
      'Sélectionnez les coups de pouce que vous souhaitez avoir auprès des coachs',
  },
} as const;

export const ParametresHelpCardContents: {
  [K in NormalUserRole]: (FilterConstant<HelpValue> & {
    icon: React.ReactNode;
    description: string;
  })[];
} = {
  [USER_ROLES.CANDIDATE]: [
    {
      icon: <IlluPoigneeDeMain {...iconSizeProps} />,
      value: 'tips',
      label: 'Demander des conseils aux membre de la communauté',
      description:
        'Recevez des conseils personnalisés et un accompagnement de la part de nos coachs pour vous guider dans votre parcours professionnel.',
    },
    {
      icon: <IlluMalette {...iconSizeProps} />,
      value: 'interview',
      label: 'Se préparer aux entretiens d’embauche',
      description:
        'Préparez au mieux vos entretiens grâce aux conseils et au soutien des coachs Entourage Pro.',
    },
    {
      icon: <IlluCV {...iconSizeProps} />,
      value: 'cv',
      label: 'M’aider à réaliser mon CV et mes lettres de motivation',
      description:
        "Profitez de l'expérience des coachs Entourage Pro pour créer des CV et lettres de motivation qui mettent en avant vos atouts et compétences.",
    },
    {
      icon: <IlluConversation {...iconSizeProps} />,
      value: 'event',
      label: 'Se rencontrer et échanger avec les membres de la communauté',
      description:
        "Rejoignez notre communauté lors d'événements pour partager vos expériences, apprendre des autres et tisser des liens professionnels précieux.",
    },
    {
      icon: <IlluReseauxSociaux {...iconSizeProps} />,
      value: 'network',
      label: 'Faire grandir votre réseau professionnel',
      description:
        "Multipliez les opportunités professionnelles en vous connectant avec des professionnels qui peuvent vous soutenir et vous ouvrir des portes sur le marché de l'emploi.",
    },
  ],
  [USER_ROLES.COACH]: [
    {
      icon: <IlluPoigneeDeMain {...iconSizeProps} />,
      value: 'tips',
      label: 'Donner des conseils aux membres de la communauté',
      description:
        'Partagez votre savoir-faire et vos conseils pour aider les candidats à naviguer sur le marché du travail et à trouver des opportunités adaptées à leurs compétences.',
    },
    {
      icon: <IlluMalette {...iconSizeProps} />,
      value: 'interview',
      label: 'Aider à préparer les entretiens d’embauche',
      description:
        "Mettez à profit votre expertise pour coacher les candidats, les aider à anticiper les questions d'entretiens et à communiquer efficacement leur motivation.",
    },
    {
      icon: <IlluCV {...iconSizeProps} />,
      value: 'cv',
      label: 'Aider à réaliser un CV et une lettre de motivation',
      description:
        'Utilisez votre expérience pour guider les candidats dans la création de documents professionnels qui reflètent leur potentiel et leurs expériences.',
    },
    {
      icon: <IlluConversation {...iconSizeProps} />,
      value: 'event',
      label:
        'Se rencontrer lors d’événements avec les membres de la communautés',
      description:
        "Participer à des événements qui encouragent l'entraide, le partage d'expériences et le développement de réseaux professionnels enrichissants pour les candidats.",
    },
    {
      icon: <IlluReseauxSociaux {...iconSizeProps} />,
      value: 'network',
      label: 'Partager votre réseau professionnel',
      description:
        'Mettez en relation les candidats avec des contacts pertinents et intégez-les dans des réseaux qui peuvent favoriser leur insertion professionnelle.',
    },
  ],
};
