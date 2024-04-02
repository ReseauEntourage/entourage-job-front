import { useOpenCorrespondingModal } from 'src/components/backoffice/parametres/ParametresLayout/UserInformationCard/useOpenModal';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import {
  CANDIDATE_USER_ROLES,
  USER_ROLES,
  UserRole,
} from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { isRoleIncluded } from 'src/utils';
import { useUploadProfileImage } from './useUploadProfileImage';

export function useHeaderProfile(role: UserRole) {
  const user = useAuthenticatedUser();
  const { openCorrespondingModal } = useOpenCorrespondingModal(user);

  const { imageUploading, uploadProfileImage } = useUploadProfileImage();

  const shouldShowAllProfile = isRoleIncluded(
    [...CANDIDATE_USER_ROLES, USER_ROLES.COACH],
    role
  );

  const { contextualRole } = useContextualRole(role);

  return {
    openCorrespondingModal,
    imageUploading,
    uploadProfileImage,
    shouldShowAllProfile,
    contextualRole,
  };
}
