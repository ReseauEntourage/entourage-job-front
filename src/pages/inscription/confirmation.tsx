import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { Confirmation } from '@/src/features/registration/Confirmation';

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
