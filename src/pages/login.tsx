import React from 'react';
import { Layout } from 'src/components/Layout';
import { Login } from 'src/components/login/Login';
import { Section } from 'src/components/utils';

const LoginPage = () => {
  return (
    <Layout title="Connexion - Entourage Pro">
      <Section className="custom-page">
        <Login />
      </Section>
    </Layout>
  );
};

export default LoginPage;
