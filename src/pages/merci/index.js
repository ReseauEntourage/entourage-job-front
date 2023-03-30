import React from 'react';
import Layout from 'src/components/Layout';
import { Grid, Section } from 'src/components/utils';
import { Button } from 'src/components/utils/Button';
import { GA_TAGS } from 'src/constants/tags';
import { NewsletterPartial } from 'src/components/partials';
import { useRouter } from 'next/router';

const thankYouMessages = {
  coach: (
    <>
      <h2 className="uk-text-bold">
        Merci beaucoup pour votre inscription&nbsp;!
      </h2>
      <h3>
        Vous recevrez par mail toutes les informations nécessaires pour
        participer au Webinaire.
      </h3>
    </>
  ),
  candidate: (
    <>
      <h2 className="uk-text-bold">
        Merci beaucoup pour votre inscription&nbsp;!
      </h2>
      <h3>Nous vous donnerons des nouvelles rapidement.</h3>
    </>
  ),
};

const Merci = () => {
  const {
    query: { type },
  } = useRouter();

  return (
    <Layout title="Merci ! - LinkedOut" noIndex>
      <Section className="uk-text-center" style="default" size="large">
        <>
          {thankYouMessages[type] || (
            <h2 className="uk-text-bold">
              Merci beaucoup d&apos;avoir répondu au formulaire&nbsp;!
            </h2>
          )}
        </>
        <h3>À bientôt&nbsp;!</h3>
        <h4 className="uk-text-italic">L&apos;équipe LinkedOut</h4>
        <Grid middle column gap="collapse">
          <Button
            href={{ pathname: '/' }}
            style="secondary"
            className="uk-margin-large-top"
          >
            Revenir à la page d&apos;accueil
          </Button>
        </Grid>
      </Section>
      <NewsletterPartial
        style="muted"
        tag={GA_TAGS.HOME_INSCRIPTION_NEWSLETTER_CLIC}
      />
    </Layout>
  );
};

export default Merci;
