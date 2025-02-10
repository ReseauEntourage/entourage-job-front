import React, { Ref } from 'react';
import { IlluCV, IlluReseauxSociaux } from 'assets/icons/icons';
import { StyledCTAsContainer } from '../../utils/SimpleImageText/SimpleImageText.styles';
import { SimpleImageText } from 'src/components/partials/utils/SimpleImageText';
import { Button, Text } from 'src/components/utils';

import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { StyledCriteria, StyledCriteriasContainer } from './WhyUseEp.styles';

export type Role = 'Coach' | 'Candidat' | 'Referer';

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

const contentByRole: { [K in Role]: Content } = {
  Candidat: {
    title: 'Pourquoi devenir candidat ?',
    img: '/static/img/why-become-candidate.png',
    content: (
      <>
        Le travail est un facteur clé d&apos;intégration.
        <br />
        Le problème c’est d’y accéder, surtout quand on n’a pas de réseau.
        <br />
        C’est pour cela qu’on a créé Entourage Pro : une plateforme qui vous met
        en relation avec des coachs, selon vos besoins.
        <br />
        <br />
        Vous pourrez clarifier votre projet professionnel, élaborer un CV et une
        lettre de motivation, vous préparer aux entretiens, vous soutenir dans
        vos recherches et vous aider à constituer votre réseau : grâce à nos
        coachs, vous serez prêt(e)s à intégrer le monde professionnel.
        <br />
        <br />
        Dans tous les cas, nos équipes vous accompagnent et vous orientent vers
        les coachs qui pourront le mieux vous aider !
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
    img: '/static/img/why-become-coach.png',
    content: (
      <>
        Recréer un réseau professionnel avec les personnes en précarité et
        isolées est crucial dans le combat pour l’inclusion.
        <br />
        <br />
        Nos candidats ont besoin de vous : devenez coach bénévole !
        <br />
        <br />
        Grâce à vous, nos candidat(e)s auront toutes les cartes en main pour
        appréhender le monde professionnel et y trouver leur place.
        <br />
        <br />
        Nos équipes vous orientent vers les candidats que vous pourrez le mieux
        accompagner !
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
    title: 'Pourquoi devenir candidat ?',
    img: '/static/img/why-become-candidate.png',
    criterias: [
      {
        text: 'Orienter un candidat',
        illu: <IlluCV {...criteriasIlluSizes} />,
      },
      {
        text: 'Suivre les grandes étapes',
        illu: <IlluReseauxSociaux {...criteriasIlluSizes} />,
      },
    ],
    content: (
      <>
        Inscrivez votre structure à l’espace asso de notre plateforme pour{' '}
        <span style={{ fontWeight: 'bold' }}>
          orienter les personnes que vous accompagnez
        </span>
        .<br />
        <br />
        En inscrivant un candidat via l’espace asso, il aura bien sûr accès à la
        plateforme et à toutes ses fonctionnalités. Mais vous pourrez également{' '}
        <span style={{ fontWeight: 'bold' }}>
          suivre les grandes étapes d’avancement
        </span>{' '}
        de sa recherche d’emploi et continuer à l’accompagner.
        <br />
        <br />
        Nos coachs bénévoles accompagnent les candidats vers l’emploi et suivent
        vos bénéficiaires à vos côtés.
        <br />
        <br />
        Nos équipes orientent chaque candidat avec le coach qui répondra le
        mieux à leurs besoins.
      </>
    ),
    ctas: [
      {
        text: 'Orienter un candidat',
        gaTag: GA_TAGS.PAGE_ORIENTER_INSCRIPTION_CLIC,
        href: '/inscription',
      },
    ],
  },
};

export const WhyUseEp = ({
  innerRef,
  role,
}: {
  innerRef?: Ref<HTMLDivElement>;
  role: Role;
}) => {
  return (
    <SimpleImageText
      innerRef={innerRef}
      title={contentByRole[role].title}
      img={contentByRole[role].img}
      reverse
    >
      {contentByRole[role].criterias && (
        <StyledCriteriasContainer>
          {contentByRole[role].criterias?.map((criteria) => (
            <StyledCriteria>
              {criteria.illu}
              <Text size="large" color="darkGray">
                {criteria.text}
              </Text>
            </StyledCriteria>
          ))}
        </StyledCriteriasContainer>
      )}
      <Text size="xlarge">{contentByRole[role].content}</Text>
      {contentByRole[role].ctas && (
        <StyledCTAsContainer>
          {contentByRole[role].ctas?.map((cta) => (
            <Button
              style="custom-secondary-inverted"
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
