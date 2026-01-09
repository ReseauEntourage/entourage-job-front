import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { Registration } from '@/src/features/registration/registration';
import { useUtm } from '@/src/hooks/queryParams/useUTM';

const Inscription = () => {
  useUtm();

  return (
    <Layout title="Inscription - Entourage Pro" noFooter>
      <Section className="custom-page">
        <Registration />
      </Section>
    </Layout>
  );
};

export default Inscription;
