import React from 'react';
import CVIllu from 'assets/icons/illu-CV.svg';
import ConversationIllu from 'assets/icons/illu-conversation.svg';
import MaletteIllu from 'assets/icons/illu-malette.svg';
import TipsIllu from 'assets/icons/illu-poignee-de-main.svg';
import RSIllu from 'assets/icons/illu-reseaux-sociaux.svg';
import { USER_ROLES } from './users';
import { FilterConstant } from './utils';

export type HelpNames = 'tips' | 'interview' | 'cv' | 'network' | 'event';

const iconSizeProps = { width: 40, height: 40 };

export const ProfileHelps: (FilterConstant<HelpNames> & {
  icon: JSX.Element;
  shortTitle: {
    [K in typeof USER_ROLES.CANDIDATE | typeof USER_ROLES.COACH]: string;
  };
})[] = [
  {
    icon: <TipsIllu {...iconSizeProps} />,
    value: 'tips',
    label: 'Soutien',
    shortTitle: {
      [USER_ROLES.CANDIDATE]: 'Demander un conseil',
      [USER_ROLES.COACH]: 'Conseiller un(e) candidat(e)',
    },
  },
  {
    icon: <MaletteIllu {...iconSizeProps} />,
    value: 'interview',
    label: 'Entretien',
    shortTitle: {
      [USER_ROLES.CANDIDATE]: 'Préparer un entretien',
      [USER_ROLES.COACH]: 'Aider à préparer un entretien',
    },
  },
  {
    icon: <CVIllu {...iconSizeProps} />,
    value: 'cv',
    label: 'CV',
    shortTitle: {
      [USER_ROLES.CANDIDATE]: 'Créer mon CV',
      [USER_ROLES.COACH]: 'Aider à réaliser un CV',
    },
  },
  {
    icon: <ConversationIllu {...iconSizeProps} />,
    value: 'event',
    label: 'Événement',
    shortTitle: {
      [USER_ROLES.CANDIDATE]: 'Rencontrer la communauté',
      [USER_ROLES.COACH]: 'Rencontrer la communauté',
    },
  },
  {
    icon: <RSIllu {...iconSizeProps} />,
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
    [R in typeof USER_ROLES.CANDIDATE | typeof USER_ROLES.COACH]: string;
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
  [K in typeof USER_ROLES.CANDIDATE | typeof USER_ROLES.COACH]: {
    icon: React.ReactNode;
    value: string;
    title: string;
    description: string;
  }[];
} = {
  [USER_ROLES.CANDIDATE]: [
    {
      icon: <TipsIllu {...iconSizeProps} />,
      value: 'tips',
      title: 'Demander des conseils aux membre de la communauté',
      description:
        'Recevez des conseils personnalisés et un accompagnement de la part de nos coachs pour vous guider dans votre parcours professionnel.',
    },
    {
      icon: <MaletteIllu {...iconSizeProps} />,
      value: 'interview',
      title: 'Se préparer aux entretiens d’embauche',
      description:
        'Préparez au mieux vos entretiens grâce aux conseils et au soutien des coachs LinkedOut.',
    },
    {
      icon: <CVIllu {...iconSizeProps} />,
      value: 'cv',
      title: 'M’aider à réaliser mon CV et mes lettres de motivation',
      description:
        "Profitez de l'expérience des coachs LinkedOut pour créer des CV et lettres de motivation qui mettent en avant vos atouts et compétences.",
    },
    {
      icon: <ConversationIllu {...iconSizeProps} />,
      value: 'event',
      title: 'Se rencontrer et échanger avec les membres de la communauté',
      description:
        "Rejoignez notre communauté lors d'événements pour partager vos expériences, apprendre des autres et tisser des liens professionnels précieux.",
    },
    {
      icon: <RSIllu {...iconSizeProps} />,
      value: 'network',
      title: 'Faire grandir votre réseau professionnel',
      description:
        "Multipliez les opportunités professionnelles en vous connectant avec des professionnels qui peuvent vous soutenir et vous ouvrir des portes sur le marché de l'emploi.",
    },
  ],
  [USER_ROLES.COACH]: [
    {
      icon: <TipsIllu {...iconSizeProps} />,
      value: 'tips',
      title: 'Donner des conseils aux membres de la communauté',
      description:
        'Partagez votre savoir-faire et vos conseils pour aider les candidats à naviguer sur le marché du travail et à trouver des opportunités adaptées à leurs compétences.',
    },
    {
      icon: <MaletteIllu {...iconSizeProps} />,
      value: 'interview',
      title: 'Aider à préparer les entretiens d’embauche',
      description:
        "Mettez à profit votre expertise pour coacher les candidats, les aider à anticiper les questions d'entretiens et à communiquer efficacement leur motivation.",
    },
    {
      icon: <CVIllu {...iconSizeProps} />,
      value: 'cv',
      title: 'Aider à réaliser un CV et une lettre de motivation',
      description:
        'Utilisez votre expérience pour guider les candidats dans la création de documents professionnels qui reflètent leur potentiel et leurs expériences.',
    },
    {
      icon: <ConversationIllu {...iconSizeProps} />,
      value: 'event',
      title:
        'Se rencontrer lors d’événements avec les membres de la communautés',
      description:
        "Participer à des événements qui encouragent l'entraide, le partage d'expériences et le développement de réseaux professionnels enrichissants pour les candidats.",
    },
    {
      icon: <RSIllu {...iconSizeProps} />,
      value: 'network',
      title: 'Partager votre réseau professionnel',
      description:
        'Mettez en relation les candidats avec des contacts pertinents et intégez-les dans des réseaux qui peuvent favoriser leur insertion professionnelle.',
    },
  ],
};
