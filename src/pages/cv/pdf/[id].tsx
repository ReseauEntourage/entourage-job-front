import { NextRouter, withRouter } from 'next/router';
import React from 'react';
import { Api } from 'src/api';
import { CV } from 'src/api/types';
import { Layout } from 'src/components/Layout';
import { CVPDF } from 'src/components/profile';
import { Section } from 'src/components/utils';
import { CV_STATUS } from 'src/constants';

interface CVPDFPageProps {
  cv: CV;
  page: number;
  router: NextRouter;
}

const CVPDFPage = ({ cv, page, router }: CVPDFPageProps) => {
  const candidatExists = cv && cv.user && cv.user.candidat;
  const urlImg = candidatExists
    ? `${process.env.AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${cv.user.candidat.id}.${CV_STATUS.Published.value}.jpg`
    : '';

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
      metaImage={urlImg}
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
      authorization: `Bearer ${query.token}`,
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
