import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { FeedbackModal } from 'src/components/modals/FeedbackModal/FeedbackModal';
import { openModal } from 'src/components/modals/Modal';
import { Card } from 'src/components/utils';
import { ToggleWithModal } from 'src/components/utils/Inputs/ToggleWithModal';
import { ReduxRequestEvents } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { gaEvent } from 'src/lib/gtag';
import {
  currentUserActions,
  updateProfileSelectors,
} from 'src/use-cases/current-user';
import { notificationsActions } from 'src/use-cases/notifications';

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

  const onToggle = (newIsAvailable: boolean) => {
    gaEvent(GA_TAGS.PAGE_DASHBOARD_DISPONIBILITE_CLIC);
    if (newIsAvailable === false) {
      openModal(<FeedbackModal />);
    } else {
      updateUserProfile({
        isAvailable: true,
        unavailabilityReason: null,
      });
    }
  };

  return (
    <Card
      title={
        user.role === UserRoles.CANDIDATE
          ? 'Disponibilité pour recevoir des coups de pouces'
          : 'Disponibilité pour accompagner un candidat'
      }
      centerTitle
    >
      <ToggleWithModal
        id="isAvailable"
        title={
          user.userProfile.isAvailable
            ? 'Je suis disponible'
            : 'Je ne suis pas disponible'
        }
        isToggled={user.userProfile.isAvailable}
        onToggle={onToggle}
      />
    </Card>
  );
};
