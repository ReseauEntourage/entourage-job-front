import React, { type JSX } from 'react';

import {
  IlluConversation,
  IlluCV,
  IlluMalette,
  IlluPoigneeDeMain,
  IlluReseauxSociaux,
} from '@/assets/icons/icons';
import { SelectListType } from '../components/utils/Inputs/SelectList';
import { Img } from 'src/components/utils/Img';
import { NormalUserRoles, UserRoles } from './users';
import { FilterConstant } from './utils';

const iconSizeProps = { width: 40, height: 40 };

export const nudgesIcons = {
  tips: <IlluPoigneeDeMain {...iconSizeProps} />,
  interview: <IlluMalette {...iconSizeProps} />,
  cv: <IlluCV {...iconSizeProps} />,
  network: <IlluConversation {...iconSizeProps} />,
  event: <IlluReseauxSociaux {...iconSizeProps} />,
};

export const ProfileNudges: (FilterConstant<string> & {
  icon: JSX.Element;
  shortTitle: {
    [K in NormalUserRoles]: string;
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
      [UserRoles.CANDIDATE]: 'Demander un conseil',
      [UserRoles.COACH]: 'Conseiller un(e) candidat(e)',
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
      [UserRoles.CANDIDATE]: 'Préparer un entretien',
      [UserRoles.COACH]: 'Aider à préparer un entretien',
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
      [UserRoles.CANDIDATE]: 'Créer mon CV',
      [UserRoles.COACH]: 'Aider à réaliser un CV',
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
      [UserRoles.CANDIDATE]: 'Rencontrer la communauté',
      [UserRoles.COACH]: 'Rencontrer la communauté',
    },
  },
  {
    icon: (
      <Img
        src="/static/img/illustrations/illu-partage-rs.png"
        alt="Réseaux sociaux"
        {...iconSizeProps}
      />
    ),
    value: 'network',
    label: 'Partage',
    shortTitle: {
      [UserRoles.CANDIDATE]: 'Développer mon réseau',
      [UserRoles.COACH]: 'Partager mon réseau',
    },
  },
];

export const ParametresNudgeCardTitles: {
  [K in 'card' | 'modal']: {
    [R in NormalUserRoles]: string;
  };
} = {
  card: {
    [UserRoles.COACH]: 'Vos propositions de coup de pouce',
    [UserRoles.CANDIDATE]: "Vos demandes d'aide",
  },
  modal: {
    [UserRoles.COACH]:
      'Sélectionnez les coups de pouce que vous souhaitez apporter aux candidats',
    [UserRoles.CANDIDATE]:
      'Sélectionnez les coups de pouce que vous souhaitez avoir auprès des coachs',
  },
} as const;

export const ReferedCandidateNudgeCardContents: (FilterConstant<string> & {
  icon: React.ReactNode;
  description: string;
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
    label: 'Demander des conseils aux membres de la communauté',
    description:
      "Recevoir des conseils personnalisés et un accompagnement de la part de nos coachs pour l'aider dans son parcours professionnel.",
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
      'Se préparer à ses entretiens grâce aux conseils et au soutien des coachs Entourage Pro.',
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
      'Profiter de l’expertise des coachs Entourage Pro pour concevoir un CV et des lettres de motivation qui valorisent ses atouts et compétences.',
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
      "Rejoindre notre communauté lors d'événements pour partager ses expériences, apprendre des autres et tisser des liens professionnels précieux.",
  },
  {
    icon: (
      <Img
        src="/static/img/illustrations/illu-partage-rs.png"
        alt="Réseaux sociaux"
        {...iconSizeProps}
      />
    ),
    value: 'network',
    label: 'Faire grandir son réseau professionnel',
    description:
      "Multiplier les opportunités professionnelles en entrant en lien avec des professionnels qui peuvent le soutenir et lui ouvrir des portes sur le marché de l'emploi.",
  },
];

export const ParametresNudgeCardContents: {
  [K in NormalUserRoles]: (FilterConstant<string> & {
    icon: React.ReactNode;
    description: string;
  })[];
} = {
  [UserRoles.CANDIDATE]: [
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
        'Profitez de l’expertise des coachs Entourage Pro pour concevoir un CV et des lettres de motivation qui valorisent vos atouts et compétences.',
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
          src="/static/img/illustrations/illu-partage-rs.png"
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

  [UserRoles.COACH]: [
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
          src="/static/img/illustrations/illu-mallette.png"
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
          src="/static/img/illustrations/illu-poignee-main.png"
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
          src="/static/img/illustrations/illu-partage-rs.png"
          alt="Réseaux sociaux"
          {...iconSizeProps}
        />
      ),
      value: 'network',
      label: 'Partager mon réseau professionnel',
      description:
        'Mettez en relation les candidats avec des contacts pertinents et intégrez-les dans des réseaux qui peuvent favoriser leur insertion professionnelle.',
    },
  ],
};

export const createNudgeOption = (role: UserRoles, nudge) => {
  const nudgeDetails = ParametresNudgeCardContents[role].find(
    (nudgeConstant) => nudgeConstant.value === nudge.value
  );
  if (nudgeDetails) {
    return {
      value: nudge.id,
      label: nudgeDetails.label,
      icon: nudgeDetails.icon,
      description: nudgeDetails.description,
    } as SelectListType;
  }
  return null;
};
