import { NextRouter, withRouter } from 'next/router';
import React, { useEffect } from 'react';
import { CV } from 'src/api/types';
import { Layout } from 'src/components/Layout';
import { CVDiscover } from 'src/components/partials/CV/CVDiscover';
import { CVList } from 'src/components/partials/CV/CVList';
import { PageCVContent } from 'src/components/partials/CV/PageCVContent';
import { StyledCVPage } from 'src/components/partials/CV/PageCVContent/PageCVContent.styles';
import { NewsletterPartial } from 'src/components/partials/common/NewsletterPartial';
import { updateSharesCount } from 'src/components/profile/updateSharesCount';
import { Grid, Section, SimpleLink, Button } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { CV_FILTERS_DATA, CV_STATUS } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';

export interface CVPageProps {
  cv: CV;
  router: NextRouter;
  exists?: boolean;
}

const CVPage = ({ cv, exists = false, router }: CVPageProps) => {
  const hostname = process.env.SERVER_URL;
  const link = `${hostname}${router.asPath}`;
  const candidateExists = cv && cv.user && cv.user.candidat;
  const sharedDescription = candidateExists
    ? `La précarité n'exclut pas les compétences\xa0! Avec Entourage Pro, aidons ${cv.user.candidat.firstName} à retrouver un emploi en lui proposant un job ou en diffusant son CV\xa0!`
    : '';
  const title = candidateExists
    ? `Entourage Pro\xa0: Aidez ${cv.user.candidat.firstName} à retrouver un emploi`
    : '';
  const urlImg = candidateExists
    ? `${process.env.AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${cv.user.candidat.id}.${CV_STATUS.Published.value}.jpg`
    : '';

  useEffect(() => {
    if (cv) {
      updateSharesCount(cv.UserId, 'other');
    }
  }, [cv]);

  if (!cv) {
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
        <CVDiscover />
      </Layout>
    );
  }

  return (
    <Layout
      title={title}
      metaTitle={title}
      metaUrl={link}
      metaDescription={sharedDescription}
      metaImage={urlImg}
      metaType="profile"
    >
      <StyledCVPage>
        <PageCVContent cv={cv} />
      </StyledCVPage>
    </Layout>
  );
};

export default withRouter<CVPageProps>(CVPage);
