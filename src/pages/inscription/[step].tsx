import React from 'react';
import { Layout } from 'src/components/Layout';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Registration } from 'src/components/registration/Registration';
import { useRedirectToFirstStep } from 'src/components/registration/useRedirectToFirstStep';
import { Section } from 'src/components/utils';
import { useStep } from 'src/hooks/queryParams/useStep';

const Inscription = () => {
  useRedirectToFirstStep();
  const step = useStep();

  return (
    <Layout title="Inscription - LinkedOut">
      <Section className="custom-page">
        {step ? <Registration /> : <LoadingScreen />}
      </Section>
    </Layout>
  );
};

export default Inscription;
