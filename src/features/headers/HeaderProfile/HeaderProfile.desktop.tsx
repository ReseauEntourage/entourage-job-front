import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  ImgUserProfile,
  Section,
  Tag,
  TagSize,
  TagVariant,
  Text,
} from '@/src/components/ui';
import { AvailabilityTag } from '@/src/components/ui/AvailabilityTag';
import { BackLink } from '@/src/components/ui/BackLink';
import { ImageInput } from '@/src/components/ui/Inputs';
import { Spinner } from '@/src/components/ui/Spinner';
import { UserActions } from '@/src/components/ui/UserActions/UserActions';
import { useFileActivator } from '@/src/hooks/useFileActivator';
import { ProfileStats } from '../../profile/ProfilePartCards/ProfileStats/ProfileStats';
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
  StyledHeaderProfileSubinfoContainer,
} from './HeaderProfile.styles';
import { HeaderProfileProps } from './HeaderProfile.types';
import { ProfileCompletion } from './ProfileCompletion/ProfileCompletion';
import { ProfileContactInfos } from './ProfileContactInfos/ProfileContactInfos';
import { ProfileIntroduction } from './ProfileIntroduction';
import { useHeaderProfile } from './useHeaderProfile';

const PROFILE_PICTURE_SIZE = 160;

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
  hasPicture,
  isEditable = false,
  createdAt,
  averageDelayResponse,
  responseRate,
  totalConversationWithMirrorRoleCount,
  lastConnection,
}: HeaderProfileProps) => {
  const {
    imageUploading,
    uploadProfileImage,
    shouldShowAllProfile,
    contextualRole,
  } = useHeaderProfile(role);
  const { setFileInputRef, requestFileUploadClick } = useFileActivator();

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
        <BackLink label="Retour" />
        <StyledHeaderProfileContent>
          <StyledHeaderProfilePictureContainer>
            <StyledHeaderProfilePicture size={PROFILE_PICTURE_SIZE}>
              {imageUploading ? (
                <Spinner color={COLORS.white} />
              ) : (
                <ImgUserProfile
                  user={{
                    id,
                    firstName,
                    role,
                  }}
                  size={PROFILE_PICTURE_SIZE}
                  hasPicture={hasPicture}
                  highlight
                />
              )}
            </StyledHeaderProfilePicture>
            {isEditable && (
              <ImageInput
                onChange={uploadProfileImage}
                id="profile-picture-upload-desktop"
                name="profile-picture-upload-desktop"
                inputRef={setFileInputRef}
              >
                <Button
                  variant="secondary"
                  rounded
                  className="button-mock-image-input"
                  size="small"
                  dataTestId="button-mock-image-input"
                  onClick={requestFileUploadClick}
                >
                  Modifier
                </Button>
              </ImageInput>
            )}
          </StyledHeaderProfilePictureContainer>
          <StyledHeaderProfileInfoContainer>
            <StyledHeaderProfilePublicInfoContainer>
              <div>
                <StyledHeaderProfileNameContainer>
                  <StyledHeaderNameAndRole>
                    <Text size={36} weight="semibold">
                      {firstName} {lastName}
                    </Text>
                    <Tag size={TagSize.Small} variant={TagVariant.Secondary}>
                      {role === UserRoles.ADMIN
                        ? UserRoles.ADMIN
                        : contextualRole}
                    </Tag>
                  </StyledHeaderNameAndRole>
                  <StyledHeaderAvailibilityAndUserActions>
                    {shouldShowAllProfile && (
                      <AvailabilityTag isAvailable={isAvailable} />
                    )}
                    <UserActions userId={id} userRole={role} />
                  </StyledHeaderAvailibilityAndUserActions>
                </StyledHeaderProfileNameContainer>
                {shouldShowAllProfile && (
                  <StyledHeaderProfileSubinfoContainer>
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
                    {!isEditable && (
                      <ProfileStats
                        createdAt={createdAt}
                        userRole={role}
                        averageDelayResponse={averageDelayResponse || null}
                        responseRate={responseRate || null}
                        totalConversationWithMirrorRoleCount={
                          totalConversationWithMirrorRoleCount || null
                        }
                        lastConnection={lastConnection}
                        isOwnProfile={ownProfile}
                      />
                    )}
                    {ownProfile && isEditable && <ProfileCompletion />}
                  </StyledHeaderProfileSubinfoContainer>
                )}
              </div>
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
                <ProfileStats
                  createdAt={createdAt}
                  userRole={role}
                  averageDelayResponse={averageDelayResponse || null}
                  responseRate={responseRate || null}
                  totalConversationWithMirrorRoleCount={
                    totalConversationWithMirrorRoleCount || null
                  }
                  lastConnection={lastConnection}
                  isOwnProfile={ownProfile}
                />
                <ProfileContactInfos
                  phone={phone}
                  email={email}
                  driverLicenses={driverLicenses}
                />
              </>
            )}
          </StyledHeaderProfileInfoContainer>
        </StyledHeaderProfileContent>
      </Section>
    </StyledHeaderProfile>
  );
};
