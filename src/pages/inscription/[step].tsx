import React from 'react';
import { Layout } from 'src/components/Layout';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Registration } from 'src/components/registration/Registration';
import { useRegistrationRedirection } from 'src/components/registration/Registration/useRegistrationRedirection';

const Inscription = () => {
  const { isLoading } = useRegistrationRedirection();

  return (
    <Layout title="Inscription - Entourage Pro" noFooter noHeader>
      {isLoading ? <LoadingScreen /> : <Registration />}
    </Layout>
  );
};

export default Inscription;
