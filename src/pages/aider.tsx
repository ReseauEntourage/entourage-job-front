import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Button, Text } from '@/src/components/ui';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { COLORS } from '@/src/constants/styles';
import { GA_TAGS } from '@/src/constants/tags';
import { openModal } from '@/src/features/modals/Modal';
import { Impact } from '@/src/features/partials/common/Impact';
import { NewsletterPartial } from '@/src/features/partials/common/NewsletterPartial';
import { PageHero } from '@/src/features/partials/utils/PageHero';
import {
  StyledCriteria,
  StyledCriteriaIllu,
  StyledCriteriasContainer,
} from '@/src/features/partials/utils/SimpleCardsImageCTA/SimpleCardsImageCTA.styles';
import { SimpleImageText } from '@/src/features/partials/utils/SimpleImageText';
import { StyledCTAsContainer } from '@/src/features/partials/utils/SimpleImageText/SimpleImageText.styles';
import { gaEvent } from '@/src/lib/gtag';
import { STORAGE_KEYS } from '../constants';
import { PinnedCommunicationModale } from '../features/modals/PopupModal/PinnedCommunicationModale';
import { InviteToRegisterSection } from '../features/partials/common/InviteToRegisterSection/InviteToRegisterSection';
import { ShareSection } from '../features/partials/common/ShareSection/ShareSection';
import { CoachFormatHighlights } from '../features/partials/pages/Aider/CoachFormatHighlights/CoachFormatHighlights';
import { CoachHowItWorks } from '../features/partials/pages/Aider/CoachHowItWorks/CoachHowItWorks';
import { CoachingVideo } from '../features/partials/pages/Aider/CoachingVideo/CoachingVideo';
import { useUtm } from '../hooks/queryParams/useUTM';
import { useMount } from '../hooks/utils';

const highlightCriteriaStyle = { color: COLORS.primaryBlue, fontWeight: '600' };
const highlightWhyStyle = { color: COLORS.primaryBlue, fontWeight: 'bold' };
const iconSize = { width: 28, height: 28 };
const ressourcesIconSize = { width: 30, height: 30 };

const reassuranceCriterias = [
  {
    illu: (
      <SvgIcon
        name="IlluReseau"
        width={iconSize.width}
        height={iconSize.height}
      />
    ),
    text: (
      <>
        <span style={highlightCriteriaStyle}>Coachs :</span> soyez juste vous,
        votre expérience terrain et votre réseau sont vos meilleurs outils.
      </>
    ),
  },
  {
    illu: (
      <SvgIcon
        name="IlluEntourageLogo"
        width={iconSize.width}
        height={iconSize.height}
      />
    ),
    text: (
      <>
        <span style={highlightCriteriaStyle}>Référents Entourage Pro :</span>{' '}
        disponibles toute la semaine pour échanger, vous conseiller sur des cas
        complexes et orienter les candidats vers les dispositifs de droits
        communs (suivi social, hébergement etc.).
      </>
    ),
  },
];

const ressourcesCriterias = [
  {
    illu: <SvgIcon name="IlluCarton" {...ressourcesIconSize} />,
    text: (
      <>
        <span style={highlightCriteriaStyle}>Un parcours de bienvenue</span> et
        une boîte à outils afin de démarrer au mieux l’aventure Entourage Pro.
      </>
    ),
  },
  {
    illu: <SvgIcon name="IlluConversation" {...ressourcesIconSize} />,
    text: (
      <>
        Un membre de l'équipe est{' '}
        <span style={highlightCriteriaStyle}>
          présent pour répondre à vos questions,
        </span>{' '}
        vos doutes ou vos idées d’atelier.
      </>
    ),
  },
  {
    illu: <SvgIcon name="IlluPoigneeDeMain" {...ressourcesIconSize} />,
    text: (
      <>
        <span style={highlightCriteriaStyle}>Une communauté vivante :</span> des
        échanges réguliers, en ligne ou en présentiel, et un groupe WA pour
        partager vos expériences avec les autres coachs.
      </>
    ),
  },
  {
    illu: <SvgIcon name="IlluPouce" {...ressourcesIconSize} />,
    text: (
      <>
        <span style={highlightCriteriaStyle}>On avance grâce à vous :</span> on
        améliore nos outils et nos échanges en fonction de vos retours et
        réalité de coach.
      </>
    ),
  },
];

const Aider = () => {
  useUtm();
  useMount(() => {
    const closed = localStorage.getItem(
      STORAGE_KEYS.PINNED_COMMUNICATION_CLOSED
    );
    if (process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_TITLE && !closed) {
      setTimeout(() => {
        openModal(<PinnedCommunicationModale />);
      }, 1500);
    }
  });
  return (
    <Layout title="Aider - Entourage Pro">
      <PageHero
        title={
          <>
            Devenez coach Entourage Pro
            <br />
            et donnez le coup de pouce
            <br />
            qui change tout.
          </>
        }
        description={
          <>
            Partagez votre expérience et votre réseau pour soutenir des
            candidats en situation de précarité et isolés dans leur recherche
            d’emploi. Une façon simple, humaine et flexible de vous engager en
            faveur de l’égalité des chances !
          </>
        }
        img="/static/img/coach-hero-desktop.png"
        alt="Un candidat Entourage Pro et sa coach"
        cta={{
          label: 'Je deviens coach',
          onClick: () => gaEvent(GA_TAGS.PAGE_AIDER_CTA_BANNER_CLICK),
          href: '/wizard',
        }}
      />

      <CoachFormatHighlights />

      <CoachingVideo />

      <CoachHowItWorks />

      <Impact as="Coach" gaEventTag={GA_TAGS.PAGE_AIDER_MESURE_IMPACT_CLICK} />

      <SimpleImageText
        title="Qui sont les candidats ?"
        subtitle="Le problème n'est pas le manque de compétences, mais l'isolement."
        img="/static/img/front-office/aider/who-are-candidates.png"
        imgCover={false}
        reverse
      >
        <Text size="large">
          Les candidats que vous allez rencontrer cherchent avant tout un coup
          de pouce : être écoutés, conseillés et soutenus dans leurs démarches.
          Ils participent aussi à des ateliers pour élargir leur réseau,
          reprendre confiance et avancer à leur rythme. Vous les encouragez à se
          rapprocher de l’emploi en leur offrant un cadre bienveillant et des
          outils concrets pour construire la suite.
        </Text>
        <StyledCTAsContainer>
          <Button
            variant="primary"
            rounded
            size="large"
            onClick={() => gaEvent(GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC)}
            href="/wizard"
            weight="bold"
          >
            Je deviens coach
          </Button>
        </StyledCTAsContainer>
      </SimpleImageText>

      <SimpleImageText
        title="Pas besoin d'être un expert du coaching pour soutenir les candidats."
        subtitle="Votre expérience du monde du travail suffit."
        img="/static/img/front-office/aider/coach-reassurance.png"
      >
        <StyledCriteriasContainer>
          {reassuranceCriterias.map((criteria, index) => (
            <StyledCriteria key={index}>
              <StyledCriteriaIllu>{criteria.illu}</StyledCriteriaIllu>
              <Text size="large" color="darkGray">
                {criteria.text}
              </Text>
            </StyledCriteria>
          ))}
        </StyledCriteriasContainer>
        <StyledCTAsContainer>
          <Button
            variant="primary"
            rounded
            size="large"
            onClick={() => gaEvent(GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC)}
            href="/wizard"
            weight="bold"
          >
            Je deviens coach
          </Button>
        </StyledCTAsContainer>
      </SimpleImageText>

      <SimpleImageText
        title="Vous n'êtes pas seul dans l’aventure"
        subtitle="L’équipe Entourage est à vos côtés dès le premier jour"
        img="/static/img/front-office/aider/coach-ressources.jpg"
        reverse
      >
        <StyledCriteriasContainer>
          {ressourcesCriterias.map((criteria, index) => (
            <StyledCriteria key={index}>
              <StyledCriteriaIllu>{criteria.illu}</StyledCriteriaIllu>
              <Text size="large" color="darkGray">
                {criteria.text}
              </Text>
            </StyledCriteria>
          ))}
        </StyledCriteriasContainer>
        <StyledCTAsContainer>
          <Button
            variant="primary"
            rounded
            size="large"
            onClick={() => gaEvent(GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC)}
            href="/wizard"
            weight="bold"
          >
            Je deviens coach
          </Button>
        </StyledCTAsContainer>
      </SimpleImageText>

      <SimpleImageText
        title="Pourquoi choisir Entourage Pro ?"
        img="/static/img/front-office/why/why-become-coach.png"
      >
        <Text size="large">
          Vous aussi vous pensez que le réseau ne devrait pas être un privilège
          ? Entourage Pro est{' '}
          <span style={highlightWhyStyle}>un réseau solidaire</span> qui
          rapproche des personnes. La relation est horizontale, sans pression de
          résultat. C'est la force du lien social qui remet les gens en
          mouvement. Pas les cases à cocher.
          <br />
          <br />
          C'est une façon flexible de s’engager pour l’égalité des chances et de{' '}
          <span style={highlightWhyStyle}>
            donner du sens à sa vie professionnelle
          </span>{' '}
          en étant outillé et accompagné par Entourage.
        </Text>
        <StyledCTAsContainer>
          <Button
            variant="primary"
            rounded
            size="large"
            onClick={() => gaEvent(GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC)}
            href="/wizard"
            weight="bold"
          >
            Je deviens coach
          </Button>
        </StyledCTAsContainer>
      </SimpleImageText>

      <InviteToRegisterSection
        as="Coach"
        onClick={() => gaEvent(GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC)}
      />

      <NewsletterPartial tag={GA_TAGS.PAGE_AIDER_INSCRIPTION_NEWSLETTER_CLIC} />
      <ShareSection />
    </Layout>
  );
};

export default Aider;
