import React from 'react';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Layout } from 'src/components/Layout';
import { CharteEthique } from 'src/components/partials/pages/Documents/CharteEthique';
import { useAuthentication } from 'src/hooks/authentication/useAuthentication';

const CharteEthiquePage = () => {
  const { isCurrentRouteReady } = useAuthentication();
  return (
    <Layout title="Charte Ethique - LinkedOut">
      {
        isCurrentRouteReady ?
        <CharteEthique /> :
        <LoadingScreen />
      }
    </Layout>
  );
};

export default CharteEthiquePage;
