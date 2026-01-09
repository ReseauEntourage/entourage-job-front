import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { ConseilsPosture } from '@/src/features/partials/pages/Documents/ConseilsPosture';
import { useAuthentication } from 'src/hooks/authentication/useAuthentication';

const ConseilsPosturePage = () => {
  const { isAuthRouteReady } = useAuthentication();
  return (
    <Layout title="Conseils de posture - Entourage Pro">
      {isAuthRouteReady ? <ConseilsPosture /> : <LoadingScreen />}
    </Layout>
  );
};

export default ConseilsPosturePage;
