import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { Login } from '@/src/features/login/Login';
import { useUtm } from '../hooks/queryParams/useUTM';

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
