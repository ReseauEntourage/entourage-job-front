import useChange from '@react-hook/change';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfile, UserWithUserCandidate } from 'src/api/types';
import { ReduxRequestEvents } from 'src/constants';
import { CANDIDATE_USER_ROLES, UserRole } from 'src/constants/users';

import {
  currentUserActions,
  updateProfileSelectors,
} from 'src/use-cases/current-user';
import { isRoleIncluded } from 'src/utils';

export const helpFields = {
  HELP_NEEDS: 'helpNeeds',
  HELP_OFFERS: 'helpOffers',
} as const;

export const useHelpField = (userRole: UserRole | undefined) => {
  const [helpField, setHelpField] =
    useState<(typeof helpFields)[keyof typeof helpFields]>();

  useEffect(() => {
    if (!helpField && userRole) {
      if (isRoleIncluded(CANDIDATE_USER_ROLES, userRole)) {
        setHelpField('helpNeeds');
      } else {
        setHelpField('helpOffers');
      }
    }
  }, [helpField, userRole]);

  return helpField;
};

export const useUpdateProfile = (user: UserWithUserCandidate) => {
  const dispatch = useDispatch();

  const [closeModal, setCloseModal] = useState<boolean>(false);

  const helpField = useHelpField(user.role);

  const updateProfileStatus = useSelector(
    updateProfileSelectors.selectUpdateProfileStatus
  );

  useChange(updateProfileStatus, () => {
    if (updateProfileStatus === ReduxRequestEvents.SUCCEEDED) {
      setCloseModal(true);
    }
  });

  const updateUserProfile = useCallback(
    (newProfileData: Partial<UserProfile>): void => {
      if (!_.isEmpty(newProfileData) && user.id) {
        dispatch(
          currentUserActions.updateProfileRequested({
            userId: user.id,
            userProfile: newProfileData,
          })
        );
      } else {
        setCloseModal(true);
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
