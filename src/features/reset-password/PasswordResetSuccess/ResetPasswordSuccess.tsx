import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Button, Section, Text } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import {
  StyledResetPasswordButtonContainer,
  StyledResetPasswordContainer,
} from '../ResetPassword/ResetPassword.styles';
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
              variant="primary"
              rounded
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
