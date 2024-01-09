import React, { useCallback } from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import {
  formPersonalDataAsAdmin,
  formPersonalDataAsCandidate,
  formPersonalDataAsCoach,
} from 'src/components/forms/schemas/formPersonalData';
import { openModal } from 'src/components/modals/Modal';
import {
  ALL_USER_ROLES,
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
} from 'src/constants/users';
import { isRoleIncluded } from 'src/utils';
import { ModalEditUserInformation } from './ModalEditUserInformation';

export const useOpenCorrespondingModal = (user: UserWithUserCandidate) => {
  const openPersonalDataModalAsAdmin = useCallback(() => {
    openModal(
      <ModalEditUserInformation
        formSchema={formPersonalDataAsAdmin}
        defaultValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          phone: user.phone,
          zone: user.zone,
          adminRole: user.adminRole,
        }}
      />
    );
  }, [user]);

  const openPersonalDataModalAsCoach = useCallback(() => {
    openModal(
      <ModalEditUserInformation
        formSchema={formPersonalDataAsCoach}
        defaultValues={{
          phone: user.phone,
        }}
      />
    );
  }, [user]);

  const openPersonalDataModalAsCandidate = useCallback(() => {
    openModal(
      <ModalEditUserInformation
        formSchema={formPersonalDataAsCandidate}
        defaultValues={{
          phone: user.phone,
          address: user.address,
        }}
      />
    );
  }, [user]);

  const openCorrespondingModal = useCallback(() => {
    if (isRoleIncluded(ALL_USER_ROLES, user.role)) {
      if (isRoleIncluded(CANDIDATE_USER_ROLES, user.role)) {
        openPersonalDataModalAsCandidate();
        return;
      }
      if (isRoleIncluded(COACH_USER_ROLES, user.role)) {
        openPersonalDataModalAsCoach();
        return;
      }
    }
    openPersonalDataModalAsAdmin();
  }, [
    openPersonalDataModalAsAdmin,
    openPersonalDataModalAsCandidate,
    openPersonalDataModalAsCoach,
    user,
  ]);

  return {
    openCorrespondingModal,
  };
};
