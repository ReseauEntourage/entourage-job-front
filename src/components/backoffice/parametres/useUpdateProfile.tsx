import _ from 'lodash';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfile, UserWithUserCandidate } from 'src/api/types';
import { ReduxRequestEvents } from 'src/constants';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import {
  authenticationActions,
  updateProfileSelectors,
} from 'src/use-cases/authentication';
import { isRoleIncluded } from 'src/utils';

export const helpFields = {
  HELP_NEEDS: 'helpNeeds',
  HELP_OFFERS: 'helpOffers',
} as const;

export const useHelpField = (user: UserWithUserCandidate) => {
  const { role } = user;

  const [helpField, setHelpField] =
    useState<(typeof helpFields)[keyof typeof helpFields]>();

  useEffect(() => {
    if (!helpField) {
      if (isRoleIncluded(CANDIDATE_USER_ROLES, role)) {
        setHelpField('helpNeeds');
      } else {
        setHelpField('helpOffers');
      }
    }
  }, [helpField, role]);

  return helpField;
};

export const useUpdateProfile = (
  user: UserWithUserCandidate,
  onClose?: () => void
) => {
  const dispatch = useDispatch();

  const [closeModal, setCloseModal] = useState<boolean>(false);

  const helpField = useHelpField(user);

  const updateProfileStatus = useSelector(
    updateProfileSelectors.selectFetchUserStatus
  );

  useEffect(() => {
    if (updateProfileStatus === ReduxRequestEvents.SUCCEEDED) {
      if (onClose) onClose();
      setCloseModal(true);
    }
  }, [updateProfileStatus, onClose]);

  const updateUserProfile = useCallback(
    (newProfileData: Partial<UserProfile>): void => {
      if (!_.isEmpty(newProfileData) && user.id) {
        dispatch(
          authenticationActions.updateProfileRequested({
            userId: user.id,
            userProfile: newProfileData,
          })
        );
      }
    },
    [dispatch, user.id]
  );

  return {
    helpField,
    updateUserProfile,
    closeModal,
  };
};
