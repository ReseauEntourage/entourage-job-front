import { NextRouter, withRouter } from 'next/router';
import React from 'react';
import { Api } from '@/src/api';
import { PublicCV } from '@/src/api/types';
import { Layout } from '@/src/components/layouts/Layout';
import { Grid, Section } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { CV_FILTERS_DATA } from '@/src/constants';
import { GA_TAGS } from '@/src/constants/tags';
import { CVList } from '@/src/features/partials/CV/CVList';
import { PageCVContent } from '@/src/features/partials/CV/PageCVContent';
import { StyledCVPage } from '@/src/features/partials/CV/PageCVContent/PageCVContent.styles';
import { NewsletterPartial } from '@/src/features/partials/common/NewsletterPartial';
import {
  StyledBold,
  StyledBoldH2,
  StyledBoldH3,
  StyledBoldLink,
  StyledBoldPrimary,
  StyledLargeTopButton,
} from '@/src/features/partials/common/PageText';

export interface CVPageProps {
  publicCV: PublicCV;
  router: NextRouter;
  exists?: boolean;
}

const CVPage = ({ publicCV, exists = false, router }: CVPageProps) => {
  const hostname = process.env.NEXT_PUBLIC_SERVER_URL;
  const link = `${hostname}${router.asPath}`;
  const sharedDescription = publicCV
    ? `${
        publicCV.userProfile.description
          ? publicCV.userProfile.description + ' '
          : ''
      }Aidez ${publicCV.firstName} à retrouver un emploi en partageant son CV !`
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
          <Section textCenter style="default" size="large">
            <StyledBoldH3>
              C&apos;est une{' '}
              <StyledBoldPrimary>bonne nouvelle&nbsp;!</StyledBoldPrimary>{' '}
            </StyledBoldH3>
            <p>
              Ce candidat est actuellement{' '}
              <StyledBold>en emploi ou a été réorienté</StyledBold>.
            </p>
          </Section>
          <Section textCenter style="muted">
            <StyledBoldH2>
              Soutenez un autre candidat&nbsp;:
              <StyledBoldLink href={{ pathname: '/candidats' }}>
                {' '}
                partagez son CV&nbsp;!
              </StyledBoldLink>
            </StyledBoldH2>
            <CVList
              hideSearchBar
              nb={3}
              filters={{
                [CV_FILTERS_DATA[0].key]: CV_FILTERS_DATA[0].constants,
              }}
            />
            <Grid middle column gap="collapse">
              <StyledLargeTopButton
                href={{ pathname: '/candidats' }}
                variant="primary"
              >
                Voir tous les candidats
                <LucidIcon name="ChevronRight" />
              </StyledLargeTopButton>
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
        <Section textCenter size="large">
          <StyledBoldH3>Ce profil n’est pas disponible</StyledBoldH3>
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
