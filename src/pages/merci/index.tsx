import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from 'src/components/Layout';
import { ThankYouMessagesType, Merci } from 'src/components/merci/Merci';
import { NewsletterPartial } from 'src/components/partials/common/NewsletterPartial';
import { Section } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';

const MerciPage = () => {
  const {
    query: { type },
  } = useRouter();

  const currentType = type as ThankYouMessagesType;

  return (
    <Layout title="Merci ! - Entourage Pro" noIndex>
      <Section style="custom-primary" size="large">
        <Merci currentType={currentType} />
      </Section>
      <NewsletterPartial
        style="muted"
        tag={GA_TAGS.HOME_INSCRIPTION_NEWSLETTER_CLIC}
      />
    </Layout>
  );
};

export default MerciPage;
