import { useContextualRole } from '../useContextualRole';
import { useOpenCorrespondingModal } from 'src/components/backoffice/parametres/ParametresLayout/UserInformationCard/useOpenModal';
import { USER_ROLES, UserRole } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { isRoleIncluded } from 'src/utils';
import { useUploadProfileImage } from './useUploadProfileImage';

export function useHeaderProfile(userId: string, role: UserRole) {
  const user = useAuthenticatedUser();
  const { openCorrespondingModal } = useOpenCorrespondingModal(user);

  const { imageUploading, uploadProfileImage } = useUploadProfileImage(userId);

  const shouldShowAllProfile = isRoleIncluded(
    [USER_ROLES.COACH, USER_ROLES.CANDIDATE, USER_ROLES.CANDIDATE_EXTERNAL],
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
