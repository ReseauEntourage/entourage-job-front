import { NextRouter, withRouter } from 'next/router';
import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { CVPDF } from '@/src/features/profile';
import { Api } from 'src/api';
import { User } from 'src/api/types';

interface CVPDFPageProps {
  user: User;
  page: number;
  router: NextRouter;
}

const CVPDFPage = ({ user, page, router }: CVPDFPageProps) => {
  const candidatExists = !!user;
  const urlImg = candidatExists
    ? `${process.env.NEXT_PUBLIC_AWSS3_URL}${process.env.NEXT_PUBLIC_AWSS3_IMAGE_DIRECTORY}${user.id}.profile.jpg`
    : '';

  if (!user) {
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
      title={`${user.firstName} - Entourage Pro`}
      metaTitle={`Aidez ${user.firstName} en partageant son CV.`}
      metaUrl={`${process.env.NEXT_PUBLIC_SERVER_URL}${router.asPath}`}
      metaDescription={user.userProfile.introduction || undefined}
      metaImage={urlImg}
      metaType="profile"
    >
      <div>
        <CVPDF user={user} page={page} />
      </div>
    </Layout>
  );
};

CVPDFPage.getInitialProps = async ({ query }) => {
  if (query.token) {
    return Api.getAuthCurrent(true, {
      authorization: `Bearer ${query.token}`,
    })
      .then(({ data }) => {
        return { user: data, page: query.page };
      })
      .catch((err) => {
        console.error(err);
        return { user: null };
      });
  }
  return { user: null };
};

export default withRouter(CVPDFPage);
