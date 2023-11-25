import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Api } from 'src/api';
import { Layout } from 'src/components/Layout';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formLogin } from 'src/components/forms/schemas/formLogin';
import { formLostPwd } from 'src/components/forms/schemas/formLostPwd';
import { openModal } from 'src/components/modals/Modal';
import { StepperModal } from 'src/components/modals/Modal/ModalGeneric/StepperModal';
import { SuccessModalContent } from 'src/components/modals/SuccessModalContent';
import { Section, SimpleLink } from 'src/components/utils';
import { USER_ROLES } from 'src/constants/users';
import {
  authenticationActions,
  selectCurrentUser,
  selectLoginError,
} from 'src/use-cases/authentication';

const Login = () => {
  const user = useSelector(selectCurrentUser);
  const {
    replace,
    query: { requestedPath },
  } = useRouter();

  const dispatch = useDispatch();
  const loginError = useSelector(selectLoginError);

  const rateLimitErrorMessage =
    'Trop de tentatives infructueuses.\nVeuillez ressayer dans 1 minute.';

  const loginErrorMessage = useMemo(() => {
    if (!loginError) {
      return null;
    }

    if (loginError === 'RATE_LIMIT') {
      return rateLimitErrorMessage;
    }

    if (loginError === 'INVALID_CREDENTIALS') {
      return 'Erreur de connexion. Identifiant ou mot de passe invalide.';
    }

    return 'Une erreur est survenue';
  }, [loginError]);

  useEffect(() => {
    let path: string;

    if (Array.isArray(requestedPath)) {
      [path] = requestedPath;
    } else {
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
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

  return (
    <Layout title="Connexion - LinkedOut">
      <Section size="large" style="muted">
        <div className="uk-flex uk-flex-center">
          <div className="uk-width-1-2@m uk-card uk-card-default uk-card-body">
            <h1>Connexion</h1>
            <FormWithValidation
              formSchema={formLogin}
              submitText="Se connecter"
              enterToSubmit
              onSubmit={({ email, password }) => {
                dispatch(
                  authenticationActions.loginRequested({ email, password })
                );
              }}
              error={loginErrorMessage}
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
                            formSchema={formLostPwd}
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
