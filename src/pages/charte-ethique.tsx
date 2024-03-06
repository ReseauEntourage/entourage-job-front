import React from 'react';
import { Layout } from 'src/components/Layout';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { CharteEthique } from 'src/components/partials/pages/Documents/CharteEthique';
import { useAuthentication } from 'src/hooks/authentication/useAuthentication';

const CharteEthiquePage = () => {
  const { isCurrentRouteReady } = useAuthentication();
  return (
    <Layout title="Charte Ethique - Entourage Pro">
      {isCurrentRouteReady ? <CharteEthique /> : <LoadingScreen />}
    </Layout>
  );
};

export default CharteEthiquePage;
