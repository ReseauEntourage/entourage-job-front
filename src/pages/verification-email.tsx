import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Api } from 'src/api';

import { Layout } from 'src/components/Layout';
import { Button, Section } from 'src/components/utils';
import { Spinner } from 'src/components/utils/Spinner';
import { COLORS } from 'src/constants/styles';

const VerificationEmailPage = () => {
  const {
    query: { token },
  } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (token === undefined || typeof token !== 'string') {
      setIsError(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    Api.getVerifyEmail(token as string)
      .then(() => {
        setIsError(false);
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [token]);

  const SuccessDiv = styled.div`
    color: ${COLORS.yesGreen};
  `;

  const ErrorDiv = styled.div`
    color: ${COLORS.noRed};
    display: flex;
    padding: 10px;
    border: 1px solid ${COLORS.noRed};
    border-radius: 10px;
  `;

  return (
    <Layout title="Vérifier mon adresse e-email - Entourage Pro">
      <Section container="small" style="default">
        <h1 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          Verification de mon{' '}
          <span className="uk-text-primary">adresse e-mail</span>
        </h1>
        {isLoading && <Spinner />}
        {isError && (
          <ErrorDiv>
            Une erreur est survenue lors de la vérification de votre adresse
            email.
          </ErrorDiv>
        )}
        {!isError && (
          <>
            {' '}
            <SuccessDiv>
              Merci d&apos;avoir vérifié votre adresse email
            </SuccessDiv>
            <Button href="/login" style="custom-secondary" size="small">
              Connexion
            </Button>
          </>
        )}
      </Section>
    </Layout>
  );
};

export default VerificationEmailPage;
