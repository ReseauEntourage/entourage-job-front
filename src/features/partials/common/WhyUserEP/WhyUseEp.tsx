import React, { Ref } from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { Button, Text } from '@/src/components/ui';
import { StyledCriteriaIllu } from '@/src/features/partials/utils/SimpleCardsImageCTA/SimpleCardsImageCTA.styles';
import { SimpleImageText } from '@/src/features/partials/utils/SimpleImageText';
import { StyledCTAsContainer } from '@/src/features/partials/utils/SimpleImageText/SimpleImageText.styles';

import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { StyledCriteria, StyledCriteriasContainer } from './WhyUseEp.styles';

type DisplayAs = 'Coach' | 'Candidat' | 'Referer';

interface Criteria {
  illu: React.ReactNode | null;
  text: string;
}

interface Cta {
  text: string;
  gaTag: {
    action: string;
    label?: string;
    category?: string;
    value?: string;
  };
  href: string;
}

interface Content {
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
    img: '/static/img/front-office/why/why-become-coach.png',
    content: (
      <>
        Vous aussi vous pensez que le réseau ne devrait pas être un privilège ?
        Entourage Pro est un réseau solidaire qui rapproche des personnes. La
        relation est horizontale, sans pression de résultat. C'est la force du
        lien social qui remet les gens en mouvement. Pas les cases à cocher.
        <br />
        <br />
        C'est une façon flexible de s’engager pour l’égalité des chances et de
        donner du sens à sa vie professionnelle en étant outillé et accompagné
        par Entourage.
      </>
    ),
    ctas: [
      {
        text: 'Je deviens coach',
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
        illu: <SvgIcon name="IlluTeteHomme" {...criteriasIlluSizes} />,
      },
      {
        text: 'Suivre les grandes étapes',
        illu: <SvgIcon name="IlluCalendrier" {...criteriasIlluSizes} />,
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
      reverse={as === 'Candidat'}
      imgCover={false}
    >
      {contentAs[as].criterias && (
        <StyledCriteriasContainer>
          {contentAs[as].criterias?.map((criteria, index) => (
            <StyledCriteria key={index}>
              <StyledCriteriaIllu>{criteria.illu}</StyledCriteriaIllu>
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
              size="medium"
              onClick={() => gaEvent(cta.gaTag)}
              href={cta.href}
              weight="bold"
            >
              {cta.text}
            </Button>
          ))}
        </StyledCTAsContainer>
      )}
    </SimpleImageText>
  );
};
