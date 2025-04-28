import React from 'react';
import { useUtm } from '../hooks/queryParams/useUTM';
import { Layout } from 'src/components/Layout';
import { Login } from 'src/components/login/Login';
import { Section } from 'src/components/utils';

const LoginPage = () => {
  useUtm();
  return (
    <Layout title="Connexion - Entourage Pro">
      <Section className="custom-page">
        <Login />
      </Section>
    </Layout>
  );
};

export default LoginPage;
