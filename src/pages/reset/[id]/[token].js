import React from 'react';
import { useRouter } from 'next/router';
import Layout from 'src/components/Layout.tsx';
import { Button, Section, IconNoSSR } from 'src/components/utils';
import schema from 'src/components/forms/schema/formResetPassword';
import { Api } from 'src/api/index.ts';
import FormWithValidation from 'src/components/forms/FormWithValidation.tsx';
import { PasswordCriterias } from 'src/components/PasswordCriterias.tsx';
import PropTypes from 'prop-types';

const ResetPasswordPage = ({ valid, id, token, isCreation }) => {
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
                  formSchema={schema}
                  onSubmit={({ newPassword, confirmPassword }, setError) => {
                    return Api.postResetUserToken(id, token, {
                      newPassword,
                      confirmPassword,
                    })
                      .then(() => {
                        push(`/reset/success?isCreation=${isCreation}`);
                      })
                      .catch((err) => {
                        setError(
                          err?.response?.data?.error ||
                            'Une erreur est survenue'
                        );
                      });
                  }}
                />
              </div>
            ) : (
              <div className="uk-card uk-card-body uk-text-center">
                <IconNoSSR name="ban" ratio={4} className="uk-text-primary" />
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

ResetPasswordPage.propTypes = {
  valid: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  isCreation: PropTypes.string,
};

ResetPasswordPage.defaultProps = {
  isCreation: false,
};

export default ResetPasswordPage;
