import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { COLORS } from '@/src/constants/styles';
import { GA_TAGS } from '@/src/constants/tags';
import { openModal } from '@/src/features/modals/Modal';
import { ModalInterestLinkedOut } from '@/src/features/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import { ContactUsSection } from '@/src/features/partials/common/ContactUsSection/ContactUsSection';
import { Impact } from '@/src/features/partials/common/Impact';
import { PartnersWorkingWithUs } from '@/src/features/partials/common/Partners/PartnersWorkingWithUs/PartnersWorkingWithUs';
import { UnderstandFormat } from '@/src/features/partials/common/UnderstandFormat/UnderstandFormat';
import { WhyUseEp } from '@/src/features/partials/common/WhyUserEP/WhyUseEp';
import { CandidatHowItWorks } from '@/src/features/partials/pages/Candidat/CandidatHowItWorks/CandidatHowItWorks';
import { CandidateFormatHighlights } from '@/src/features/partials/pages/Candidats/CandidateFormatHighlights/CandidateFormatHighlights';
import { PageHero } from '@/src/features/partials/utils/PageHero';
import { Reviews } from '@/src/features/partials/utils/Reviews';
import { SimpleVideoSection } from '@/src/features/partials/utils/SimpleVideoSection';
import { useUtm } from '@/src/hooks/queryParams/useUTM';
import { gaEvent } from '@/src/lib/gtag';
import { caveatFont } from '@/src/styles/fonts';
import { Button, Text } from '../../components/ui';
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

const reviews = [
  {
    author: 'Elicia',
    authorStatus: 'accompagnée par l’Accélérateur, a trouvé chez Kiko',
    review: (
      <>
        &quot;Maintenant j’arrive à plus parler aux gens, à aller vers les
        autres, c’est grâce à Entourage Pro. Je faisais la paresseuse avant, et
        là, ça m’a donné envie de me donner à fond.&quot;
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
    author: 'Grégoire',
    authorStatus: "Recruteur de M'Bemba Dani Alu",
    review: (
      <>
        &quot;Le recrutement de M&lsquo;Bemba a resserré les équipes. Elles se
        sont investies dans un projet. Elles peuvent être très fières d’avoir
        fait en sorte que M&lsquo;Bemba soit épanoui et polyvalent dans
        l’atelier.&quot;
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

      <CandidateFormatHighlights />

      <SimpleVideoSection
        videoId="puDIh46PQUI"
        videoTitle="Témoignages Entourage Pro"
      />

      <CandidatHowItWorks />

      <Impact
        as="Candidat"
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

      <UnderstandFormat as="Candidat" />

      <WhyUseEp as="Candidat" />

      <ContactUsSection
        onClick={() => {
          gaEvent(GA_TAGS.PAGE_TRAVAILLER_CONTACT_OPEN);
          openModal(<ModalInterestLinkedOut />);
        }}
      />

      <PartnersWorkingWithUs />
    </Layout>
  );
};
export default Candidat;
