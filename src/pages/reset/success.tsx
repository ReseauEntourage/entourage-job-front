import { useRouter } from 'next/router';
import React from 'react';
import CheckIcon from 'assets/icons/check.svg';
import { Layout } from 'src/components/Layout';
import { Button, Section } from 'src/components/utils';

const ResetSuccessPage = () => {
  const {
    push,
    query: { isCreation },
  } = useRouter();

  return (
    <Layout
      title={`${
        isCreation ? 'Création' : 'Réinitialisation'
      } de mot de passe - Entourage Pro`}
    >
      <Section size="large" style="muted">
        <div className="uk-flex uk-flex-center">
          <div className="uk-card uk-card-body uk-text-center">
            <CheckIcon className="uk-text-primary" width={100} height={100} />
            <p className="uk-text-lead">
              Votre mot de passe a bien été{' '}
              {isCreation ? 'crée' : 'réinitialisé'}.
            </p>
            <div className="uk-flex uk-flex-center">
              <Button
                style="primary"
                onClick={async () => {
                  await push('/login');
                }}
              >
                Se connecter
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default ResetSuccessPage;
