import React from 'react';
import { Layout } from 'src/components/Layout';
import { openModal } from 'src/components/modals/Modal';
import { ModalInterestLinkedOut } from 'src/components/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import { ContactUsSection } from 'src/components/partials/common/ContactUsSection/ContactUsSection';
import { FormatBenefits } from 'src/components/partials/common/FormatBenefits/FormatBenefits';
import { Impact } from 'src/components/partials/common/Impact';
import { NewsletterPartial } from 'src/components/partials/common/NewsletterPartial';
import { PartnersWorkingWithUs } from 'src/components/partials/common/Partners/PartnersWorkingWithUs/PartnersWorkingWithUs';
import { SharePartial } from 'src/components/partials/common/SharePartial';
import { UnderstandFormat } from 'src/components/partials/common/UnderstandFormat/UnderstandFormat';
import { WhyUseEp } from 'src/components/partials/common/WhyUserEP/WhyUseEp';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';
import { Reviews } from 'src/components/partials/utils/Reviews';
import { Section } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

const reviewContent = [
  {
    review: (
      <>
        &quot;Je suis ravie d&apos;avoir rencontré Lucie, on a une relation
        vraiment humaine. C&apos;était quelqu&apos;un de timide et il fallait la
        mettre en confiance. La première rencontre, ça fait un peu peur mais
        j’ai découvert une personne très douce, et c&apos;est devenu fluide. Je
        suis sûr que nous resterons en lien&quot;
      </>
    ),
    author: 'Jean-Baptiste',
    industry: 'coach de Lucie',
    image: '',
  },
  {
    review: (
      <>
        &quot;Maria est la troisième candidate que j’accompagne. Je sais que si
        j’ai une question, j’aurai toujours une personne d’Entourage pro pour
        répondre à mes questions. L&apos;association est très mature : le
        contact est facile et informel mais en même temps très professionnel.
        C&apos;est vraiment positif !&quot;
      </>
    ),
    author: 'Remy',
    industry: 'coach de Maria',
    image: '',
  },
  {
    review: (
      <>
        &quot;C’est hyper enrichissant humainement. Chaque minute que tu passes
        est utile au candidat, à sa progression, à la manière dont il voit les
        choses.&quot;
      </>
    ),
    author: 'Marie',
    industry: 'coach de Léo',
    image: '',
  },
];

const Aider = () => {
  return (
    <Layout title="Aider - Entourage Pro">
      <ImageTitle
        title="Avec Entourage Pro, s’engager se fait en toute flexibilité"
        description="Devenir coach bénévole ? Une façon de concilier agenda chargé et envie de s’engager."
        img="/static/img/aider-banner-desktop.jpg"
        imgMobile="/static/img/aider-banner-mobile.jpg"
        alt="Un candidat Entourage Pro et sa coach"
      />

      <UnderstandFormat as="Coach" />

      <FormatBenefits as="Coach" title="Les avantages de devenir coach" />

      <WhyUseEp as="Coach" />

      <ContactUsSection
        onClick={() => {
          gaEvent(GA_TAGS.PAGE_AIDER_CONTACT_OPEN);
          openModal(<ModalInterestLinkedOut />);
        }}
      />

      <Reviews title="Nos coachs témoignent" reviews={reviewContent} />
      <Impact as="Coach" />
      <PartnersWorkingWithUs tag={GA_TAGS.HOME_PARTNERS_CLICK} />
      <NewsletterPartial tag={GA_TAGS.PAGE_AIDER_INSCRIPTION_NEWSLETTER_CLIC} />
      <Section style="muted">
        <SharePartial />
      </Section>
    </Layout>
  );
};

export default Aider;
