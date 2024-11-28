import React from 'react';
import { Layout } from 'src/components/Layout';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Confirmation } from 'src/components/backoffice/referer/Refering/Confirmation';
import { useConfirmationRedirection } from 'src/components/backoffice/referer/Refering/Confirmation/useConfirmationRedirection';

const InscriptionConfirmation = () => {
  const { isLoading } = useConfirmationRedirection();

  return (
    <Layout title="Orienter un candidat" noFooter noHeader>
      {isLoading ? <LoadingScreen /> : <Confirmation />}
    </Layout>
  );
};

export default InscriptionConfirmation;
