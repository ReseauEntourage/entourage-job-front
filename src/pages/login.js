import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from 'src/components/Layout';
import { Section, SimpleLink } from 'src/components/utils';
import schemaLogin from 'src/components/forms/schema/formLogin.json';
import schemaLostPwd from 'src/components/forms/schema/formLostPwd.json';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import { UserContext } from 'src/components/store/UserProvider';
import Api from 'src/Axios';
import { USER_ROLES } from 'src/constants';
import StepperModal from 'src/components/modals/StepperModal';
import SuccessModalContent from 'src/components/modals/SuccessModalContent';
import { openModal } from 'src/components/modals/Modal';

const Login = () => {
  const { login, user } = useContext(UserContext);
  const {
    replace,
    query: { requestedPath },
  } = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === USER_ROLES.ADMIN) {
        replace(requestedPath || '/backoffice/admin/offres');
      }
      if (user.role === USER_ROLES.CANDIDAT || user.role === USER_ROLES.COACH) {
        replace(requestedPath || '/backoffice/candidat/offres');
      }
    }
  }, [replace, requestedPath, user]);

  const rateLimitErrorMessage =
    'Trop de tentatives infructueuses.\nVeuillez ressayer dans 1 minute.';

  return (
    <Layout title="Connexion - LinkedOut">
      <Section size="large" style="muted">
        <div className="uk-flex uk-flex-center">
          <div className="uk-width-1-2@m uk-card uk-card-default uk-card-body">
            <h1>Connexion</h1>
            <FormWithValidation
              formSchema={schemaLogin}
              submitText="Se connecter"
              enterToSubmit
              onSubmit={({ email, password }, setError) => {
                return login(email, password).catch((err) => {
                  const errorMessage =
                    err && err.response && err.response.status === 429
                      ? rateLimitErrorMessage
                      : 'Erreur de connexion. Identifiant ou mot de passe invalide.';
                  setError(errorMessage);
                });
              }}
            />
            <SimpleLink
              isExternal
              className="uk-text-small uk-margin-remove"
              onClick={() => {
                openModal(
                  <StepperModal
                    title="Mot de passe oubli?? ?"
                    composers={[
                      (closeModal, nextStep) => {
                        return (
                          <FormWithValidation
                            submitText="Envoyer"
                            formSchema={schemaLostPwd}
                            onCancel={closeModal}
                            onSubmit={({ email }, setError) => {
                              return Api.post('/auth/forgot', {
                                email: email.toLowerCase(),
                              })
                                .then(() => {
                                  return nextStep();
                                })
                                .catch((err) => {
                                  const errorMessage =
                                    err &&
                                    err.response &&
                                    err.response.status === 429
                                      ? rateLimitErrorMessage
                                      : "L'adresse mail ne correspond ?? aucun utilisateur";
                                  setError(errorMessage);
                                });
                            }}
                          />
                        );
                      },
                      (closeModal) => {
                        return (
                          <SuccessModalContent
                            closeModal={closeModal}
                            text="Un e-mail vient d'??tre envoy?? ?? l'adresse indiqu??e."
                          />
                        );
                      },
                    ]}
                  />
                );
              }}
            >
              Mot de passe oubli?? ?
            </SimpleLink>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Login;
