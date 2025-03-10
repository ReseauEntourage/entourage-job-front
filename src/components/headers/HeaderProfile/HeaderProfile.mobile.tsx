import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonIcon,
  ImgProfile,
  Section,
  Tag,
  Text,
} from 'src/components/utils';
import { AvailabilityTag } from 'src/components/utils/AvailabilityTag';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { ImageInput } from 'src/components/utils/Inputs';
import { Spinner } from 'src/components/utils/Spinner';
import { UserActions } from 'src/components/utils/UserActions/UserActions';
import { Department } from 'src/constants/departements';
import { COLORS } from 'src/constants/styles';
import { USER_ROLES, UserRole } from 'src/constants/users';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import {
  StyledEditPictureIconContainer,
  StyledHeaderAvailibilityAndUserActions,
  StyledHeaderNameAndRole,
  StyledHeaderProfile,
  StyledHeaderProfileContent,
  StyledHeaderProfileInfoContainer,
  StyledHeaderProfileNameContainer,
  StyledHeaderProfilePicture,
  StyledHeaderProfilePictureContainer,
  StyledHeaderProfilePublicInfoContainer,
  StyledHeaderProfileSectionMobile,
} from './HeaderProfile.styles';
import { ProfileCompletion } from './ProfileCompletion/ProfileCompletion';
import { ProfileContactInfos } from './ProfileContactInfos/ProfileContactInfos';
import { ProfileDescription } from './ProfileDescription';
import { useHeaderProfile } from './useHeaderProfile';

const PROFILE_PICTURE_SIZE = 64;

export interface HeaderProfileProps {
  isEditable?: boolean;
  id: string;
  isAvailable: boolean;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: Department;
  description?: string;

  // Only for own profile
  phone?: string;
  email?: string;
}

export const HeaderProfileMobile = ({
  id,
  isAvailable,
  firstName,
  lastName,
  role,
  department,
  description,
  phone,
  email,
  isEditable = false,
}: HeaderProfileProps) => {
  const {
    imageUploading,
    uploadProfileImage,
    shouldShowAllProfile,
    contextualRole,
  } = useHeaderProfile(role);
  const router = useRouter();
  const currentUserId = useSelector(selectCurrentUserId);
  const ownProfile = currentUserId === id;
  const displayMessageButton =
    shouldShowAllProfile && isAvailable && !ownProfile;

  const openConversation = () => {
    router.push(`/backoffice/messaging?userId=${id}`);
  };

  return (
    <StyledHeaderProfile>
      <Section>
        <StyledHeaderProfileSectionMobile>
          <StyledHeaderProfileContent>
            <StyledHeaderProfilePictureContainer>
              <StyledHeaderProfilePicture size={PROFILE_PICTURE_SIZE}>
                {imageUploading ? (
                  <Spinner color={COLORS.white} />
                ) : (
                  <ImgProfile
                    user={{ id, role, firstName }}
                    size={PROFILE_PICTURE_SIZE}
                  />
                )}
              </StyledHeaderProfilePicture>
              {isEditable && (
                <StyledEditPictureIconContainer>
                  <ImageInput
                    onChange={uploadProfileImage}
                    id="profile-picture-upload-mobile"
                    name="profile-picture-upload-mobile"
                  >
                    <ButtonIcon icon={<LucidIcon name="Pencil" size={14} />} />
                  </ImageInput>
                </StyledEditPictureIconContainer>
              )}
            </StyledHeaderProfilePictureContainer>
            <StyledHeaderProfileInfoContainer>
              <StyledHeaderProfilePublicInfoContainer>
                <StyledHeaderProfileNameContainer>
                  <StyledHeaderNameAndRole>
                    <Text size={20} weight="semibold">
                      {firstName} {lastName}
                    </Text>
                    <Tag
                      content={
                        role === USER_ROLES.ADMIN
                          ? USER_ROLES.ADMIN
                          : contextualRole
                      }
                      size="small"
                      style="secondary"
                    />
                  </StyledHeaderNameAndRole>
                </StyledHeaderProfileNameContainer>
                {shouldShowAllProfile && (
                  <>
                    {department && (
                      <Text color="black" weight="medium" size="large">
                        {department}
                      </Text>
                    )}
                  </>
                )}
                {displayMessageButton && (
                  <div>
                    <Button
                      onClick={openConversation}
                      style="custom-primary-inverted"
                    >
                      Envoyer un message
                    </Button>
                  </div>
                )}
              </StyledHeaderProfilePublicInfoContainer>
            </StyledHeaderProfileInfoContainer>
          </StyledHeaderProfileContent>

          <StyledHeaderAvailibilityAndUserActions>
            {shouldShowAllProfile && (
              <AvailabilityTag isAvailable={isAvailable} />
            )}
            <UserActions userId={id} openDirection="right" />
          </StyledHeaderAvailibilityAndUserActions>

          {shouldShowAllProfile && description && (
            <ProfileDescription description={description} />
          )}

          {ownProfile && isEditable && (
            <>
              <ProfileContactInfos phone={phone} email={email} />
              <ProfileCompletion completionRate={0.8} />
            </>
          )}
        </StyledHeaderProfileSectionMobile>
      </Section>
    </StyledHeaderProfile>
  );
};
