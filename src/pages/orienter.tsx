import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Button, Section, Text } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { PARTNERS } from '@/src/constants/partners';
import { GA_TAGS } from '@/src/constants/tags';
import { openModal } from '@/src/features/modals/Modal';
import { ModalInterestLinkedOut } from '@/src/features/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import { CtaSection } from '@/src/features/partials/common/CtaSection/CtaSection';
import { FormatBenefits } from '@/src/features/partials/common/FormatBenefits/FormatBenefits';

import { Impact, ImpactInsight } from '@/src/features/partials/common/Impact';
import { UnderstandFormat } from '@/src/features/partials/common/UnderstandFormat/UnderstandFormat';
import {
  StyledCriteria,
  StyledCriteriasContainer,
} from '@/src/features/partials/common/WhyUserEP/WhyUseEp.styles';
import { LogoList } from '@/src/features/partials/utils/LogoList';
import { PageHero } from '@/src/features/partials/utils/PageHero';
import { Reviews } from '@/src/features/partials/utils/Reviews';
import { StyledCriteriaIllu } from '@/src/features/partials/utils/SimpleCardsImageCTA/SimpleCardsImageCTA.styles';
import { SimpleImageText } from '@/src/features/partials/utils/SimpleImageText';
import { StyledCTAsContainer } from '@/src/features/partials/utils/SimpleImageText/SimpleImageText.styles';
import { useIsDesktop } from '@/src/hooks/utils';
import { gaEvent } from '@/src/lib/gtag';
import { useUtm } from '../hooks/queryParams/useUTM';

const criteriasIlluSizes = { width: 30, height: 30 };
const impactIlluSizes = { width: 85, height: 85 };

const impactInsights: ImpactInsight[] = [
  {
    // https://metabase-analytics.entourage.social/question/1899-stat-total-candidats-engages-kpi-site-entourage-pro
    value: '2500',
    description: 'candidats accompagnés depuis le lancement',
    illu: <SvgIcon name="IlluPoigneeDeMain" {...impactIlluSizes} />,
  },
  {
    value: '67%',
    description: 'des candidats ont retrouvé un emploi',
    illu: <SvgIcon name="IlluMalette" {...impactIlluSizes} />,
  },
  {
    value: '80%',
    description: 'des candidats ont développé de nouvelles compétences',
    illu: <SvgIcon name="IlluAmpoule" {...impactIlluSizes} />,
  },
  {
    value: '92%',
    description: 'des structures sociales sont satisfaites de leur expérience',
    illu: <SvgIcon name="IlluCoeurSurLaMain" {...impactIlluSizes} />,
  },
];

const whyCriterias = [
  {
    text: 'Recevoir et suivre leurs actualités ',
    illu: <SvgIcon name="IlluTeteHomme" {...criteriasIlluSizes} />,
  },
  {
    text: 'Suivre les grandes étapes',
    illu: <SvgIcon name="IlluCalendrier" {...criteriasIlluSizes} />,
  },
];

const reviews = [
  {
    author: 'Elicia',
    authorStatus: 'accompagnée par l’Accélérateur, a trouvé chez Kiko',
    review: (
      <>
        &quot;Maintenant j’arrive plus à parler aux gens, à aller vers les
        autres. C’est grâce à Entourage Pro. Je faisais la paresseuse avant et
        là, ça m’a donné envie de me donner à fond.&quot;
      </>
    ),
  },
  {
    author: 'Mike',
    authorStatus: 'candidat Entourage Pro',
    review: (
      <>
        &quot;Entourage Pro s’est vraiment bougé pour moi. Par le réseau, j’ai
        pu rencontrer plein de professionnels qui m’ont motivé dans ma
        recherche. Ça change tout !&quot;
      </>
    ),
  },
  {
    author: 'Grégoire',
    company: 'Dani Alu',
    authorStatus: "Recruteur de M'Bemba",
    review: (
      <>
        &quot;Le recrutement de M&apos;Bemba a resserré les équipes. Elles se
        sont investies dans un projet. Elles peuvent être très fières d’avoir
        fait en sorte que M&apos;Bemba soit épanoui et polyvalent dans
        l’atelier.&quot;
      </>
    ),
  },
];

const Orienter = () => {
  const isDesktop = useIsDesktop();
  useUtm();

  return (
    <Layout title="Orienter - Entourage Pro">
      <PageHero
        img="/static/img/orienter-banner-desktop.jpg"
        title={
          <>
            Travaillons ensemble pour
            <br />
            l&apos;accès à l’emploi
          </>
        }
        description={
          <>
            Vous accompagnez des personnes en situation d&apos;exclusion ? Avec
            Entourage Pro, accélérez leur retour à l&apos;emploi !
          </>
        }
      />

      <SimpleImageText
        title="Pourquoi rejoindre notre espace asso ?"
        img="/static/img/front-office/why/why-refer-candidate.jpg"
        imgCover={false}
      >
        <StyledCriteriasContainer>
          {whyCriterias.map((criteria, index) => (
            <StyledCriteria key={index}>
              <StyledCriteriaIllu>{criteria.illu}</StyledCriteriaIllu>
              <Text size="large" color="darkGray">
                {criteria.text}
              </Text>
            </StyledCriteria>
          ))}
        </StyledCriteriasContainer>
        <Text size="large">
          Rejoignez l’espace asso de notre plateforme pour{' '}
          <span style={{ fontWeight: 'bold' }}>
            orienter les personnes que vous accompagnez
          </span>
          .
          <br />
          <br />
          Clarifier son projet professionnel, élaborer un CV et une lettre de
          motivation, se préparer aux entretiens, être soutenu dans ses
          recherches, se constituer un réseau : grâce à nos coachs bénévoles,
          vos publics seront préparés à intégrer le monde professionnel.
          <br />
          <br />
          En inscrivant un candidat via l’espace asso, vous pourrez bien
          sûr&nbsp;
          <span style={{ fontWeight: 'bold' }}>
            suivre les grandes étapes d’avancement
          </span>{' '}
          de sa recherche d’emploi.
        </Text>
        <StyledCTAsContainer>
          <Button
            variant="primary"
            rounded
            size="large"
            onClick={() => gaEvent(GA_TAGS.PAGE_ORIENTER_INSCRIPTION_CLIC)}
            href="/wizard"
            weight="bold"
          >
            Orienter un(e) candidat(e)
          </Button>
        </StyledCTAsContainer>
      </SimpleImageText>

      <FormatBenefits
        as="Referer"
        title="Les avantages pour les personnes que vous accompagnez"
      />

      <UnderstandFormat as="Referer" />

      <CtaSection
        title="Une question, une précision ?"
        description="Notre équipe est à votre disposition !"
        ctaLabel="Nous contacter"
        dataTestId="button-contact"
        onClick={() => {
          gaEvent(GA_TAGS.PAGE_ORIENTER_CONTACT_CLIC);
          openModal(<ModalInterestLinkedOut />);
        }}
      />

      <Reviews
        reviews={reviews}
        title="Ils utilisent l’espace asso, ils en parlent"
      />

      <Impact title="Quelques chiffres" insights={impactInsights} />

      {/* already done => only remove uikit */}
      {isDesktop && (
        <Section style="default">
          <H2
            title={
              <>
                <span className="orange">Ils travaillent</span> avec Entourage
                Pro
              </>
            }
            center
          />
          <LogoList logos={PARTNERS.ORIENTATION} carousel />
        </Section>
      )}
    </Layout>
  );
};

export default Orienter;
