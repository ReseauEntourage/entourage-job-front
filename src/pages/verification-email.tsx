import React from 'react';

import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
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
