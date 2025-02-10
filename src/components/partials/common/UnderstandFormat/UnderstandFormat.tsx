import React from 'react';
import {
  IlluBulleQuestionCheck,
  IlluCalendrier,
  IlluQuestionReponseOrange,
  OrienterCarteSolidaire,
  OrienterSablier,
} from 'assets/icons/icons';
import { Button, Text } from '../../../utils';
import { SimpleImageText } from '../../utils/SimpleImageText';
import { StyledCTAsContainer } from '../../utils/SimpleImageText/SimpleImageText.styles';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledCriteria,
  StyledCriteriasContainer,
} from './UnderstandFormat.styles';

export type Role = 'Coach' | 'Candidat' | 'Referer';

export interface UnderstandFormatProps {
  innerRef?: React.RefObject<HTMLDivElement>;
  asRole: 'Coach' | 'Candidat' | 'Referer';
}

export interface Criteria {
  illu: React.ReactNode | null;
  text: string;
}

export interface Content {
  title: string;
  img: string;
  criterias?: Criteria[];
  content: React.ReactNode;
  cta: {
    text: string;
    gaTag: {
      action: string;
      label?: string;
      category?: string;
      value?: string;
    };
    href: string;
  }[];
}

const contentByRole: { [K in Role]: Content } = {
  Candidat: {
    title: 'Boostez votre recherche d’emploi',
    img: '/static/img/front-office/understand-format/understand-format-candidate.jpg',
    criterias: [
      {
        illu: (
          <IlluCalendrier width={30} height={30} color={COLORS.orangeSocial} />
        ),
        text: 'Ponctuel',
      },
      {
        illu: (
          <OrienterSablier width={30} height={30} color={COLORS.orangeSocial} />
        ),
        text: 'Selon vos besoins',
      },
      {
        illu: <IlluQuestionReponseOrange width={30} height={30} />,
        text: 'En physique ou en visio',
      },
      {
        illu: <OrienterCarteSolidaire width={30} height={30} />,
        text: 'Partout en France',
      },
    ],
    content:
      "Je souhaite bénéficier de coups de pouce ponctuels de la communauté pour m'aider dans ma recherche d'emploi, que cela concerne la rédaction demon CV, une relecture de ma lettre de motivation, ou une mise en relation.",
    cta: [
      {
        text: "S'inscrire",
        gaTag: GA_TAGS.PAGE_TRAVAILLER_INSCRIPTION_CLICK,
        href: '/inscription',
      },
    ],
  },
  Coach: {
    title: 'Vous engager et soutenir nos candidat(e)s ',
    img: '/static/img/front-office/understand-format/understand-format-coach.png',
    criterias: [
      {
        illu: (
          <IlluCalendrier width={30} height={30} color={COLORS.orangeSocial} />
        ),
        text: 'Selon vos disponibilités',
      },
      {
        illu: (
          <OrienterSablier width={30} height={30} color={COLORS.orangeSocial} />
        ),
        text: 'En fonction de votre expertise',
      },
      {
        illu: <IlluBulleQuestionCheck width={30} height={30} />,
        text: 'En physique ou en visio',
      },
      {
        illu: <OrienterCarteSolidaire width={30} height={30} />,
        text: 'Partout en France',
      },
    ],
    content: (
      <>
        Avec Entourage Pro, il n’a jamais été aussi facile d’oeuvrer pour
        l’inclusion.
        <br />
        Selon vos compétences et votre disponibilité, vous donnez des coups de
        pouce à nos candidat(e)s : relayer une recherche d’emploi sur LinkedIn,
        aider à la rédaction d’un CV ou d’une lettre de motivation, préparer un
        entretien, partager un conseil ou un contact, etc.
      </>
    ),

    cta: [
      {
        text: "S'inscrire",
        gaTag: GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC,
        href: '/inscription',
      },
    ],
  },
  Referer: {
    title: 'Booster la recherche d’emploi de vos bénéficiaires',
    img: '/static/img/front-office/understand-format/understand-format-referer.jpg',
    criterias: [
      {
        illu: (
          <IlluCalendrier width={30} height={30} color={COLORS.orangeSocial} />
        ),
        text: 'Ponctuel',
      },
      {
        illu: (
          <OrienterSablier width={30} height={30} color={COLORS.orangeSocial} />
        ),
        text: 'Selon ses besoins',
      },
      {
        illu: <IlluBulleQuestionCheck width={30} height={30} />,
        text: 'En physique ou en visio',
      },
      {
        illu: <OrienterCarteSolidaire width={30} height={30} />,
        text: 'Partout en France',
      },
    ],
    content:
      "La personne que je souhaite inscrire a besoin de bénéficier de coups de pouce ponctuels de la communauté pour l'aider dans sa recherche d'emploi, que cela concerne la rédaction de mon CV, une relecture de ma lettre de motivation, ou une mise en relation.",
    cta: [
      {
        text: 'Orienter un(e) candidat(e)',
        gaTag: GA_TAGS.PAGE_ORIENTER_INSCRIPTION_CLIC,
        href: '/inscription',
      },
    ],
  },
};

export const UnderstandFormat = ({
  innerRef,
  asRole,
}: UnderstandFormatProps) => {
  return (
    <SimpleImageText
      innerRef={innerRef}
      title={contentByRole[asRole].title}
      img={contentByRole[asRole].img}
    >
      {contentByRole[asRole].criterias && (
        <StyledCriteriasContainer>
          {contentByRole[asRole].criterias?.map((criteria) => (
            <StyledCriteria>
              {criteria.illu}
              <Text size="large" color="darkGray">
                {criteria.text}
              </Text>
            </StyledCriteria>
          ))}
        </StyledCriteriasContainer>
      )}
      <Text size="xlarge">{contentByRole[asRole].content}</Text>

      <StyledCTAsContainer>
        {contentByRole[asRole].cta.map((cta) => (
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
    </SimpleImageText>
  );
};
