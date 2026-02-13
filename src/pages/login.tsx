import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { Login } from '@/src/features/login/Login';
import { StyledLoginContainer } from '../features/login/Login.styles';
import { useUtm } from '../hooks/queryParams/useUTM';

const LoginPage = () => {
  useUtm();
  return (
    <Layout title="Connexion - Entourage Pro">
      <StyledLoginContainer>
        <Section className="custom-page small">
          <Login />
        </Section>
      </StyledLoginContainer>
    </Layout>
  );
};

export default LoginPage;
