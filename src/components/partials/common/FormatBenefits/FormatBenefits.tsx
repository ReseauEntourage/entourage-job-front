import React from 'react';
import {
  IlluCV,
  IlluMalette,
  IlluPoigneeDeMain,
  IlluReseauxSociaux,
} from 'assets/icons/icons';
import { RowIconTitleText } from '../../utils/RowIconTitleText';

export type DisplayAs = 'Coach' | 'Candidat' | 'Referer';

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

const contentAs: { [K in DisplayAs]: Content } = {
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
        "L'accès à un réseau de professionnels expérimentés et disponibles pour vous aider",
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
      title: 'Donner du sens à sa vie professionnelle',
      paragraph: 'Grâce à une expérience humaine fédératrice et positive',
      illu: <IlluMalette {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Découvrir le coaching et l’associatif',
      paragraph: 'En faisant vos premiers pas à votre rythme.',
      illu: <IlluPoigneeDeMain {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Ajouter une ligne à  votre CV',
      paragraph:
        'Qui a dit qu’on ne pouvait pas valoriser le fait d’aider les autres ? Pas nous.',
      illu: <IlluCV {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Rejoindre une communauté d’experts',
      paragraph: '... et élargir son propre réseau pro !',
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
        "L'accès à un réseau de professionnels expérimentés et disponibles pour vous aider",
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
  as: DisplayAs;
  title: string;
}

export const FormatBenefits = ({ as, title }: FormatBenefitsProps) => {
  return (
    <>
      {contentAs[as] && (
        <RowIconTitleText
          title={title}
          content={contentAs[as] || []}
          sectionBgColor="hoverBlue"
        />
      )}
    </>
  );
};
