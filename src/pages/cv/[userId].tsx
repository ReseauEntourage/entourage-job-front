import { NextRouter, withRouter } from 'next/router';
import React from 'react';
import { Api } from '@/src/api';
import { PublicCV } from '@/src/api/types';
import { Layout } from '@/src/components/layouts/Layout';
import { Grid, Section, SimpleLink, Button } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { CVList } from '@/src/features/partials/CV/CVList';
import { PageCVContent } from '@/src/features/partials/CV/PageCVContent';
import { StyledCVPage } from '@/src/features/partials/CV/PageCVContent/PageCVContent.styles';
import { NewsletterPartial } from '@/src/features/partials/common/NewsletterPartial';
import { CV_FILTERS_DATA } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';

export interface CVPageProps {
  publicCV: PublicCV;
  router: NextRouter;
  exists?: boolean;
}

const CVPage = ({ publicCV, exists = false, router }: CVPageProps) => {
  const hostname = process.env.NEXT_PUBLIC_SERVER_URL;
  const link = `${hostname}${router.asPath}`;
  const sharedDescription = publicCV
    ? `La précarité n'exclut pas les compétences\xa0! Avec Entourage Pro, aidons ${publicCV.firstName} à retrouver un emploi en lui proposant un job ou en diffusant son CV\xa0!`
    : '';
  const title = publicCV
    ? `Entourage Pro\xa0: Aidez ${publicCV.firstName} à retrouver un emploi`
    : '';
  const imgSrc = publicCV?.userProfile.hasPicture
    ? `${process.env.NEXT_PUBLIC_AWSS3_URL}${process.env.NEXT_PUBLIC_AWSS3_IMAGE_DIRECTORY}${publicCV.id}.profile.jpg`
    : undefined;

  if (!publicCV) {
    if (exists) {
      return (
        <Layout title="Bonne nouvelle ! - Entourage Pro" noIndex>
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
                href={{ pathname: '/candidats' }}
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
                href={{ pathname: '/candidats' }}
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
    }
    return (
      <Layout title="Page introuvable - Entourage Pro" noIndex>
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
      </Layout>
    );
  }

  return (
    <Layout
      title={title}
      metaTitle={title}
      metaUrl={link}
      metaDescription={sharedDescription}
      metaImage={imgSrc}
      metaType="profile"
    >
      <StyledCVPage>
        <PageCVContent publicCV={publicCV} />
      </StyledCVPage>
    </Layout>
  );
};

CVPage.getInitialProps = async ({ query }) => {
  return Api.getPublicCVByUserId(query.userId)
    .then(({ data }) => {
      return {
        publicCV: data,
        exists: true,
      };
    })
    .catch((err) => {
      console.error(err);
      return { publicCV: null, exists: false };
    });
};

export default withRouter<CVPageProps>(CVPage);
