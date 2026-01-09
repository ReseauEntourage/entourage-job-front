import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { Refering } from '@/src/features/backoffice/referer/Refering/Refering';
import { useReferingRedirection } from '@/src/features/backoffice/referer/Refering/useReferingRedirection';

const Orienter = () => {
  const { isLoading } = useReferingRedirection();

  return (
    <Layout title="Orienter un candidat" noHeader noFooter>
      {isLoading ? <LoadingScreen /> : <Refering />}
    </Layout>
  );
};

export default Orienter;
