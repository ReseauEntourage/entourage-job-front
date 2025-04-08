import React from 'react';
import { Layout } from 'src/components/Layout';
import { CVList } from 'src/components/partials/CV/CVList';
import { NewsletterPartial } from 'src/components/partials/common/NewsletterPartial';
import { Button, Grid, Section, SimpleLink } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { CV_FILTERS_DATA } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';

const Custom404 = () => {
  return (
    <Layout title="Page introuvable - Entourage Pro" noIndex>
      <Section className="uk-text-center" style="default" size="large">
        <h3 className="uk-text-bold">Erreur</h3>
        <p>La page que vous avez demandé est malheureusement introuvable</p>
      </Section>
      <Section className="uk-text-center" style="muted">
        <h2 className="uk-margin-medium-bottom uk-text-bold">
          Soutenez un candidat&nbsp;:
          <SimpleLink
            href={{ pathname: '/candidats', query: { employed: false } }}
            className="uk-text-bold"
          >
            {' '}
            partagez son CV&nbsp;!
          </SimpleLink>
        </h2>
        <CVList
          hideSearchBar
          nb={3}
          filters={{
            [CV_FILTERS_DATA[0].key]: CV_FILTERS_DATA[0].constants,
          }}
        />
        <Grid middle column gap="collapse">
          <Button
            href={{ pathname: '/candidats', query: { employed: false } }}
            variant="primary"
            className="uk-margin-large-top"
          >
            Voir tous les candidats
            <LucidIcon name="ChevronRight" />
          </Button>
        </Grid>
      </Section>
      <NewsletterPartial
        style="default"
        tag={GA_TAGS.PAGE_CV_INSCRIPTION_NEWSLETTER_CLIC}
      />
    </Layout>
  );
};

export default Custom404;
