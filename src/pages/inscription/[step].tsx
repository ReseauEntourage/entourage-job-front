import React from 'react';
import { Layout } from 'src/components/Layout';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Onboarding } from 'src/components/onboarding/Onboarding/Onboarding';
import { useRedirectToFirstStep } from 'src/components/onboarding/Onboarding/useRedirectToFirstStep';
import { useStep } from 'src/hooks/queryParams/useStep';

const Inscription = () => {
  useRedirectToFirstStep();
  const page = useStep();

  return (
    <Layout title="Inscription - LinkedOut">
      {page ? <Onboarding /> : <LoadingScreen />}
    </Layout>
  );
};

export default Inscription;
