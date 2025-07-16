import React from 'react';
import { Registration } from '@/src/components/registration/registration';
import { useUtm } from '@/src/hooks/queryParams/useUTM';
import { Layout } from 'src/components/Layout';
import { Section } from 'src/components/utils';

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
