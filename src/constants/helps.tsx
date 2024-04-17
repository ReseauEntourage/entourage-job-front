import React from 'react';

import { Img } from 'src/components/utils/Img';
import { NormalUserRole, USER_ROLES } from './users';
import { FilterConstant } from './utils';

export type HelpValue = 'tips' | 'interview' | 'cv' | 'network' | 'event';

const iconSizeProps = { width: 45, height: 45 };

export const ProfileHelps: (FilterConstant<HelpValue> & {
  icon: JSX.Element;
  shortTitle: {
    [K in NormalUserRole]: string;
  };
})[] = [
  {
    icon: (
      <Img
        src="/static/img/illustrations/illu-poignee-main.png"
        alt="Poignée de main"
        {...iconSizeProps}
      />
    ),
    value: 'tips',
    label: 'Soutien',
    shortTitle: {
      [USER_ROLES.CANDIDATE]: 'Demander un conseil',
      [USER_ROLES.COACH]: 'Conseiller un(e) candidat(e)',
    },
  },
  {
    icon: (
      <Img
        src="/static/img/illustrations/illu-mallette.png"
        alt="Entretien"
        {...iconSizeProps}
      />
    ),
    value: 'interview',
    label: 'Entretien',
    shortTitle: {
      [USER_ROLES.CANDIDATE]: 'Préparer un entretien',
      [USER_ROLES.COACH]: 'Aider à préparer un entretien',
    },
  },
  {
    icon: (
      <Img
        src="/static/img/illustrations/illu-CV.png"
        alt="CV"
        {...iconSizeProps}
      />
    ),
    value: 'cv',
    label: 'CV',
    shortTitle: {
      [USER_ROLES.CANDIDATE]: 'Créer mon CV',
      [USER_ROLES.COACH]: 'Aider à réaliser un CV',
    },
  },
  {
    icon: (
      <Img
        src="/static/img/illustrations/illu-disscution.png"
        alt="Disscution"
        {...iconSizeProps}
      />
    ),
    value: 'event',
    label: 'Événement',
    shortTitle: {
      [USER_ROLES.CANDIDATE]: 'Rencontrer la communauté',
      [USER_ROLES.COACH]: 'Rencontrer la communauté',
    },
  },
  {
    icon: (
      <Img
        src="/static/img/illustrations/illu-partage-RS.png"
        alt="Réseaux sociaux"
        {...iconSizeProps}
      />
    ),
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
      icon: (
        <Img
          src="/static/img/illustrations/illu-poignee-main.png"
          alt="Poignée de main"
          {...iconSizeProps}
        />
      ),
      value: 'tips',
      label: 'Demander des conseils aux membres de la communauté',
      description:
        'Recevez des conseils personnalisés et un accompagnement de la part de nos coachs pour vous guider dans votre parcours professionnel.',
    },
    {
      icon: (
        <Img
          src="/static/img/illustrations/illu-mallette.png"
          alt="Mallette"
          {...iconSizeProps}
        />
      ),
      value: 'interview',
      label: 'Se préparer aux entretiens d’embauche',
      description:
        'Préparez au mieux vos entretiens grâce aux conseils et au soutien des coachs Entourage Pro.',
    },
    {
      icon: (
        <Img
          src="/static/img/illustrations/illu-CV.png"
          alt="CV"
          {...iconSizeProps}
        />
      ),
      value: 'cv',
      label: 'Réaliser son CV et ses lettres de motivation',
      description:
        "Profitez de l'expérience des coachs Entourage Pro pour créer des CV et lettres de motivation qui mettent en avant vos atouts et compétences.",
    },
    {
      icon: (
        <Img
          src="/static/img/illustrations/illu-disscution.png"
          alt="Disscution"
          {...iconSizeProps}
        />
      ),
      value: 'event',
      label: 'Se rencontrer et échanger avec les membres de la communauté',
      description:
        "Rejoignez notre communauté lors d'événements pour partager vos expériences, apprendre des autres et tisser des liens professionnels précieux.",
    },
    {
      icon: (
        <Img
          src="/static/img/illustrations/illu-partage-RS.png"
          alt="Réseaux sociaux"
          {...iconSizeProps}
        />
      ),
      value: 'network',
      label: 'Faire grandir son réseau professionnel',
      description:
        "Multipliez les opportunités professionnelles en vous connectant avec des professionnels qui peuvent vous soutenir et vous ouvrir des portes sur le marché de l'emploi.",
    },
  ],

  // Using <Img /> instead of SVGs on purpose to fix the disapearing bug
  [USER_ROLES.COACH]: [
    {
      icon: (
        <Img
          src="/static/img/illustrations/illu-CV.png"
          alt="CV"
          {...iconSizeProps}
        />
      ),
      value: 'tips',
      label: 'Donner des conseils aux membres de la communauté',
      description:
        'Partagez votre savoir-faire et vos conseils pour aider les candidats à naviguer sur le marché du travail et à trouver des opportunités adaptées à leurs compétences.',
    },
    {
      icon: (
        <Img
          src="/static/img/illu-mallette.png"
          alt="Mallette"
          {...iconSizeProps}
        />
      ),
      value: 'interview',
      label: 'Aider à préparer les entretiens d’embauche',
      description:
        "Mettez à profit votre expertise pour coacher les candidats, les aider à anticiper les questions d'entretiens et à communiquer efficacement leur motivation.",
    },
    {
      icon: (
        <Img
          src="/static/img/illu-poignee-main.png"
          alt="Poignée de main"
          {...iconSizeProps}
        />
      ),
      value: 'cv',
      label: 'Aider à réaliser un CV et une lettre de motivation',
      description:
        'Utilisez votre expérience pour guider les candidats dans la création de documents professionnels qui reflètent leur potentiel et leurs expériences.',
    },
    {
      icon: (
        <Img
          src="/static/img/illustrations/illu-disscution.png"
          alt="Disscution"
          {...iconSizeProps}
        />
      ),
      value: 'event',
      label:
        'Se rencontrer lors d’événements avec les membres de la communauté',
      description:
        "Participer à des événements qui encouragent l'entraide, le partage d'expériences et le développement de réseaux professionnels enrichissants pour les candidats.",
    },
    {
      icon: (
        <Img
          src="/static/img/illustrations/illu-partage-RS.png"
          alt="Réseaux sociaux"
          {...iconSizeProps}
        />
      ),
      value: 'network',
      label: 'Partager mon réseau professionnel',
      description:
        'Mettez en relation les candidats avec des contacts pertinents et intégez-les dans des réseaux qui peuvent favoriser leur insertion professionnelle.',
    },
  ],
};
