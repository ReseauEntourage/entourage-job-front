import { NextRouter, withRouter } from 'next/router';
import React from 'react';
import { Api } from 'src/api';
import { CV } from 'src/api/types';
import { Layout } from 'src/components/Layout';
import { CVPDF } from 'src/components/cv';
import { Section } from 'src/components/utils';

interface CVPDFPageProps {
  cv: CV;
  page: number;
  router: NextRouter;
}

const CVPDFPage = ({ cv, page, router }: CVPDFPageProps) => {
  if (!cv) {
    return (
      <Layout title="Page introuvable - Entourage Pro">
        <Section className="uk-text-center" size="large">
          <h3 className="uk-text-bold">Ce profil n’est pas disponible</h3>
          <p>
            Le lien que vous avez suivi est peut-être rompu, ou la page a été
            supprimée.
          </p>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${cv.user.candidat.firstName} - Entourage Pro`}
      metaTitle={`Aidez ${cv.user.candidat.firstName} en partageant son CV.`}
      metaUrl={`${process.env.SERVER_URL}${router.asPath}`}
      metaDescription={cv.story}
      metaImage={
        cv.urlImg
          ? `${process.env.AWSS3_URL}/${cv.urlImg.replace(
              '.jpg',
              '.preview.jpg'
            )}`
          : `${process.env.SERVER_URL}/static/img/entourage-pro-preview.jpg`
      }
      metaType="profile"
    >
      <div>
        <CVPDF cv={cv} page={page} />
      </div>
    </Layout>
  );
};

CVPDFPage.getInitialProps = async ({ query }) => {
  if (query.token) {
    return Api.getCVByCandidateId(query.id, {
      authorization: `Token ${query.token}`,
    })
      .then(({ data }) => {
        return { cv: data, page: query.page };
      })
      .catch((err) => {
        console.error(err);
        return { cv: null };
      });
  }
  return { cv: null };
};

export default withRouter(CVPDFPage);
