import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Api } from 'src/api';

import { Layout } from 'src/components/Layout';
import { Section } from 'src/components/utils';
import { Spinner } from 'src/components/utils/Spinner';

const VerificationEmailPage = () => {
  const {
    query: { token },
  } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (token === undefined || typeof token !== 'string') return;
    setIsLoading(true);
    Api.getVerifyEmail(token as string).then((response) => {
      setStatus(response.status);
      setIsLoading(false);
    });
  }, [token]);

  return (
    <Layout title="Vérifier mon adresse e-email - Entourage Pro">
      <Section container="small" style="default">
        <h1 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          Verification de mon{' '}
          <span className="uk-text-primary">adresse e-mail</span>
        </h1>
        {isLoading && <Spinner />}
        {!isLoading && status === 200 ? <div>Success</div> : <div>Error</div>};
      </Section>
    </Layout>
  );
};

export default VerificationEmailPage;
