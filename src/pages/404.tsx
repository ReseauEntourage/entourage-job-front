import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { GA_TAGS } from '@/src/constants/tags';
import { NewsletterPartial } from '@/src/features/partials/common/NewsletterPartial';
import { StyledBoldH3 } from '@/src/features/partials/common/PageText';

const Custom404 = () => {
  return (
    <Layout title="Page introuvable - Entourage Pro" noIndex>
      <Section textCenter style="default" size="large">
        <StyledBoldH3>Erreur</StyledBoldH3>
        <p>La page que vous avez demandé est malheureusement introuvable</p>
      </Section>
      <NewsletterPartial
        style="default"
        tag={GA_TAGS.PAGE_CV_INSCRIPTION_NEWSLETTER_CLIC}
      />
    </Layout>
  );
};

export default Custom404;
