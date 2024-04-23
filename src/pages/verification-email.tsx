import React from 'react';

import { Layout } from 'src/components/Layout';
import { Section, Typography } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import { VerifyEmailContainer } from 'src/components/verify-email/VerifyEmailContainer';

const VerificationEmailPage = () => {
  return (
    <Layout title="Vérifier mon adresse e-email - Entourage Pro">
      <Section container="small" style="default">
        <H1
          title={
            <>
              Verification de mon{' '}
              <Typography color="blue">adresse e-mail</Typography>
            </>
          }
        />
        <VerifyEmailContainer />
      </Section>
    </Layout>
  );
};

export default VerificationEmailPage;
