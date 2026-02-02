import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { Confirmation } from '@/src/features/backoffice/referer/Refering/Confirmation';
import { useConfirmationRedirection } from '@/src/features/backoffice/referer/Refering/Confirmation/useConfirmationRedirection';

const InscriptionConfirmation = () => {
  const { isLoading } = useConfirmationRedirection();

  return (
    <Layout title="Orienter un candidat" noFooter noHeader>
      {isLoading ? <LoadingScreen /> : <Confirmation />}
    </Layout>
  );
};

export default InscriptionConfirmation;
