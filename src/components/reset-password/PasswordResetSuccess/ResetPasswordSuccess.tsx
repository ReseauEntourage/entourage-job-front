import { useRouter } from 'next/router';
import React from 'react';
import { Check } from 'assets/icons/icons';
import {
  StyledResetPasswordButtonContainer,
  StyledResetPasswordContainer,
} from '../ResetPassword/ResetPassword.styles';
import { Layout } from 'src/components/Layout';
import { Button, Section, Typography } from 'src/components/utils';
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
          <Check color={COLORS.primaryBlue} width={100} height={100} />
          <Typography size="large">
            Votre mot de passe a bien été {isCreation ? 'crée' : 'réinitialisé'}
            .
          </Typography>
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
