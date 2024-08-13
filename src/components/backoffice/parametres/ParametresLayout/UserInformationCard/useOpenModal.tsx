import React, { useCallback } from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import {
  formPersonalDataAsAdmin,
  formPersonalDataAsCandidate,
  formPersonalDataAsCoach,
} from 'src/components/forms/schemas/formPersonalData';
import { openModal } from 'src/components/modals/Modal';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import {
  ALL_USER_ROLES,
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
} from 'src/constants/users';
import { findConstantFromValue, isRoleIncluded } from 'src/utils';
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
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          department: user.userProfile.department
            ? findConstantFromValue(
                user.userProfile.department,
                DEPARTMENTS_FILTERS
              )
            : undefined,
        }}
      />
    );
  }, [user]);

  const openPersonalDataModalAsCandidate = useCallback(() => {
    openModal(
      <ModalEditUserInformation
        formSchema={formPersonalDataAsCandidate}
        defaultValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address,
          department: user.userProfile.department
            ? findConstantFromValue(
                user.userProfile.department,
                DEPARTMENTS_FILTERS
              )
            : undefined,
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
