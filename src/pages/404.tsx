import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { NewsletterPartial } from '@/src/features/partials/common/NewsletterPartial';
import { GA_TAGS } from 'src/constants/tags';

const Custom404 = () => {
  return (
    <Layout title="Page introuvable - Entourage Pro" noIndex>
      <Section className="uk-text-center" style="default" size="large">
        <h3 className="uk-text-bold">Erreur</h3>
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
