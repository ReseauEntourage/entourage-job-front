import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { StyledRegistrationContainer } from '@/src/features/registration/Registration.styles';
import { WizardInscription } from '@/src/features/wizard/WizardInscription';
import { useUtm } from '@/src/hooks/queryParams/useUTM';

const Inscription = () => {
  useUtm();

  return (
    <Layout title="Inscription - Entourage Pro" noFooter>
      <StyledRegistrationContainer>
        <WizardInscription />
      </StyledRegistrationContainer>
    </Layout>
  );
};

export default Inscription;
