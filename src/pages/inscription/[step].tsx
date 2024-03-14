import React from 'react';
import { Layout } from 'src/components/Layout';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Registration } from 'src/components/registration/Registration';
import { useRegistrationRedirection } from 'src/components/registration/Registration/useRegistrationRedirection';
import { Section } from 'src/components/utils';

const Inscription = () => {
  const { isLoading } = useRegistrationRedirection();

  return (
    <Layout title="Inscription - Entourage Pro">
      <Section className="custom-page">
        {isLoading ? <LoadingScreen /> : <Registration />}
      </Section>
    </Layout>
  );
};

export default Inscription;
