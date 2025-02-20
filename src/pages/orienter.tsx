import React from 'react';
import { Layout } from 'src/components/Layout';
import { openModal } from 'src/components/modals/Modal';
import { ModalInterestLinkedOut } from 'src/components/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import { ContactUsSection } from 'src/components/partials/common/ContactUsSection/ContactUsSection';
import { FormatBenefits } from 'src/components/partials/common/FormatBenefits/FormatBenefits';

import { Impact } from 'src/components/partials/common/Impact';
import { UnderstandFormat } from 'src/components/partials/common/UnderstandFormat/UnderstandFormat';
import { WhyUseEp } from 'src/components/partials/common/WhyUserEP/WhyUseEp';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';
import { LogoList } from 'src/components/partials/utils/LogoList';
import { Reviews } from 'src/components/partials/utils/Reviews';
import { Section } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { PARTNERS } from 'src/constants/partners';
import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';

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

  return (
    <Layout title="Orienter - Entourage Pro">
      <ImageTitle
        img="/static/img/orienter-banner-desktop.jpg"
        imgMobile="/static/img/orienter-banner-mobile.jpg"
        title={
          <>
            Travaillons ensemble pour
            <br />
            l&apos;accès à l’emploi
          </>
        }
        textColor="white"
        description={
          <>
            Vous accompagnez des personnes en situation d&apos;exclusion ? Avec
            Entourage Pro, accélérez leur retour à l&apos;emploi !
          </>
        }
      />

      <WhyUseEp as="Referer" />

      <FormatBenefits
        as="Referer"
        title="Les avantages pour les personnes que vous accompagnez"
      />

      <UnderstandFormat as="Referer" />

      <ContactUsSection
        onClick={() => {
          gaEvent(GA_TAGS.PAGE_ORIENTER_CONTACT_CLIC);
          openModal(<ModalInterestLinkedOut />);
        }}
      />

      <Reviews
        reviews={reviews}
        title="Ils utilisent l’espace asso, ils en parlent"
      />

      <Impact as="Referer" />

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
