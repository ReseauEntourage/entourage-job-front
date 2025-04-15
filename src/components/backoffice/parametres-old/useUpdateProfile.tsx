import useChange from '@react-hook/change';
import _ from 'lodash';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfile, UserWithUserCandidate } from 'src/api/types';
import { ReduxRequestEvents } from 'src/constants';

import {
  currentUserActions,
  updateProfileSelectors,
} from 'src/use-cases/current-user';

export const useUpdateProfile = (user: UserWithUserCandidate) => {
  const dispatch = useDispatch();

  const [closeModal, setCloseModal] = useState<boolean>(false);

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
    updateUserProfile,
    closeModal,
  };
};
