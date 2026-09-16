import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/src/components/ui/Button';
import { COLORS } from '@/src/constants/styles';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { selectCurrentUser } from '@/src/use-cases/current-user';

export interface NavPublicAuthActionsProps {
  onNavigate?: () => void;
}

export const NavPublicAuthActions = ({
  onNavigate,
}: NavPublicAuthActionsProps) => {
  // NavPublic is rendered on pages that may or may not be authenticated,
  // unlike NavConnected (backoffice-only) — use the nullable selector,
  // not useAuthenticatedUser()/selectAuthenticatedUser which asserts and
  // throws when no user is logged in.
  const user = useSelector(selectCurrentUser);

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
