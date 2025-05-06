import { useOpenCorrespondingModal } from 'src/components/backoffice/parametres/ParametresLayout/UserInformationCard/useOpenModal';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { isRoleIncluded } from 'src/utils';
import { useUploadProfileImage } from './useUploadProfileImage';

export function useHeaderProfile(role: UserRoles) {
  const user = useAuthenticatedUser();
  const { openCorrespondingModal } = useOpenCorrespondingModal(user);

  const { imageUploading, uploadProfileImage } = useUploadProfileImage();

  const shouldShowAllProfile = isRoleIncluded(
    [UserRoles.CANDIDATE, UserRoles.COACH],
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
