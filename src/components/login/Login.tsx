import Link from 'next/link';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Api } from 'src/api';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formLogin } from 'src/components/forms/schemas/formLogin';
import { formLostPwd } from 'src/components/forms/schemas/formLostPwd';
import { openModal } from 'src/components/modals/Modal';
import { StepperModal } from 'src/components/modals/Modal/ModalGeneric/StepperModal';
import { SuccessModalContent } from 'src/components/modals/SuccessModalContent';
import { Card, SimpleLink, Text } from 'src/components/utils';
import { authenticationActions } from 'src/use-cases/authentication';
import { StyledLoginContainer, StyledLoginFooter } from './Login.styles';
import { useLogin } from './useLogin';

export function Login() {
  const dispatch = useDispatch();
  const { loginErrorMessage, rateLimitErrorMessage, setEmail } = useLogin();

  return (
    <StyledLoginContainer>
      <Card title="Connectez-vous à votre espace personnel">
        <FormWithValidation
          formSchema={formLogin}
          submitText="Se connecter"
          enterToSubmit
          onSubmit={({ email, password }) => {
            setEmail(email);
            dispatch(authenticationActions.loginRequested({ email, password }));
          }}
          error={loginErrorMessage}
        />
        <StyledLoginFooter>
          <Text size="small">
            <SimpleLink
              isExternal
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
          </Text>
          <Text size="small">
            Vous n&apos;avez pas de compte&nbsp;?{' '}
            <Link href="/inscription">Inscrivez-vous</Link>
          </Text>
        </StyledLoginFooter>
      </Card>
    </StyledLoginContainer>
  );
}
