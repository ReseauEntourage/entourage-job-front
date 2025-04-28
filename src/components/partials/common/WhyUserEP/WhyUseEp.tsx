import React, { Ref } from 'react';
import { IlluCalendrier, IlluTeteHomme } from 'assets/icons/icons';
import { StyledCTAsContainer } from '../../utils/SimpleImageText/SimpleImageText.styles';
import { SimpleImageText } from 'src/components/partials/utils/SimpleImageText';
import { Button, Text } from 'src/components/utils';

import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { StyledCriteria, StyledCriteriasContainer } from './WhyUseEp.styles';

export type DisplayAs = 'Coach' | 'Candidat' | 'Referer';

export interface UnderstandFormatProps {
  innerRef?: React.RefObject<HTMLDivElement>;
  asRole: 'Coach' | 'Candidat' | 'Referer';
}

export interface Criteria {
  illu: React.ReactNode | null;
  text: string;
}

export interface Cta {
  text: string;
  gaTag: {
    action: string;
    label?: string;
    category?: string;
    value?: string;
  };
  href: string;
}

export interface Content {
  title: string;
  img: string;
  criterias?: Criteria[];
  content: React.ReactNode;
  ctas?: Cta[];
}

const criteriasIlluSizes = {
  width: 30,
  height: 30,
};

const contentAs: { [K in DisplayAs]: Content } = {
  Candidat: {
    title: 'Pourquoi devenir candidat ?',
    img: '/static/img/front-office/why/why-become-candidate.png',
    content: (
      <>
        Le travail est un facteur clé d&apos;intégration. Le problème, c’est d’y
        accéder, surtout quand on n’a pas de réseau.
        <br />
        <br />
        C’est pour cela qu’on a créé Entourage Pro : une plateforme qui vous met
        en relation avec des coachs bénévoles, selon vos besoins.
        <br />
        <br />
        Que ce soit pour améliorer votre CV, rédiger une lettre de motivation,
        être mis(e) en relation, préparer un entretien ou vous constituer un
        réseau, notre équipe vous accompagnent et vous orientent vers les coachs
        qui pourront le mieux vous aider.
        <br />
        <br />
        Bienvenue sur le réseau professionnel, solidaire et inclusif !
      </>
    ),
    ctas: [
      {
        text: "S'inscrire",
        gaTag: GA_TAGS.PAGE_TRAVAILLER_INSCRIPTION_CLICK,
        href: '/inscription',
      },
    ],
  },
  Coach: {
    title: 'Pourquoi devenir coach ?',
    img: '/static/img/front-office/why/why-become-coach.jpg',
    content: (
      <>
        Recréer un réseau professionnel pour les personnes en situation de
        précarité et d’isolement est crucial dans le combat pour l’inclusion.
        <br />
        <br />
        Pour y arriver, nous avons besoin de vous ! En devenant coach bénévole,
        vous donnez des coups de pouce à des candidat(e)s afin qu’ils aient
        toutes les cartes en main pour appréhender le monde professionnel et y
        trouver leur place.
        <br />
        <br />
        Un format d’engagement souple, qui s’adapte à vos disponibilités et vous
        permet de vous engager à votre rythme.
        <br />
        <br />
        Bien sûr, notre équipe ne vous laissent pas seul(e) ! Nous assurons un
        suivi et vous orientons vers les candidats que vous pourrez le mieux
        accompagner.
      </>
    ),
    ctas: [
      {
        text: "S'inscrire",
        gaTag: GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC,
        href: '/inscription',
      },
    ],
  },
  Referer: {
    title: 'Pourquoi rejoindre notre espace asso ?',
    img: '/static/img/front-office/why/why-refer-candidate.jpg',
    criterias: [
      {
        text: 'Recevoir et suivre leurs actualités ',
        illu: <IlluTeteHomme {...criteriasIlluSizes} />,
      },
      {
        text: 'Suivre les grandes étapes',
        illu: (
          <IlluCalendrier {...criteriasIlluSizes} color={COLORS.orangeSocial} />
        ),
      },
    ],
    content: (
      <>
        Rejoignez l’espace asso de notre plateforme pour{' '}
        <span style={{ fontWeight: 'bold' }}>
          orienter les personnes que vous accompagnez
        </span>
        .<br />
        <br />
        Clarifier son projet professionnel, élaborer un CV et une lettre de
        motivation, se préparer aux entretiens, être soutenu dans ses
        recherches, se constituer un réseau : grâce à nos coachs bénévoles, vos
        publics seront préparés à intégrer le monde professionnel.
        <br />
        <br />
        En inscrivant un candidat via l’espace asso, vous pourrez bien sûr&nbsp;
        <span style={{ fontWeight: 'bold' }}>
          suivre les grandes étapes d’avancement
        </span>{' '}
        de sa recherche d’emploi.
      </>
    ),
    ctas: [
      {
        text: 'Orienter un(e) candidat(e)',
        gaTag: GA_TAGS.PAGE_ORIENTER_INSCRIPTION_CLIC,
        href: '/inscription',
      },
    ],
  },
};

export const WhyUseEp = ({
  innerRef,
  as,
}: {
  innerRef?: Ref<HTMLDivElement>;
  as: DisplayAs;
}) => {
  return (
    <SimpleImageText
      innerRef={innerRef}
      title={contentAs[as].title}
      img={contentAs[as].img}
      reverse
    >
      {contentAs[as].criterias && (
        <StyledCriteriasContainer>
          {contentAs[as].criterias?.map((criteria, index) => (
            <StyledCriteria key={index}>
              {criteria.illu}
              <Text size="large" color="darkGray">
                {criteria.text}
              </Text>
            </StyledCriteria>
          ))}
        </StyledCriteriasContainer>
      )}
      <Text size="large">{contentAs[as].content}</Text>
      {contentAs[as].ctas && (
        <StyledCTAsContainer>
          {contentAs[as].ctas?.map((cta, index) => (
            <Button
              variant="primary"
              rounded
              key={index}
              size="large"
              onClick={() => gaEvent(cta.gaTag)}
              href={cta.href}
            >
              {cta.text}
            </Button>
          ))}
        </StyledCTAsContainer>
      )}
    </SimpleImageText>
  );
};
