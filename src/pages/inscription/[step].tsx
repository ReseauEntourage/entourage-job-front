import React from 'react';
import { useUtm } from '@/src/hooks/queryParams/useUTM';
import { Layout } from 'src/components/Layout';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Registration } from 'src/components/registration/Registration';
import { useRegistrationRedirection } from 'src/components/registration/Registration/useRegistrationRedirection';
import { Section } from 'src/components/utils';

const Inscription = () => {
  const { isLoading } = useRegistrationRedirection();
  useUtm();

  return (
    <Layout title="Inscription - Entourage Pro" noFooter>
      <Section className="custom-page">
        {isLoading ? <LoadingScreen /> : <Registration />}
      </Section>
    </Layout>
  );
};

export default Inscription;
