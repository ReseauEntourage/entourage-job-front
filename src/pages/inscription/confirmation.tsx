import React from 'react';
import { Layout } from 'src/components/Layout';
import { Confirmation } from 'src/components/registration/Confirmation';
import { Section } from 'src/components/utils';

const InscriptionConfirmation = () => {
  return (
    <Layout title="Inscription - Entourage Pro" noFooter>
      <Section className="custom-page">
        <Confirmation />
      </Section>
    </Layout>
  );
};

export default InscriptionConfirmation;
