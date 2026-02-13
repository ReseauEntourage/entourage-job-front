import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { Button, Text } from '@/src/components/ui';
import { SimpleImageText } from '../../utils/SimpleImageText';
import { StyledCTAsContainer } from '../../utils/SimpleImageText/SimpleImageText.styles';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledCriteria,
  StyledCriteriasContainer,
} from './UnderstandFormat.styles';

export type DisplayAs = 'Coach' | 'Candidat' | 'Referer';

export interface UnderstandFormatProps {
  innerRef?: React.RefObject<HTMLDivElement>;
  as: 'Coach' | 'Candidat' | 'Referer';
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

const contentAs: { [K in DisplayAs]: Content } = {
  Candidat: {
    title: 'Devenez candidat et boostez votre recherche d’emploi !',
    img: '/static/img/front-office/understand-format/understand-format-candidate.jpg',
    criterias: [
      {
        illu: <SvgIcon name="IlluCalendrier" width={30} height={30} />,
        text: 'Ponctuel',
      },
      {
        illu: <SvgIcon name="OrienterSablier" width={30} height={30} />,
        text: 'Selon vos besoins',
      },
      {
        illu: (
          <SvgIcon name="IlluQuestionReponseOrange" width={30} height={30} />
        ),
        text: 'En physique ou en visio',
      },
      {
        illu: <SvgIcon name="OrienterCarteSolidaire" width={30} height={30} />,
        text: 'Partout en France',
      },
    ],
    content: (
      <>
        En devenant candidat Entourage Pro, vous rejoignez une communauté
        solidaire et bienveillante.
        <br />
        <br />
        Vous bénéficiez gratuitement de coups de pouce de coachs bénévoles
        expérimentés : clarifier votre projet professionnel, élaborer un CV et
        une lettre de motivation, vous préparer aux entretiens, vous soutenir
        dans vos recherches, vous aider à constituer votre réseau, etc.
        <br />
        <br />
        Grâce à nos coachs, vous serez prêt(e) à intégrer le monde professionnel
        !
      </>
    ),
    cta: [
      {
        text: "S'inscrire",
        gaTag: GA_TAGS.PAGE_TRAVAILLER_INSCRIPTION_CLICK,
        href: '/inscription',
      },
    ],
  },
  Coach: {
    title: 'Rejoignez notre communauté de coachs bénévoles !',
    img: '/static/img/front-office/understand-format/understand-format-coach.png',
    criterias: [
      {
        illu: <SvgIcon name="IlluCalendrier" width={30} height={30} />,
        text: 'Selon vos disponibilités',
      },
      {
        illu: <SvgIcon name="IlluMalette" width={30} height={30} />,
        text: 'En fonction de votre expertise',
      },
      {
        illu: <SvgIcon name="IlluBulleQuestionCheck" width={30} height={30} />,
        text: 'En physique ou en visio',
      },
      {
        illu: <SvgIcon name="OrienterCarteSolidaire" width={30} height={30} />,
        text: 'Partout en France',
      },
    ],
    content: (
      <>
        Avec Entourage Pro, il n’a jamais été aussi facile d’œuvrer pour
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
    title: 'Inscrire un(e) candidat(e), c’est booster sa recherche d’emploi !',
    img: '/static/img/front-office/understand-format/understand-format-referer.jpg',
    criterias: [
      {
        illu: <SvgIcon name="IlluCalendrier" width={30} height={30} />,
        text: 'Ponctuel',
      },
      {
        illu: <SvgIcon name="OrienterSablier" width={30} height={30} />,
        text: 'Selon les besoins',
      },
      {
        illu: <SvgIcon name="IlluBulleQuestionCheck" width={30} height={30} />,
        text: 'En physique ou en visio',
      },
      {
        illu: <SvgIcon name="OrienterCarteSolidaire" width={30} height={30} />,
        text: 'Partout en France',
      },
    ],
    content: (
      <>
        En devenant candidat(e) Entourage Pro, la personne que vous inscrivez
        rejoint une communauté solidaire et bienveillante.
        <br />
        <br />
        Nos candidat(e)s bnéficient gratuitement de coups de pouce de coachs
        bénévoles expérimentés : clarifier son projet professionnel, élaborer
        son CV et sa lettre de motivation, se préparer aux entretiens, être
        soutenu dans ses recherches, se constituer son réseau, etc.
        <br />
        <br />
        Grâce à nos coachs, vos publics seront prêts à intégrer le monde
        professionnel !
      </>
    ),
    cta: [
      {
        text: 'Orienter un(e) candidat(e)',
        gaTag: GA_TAGS.PAGE_ORIENTER_INSCRIPTION_CLIC,
        href: '/inscription',
      },
    ],
  },
};

export const UnderstandFormat = ({ innerRef, as }: UnderstandFormatProps) => {
  return (
    <SimpleImageText
      innerRef={innerRef}
      title={contentAs[as].title}
      img={contentAs[as].img}
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

      <StyledCTAsContainer>
        {contentAs[as].cta.map((cta, index) => (
          <Button
            variant="primary"
            rounded
            key={index}
            size="medium"
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
