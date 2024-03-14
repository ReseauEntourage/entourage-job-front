import React from 'react';
import { Layout } from 'src/components/Layout';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Confirmation } from 'src/components/registration/Confirmation';
import { useConfirmationRedirection } from 'src/components/registration/Confirmation/useConfirmationRedirection';
import { Section } from 'src/components/utils';

const InscriptionConfirmation = () => {
  const { isLoading } = useConfirmationRedirection();

  return (
    <Layout title="Inscription - Entourage Pro">
      <Section className="custom-page">
        {isLoading ? <LoadingScreen /> : <Confirmation />}
      </Section>
    </Layout>
  );
};

export default InscriptionConfirmation;
