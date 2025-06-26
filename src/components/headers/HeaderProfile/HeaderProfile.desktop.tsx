import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { BackLink } from '../../utils/BackLink';
import { Button, ImgProfile, Section, Tag, Text } from 'src/components/utils';
import { AvailabilityTag } from 'src/components/utils/AvailabilityTag';
import { ImageInput } from 'src/components/utils/Inputs';
import { Spinner } from 'src/components/utils/Spinner';
import { UserActions } from 'src/components/utils/UserActions/UserActions';
import { Department } from 'src/constants/departements';
import { COLORS } from 'src/constants/styles';
import { UserRoles } from 'src/constants/users';
import {
  selectAuthenticatedUser,
  selectCurrentUserId,
} from 'src/use-cases/current-user';
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
import { ProfileContactInfos } from './ProfileContactInfos/ProfileContactInfos';
import { ProfileIntroduction } from './ProfileIntroduction';
import { useHeaderProfile } from './useHeaderProfile';

const PROFILE_PICTURE_SIZE = 146;

export interface HeaderProfileProps {
  isEditable?: boolean;
  id: string;
  isAvailable: boolean;
  firstName: string;
  lastName: string;
  role: UserRoles;
  department: Department;
  introduction?: string;

  // Only for own profile
  phone?: string;
  email?: string;
  driverLicenses?: string[];
}

export const HeaderProfileDesktop = ({
  id,
  isAvailable,
  firstName,
  lastName,
  role,
  department,
  introduction,
  phone,
  email,
  driverLicenses,
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
  const currentUser = useSelector(selectAuthenticatedUser);
  const ownProfile = currentUserId === id;
  const displayMessageButton =
    shouldShowAllProfile && isAvailable && !ownProfile;
  const { openCorrespondingModal } = useHeaderProfile(currentUser.role);

  const openConversation = () => {
    router.push(`/backoffice/messaging?userId=${id}`);
  };

  return (
    <StyledHeaderProfile>
      <Section className="custom-page">
        <BackLink
          url="/backoffice/dashboard"
          label="Retour à mon espace personnel"
        />
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
                <Button
                  variant="secondary"
                  rounded
                  className="button-mock-image-input"
                  size="small"
                  dataTestId="button-mock-image-input"
                >
                  Modifier
                </Button>
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
                      role === UserRoles.ADMIN
                        ? UserRoles.ADMIN
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
                  <UserActions userId={id} userRole={role} />
                </StyledHeaderAvailibilityAndUserActions>
              </StyledHeaderProfileNameContainer>
              {shouldShowAllProfile && (
                <>
                  {department && (
                    <Text color="black" weight="medium" size="large">
                      {department}
                    </Text>
                  )}
                  {introduction && (
                    <>
                      <ProfileIntroduction introduction={introduction} />
                      {isEditable && (
                        <Text
                          color="mediumGray"
                          size="small"
                          underline
                          onClick={() => openCorrespondingModal()}
                        >
                          Modifier l&apos;introduction
                        </Text>
                      )}
                    </>
                  )}
                </>
              )}
              {displayMessageButton && (
                <div>
                  <Button
                    onClick={openConversation}
                    variant="secondary"
                    rounded
                  >
                    Envoyer un message
                  </Button>
                </div>
              )}
            </StyledHeaderProfilePublicInfoContainer>
            {ownProfile && isEditable && (
              <>
                <ProfileContactInfos
                  phone={phone}
                  email={email}
                  driverLicenses={driverLicenses}
                />
                {/* <ProfileCompletion completionRate={0.8} /> */}
              </>
            )}
          </StyledHeaderProfileInfoContainer>
        </StyledHeaderProfileContent>
      </Section>
    </StyledHeaderProfile>
  );
};
