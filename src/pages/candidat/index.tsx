import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { H2, H4 } from '@/src/components/ui/Headings';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { COLORS } from '@/src/constants/styles';
import { GA_TAGS } from '@/src/constants/tags';
import { openModal } from '@/src/features/modals/Modal';
import { ModalInterestLinkedOut } from '@/src/features/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import { CtaSection } from '@/src/features/partials/common/CtaSection/CtaSection';
import { Impact, ImpactInsight } from '@/src/features/partials/common/Impact';
import {
  ConnectedStep,
  ConnectedStepsGrid,
} from '@/src/features/partials/utils/ConnectedStepsGrid';
import { PageHero } from '@/src/features/partials/utils/PageHero';
import { Reviews } from '@/src/features/partials/utils/Reviews';
import { SimpleVideoSection } from '@/src/features/partials/utils/SimpleVideoSection';
import { useUtm } from '@/src/hooks/queryParams/useUTM';
import { gaEvent } from '@/src/lib/gtag';
import { caveatFont } from '@/src/styles/fonts';
import { Button, Text } from '../../components/ui';
import { NewsletterPartial } from '../../features/partials/common/NewsletterPartial';
import {
  StyledCandidatsGrid,
  StyledCTAContainer,
  StyledCandidateFormatHighlights,
} from '../../features/partials/pages/Candidats/CandidateFormatHighlights/CandidateFormatHighlights.styles';
import { ImageGradientCard } from '../../features/partials/utils/ImageGradientCard';
import {
  StyledCriteria,
  StyledCriteriaIllu,
  StyledCriteriasContainer,
} from '../../features/partials/utils/SimpleCardsImageCTA/SimpleCardsImageCTA.styles';
import { SimpleImageText } from '../../features/partials/utils/SimpleImageText';
import { StyledCTAsContainer } from '../../features/partials/utils/SimpleImageText/SimpleImageText.styles';

const iconSize = {
  width: 28,
  height: 28,
};

const highlightCriteriaStyle = {
  fontWeight: 'bold',
  color: COLORS.primaryBlue,
};

const impactIlluSizes = { width: 85, height: 85 };

const impactInsights: ImpactInsight[] = [
  {
    value: '3 000',
    description: 'coachs engagés sur la plateforme',
    illu: <SvgIcon name="IlluAmpoule" {...impactIlluSizes} />,
  },
  {
    value: '81%',
    description: 'des candidats ont rencontrés de nouvelles personnes',
    illu: <SvgIcon name="IlluPoigneeDeMain" {...impactIlluSizes} />,
  },
  {
    value: '89%',
    description: 'des candidats disent se sentir mieux',
    illu: <SvgIcon name="IlluHeartGradient" {...impactIlluSizes} />,
  },
  {
    value: '83%',
    description: 'ont développé de nouvelles compétences',
    illu: <SvgIcon name="IlluMalette" {...impactIlluSizes} />,
  },
];

interface Highlight {
  title: React.ReactNode;
  description: React.ReactNode;
  img: string;
  alt: string;
}

const formatHighlights: Highlight[] = [
  {
    title: 'Rejoindre un réseau professionnel solidaire',
    description:
      'Pour faire des rencontres pro et profiter du soutien de coachs bénévoles.',
    img: '/static/img/front-office/candidat/format-highlight-1.jpg',
    alt: 'Un groupe de coachs et candidats réunis autour d’une table',
  },
  {
    title: 'Participer à des évènements et ateliers collectifs réguliers',
    description:
      'Pour rencontrer des coachs et des candidats, et monter en compétence sur votre recherche d’emploi.',
    img: '/static/img/front-office/candidat/format-highlight-2.jpg',
    alt: 'Une coach échangeant avec un candidat, carnet de notes en main',
  },
  {
    title: 'Être écouté et retrouver confiance en soi',
    description:
      'Grâce au soutien de la communauté Entourage Pro et à la disponibilité de nos équipes.',
    img: '/static/img/front-office/candidat/format-highlight-3.jpg',
    alt: 'Un échange entre un candidat et une coach, entourés d’autres participants',
  },
  {
    title: 'S’engager selon ses contraintes et son rythme',
    description:
      'Sans pression de durée ni de fréquence, partout en France, en ligne ou en présentiel.',
    img: '/static/img/front-office/candidat/format-highlight-4.jpg',
    alt: 'Une coach et un candidat discutant face à face',
  },
];

const howItWorksSteps: ConnectedStep[] = [
  {
    title: 'Vous complétez votre profil',
    description: 'Votre parcours et ce que vous recherchez',
    illu: <SvgIcon name="IlluDossierCandidat" width={75} height={75} />,
  },
  {
    title: 'Vous êtes mis en relation avec des coachs adaptés à votre profil',
    description:
      "Vous les contactez et pouvez en contacter d'autres dans tout le réseau mis à votre disposition",
    illu: <SvgIcon name="IlluReseau" width={75} height={75} />,
  },
  {
    title: 'Vous profitez de leurs coups de pouce',
    description:
      "Clarifier votre projet, relire votre CV, vos lettres de motivations, faire des simulations d'entretiens, etc.",
    illu: <SvgIcon name="IlluPouceCoeur" width={75} height={75} />,
  },
  {
    title: 'Vous avancez à votre rythme',
    description:
      "C'est vous qui menez votre recherche, les coachs sont là pour vous soutenir.",
    illu: <SvgIcon name="IlluPoigneeDeMain" width={75} height={75} />,
  },
];

const reviews = [
  {
    author: 'Fatma',
    authorStatus: 'candidate Entourage Pro',
    review: (
      <>
        &quot;Je remercie les coachs Entourage Pro d&apos;avoir pris contact
        avec moi. Cela m&apos;a permis de me sentir entourée dans ma recherche.
        Vraiment il y a eu deux coachs importants : grâce à eux, je me suis
        remobilisée.&quot;
      </>
    ),
  },
  {
    author: 'Mike',
    authorStatus: 'candidat Entourage Pro',
    review: (
      <>
        &quot;Entourage Pro s&apos;est vraiment bougé pour moi. Par le réseau,
        j’ai pu rencontrer plein de professionnels qui m’ont motivé dans ma
        recherche. Ça change tout !&quot;
      </>
    ),
  },
  {
    author: 'Milan',
    authorStatus: 'candidat Entourage Pro',
    review: (
      <>
        &quot;J&apos;ai beaucoup aimé l&apos;expérience Entourage Pro, le site
        est bien fait, c&apos;est très clair et très pro. J&apos;ai pu avoir 2
        rendez vous avec des coachs qui donnent de bon conseils.&quot;
      </>
    ),
  },
];

const criterias = [
  {
    illu: (
      <SvgIcon
        name="IlluCarteDeDon"
        width={iconSize.width}
        height={iconSize.height}
      />
    ),
    text: (
      <>
        <span style={highlightCriteriaStyle}>À des personnes motivées</span> à
        retrouver un travail mais qui sont isolées dans leur recherche d’emploi
        et vivent une forme de précarité matérielle.
      </>
    ),
  },
  {
    illu: (
      <SvgIcon
        name="IlluConversation"
        width={iconSize.width}
        height={iconSize.height}
      />
    ),
    text: (
      <>
        <span style={highlightCriteriaStyle}>
          Pas besoin de s’inscrire pour une durée définie.
        </span>{' '}
        Vous profitez du réseau Entourage Pro le temps qu’il faut, en fonction
        de vos besoins.
      </>
    ),
  },
  {
    illu: (
      <SvgIcon
        name="IlluPoigneeDeMain"
        width={iconSize.width}
        height={iconSize.height}
      />
    ),
    text: (
      <>
        <span style={highlightCriteriaStyle}>
          L'objectif n'est pas de promettre un emploi,
        </span>{' '}
        mais de se sentir soutenu et de développer son réseau pour multiplier
        les opportunités d’emploi.
      </>
    ),
  },
  {
    illu: (
      <SvgIcon
        name="IlluPouce"
        width={iconSize.width}
        height={iconSize.height}
      />
    ),
    text: (
      <>
        <span style={highlightCriteriaStyle}>
          Une plateforme complémentaire
        </span>{' '}
        aux institutions et aux associations du secteur, qui peut être un
        véritable coup de pouce supplémentaire dans votre parcours.
      </>
    ),
  },
];

const Candidat = () => {
  useUtm();

  return (
    <Layout title="Travailler - Entourage Pro">
      <PageHero
        img="/static/img/candidat-hero-desktop.png"
        title={`Entourage Pro : le réseau professionnel de celles et ceux qui n’en ont pas`}
        description={
          <>
            Vous êtes motivé à trouver un emploi mais vous êtes isolé et vivez
            une forme de précarité matérielle ?<br />
            Rejoignez gratuitement Entourage Pro !
          </>
        }
        cta={{
          label: 'Je deviens candidat',
          onClick: () => gaEvent(GA_TAGS.PAGE_TRAVAILLER_INSCRIPTION_CLICK),
          href: '/wizard',
        }}
      />

      <Section>
        <StyledCandidateFormatHighlights>
          <H2
            title="C’est quoi être candidat Entourage Pro ?"
            weight="bold"
            color={COLORS.primaryBlue}
            center
            noMarginBottom
          />
          <H4
            title="Être soutenu dans son retour à l’emploi via un réseau professionnel solidaire."
            weight="normal"
            center
          />

          <StyledCandidatsGrid>
            {formatHighlights.map((highlight, index) => (
              <ImageGradientCard
                key={index}
                title={highlight.title}
                description={highlight.description}
                img={highlight.img}
                alt={highlight.alt}
              />
            ))}
          </StyledCandidatsGrid>

          <StyledCTAContainer>
            <Button
              variant="primary"
              rounded
              size="large"
              weight="bold"
              href="/wizard"
              onClick={() => gaEvent(GA_TAGS.PAGE_TRAVAILLER_INSCRIPTION_CLICK)}
            >
              Je deviens candidat
            </Button>
          </StyledCTAContainer>
        </StyledCandidateFormatHighlights>
      </Section>

      <SimpleVideoSection
        videoId="puDIh46PQUI"
        videoTitle="Témoignages Entourage Pro"
      />

      <ConnectedStepsGrid title="Comment ça marche ?" steps={howItWorksSteps} />

      <Impact
        title="Notre impact"
        insights={impactInsights}
        gaEventTag={GA_TAGS.PAGE_TRAVAILLER_MESURE_IMPACT_CLICK}
      />

      <SimpleImageText
        title="Qui sont les coachs ?"
        subtitle="Et pourquoi le réseau professionnel, c'est si important ?"
        img="/static/img/front-office/candidat/who-are-coaches.png"
        reverse
        imgCover={false}
      >
        <Text>
          Trouver un travail est un facteur clé d'intégration. Le problème,
          c’est d’y accéder, surtout quand on n’a pas le réseau, les codes, la
          confiance ou le carnet d’adresse. Entourage Pro, c’est une conviction
          :{' '}
          <span style={{ color: COLORS.primaryBlue, fontWeight: 'bold' }}>
            le réseau professionnel ne devrait pas être un privilège, mais un
            bien commun, accessible à tous.
          </span>
        </Text>
        <br />
        <Text>
          Les coachs que vous allez rencontrer sont en emploi dans différents
          secteurs d’activités et dans toute la France. Ils sont prêts à vous
          soutenir dans votre recherche d’emploi en vous donnant des coups de
          pouce.. Ils sont là pour vous écouter, vous conseiller et vous
          soutenir dans vos démarches grâce à leur expérience. Ils animent aussi
          les événements et ateliers du parcours Entourage Pro pour favoriser
          vos opportunités professionnelles.
        </Text>
        <br />
        <Text size="xxlarge" weight="bold" color="primaryBlue">
          <span className={caveatFont.className}>
            Contactez-les via la plateforme et partagez vos besoins.
          </span>
        </Text>
        <StyledCTAsContainer>
          <Button
            variant="primary"
            rounded
            size="large"
            onClick={() => gaEvent(GA_TAGS.PAGE_TRAVAILLER_INSCRIPTION_CLICK)}
            href="/wizard"
            weight="bold"
          >
            Je deviens candidat
          </Button>
        </StyledCTAsContainer>
      </SimpleImageText>

      <Reviews reviews={reviews} title="Ils nous racontent leur expérience" />

      <SimpleImageText
        title="À qui s’adresse le programme Entourage Pro ?"
        img="/static/img/front-office/candidat/for-who.png"
        reverse
        imgCover={false}
      >
        <StyledCriteriasContainer>
          {criterias?.map((criteria, index) => (
            <StyledCriteria key={index}>
              <StyledCriteriaIllu>{criteria.illu}</StyledCriteriaIllu>
              <Text size="large" color="darkGray">
                {criteria.text}
              </Text>
            </StyledCriteria>
          ))}
        </StyledCriteriasContainer>
      </SimpleImageText>

      <CtaSection
        title="Rejoignez une large communauté de candidats qui se battent pour que l’isolement et la précarité ne soit plus un frein à leur recherche d’emploi."
        description=""
        ctaLabel="Je deviens candidat"
        href="/wizard"
        dataTestId="button-cta-candidat-community"
        onClick={() => gaEvent(GA_TAGS.PAGE_TRAVAILLER_INSCRIPTION_CLICK)}
      />
      <NewsletterPartial tag={GA_TAGS.PAGE_TRAVAILLER_NEWSLETTER_CLIC} />
    </Layout>
  );
};

export default Candidat;
