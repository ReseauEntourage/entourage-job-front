import { useRouter } from 'next/router';
import React from 'react';
import {
  StyledResetPasswordButtonContainer,
  StyledResetPasswordContainer,
} from '../ResetPassword/ResetPassword.styles';
import { Layout } from 'src/components/Layout';
import { Button, Section, Text } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { COLORS } from 'src/constants/styles';

export const ResetPasswordSuccess = () => {
  const {
    push,
    query: { isCreation },
  } = useRouter();
  return (
    <Layout
      title={`${
        isCreation ? 'Création' : 'Réinitialisation'
      } de mot de passe - Entourage Pro`}
    >
      <Section size="large" style="muted">
        <StyledResetPasswordContainer>
          <LucidIcon name="Check" size={100} color={COLORS.primaryBlue} />
          <Text size="large">
            Votre mot de passe a bien été {isCreation ? 'crée' : 'réinitialisé'}
            .
          </Text>
          <StyledResetPasswordButtonContainer>
            <Button
              style="custom-primary"
              onClick={async () => {
                await push('/login');
              }}
            >
              Se connecter
            </Button>
          </StyledResetPasswordButtonContainer>
        </StyledResetPasswordContainer>
      </Section>
    </Layout>
  );
};
