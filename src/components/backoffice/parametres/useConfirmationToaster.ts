import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UIkit from 'uikit';
import { ReduxRequestEvents } from 'src/constants';
import { usePrevious } from 'src/hooks/utils';
import {
  authenticationActions,
  updateProfileSelectors,
  updateCandidateSelectors,
  updateUserSelectors,
} from 'src/use-cases/authentication';

export const useConfirmationToaster = () => {
  const updateProfileStatus = useSelector(
    updateProfileSelectors.selectFetchUserStatus
  );
  const prevUpdateProfileStatus = usePrevious(updateProfileStatus);

  const updateUserStatus = useSelector(
    updateUserSelectors.selectFetchUserStatus
  );
  const prevUpdateUserStatus = usePrevious(updateUserStatus);

  const updateCandidateStatus = useSelector(
    updateCandidateSelectors.selectFetchUserStatus
  );
  const prevUpdateCandidateStatus = usePrevious(updateCandidateStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    if (prevUpdateProfileStatus === ReduxRequestEvents.REQUESTED) {
      if (updateProfileStatus === ReduxRequestEvents.SUCCEEDED) {
        UIkit.notification(
          `La modification du profil a bien été enregistrée`,
          'success'
        );
        dispatch(authenticationActions.updateProfileReset());
      } else if (updateProfileStatus === ReduxRequestEvents.FAILED) {
        UIkit.notification(
          `Une erreur est survenue lors de la modification`,
          'danger'
        );
      }
    }
  }, [updateProfileStatus, dispatch, prevUpdateProfileStatus]);

  useEffect(() => {
    if (prevUpdateUserStatus === ReduxRequestEvents.REQUESTED) {
      if (updateUserStatus === ReduxRequestEvents.SUCCEEDED) {
        UIkit.notification(
          'Vos informations personnelles ont bien été mises à jour',
          'success'
        );
        dispatch(authenticationActions.updateUserReset());
      } else if (updateUserStatus === ReduxRequestEvents.FAILED) {
        UIkit.notification(
          "Une erreur c'est produite lors de la mise à jour",
          'danger'
        );
      }
    }
  }, [updateUserStatus, dispatch, prevUpdateUserStatus]);

  useEffect(() => {
    if (prevUpdateCandidateStatus === ReduxRequestEvents.REQUESTED) {
      if (updateCandidateStatus === ReduxRequestEvents.SUCCEEDED) {
        UIkit.notification(
          'Les informations candidat ont bien été mises à jour',
          'success'
        );
        dispatch(authenticationActions.updateCandidateReset());
      } else if (updateCandidateStatus === ReduxRequestEvents.FAILED) {
        UIkit.notification(
          "Une erreur c'est produite lors de la mise à jour",
          'danger'
        );
      }
    }
  }, [updateCandidateStatus, dispatch, prevUpdateCandidateStatus]);

  useEffect(() => {
    return () => {
      dispatch(authenticationActions.updateProfileReset());
      dispatch(authenticationActions.updateUserReset());
      dispatch(authenticationActions.updateCandidateReset());
    };
  }, [dispatch]);
};
