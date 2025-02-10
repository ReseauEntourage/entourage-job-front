import React from 'react';
import {
  IlluCV,
  IlluMalette,
  IlluPoigneeDeMain,
  IlluReseauxSociaux,
} from 'assets/icons/icons';
import { RowIconTitleText } from '../../utils/RowIconTitleText';

export type Role = 'Coach' | 'Candidat' | 'Referer';

export interface Benefit {
  title: string;
  paragraph: string;
  illu: React.ReactNode;
}

export type Content = Benefit[];

const opportunitiesIlluSizes = {
  width: 100,
  height: 100,
};

const contentByRole: { [K in Role]: Content } = {
  Candidat: [
    {
      title: 'Un CV humain et convaincant',
      paragraph: 'Un CV qui casse les codes en valorisant votre parcours',
      illu: <IlluCV {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Une diffusion élargie de votre profil',
      paragraph:
        'Via notre réseau, celui des coachs et les partages du grand public',
      illu: <IlluReseauxSociaux {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Un nouveau réseau professionnel',
      paragraph:
        "l'accès à un réseau de professionnels expérimentés et disponibles pour vous aider",
      illu: <IlluMalette {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Des temps forts collectifs',
      paragraph: 'Des expériences humaines et fédératrices !',
      illu: <IlluPoigneeDeMain {...opportunitiesIlluSizes} />,
    },
  ],
  Coach: [
    {
      title: 'Donnez du sens à sa vie professionnelle',
      paragraph: 'Grâce à une expérience humaine fédératrice et positive',
      illu: <IlluMalette {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Découvrez le coaching et l’associatif.',
      paragraph: 'En faisant vos premiers pas à votre rythme. ',
      illu: <IlluPoigneeDeMain {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Ajoutez une  ligne à  votre CV ',
      paragraph:
        'Qui a dit qu’on ne pouvait pas valoriser le fait d’aider les autres ? Pas nous.',
      illu: <IlluCV {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Rejoignez une communauté d’experts',
      paragraph: '... et élargissez votre propre réseau pro !',
      illu: <IlluReseauxSociaux {...opportunitiesIlluSizes} />,
    },
  ],
  Referer: [
    {
      title: 'Un CV humain et convaincant',
      paragraph: 'Un CV qui casse les codes en valorisant votre parcours',
      illu: <IlluCV {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Une diffusion élargie de votre profil',
      paragraph:
        'Via notre réseau, celui des coachs et les partages du grand public',
      illu: <IlluReseauxSociaux {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Un nouveau réseau professionnel',
      paragraph:
        "l'accès à un réseau de professionnels expérimentés et disponibles pour vous aider",
      illu: <IlluMalette {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Des temps forts collectifs',
      paragraph: 'Des expériences humaines et fédératrices !',
      illu: <IlluPoigneeDeMain {...opportunitiesIlluSizes} />,
    },
  ],
};

export interface FormatBenefitsProps {
  role: Role;
  title: string;
}

export const FormatBenefits = ({ role, title }: FormatBenefitsProps) => {
  return (
    <>
      {contentByRole[role] && (
        <RowIconTitleText
          title={title}
          content={contentByRole[role] || []}
          sectionBgColor="hoverBlue"
        />
      )}
    </>
  );
};
