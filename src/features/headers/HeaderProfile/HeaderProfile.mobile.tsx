import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonIcon,
  ImgUserProfile,
  Section,
  Tag,
  TagSize,
  TagVariant,
  Text,
} from '@/src/components/ui';
import { AvailabilityTag } from '@/src/components/ui/AvailabilityTag';
import { BackLink } from '@/src/components/ui/BackLink';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { ImageInput } from '@/src/components/ui/Inputs';
import { Spinner } from '@/src/components/ui/Spinner';
import { UserActions } from '@/src/components/ui/UserActions/UserActions';
import { useFileActivator } from '@/src/hooks/useFileActivator';
import { ProfileAchievementHighlighter } from '../../profile/ProfileAchievementHighlighter';
import { ProfileStats } from '../../profile/ProfilePartCards/ProfileStats/ProfileStats';
import { COLORS } from 'src/constants/styles';
import { UserRoles } from 'src/constants/users';
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
import { HeaderProfileProps } from './HeaderProfile.types';
import { ProfileCompletion } from './ProfileCompletion/ProfileCompletion';
import { ProfileContactInfos } from './ProfileContactInfos/ProfileContactInfos';
import { ProfileIntroduction } from './ProfileIntroduction';
import { useHeaderProfile } from './useHeaderProfile';

const PROFILE_PICTURE_SIZE = 64;

export const HeaderProfileMobile = ({
  id,
  isAvailable,
  firstName,
  lastName,
  role,
  gender,
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
  achievements,
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
  const ownProfile = currentUserId === id;
  const displayMessageButton =
    shouldShowAllProfile && isAvailable && !ownProfile;

  const openConversation = () => {
    router.push(`/backoffice/messaging?userId=${id}`);
  };

  return (
    <StyledHeaderProfile>
      <Section>
        <BackLink label="Retour" />
        <StyledHeaderProfileSectionMobile>
          <StyledHeaderProfileContent>
            <StyledHeaderProfilePictureContainer>
              <StyledHeaderProfilePicture size={PROFILE_PICTURE_SIZE}>
                {imageUploading ? (
                  <Spinner color={COLORS.white} />
                ) : (
                  <ImgUserProfile
                    user={{ id, role, firstName }}
                    size={PROFILE_PICTURE_SIZE}
                    hasPicture={hasPicture}
                  />
                )}
              </StyledHeaderProfilePicture>
              {isEditable && (
                <StyledEditPictureIconContainer>
                  <ImageInput
                    onChange={uploadProfileImage}
                    id="profile-picture-upload-mobile"
                    name="profile-picture-upload-mobile"
                    inputRef={setFileInputRef}
                  >
                    <ButtonIcon
                      icon={<LucidIcon name="Pencil" size={14} />}
                      onClick={requestFileUploadClick}
                    />
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
              </StyledHeaderProfilePublicInfoContainer>
            </StyledHeaderProfileInfoContainer>
            {displayMessageButton && (
              <Button
                onClick={openConversation}
                variant="secondary"
                rounded="circle"
                size="xlarge"
              >
                <LucidIcon name="MessageCircle" size={24} />
              </Button>
            )}
          </StyledHeaderProfileContent>

          <StyledHeaderAvailibilityAndUserActions>
            <Tag size={TagSize.Small} variant={TagVariant.Secondary}>
              {role === UserRoles.ADMIN ? UserRoles.ADMIN : contextualRole}
            </Tag>
            {achievements.length > 0 && (
              <ProfileAchievementHighlighter
                achievement={achievements[0]}
                gender={gender}
              />
            )}
            {shouldShowAllProfile && (
              <AvailabilityTag isAvailable={isAvailable} />
            )}
            <UserActions userId={id} userRole={role} openDirection="right" />
          </StyledHeaderAvailibilityAndUserActions>

          {shouldShowAllProfile && introduction && (
            <ProfileIntroduction introduction={introduction} />
          )}

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

          {ownProfile && isEditable && (
            <>
              <ProfileContactInfos
                phone={phone}
                email={email}
                driverLicenses={driverLicenses}
              />
              <ProfileCompletion />
            </>
          )}
        </StyledHeaderProfileSectionMobile>
      </Section>
    </StyledHeaderProfile>
  );
};
