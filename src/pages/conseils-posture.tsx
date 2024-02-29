import React from 'react';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Layout } from 'src/components/Layout';
import { ConseilsPosture } from 'src/components/partials/pages/Documents/ConseilsPosture';
import { useAuthentication } from 'src/hooks/authentication/useAuthentication';

const ConseilsPosturePage = () => {
  const { isCurrentRouteReady } = useAuthentication();
  return (
    <Layout title="Conseils de posture - LinkedOut">
      {
        isCurrentRouteReady ?
        <ConseilsPosture /> :
        <LoadingScreen />
      }
    </Layout>
  );
};

export default ConseilsPosturePage;
