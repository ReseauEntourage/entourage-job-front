import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  currentUserActions,
  updateProfileSelectors,
  updateUserSelectors,
} from 'src/use-cases/current-user';
import { notificationsActions } from 'src/use-cases/notifications';

export function useConfirmationToaster() {
  const dispatch = useDispatch();

  const updateProfileStatus = useSelector(
    updateProfileSelectors.selectUpdateProfileStatus
  );

  const updateUserStatus = useSelector(
    updateUserSelectors.selectUpdateUserStatus
  );

  useEffect(() => {
    return () => {
      dispatch(currentUserActions.updateProfileReset());
      dispatch(currentUserActions.updateUserReset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (updateProfileStatus === ReduxRequestEvents.SUCCEEDED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: `La modification du profil a bien été enregistrée`,
        })
      );
    } else if (updateProfileStatus === ReduxRequestEvents.FAILED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: `Une erreur est survenue lors de la modification`,
        })
      );
    }
  }, [updateProfileStatus, dispatch]);

  useEffect(() => {
    if (updateUserStatus === ReduxRequestEvents.SUCCEEDED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: `Vos informations personnelles ont bien été mises à jour`,
        })
      );
    } else if (updateUserStatus === ReduxRequestEvents.FAILED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: `Une erreur est survenue lors de la modification`,
        })
      );
    }
  }, [updateUserStatus, dispatch]);
}
