import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectShouldLaunchOnboarding } from '@/src/use-cases/onboarding/onboarding.selectors';
import { RegistrableUserRoles, UserRoles } from 'src/constants/users';
import { selectAuthenticatedUser } from 'src/use-cases/current-user';
import { onboardingActions } from 'src/use-cases/onboarding';

/**
 * Hook qui gère la vérification et la mise à jour de l'état d'onboarding
 * basé sur les conditions de l'utilisateur authentifié
 */
export const useOnboardingCheck = () => {
  const dispatch = useDispatch();
  const shouldLaunchOnboarding = useSelector(selectShouldLaunchOnboarding);
  const authenticatedUser = useSelector(selectAuthenticatedUser);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    // Vérification des conditions pour lancer l'onboarding
    if (authenticatedUser) {
      const hasAcceptedEthicsCharter = authenticatedUser.readDocuments?.some(
        (doc) => doc.documentName === 'CharteEthique'
      );
      const userRoleHasOnboarding =
        authenticatedUser.role === UserRoles.CANDIDATE ||
        authenticatedUser.role === UserRoles.COACH;

      if (!hasAcceptedEthicsCharter && userRoleHasOnboarding) {
        dispatch(
          onboardingActions.launchOnboarding(
            authenticatedUser.role as RegistrableUserRoles
          )
        );
        setOnboardingChecked(true);
      } else if (hasAcceptedEthicsCharter || !userRoleHasOnboarding) {
        dispatch(onboardingActions.endOnboarding());
        setOnboardingChecked(true);
      }
    }
  }, [authenticatedUser, dispatch]);

  useEffect(() => {
    if (onboardingChecked && authenticatedUser) {
      const hasAcceptedEthicsCharter = authenticatedUser.readDocuments?.some(
        (doc) => doc.documentName === 'CharteEthique'
      );
      const userRoleHasOnboarding =
        authenticatedUser.role === UserRoles.CANDIDATE ||
        authenticatedUser.role === UserRoles.COACH;

      // Forcer la mise à jour de l'état Redux basé sur les conditions actuelles
      if (
        !hasAcceptedEthicsCharter &&
        userRoleHasOnboarding &&
        !shouldLaunchOnboarding
      ) {
        dispatch(
          onboardingActions.launchOnboarding(
            authenticatedUser.role as RegistrableUserRoles
          )
        );
      } else if (
        (hasAcceptedEthicsCharter || !userRoleHasOnboarding) &&
        shouldLaunchOnboarding
      ) {
        dispatch(onboardingActions.endOnboarding());
      }
    }
  }, [authenticatedUser, dispatch, onboardingChecked, shouldLaunchOnboarding]);

  return { shouldLaunchOnboarding };
};
