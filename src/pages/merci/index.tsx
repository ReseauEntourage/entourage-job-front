import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { ThankYouMessagesType, Merci } from '@/src/features/merci/Merci';
import { NewsletterPartial } from '@/src/features/partials/common/NewsletterPartial';
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
