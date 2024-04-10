import React from 'react';
import { Layout } from 'src/components/Layout';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { ConseilsPosture } from 'src/components/partials/pages/Documents/ConseilsPosture';
import { useAuthentication } from 'src/hooks/authentication/useAuthentication';

const ConseilsPosturePage = () => {
  const { isCurrentRouteReady } = useAuthentication();
  return (
    <Layout title="Conseils de posture - Entourage Pro">
      {isCurrentRouteReady ? <ConseilsPosture /> : <LoadingScreen />}
    </Layout>
  );
};

export default ConseilsPosturePage;
