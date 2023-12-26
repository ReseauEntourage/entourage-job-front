import _ from 'lodash';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UIkit from 'uikit';
import { HelpNames, UserProfile, UserWithUserCandidate } from 'src/api/types';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import {
  authenticationActions,
  updateProfileSelectors,
} from 'src/use-cases/authentication';
import { isRoleIncluded } from 'src/utils';

export const useHelpField = (user: UserWithUserCandidate) => {
  const { role } = user;

  const [helpField, setHelpField] = useState<'helpNeeds' | 'helpOffers'>();

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

export const useProfile = (
  user: UserWithUserCandidate,
  onClose?: () => void
) => {
  const dispatch = useDispatch();

  const helpField = useHelpField(user);

  const updateProfileStatus = useSelector(
    updateProfileSelectors.selectFetchUserStatus
  );

  useEffect(() => {
    if (updateProfileStatus === 'SUCCEEDED') {
      if (onClose) onClose();
      UIkit.notification(`La modification a bien été enregistrée`, 'success');
    } else if (updateProfileStatus === 'FAILED') {
      UIkit.notification(
        `Une erreur est survenue lors de la modification`,
        'danger'
      );
    }
  }, [updateProfileStatus, onClose]);

  useEffect(() => {
    return () => {
      dispatch(authenticationActions.updateProfileReset());
    };
  }, [dispatch]);

  const [tempProfile, setTempProfile] = useState<Partial<UserProfile>>({});

  const updateHelpFields = useCallback(
    (newHelpFields: HelpNames[]): void => {
      if (!helpField || !tempProfile) return;
      setTempProfile({
        ...tempProfile,
        [helpField]: newHelpFields.map((help) => {
          return { name: help };
        }),
      });
    },
    [helpField, tempProfile]
  );

  const updateUserProfile = useCallback((): void => {
    if (!tempProfile) return;
    const cleanedProfile: Partial<UserProfile> = _.pickBy(
      tempProfile,
      (v) => v !== null
    );
    dispatch(
      authenticationActions.updateProfileRequested({
        userId: user.id,
        userProfile: cleanedProfile,
      })
    );
  }, [dispatch, tempProfile, user.id]);

  return {
    helpField,
    updateUserProfile,
    setTempProfile,
    updateHelpFields,
    tempProfile,
  };
};
