import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { GA_TAGS } from '@/src/constants/tags';
import { openModal } from '@/src/features/modals/Modal';
import { ModalInterestLinkedOut } from '@/src/features/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import { ContactUsSection } from '@/src/features/partials/common/ContactUsSection/ContactUsSection';
import { FormatBenefits } from '@/src/features/partials/common/FormatBenefits/FormatBenefits';

import { Impact } from '@/src/features/partials/common/Impact';
import { PartnersWorkingWithUs } from '@/src/features/partials/common/Partners/PartnersWorkingWithUs/PartnersWorkingWithUs';
import { UnderstandFormat } from '@/src/features/partials/common/UnderstandFormat/UnderstandFormat';
import { WhyUseEp } from '@/src/features/partials/common/WhyUserEP/WhyUseEp';
import { CandidateFormatHighlights } from '@/src/features/partials/pages/Candidats/CandidateFormatHighlights/CandidateFormatHighlights';
import { PageHero } from '@/src/features/partials/utils/PageHero';
import { Reviews } from '@/src/features/partials/utils/Reviews';
import { useUtm } from '@/src/hooks/queryParams/useUTM';
import { gaEvent } from '@/src/lib/gtag';

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

const Travailler = () => {
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

      <UnderstandFormat as="Candidat" />
      <FormatBenefits as="Candidat" title="Les avantages de devenir candidat" />
      <WhyUseEp as="Candidat" />

      <ContactUsSection
        onClick={() => {
          gaEvent(GA_TAGS.PAGE_TRAVAILLER_CONTACT_OPEN);
          openModal(<ModalInterestLinkedOut />);
        }}
      />

      <Reviews reviews={reviews} title="Ils nous racontent leur expérience" />

      <Impact
        as="Candidat"
        gaEventTag={GA_TAGS.PAGE_TRAVAILLER_MESURE_IMPACT_CLICK}
      />

      <PartnersWorkingWithUs />
    </Layout>
  );
};

export default Travailler;
