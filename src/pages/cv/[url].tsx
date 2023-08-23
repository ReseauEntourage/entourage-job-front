import { NextRouter, withRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Api } from 'src/api';
import { CV } from 'src/api/types';
import { Layout } from 'src/components/Layout';
import { CVList } from 'src/components/cv';
import { DiscoverPartial, NewsletterPartial } from 'src/components/partials';
import { PageCVContent } from 'src/components/partials/CV/PageCvContent';
import { Grid, Section, SimpleLink, Icon, Button } from 'src/components/utils';
import { CV_FILTERS_DATA } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { useUpdateSharesCount } from 'src/hooks';

interface CVPageProps {
  cv: CV;
  router: NextRouter;
  exists?: boolean;
}
const CVPage = ({ cv, exists = false, router }: CVPageProps) => {
  const updateSharesCount = useUpdateSharesCount();

  const hostname = process.env.SERVER_URL;
  const link = `${hostname}${router.asPath}`;
  const candidateExists = cv && cv.user && cv.user.candidat;
  const sharedDescription = candidateExists
    ? `La précarité n'exclut pas les compétences\xa0! Avec LinkedOut, aidons ${cv.user.candidat.firstName} à retrouver un emploi en lui proposant un job ou en diffusant son CV\xa0!`
    : '';
  const title = candidateExists
    ? `LinkedOut\xa0: Aidez ${cv.user.candidat.firstName} à retrouver un emploi`
    : '';

  useEffect(() => {
    if (cv) {
      updateSharesCount(cv.UserId, 'other');
    }
  }, [cv, updateSharesCount]);

  if (!cv) {
    if (exists) {
      return (
        <Layout title="Bonne nouvelle ! - LinkedOut" noIndex>
          <Section className="uk-text-center" style="default" size="large">
            <h3 className="uk-text-bold">
              C&apos;est une{' '}
              <span className="uk-text-bold uk-text-primary">
                bonne nouvelle&nbsp;!
              </span>{' '}
            </h3>
            <p>
              Ce candidat est actuellement{' '}
              <span className="uk-text-bold">en emploi ou a été réorienté</span>
              .
            </p>
          </Section>
          <Section className="uk-text-center" style="muted">
            <h2 className="uk-margin-medium-bottom uk-text-bold">
              Soutenez un autre candidat&nbsp;:
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
                Voir tous les candidats <Icon name="chevron-right" />
              </Button>
            </Grid>
          </Section>
          <NewsletterPartial
            style="default"
            tag={GA_TAGS.PAGE_CV_INSCRIPTION_NEWSLETTER_CLIC}
          />
        </Layout>
      );
    }
    return (
      <Layout title="Page introuvable - LinkedOut" noIndex>
        <Section className="uk-text-center" size="large">
          <h3 className="uk-text-bold">Ce profil n’est pas disponible</h3>
          <p>
            Le lien que vous avez suivi est peut-être rompu, ou la page a été
            supprimée.
          </p>
        </Section>
        <NewsletterPartial
          padding={false}
          tag={GA_TAGS.PAGE_CV_INSCRIPTION_NEWSLETTER_CLIC}
        />
        <DiscoverPartial />
      </Layout>
    );
  }

  return (
    <Layout
      title={title}
      metaTitle={title}
      metaUrl={link}
      metaDescription={sharedDescription}
      metaImage={
        cv.urlImg
          ? `${process.env.AWSS3_CDN_URL}${cv.urlImg.replace(
              '.jpg',
              '.preview.jpg'
            )}`
          : `${process.env.SERVER_URL}/static/img/linkedout-preview-new.jpg`
      }
      metaType="profile"
    >
      <div className="uk-background-muted">
        <PageCVContent cv={cv} />
      </div>
    </Layout>
  );
};

CVPage.getInitialProps = async ({ query }) => {
  return Api.getCVByUrl(query.url)
    .then(({ data: { cv, exists } }) => {
      return {
        cv,
        exists,
      };
    })
    .catch((err) => {
      console.error(err);
      return { cv: null, exists: false };
    });
};

export default withRouter<CVPageProps>(CVPage);
