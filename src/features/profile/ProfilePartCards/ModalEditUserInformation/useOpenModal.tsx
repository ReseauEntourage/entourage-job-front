import React, { useCallback } from 'react';
import { User } from '@/src/api/types';
import { getNormalUserRoles, UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import {
  formPersonalDataAsAdmin,
  formPersonalDataAsCandidate,
  formPersonalDataAsCoach,
} from 'src/features/forms/schemas/formPersonalData';
import { useCurrentUserProfile } from 'src/hooks/current-user/useCurrentUserProfile';
import { findConstantFromValue, isRoleIncluded } from 'src/utils';
import { ModalEditUserInformation } from '.';

export const useOpenCorrespondingModal = (user: User) => {
  const userProfile = useCurrentUserProfile();

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
        }}
      />
    );
  }, [user]);

  const openPersonalDataModalAsNormalUser = useCallback(() => {
    const formSchemasByRole = {
      [UserRoles.CANDIDATE]: formPersonalDataAsCandidate,
      [UserRoles.COACH]: formPersonalDataAsCoach,
    };
    openModal(
      <ModalEditUserInformation
        formSchema={formSchemasByRole[user.role]}
        defaultValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          department: userProfile?.department
            ? findConstantFromValue(userProfile.department, DEPARTMENTS_FILTERS)
            : undefined,
          introduction: userProfile?.introduction || undefined,
        }}
      />
    );
  }, [user, userProfile]);

  const openCorrespondingModal = useCallback(() => {
    if (isRoleIncluded(getNormalUserRoles(), user.role)) {
      openPersonalDataModalAsNormalUser();
    }
    if (user.role === UserRoles.ADMIN) {
      openPersonalDataModalAsAdmin();
    }
  }, [openPersonalDataModalAsAdmin, openPersonalDataModalAsNormalUser, user]);

  return {
    openCorrespondingModal,
  };
};
