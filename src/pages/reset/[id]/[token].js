import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from 'src/components/Layout';
import { Button, Section } from 'src/components/utils';
import schema from 'src/components/forms/schema/formResetPassword.json';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import Api from 'src/Axios';
import { IconNoSSR } from 'src/components/utils/Icon';

const ResetPasswordPage = () => {
  const {
    isReady,
    query: { id, token, push },
  } = useRouter();

  const [valide, setValide] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady && id && token) {
      Api.get(`/auth/reset/${id}/${token}`)
        .then(() => {
          setValide(true);
        })
        .catch(() => {
          setValide(false);
          console.log('Lien non valide');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isReady, token]);

  return (
    <Layout title="Réinitialisation de mot de passe - LinkedOut">
      <Section size="large" style="muted">
        <div className="uk-flex uk-flex-center uk-flex-middle">
          {loading && (
            <div className="uk-text-center">
              <div data-uk-spinner />
            </div>
          )}
          {valide ? (
            <div className="uk-width-1-2@m uk-card uk-card-default uk-card-body">
              <h1>Réinitialisation de mot de passe</h1>
              <FormWithValidation
                formSchema={schema}
                onSubmit={({ newPassword, confirmPassword }, setError) => {
                  return Api.post(`/auth/reset/${id}/${token}`, {
                    newPassword,
                    confirmPassword,
                  })
                    .then(() => {
                      push('/reset/success');
                    })
                    .catch((err) => {
                      setError(err.response.data.error);
                    });
                }}
              />
            </div>
          ) : (
            <div className="uk-card uk-card-body uk-text-center">
              <IconNoSSR name="ban" ratio={4} className="uk-text-primary" />
              <p className="uk-text-lead">
                Ce lien ne semble pas valide. Veuillez contacter l&apos;équipe
                Linkedout.
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
        </div>
      </Section>
    </Layout>
  );
};

export default ResetPasswordPage;
