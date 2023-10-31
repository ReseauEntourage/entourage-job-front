import React from 'react';
import ChevronRightIcon from 'assets/icons/chevron-right.svg';
import { Layout } from 'src/components/Layout';
import { NewsletterPartial } from 'src/components/partials';
import { CVList } from 'src/components/partials/CV/CVList';
import { Button, Grid, Section, SimpleLink } from 'src/components/utils';
import { CV_FILTERS_DATA } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';

const Custom404 = () => {
  return (
    <Layout title="Page introuvable - LinkedOut" noIndex>
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
            style="secondary"
            className="uk-margin-large-top"
          >
            Voir tous les candidats&nbsp;
            <ChevronRightIcon />
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
