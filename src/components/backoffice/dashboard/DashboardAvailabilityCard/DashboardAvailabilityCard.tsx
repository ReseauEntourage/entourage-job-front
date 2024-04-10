import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateProfile } from 'src/components/backoffice/parametres/useUpdateProfile';
import { Card } from 'src/components/utils';
import { ToggleWithModal } from 'src/components/utils/Inputs/ToggleWithModal';
import { ReduxRequestEvents } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { gaEvent } from 'src/lib/gtag';
import {
  currentUserActions,
  updateProfileSelectors,
} from 'src/use-cases/current-user';
import { notificationsActions } from 'src/use-cases/notifications';
import { isRoleIncluded } from 'src/utils';

export const DashboardAvailabilityCard = () => {
  const user = useAuthenticatedUser();
  const dispatch = useDispatch();
  const updateProfileStatus = useSelector(
    updateProfileSelectors.selectUpdateProfileStatus
  );

  const { updateUserProfile } = useUpdateProfile(user);

  useEffect(() => {
    return () => {
      dispatch(currentUserActions.updateProfileReset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (updateProfileStatus === ReduxRequestEvents.SUCCEEDED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: `La modification a bien été enregistrée`,
        })
      );
    } else if (updateProfileStatus === ReduxRequestEvents.FAILED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: `Une erreur est survenue`,
        })
      );
    }
  }, [updateProfileStatus, dispatch]);

  return (
    <Card
      title={
        isRoleIncluded(CANDIDATE_USER_ROLES, user.role)
          ? 'Disponibilité pour recevoir des coups de pouces'
          : 'Disponibilité pour accompagner un candidat'
      }
    >
      <ToggleWithModal
        id="isAvailable"
        title={
          user.userProfile.isAvailable
            ? 'Je suis disponible'
            : 'Je ne suis pas disponible'
        }
        isToggled={user.userProfile.isAvailable}
        onToggle={(isAvailable) => {
          updateUserProfile({ isAvailable });
          gaEvent(GA_TAGS.PAGE_DASHBOARD_DISPONIBILITE_CLIC);
        }}
      />
    </Card>
  );
};
