import React, { useCallback } from 'react';
import {
  getNormalUserRoles,
  NormalUserRoles,
  UserRoles,
} from '@/src/constants/users';
import { UserWithUserCandidate } from 'src/api/types';
import {
  formPersonalDataAsAdmin,
  formPersonalDataAsCandidate,
  formPersonalDataAsCoach,
} from 'src/components/forms/schemas/formPersonalData';
import { openModal } from 'src/components/modals/Modal';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
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

  const openPersonalDataModalAsNormalUserRole = useCallback(
    (role: NormalUserRoles) => {
      const formSchemasByRole = {
        [UserRoles.CANDIDATE]: formPersonalDataAsCandidate,
        [UserRoles.COACH]: formPersonalDataAsCoach,
      };
      openModal(
        <ModalEditUserInformation
          formSchema={formSchemasByRole[role]}
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
    },
    [user]
  );

  const openCorrespondingModal = useCallback(() => {
    if (isRoleIncluded(getNormalUserRoles(), user.role)) {
      if (user.role === UserRoles.CANDIDATE || user.role === UserRoles.COACH) {
        openPersonalDataModalAsNormalUserRole(user.role as NormalUserRoles);
        return;
      }
    }
    openPersonalDataModalAsAdmin();
  }, [
    openPersonalDataModalAsAdmin,
    openPersonalDataModalAsNormalUserRole,
    user,
  ]);

  return {
    openCorrespondingModal,
  };
};
