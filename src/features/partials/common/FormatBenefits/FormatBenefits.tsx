import React from 'react';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { RowIconTitleText } from '../../utils/RowIconTitleText';

type DisplayAs = 'Coach' | 'Candidat' | 'Referer';

interface Benefit {
  title?: string;
  paragraph: React.ReactNode;
  illu: React.ReactNode;
}

type Content = Benefit[];

const opportunitiesIlluSizes = {
  width: 100,
  height: 100,
};

const highlightParagraphStyle = { fontWeight: '600' };

const contentAs: { [K in DisplayAs]: Content } = {
  Candidat: [
    {
      title: 'Un CV humain et convaincant',
      paragraph: 'Un CV qui casse les codes en valorisant votre parcours',
      illu: <SvgIcon name="IlluCV" {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Une diffusion élargie de votre profil',
      paragraph:
        'Via notre réseau, celui des coachs et les partages du grand public',
      illu: <SvgIcon name="IlluReseauxSociaux" {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Un nouveau réseau professionnel',
      paragraph:
        "L'accès à un réseau de professionnels expérimentés et disponibles pour vous aider",
      illu: <SvgIcon name="IlluMalette" {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Des temps forts collectifs',
      paragraph: 'Des expériences humaines et fédératrices !',
      illu: <SvgIcon name="IlluPoigneeDeMain" {...opportunitiesIlluSizes} />,
    },
  ],
  Coach: [
    {
      paragraph: (
        <>
          <span style={highlightParagraphStyle}>
            Relire un CV, simuler un entretien,
          </span>{' '}
          conseiller sur les plateformes de recherche ou partager votre réseau.
        </>
      ),
      illu: <SvgIcon name="IlluDossierCandidat" {...opportunitiesIlluSizes} />,
    },
    {
      paragraph: (
        <>
          <span style={highlightParagraphStyle}>Être une écoute active,</span>{' '}
          prendre des nouvelles avant/après un entretien, ou simplement échanger
          par message pour remotiver.
        </>
      ),
      illu: <SvgIcon name="IlluPoigneeDeMain" {...opportunitiesIlluSizes} />,
    },
    {
      paragraph: (
        <>
          <span style={highlightParagraphStyle}>
            Participer à une large offre d’ateliers
          </span>{' '}
          thématiques en ligne et en présentiel pour rencontrer la communauté.
        </>
      ),
      illu: <SvgIcon name="IlluBulleWebinaire" {...opportunitiesIlluSizes} />,
    },
    {
      paragraph: (
        <>
          <span style={highlightParagraphStyle}>
            On vous donne même les clefs
          </span>{' '}
          pour proposer vos ateliers thématiques si vous le désirez.
        </>
      ),
      illu: <SvgIcon name="IlluClef" {...opportunitiesIlluSizes} />,
    },
  ],
  Referer: [
    {
      title: 'Un CV humain et convaincant',
      paragraph: 'Un CV qui casse les codes en valorisant votre parcours',
      illu: <SvgIcon name="IlluCV" {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Une diffusion élargie de votre profil',
      paragraph:
        'Via notre réseau, celui des coachs et les partages du grand public',
      illu: <SvgIcon name="IlluReseauxSociaux" {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Un nouveau réseau professionnel',
      paragraph:
        "L'accès à un réseau de professionnels expérimentés et disponibles pour vous aider",
      illu: <SvgIcon name="IlluMalette" {...opportunitiesIlluSizes} />,
    },
    {
      title: 'Des temps forts collectifs',
      paragraph: 'Des expériences humaines et fédératrices !',
      illu: <SvgIcon name="IlluPoigneeDeMain" {...opportunitiesIlluSizes} />,
    },
  ],
};

interface FormatBenefitsProps {
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
