import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { StyledRegistrationContainer } from '@/src/features/registration/Registration.styles';
import { Registration } from '@/src/features/registration/registration';
import { useUtm } from '@/src/hooks/queryParams/useUTM';

const Inscription = () => {
  useUtm();

  return (
    <Layout title="Inscription - Entourage Pro" noFooter>
      <StyledRegistrationContainer>
        <Section className="custom-page small">
          <Registration />
        </Section>
      </StyledRegistrationContainer>
    </Layout>
  );
};

export default Inscription;
