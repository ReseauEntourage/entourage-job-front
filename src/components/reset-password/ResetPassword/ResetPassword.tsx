import { useRouter } from 'next/router';
import React from 'react';
import { Api } from 'src/api';
import { Layout } from 'src/components/Layout';
import { PasswordCriterias } from 'src/components/backoffice/parametres-old/ParametresLayout/ChangePasswordCard/PasswordCriterias';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formResetPassword } from 'src/components/forms/schemas/formResetPassword';
import { Button, Section, Text } from 'src/components/utils';
import { Card } from 'src/components/utils/Cards/Card';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
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
              <LucidIcon name="X" size={100} color={COLORS.primaryBlue} />
              <Text size="large">
                Ce lien ne semble pas valide. Veuillez contacter l&apos;équipe
                Entourage Pro.
              </Text>
              <StyledResetPasswordButtonContainer>
                <Button
                  variant="primary"
                  rounded
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
