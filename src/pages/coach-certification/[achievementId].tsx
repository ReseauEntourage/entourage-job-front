import React from 'react';
import { Api } from '@/src/api';
import { PublicAchievement } from '@/src/api/types';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { CoachCertificate } from '@/src/features/coach-certification/CoachCertificate';

interface CoachCertificationPageProps {
  achievement: PublicAchievement | null;
}

const CoachCertificationPage = ({
  achievement,
}: CoachCertificationPageProps) => {
  if (!achievement) {
    return (
      <Layout title="Certificat introuvable - Entourage Pro" noIndex>
        <Section className="uk-text-center" size="large">
          <h3 className="uk-text-bold">
            Ce certificat n&apos;est pas disponible
          </h3>
          <p>
            Le lien que vous avez suivi est peut-être rompu, ou le certificat
            n&apos;existe pas.
          </p>
        </Section>
      </Layout>
    );
  }

  const title = `Certificat ${achievement.firstName} ${achievement.lastName} - Entourage Pro`;

  return (
    <Layout
      title={title}
      metaTitle={title}
      metaDescription="Membre engagé en faveur de l'égalité des chances"
    >
      <CoachCertificate achievement={achievement} />
    </Layout>
  );
};

CoachCertificationPage.getInitialProps = async ({ query }) => {
  return Api.getPublicAchievementById(query.achievementId as string)
    .then(({ data }) => ({ achievement: data }))
    .catch((err) => {
      console.error(err);
      return { achievement: null };
    });
};

export default CoachCertificationPage;
