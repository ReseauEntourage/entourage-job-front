import React from 'react';
import { Layout } from 'src/components/Layout';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Refering } from 'src/components/backoffice/referer/Refering/Refering';
import { useReferingRedirection } from 'src/components/backoffice/referer/Refering/useReferingRedirection';

const Orienter = () => {
  const { isLoading } = useReferingRedirection();

  return (
    <Layout title="Orienter un candidat" noHeader noFooter>
      {isLoading ? <LoadingScreen /> : <Refering />}
    </Layout>
  );
};

export default Orienter;
