import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';

import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { VerifyEmailContainer } from 'src/components/verify-email/VerifyEmailContainer';

const VerificationEmailPage = () => {
  return (
    <Layout title="Vérifier mon adresse e-email - Entourage Pro">
      <Section container="small" style="default" size="small">
        <SvgIcon name="EntourageProLogoPrimary" width={180} height={60} />
        <VerifyEmailContainer />
      </Section>
    </Layout>
  );
};

export default VerificationEmailPage;
