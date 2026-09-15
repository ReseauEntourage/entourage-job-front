import React from 'react';
import { Button } from '@/src/components/ui/Button';
import { COLORS } from '@/src/constants/styles';
import { GA_TAGS } from '@/src/constants/tags';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { gaEvent } from '@/src/lib/gtag';

export interface NavPublicAuthActionsProps {
  onNavigate?: () => void;
}

export const NavPublicAuthActions = ({
  onNavigate,
}: NavPublicAuthActionsProps) => {
  const user = useAuthenticatedUser();

  if (user) {
    return (
      <Button
        href="/backoffice/dashboard"
        variant="primary"
        rounded
        style={{
          backgroundColor: COLORS.darkTeal,
          borderColor: COLORS.darkTeal,
        }}
        onClick={() => {
          gaEvent(GA_TAGS.HEADER_ACCEDER_ESPACE_CLIC);
          onNavigate?.();
        }}
      >
        Accéder à mon espace
      </Button>
    );
  }

  return (
    <>
      <Button
        href="/login"
        variant="secondary"
        rounded
        style={{
          borderColor: COLORS.darkTeal,
          color: COLORS.darkTeal,
        }}
        onClick={() => {
          gaEvent(GA_TAGS.HEADER_CONNEXION_CLIC);
          onNavigate?.();
        }}
      >
        Connexion
      </Button>
      <Button
        href="/wizard"
        variant="primary"
        rounded
        style={{
          backgroundColor: COLORS.darkTeal,
          borderColor: COLORS.darkTeal,
        }}
        onClick={() => {
          gaEvent(GA_TAGS.HEADER_INSCRIPTION_CLIC);
          onNavigate?.();
        }}
      >
        Inscription
      </Button>
    </>
  );
};
