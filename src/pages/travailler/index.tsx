import React from 'react';
import { Layout } from 'src/components/Layout';
import { openModal } from 'src/components/modals/Modal';
import { ModalInterestLinkedOut } from 'src/components/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import { ContactUsSection } from 'src/components/partials/common/ContactUsSection/ContactUsSection';
import { FormatBenefits } from 'src/components/partials/common/FormatBenefits/FormatBenefits';

import { Impact } from 'src/components/partials/common/Impact';
import { PartnersWorkingWithUs } from 'src/components/partials/common/Partners/PartnersWorkingWithUs/PartnersWorkingWithUs';
import { UnderstandFormat } from 'src/components/partials/common/UnderstandFormat/UnderstandFormat';
import { WhyUseEp } from 'src/components/partials/common/WhyUserEP/WhyUseEp';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';
import { Reviews } from 'src/components/partials/utils/Reviews';
import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';

const reviews = [
  {
    author: 'Elicia',
    authorStatus: 'accompagnée par l’Accélérateur a trouvé chez Kiko',
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
    authorStatus: 'candidat EntouragePro',
    review: (
      <>
        &quot;Entourage Pro s&apos;est vraiment bougé pour moi. Par le réseau,
        j’ai pu rencontrer plein de professionnels qui m’ont motivé dans ma
        recherche. Ca change tout !&quot;
      </>
    ),
  },
  {
    author: 'Grégoire',
    authorStatus: "Recruteur de M'Bemba Dani Alu",
    review: (
      <>
        &quot;Le recrutement de M&lsquo;Bemba a ressoudé les équipes. Elles se
        sont investies dans un projet. Elles peuvent être très fières d’avoir
        fait en sorte que M&lsquo;Bemba soit épanoui et polyvalent dans
        l’atelier.&quot;
      </>
    ),
  },
];

const Travailler = () => {
  const isDesktop = useIsDesktop();

  return (
    <Layout title="Travailler - Entourage Pro">
      <ImageTitle
        img="/static/img/candidate-banner-desktop.png"
        imgMobile="/static/img/candidate-banner-mobile.png"
        title={`Entourage Pro : un tremplin vers l’emploi${
          isDesktop ? ' pour les plus exclus' : ''
        }`}
        description={
          <>
            Vous êtes dans une situation de précarité ou d’isolement ?<br />{' '}
            Rejoignez gratuitement Entourage Pro
          </>
        }
      />

      <UnderstandFormat asRole="Candidat" />
      <FormatBenefits
        role="Candidat"
        title="Les avantages de devenir candidat"
      />
      <WhyUseEp role="Candidat" />

      <ContactUsSection
        onClick={() => {
          gaEvent(GA_TAGS.PAGE_TRAVAILLER_CONTACT_OPEN);
          openModal(<ModalInterestLinkedOut />);
        }}
      />

      <Reviews reviews={reviews} title="Ils nous racontent leur expérience" />

      <Impact
        role="Candidat"
        gaEventTag={GA_TAGS.PAGE_TRAVAILLER_MESURE_IMPACT_CLICK}
      />

      <PartnersWorkingWithUs />
    </Layout>
  );
};

export default Travailler;
