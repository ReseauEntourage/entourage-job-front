import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from 'src/components/Layout';
import { Button, Section } from 'src/components/utils';
import { Icon } from 'src/components/utils/Icon';

const ResetSuccessPage = () => {
  const {
    push,
    query: { isCreation },
  } = useRouter();

  return (
    <Layout
      title={`${
        isCreation ? 'Création' : 'Réinitialisation'
      } de mot de passe - LinkedOut`}
    >
      <Section size="large" style="muted">
        <div className="uk-flex uk-flex-center">
          <div className="uk-card uk-card-body uk-text-center">
            <Icon name="check" ratio={4} className="uk-text-primary" />
            <p className="uk-text-lead">
              Votre mot de passe a bien été{' '}
              {isCreation ? 'crée' : 'réinitialisé'}.
            </p>
            <div className="uk-flex uk-flex-center">
              <Button
                style="primary"
                onClick={() => {
                  return push('/login');
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