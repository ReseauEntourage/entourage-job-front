import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { openModal } from '@/src/features/modals/Modal';
import { ModalInterestLinkedOut } from '@/src/features/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import { ContactUsSection } from '@/src/features/partials/common/ContactUsSection/ContactUsSection';
import { FormatBenefits } from '@/src/features/partials/common/FormatBenefits/FormatBenefits';

import { Impact } from '@/src/features/partials/common/Impact';
import { UnderstandFormat } from '@/src/features/partials/common/UnderstandFormat/UnderstandFormat';
import { WhyUseEp } from '@/src/features/partials/common/WhyUserEP/WhyUseEp';
import { ImageTitle } from '@/src/features/partials/utils/ImageTitle';
import { LogoList } from '@/src/features/partials/utils/LogoList';
import { Reviews } from '@/src/features/partials/utils/Reviews';
import { useUtm } from '../hooks/queryParams/useUTM';
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
  useUtm();

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
