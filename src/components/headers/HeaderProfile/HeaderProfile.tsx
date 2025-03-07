import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonMock,
  ImgProfile,
  Section,
  Tag,
  Text,
} from 'src/components/utils';
import { AvailabilityTag } from 'src/components/utils/AvailabilityTag';
import { ImageInput } from 'src/components/utils/Inputs';
import { Spinner } from 'src/components/utils/Spinner';
import { UserActions } from 'src/components/utils/UserActions/UserActions';
import { Department } from 'src/constants/departements';
import { COLORS } from 'src/constants/styles';
import { USER_ROLES, UserRole } from 'src/constants/users';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import {
  StyledHeaderAvailibilityAndUserActions,
  StyledHeaderNameAndRole,
  StyledHeaderProfile,
  StyledHeaderProfileContent,
  StyledHeaderProfileInfoContainer,
  StyledHeaderProfileNameContainer,
  StyledHeaderProfilePicture,
  StyledHeaderProfilePictureContainer,
  StyledHeaderProfilePublicInfoContainer,
} from './HeaderProfile.styles';
import { ProfileCompletion } from './ProfileCompletion/ProfileCompletion';
import { ProfileContactInfos } from './ProfileContactInfos/ProfileContactInfos';
import { ProfileDescription } from './ProfileDescription';
import { useHeaderProfile } from './useHeaderProfile';

const PROFILE_PICTURE_SIZE = 146;

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

export const HeaderProfile = ({
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
        <StyledHeaderProfileContent>
          <StyledHeaderProfilePictureContainer>
            <StyledHeaderProfilePicture size={PROFILE_PICTURE_SIZE}>
              {imageUploading ? (
                <Spinner color={COLORS.white} />
              ) : (
                <ImgProfile
                  user={{
                    id,
                    firstName,
                    role,
                  }}
                  size={PROFILE_PICTURE_SIZE}
                  highlight
                />
              )}
            </StyledHeaderProfilePicture>
            {isEditable && (
              <ImageInput
                onChange={uploadProfileImage}
                id="profile-picture-upload-desktop"
                name="profile-picture-upload-desktop"
              >
                <ButtonMock
                  style="custom-secondary"
                  size="small"
                  className="button-mock-image-input"
                  dataTestId="button-mock-image-input"
                >
                  Modifier
                </ButtonMock>
              </ImageInput>
            )}
          </StyledHeaderProfilePictureContainer>
          <StyledHeaderProfileInfoContainer>
            <StyledHeaderProfilePublicInfoContainer>
              <StyledHeaderProfileNameContainer>
                <StyledHeaderNameAndRole>
                  <Text size={36} weight="semibold">
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
                <StyledHeaderAvailibilityAndUserActions>
                  {shouldShowAllProfile && (
                    <AvailabilityTag isAvailable={isAvailable} />
                  )}
                  <UserActions userId={id} />
                </StyledHeaderAvailibilityAndUserActions>
              </StyledHeaderProfileNameContainer>
              {shouldShowAllProfile && (
                <>
                  {department && (
                    <Text color="black" weight="medium" size="large">
                      {department}
                    </Text>
                  )}
                  {description && (
                    <ProfileDescription description={description} />
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
            {ownProfile && isEditable && (
              <>
                <ProfileContactInfos phone={phone} email={email} />
                <ProfileCompletion completionRate={0.8} />
              </>
            )}
          </StyledHeaderProfileInfoContainer>
        </StyledHeaderProfileContent>
      </Section>
    </StyledHeaderProfile>
  );
};
