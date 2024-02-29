import useChange from '@react-hook/change';
import _ from 'lodash';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserWithUserCandidate } from 'src/api/types';
import { ReduxRequestEvents } from 'src/constants';
import {
  authenticationActions,
  updateUserSelectors,
} from 'src/use-cases/authentication';

export const useUpdateUser = (user: UserWithUserCandidate) => {
  const dispatch = useDispatch();

  const [closeModal, setCloseModal] = useState<boolean>(false);

  const updateUserStatus = useSelector(
    updateUserSelectors.selectUpdateUserStatus
  );

  useChange(updateUserStatus, () => {
    if (updateUserStatus === ReduxRequestEvents.SUCCEEDED) {
      setCloseModal(true);
    }
  });

  const updateUser = useCallback(
    (newUserData: Partial<UserWithUserCandidate>) => {
      if (!_.isEmpty(newUserData) && user.id) {
        dispatch(
          authenticationActions.updateUserRequested({
            userId: user.id,
            user: newUserData,
          })
        );
      } else {
        setCloseModal(true);
      }
    },
    [dispatch, user]
  );

  return { updateUser, closeModal };
};
