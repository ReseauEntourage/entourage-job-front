import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { Button, Text } from '@/src/components/ui';
import { COLORS } from '@/src/constants/styles';
import { SimpleImageText } from '../../utils/SimpleImageText';
import { StyledCTAsContainer } from '../../utils/SimpleImageText/SimpleImageText.styles';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledCriteria,
  StyledCriteriasContainer,
} from './UnderstandFormat.styles';

type DisplayAs = 'Coach' | 'Candidat' | 'Referer';

interface UnderstandFormatProps {
  as: 'Coach' | 'Candidat' | 'Referer';
}

interface Criteria {
  illu: React.ReactNode | null;
  text: React.ReactNode;
}

interface Content {
  title: string;
  subtitle?: string;
  img: string;
  imgCover?: boolean;
  criterias?: Criteria[];
  content: React.ReactNode;
  cta: {
    text: React.ReactNode;
    gaTag: {
      action: string;
      label?: string;
      category?: string;
      value?: string;
    };
    href: string;
  }[];
}

const higlightCriteriaStyle = { color: COLORS.primaryBlue, fontWeight: '600' };

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
    title: 'C’est quoi être coach Entourage Pro ?',
    subtitle: 'Une rencontre humaine avant tout.',
    img: '/static/img/front-office/understand-format/understand-format-coach.png',
    imgCover: false,
    criterias: [
      {
        illu: (
          <SvgIcon
            name="IlluConversation"
            width={30}
            height={30}
            color="white"
          />
        ),
        text: (
          <>
            <span style={higlightCriteriaStyle}>Vivre des rencontres</span> que
            vous n'auriez peut-être jamais faites autrement.
          </>
        ),
      },
      {
        illu: <SvgIcon name="IlluPouce" width={30} height={30} />,
        text: (
          <>
            <span style={higlightCriteriaStyle}>Donner un coup de pouce</span>{' '}
            concret à des personnes isolées de la recherche d’emploi : un avis
            sur un CV, un contact, une simulation d’entretien, un échange qui
            remet quelqu'un en confiance.
          </>
        ),
      },
      {
        illu: <SvgIcon name="IlluPoigneeDeMain" width={30} height={30} />,
        text: (
          <>
            <span style={higlightCriteriaStyle}>Avancer d'égal à égal :</span>{' '}
            on ne fait pas à la place de, on fait avec.
          </>
        ),
      },
      {
        illu: <SvgIcon name="IlluReseau" width={30} height={30} />,
        text: (
          <>
            <span style={higlightCriteriaStyle}>Rejoindre une communauté</span>{' '}
            de coachs bénévoles : qui partagent la même conviction
          </>
        ),
      },
      {
        illu: (
          <SvgIcon
            name="IlluCalendrier"
            width={30}
            height={30}
            color={COLORS.primaryBlue}
          />
        ),
        text: (
          <>
            <span style={higlightCriteriaStyle}>
              S'engager selon ses disponibilités
            </span>
            , sans pression de durée ni de fréquence.
          </>
        ),
      },
    ],
    content: (
      <>
        Rejoignez une large communauté de coachs bénévoles qui agissent pour que
        l’isolement et la précarité ne soient pas un frein à la recherche
        d’emploi
      </>
    ),

    cta: [
      {
        text: 'Je deviens coach',
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

export const UnderstandFormat = ({ as }: UnderstandFormatProps) => {
  return (
    <SimpleImageText
      title={contentAs[as].title}
      subtitle={contentAs[as].subtitle}
      img={contentAs[as].img}
      imgCover={contentAs[as].imgCover}
    >
      {contentAs[as].criterias && (
        <StyledCriteriasContainer>
          {contentAs[as].criterias?.map((criteria, index) => (
            <StyledCriteria.Container key={index}>
              <StyledCriteria.IlluContainer>
                {criteria.illu}
              </StyledCriteria.IlluContainer>
              <Text size="large" color="darkGray">
                {criteria.text}
              </Text>
            </StyledCriteria.Container>
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
            weight="bold"
          >
            {cta.text}
          </Button>
        ))}
      </StyledCTAsContainer>
    </SimpleImageText>
  );
};
