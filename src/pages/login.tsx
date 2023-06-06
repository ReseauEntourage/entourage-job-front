import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { Api } from 'src/api';
import Layout from 'src/components/Layout';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import schemaLogin from 'src/components/forms/schema/formLogin.json';
import schemaLostPwd from 'src/components/forms/schema/formLostPwd.json';
import { openModal } from 'src/components/modals/Modal';
import StepperModal from 'src/components/modals/Modal/ModalGeneric/StepperModal';
import SuccessModalContent from 'src/components/modals/SuccessModalContent';
import { Section, SimpleLink } from 'src/components/utils';
import { USER_ROLES } from 'src/constants/users';
import { UserContext } from 'src/store/UserProvider';

const Login = () => {
  const { login, user } = useContext(UserContext);
  const {
    replace,
    query: { requestedPath },
  } = useRouter();

  useEffect(() => {
    let path: string;

    if (Array.isArray(requestedPath)) {
      [path] = requestedPath;
    } else {
      path = requestedPath;
    }

    if (user) {
      if (user.role === USER_ROLES.ADMIN) {
        replace(path || '/backoffice/admin/offres');
      } else if (user.role === USER_ROLES.COACH_EXTERNAL) {
        replace(path || '/backoffice/candidat/list');
      } else {
        replace(path || '/backoffice/candidat/cv');
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
                    title="Mot de passe oublié ?"
                    composers={[
                      (closeModal, nextStep) => {
                        return (
                          <FormWithValidation
                            submitText="Envoyer"
                            formSchema={schemaLostPwd}
                            onCancel={closeModal}
                            onSubmit={({ email }, setError) => {
                              return Api.postAuthForgot({
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
                                      : "L'adresse mail ne correspond à aucun utilisateur";
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
                            text="Un e-mail vient d'être envoyé à l'adresse indiquée."
                          />
                        );
                      },
                    ]}
                  />
                );
              }}
            >
              Mot de passe oublié ?
            </SimpleLink>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Login;
