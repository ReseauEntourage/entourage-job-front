import React from 'react';
import { Layout } from 'src/components/Layout';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Confirmation } from 'src/components/registration/Confirmation';
import { useRegistrationRedirection } from 'src/components/registration/useRegistrationRedirection';
import { Section } from 'src/components/utils';

const InscriptionConfirmation = () => {
  const { isLoading } = useRegistrationRedirection();

  return (
    <Layout title="Inscription - LinkedOut">
      <Section className="custom-page">
        {isLoading ? <LoadingScreen /> : <Confirmation />}
      </Section>
    </Layout>
  );
};

export default InscriptionConfirmation;
