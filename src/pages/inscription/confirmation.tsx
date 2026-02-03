import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { Confirmation } from '@/src/features/registration/Confirmation';
import { StyledRegistrationContainer } from '@/src/features/registration/Registration.styles';

const InscriptionConfirmation = () => {
  return (
    <Layout title="Inscription - Entourage Pro" noFooter>
      <StyledRegistrationContainer>
        <Section className="custom-page small">
          <Confirmation />
        </Section>
      </StyledRegistrationContainer>
    </Layout>
  );
};

export default InscriptionConfirmation;
