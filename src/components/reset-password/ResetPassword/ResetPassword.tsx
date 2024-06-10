import { useRouter } from 'next/router';
import React from 'react';
import { Close } from 'assets/icons/icons';
import { Api } from 'src/api';
import { Layout } from 'src/components/Layout';
import { PasswordCriterias } from 'src/components/backoffice/parametres/ParametresLayout/ChangePasswordCard/PasswordCriterias';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formResetPassword } from 'src/components/forms/schemas/formResetPassword';
import { Button, Section, Typography } from 'src/components/utils';
import { Card } from 'src/components/utils/Cards/Card';
import { COLORS } from 'src/constants/styles';
import {
  StyledResetPasswordButtonContainer,
  StyledResetPasswordContainer,
} from './ResetPassword.styles';

export interface ResetPasswordProps {
  valid: boolean;
  id: string;
  token: string;
  isCreation: boolean;
}

export const ResetPassword = ({
  valid,
  id,
  token,
  isCreation = false,
}: ResetPasswordProps) => {
  const { push } = useRouter();
  return (
    <Layout
      title={`${
        isCreation ? 'Création' : 'Réinitialisation'
      } de mot de passe - Entourage Pro`}
    >
      <Section size="large" style="muted">
        <StyledResetPasswordContainer>
          {valid ? (
            <Card
              title={`${
                isCreation ? 'Création' : 'Réinitialisation'
              } de mot de passe`}
            >
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
                    console.error(err);
                    setError('Une erreur est survenue');
                  }
                }}
              />
            </Card>
          ) : (
            <>
              <Close width={100} height={100} color={COLORS.primaryBlue} />
              <Typography size="large">
                Ce lien ne semble pas valide. Veuillez contacter l&apos;équipe
                Entourage Pro.
              </Typography>
              <StyledResetPasswordButtonContainer>
                <Button
                  style="custom-primary"
                  onClick={async () => {
                    await push('/');
                  }}
                >
                  Retourner à l&apos;accueil
                </Button>
              </StyledResetPasswordButtonContainer>
            </>
          )}
        </StyledResetPasswordContainer>
      </Section>
    </Layout>
  );
};
