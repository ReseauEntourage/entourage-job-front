import { useRouter } from 'next/router';
import React from 'react';
import { Api } from 'src/api';
import { Layout } from 'src/components/Layout';
import { PasswordCriterias } from 'src/components/PasswordCriterias';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formResetPassword } from 'src/components/forms/schemas/formResetPassword';
import { Button, Section, Icon } from 'src/components/utils';

interface ResetPasswordPageProps {
  valid: boolean;
  id: string;
  token: string;
  isCreation: boolean;
}
const ResetPasswordPage = ({
  valid,
  id,
  token,
  isCreation = false,
}: ResetPasswordPageProps) => {
  const { push } = useRouter();

  return (
    <Layout
      title={`${
        isCreation ? 'Création' : 'Réinitialisation'
      } de mot de passe - LinkedOut`}
    >
      <Section size="large" style="muted">
        <div className="uk-flex uk-flex-center uk-flex-middle">
          <>
            {valid ? (
              <div className="uk-width-1-2@m uk-card uk-card-default uk-card-body">
                <h1>
                  {isCreation ? 'Création' : 'Réinitialisation'} de mot de passe
                </h1>
                <PasswordCriterias />
                <FormWithValidation
                  formSchema={formResetPassword}
                  onSubmit={async (
                    { newPassword, confirmPassword },
                    setError
                  ) => {
                    try {
                      await Api.postResetUserToken(id, token, {
                        newPassword,
                        confirmPassword,
                      });
                      push(`/reset/success?isCreation=${isCreation}`);
                    } catch (err) {
                      setError(
                        err?.response?.data?.error || 'Une erreur est survenue'
                      );
                    }
                  }}
                />
              </div>
            ) : (
              <div className="uk-card uk-card-body uk-text-center">
                <Icon name="ban" ratio={4} className="uk-text-primary" />
                <p className="uk-text-lead">
                  Ce lien ne semble pas valide. Veuillez contacter l&apos;équipe
                  LinkedOut.
                </p>
                <div className="uk-flex uk-flex-center">
                  <Button
                    style="primary"
                    onClick={() => {
                      return push('/');
                    }}
                  >
                    Retourner à l&apos;accueil
                  </Button>
                </div>
              </div>
            )}
          </>
        </div>
      </Section>
    </Layout>
  );
};

ResetPasswordPage.getInitialProps = async ({ query }) => {
  const { id, token, isCreation } = query;
  const valid = await Api.getResetUserToken(id, token)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });

  return {
    valid,
    id,
    token,
    isCreation,
  };
};

export default ResetPasswordPage;
