import React, { useCallback } from 'react';
import { getNormalUserRoles, UserRoles } from '@/src/constants/users';
import { UserWithUserCandidate } from 'src/api/types';
import {
  formPersonalDataAsAdmin,
  formPersonalDataAsCandidate,
  formPersonalDataAsCoach,
} from 'src/components/forms/schemas/formPersonalData';
import { openModal } from 'src/components/modals/Modal';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { findConstantFromValue, isRoleIncluded } from 'src/utils';
import { ModalEditUserInformation } from '.';

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
          introduction: user.userProfile.introduction || undefined,
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
          introduction: user.userProfile.introduction || undefined,
        }}
      />
    );
  }, [user]);

  const openCorrespondingModal = useCallback(() => {
    if (isRoleIncluded(getNormalUserRoles(), user.role)) {
      if (user.role === UserRoles.CANDIDATE) {
        openPersonalDataModalAsCandidate();
        return;
      }
      if (user.role === UserRoles.COACH) {
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
