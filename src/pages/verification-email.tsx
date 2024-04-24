import React from 'react';
import { EntourageProLogoPrimary } from 'assets/icons/icons';

import { Layout } from 'src/components/Layout';
import { Section } from 'src/components/utils';
import { VerifyEmailContainer } from 'src/components/verify-email/VerifyEmailContainer';
import { StyledVerifyEmailSuccessContainer } from 'src/components/verify-email/VerifyEmailContainer/VerifyEmailContainer.styles';

const VerificationEmailPage = () => {
  return (
    <Layout title="Vérifier mon adresse e-email - Entourage Pro">
      <Section container="small" style="default" size="small">
        <EntourageProLogoPrimary width={180} height={60} />
        <VerifyEmailContainer />
      </Section>
    </Layout>
  );
};

export default VerificationEmailPage;
