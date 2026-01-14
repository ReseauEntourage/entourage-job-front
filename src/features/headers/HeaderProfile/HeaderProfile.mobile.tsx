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
import { DepartmentName } from 'src/constants/departements';
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
import { ProfileCompletion } from './ProfileCompletion/ProfileCompletion';
import { ProfileContactInfos } from './ProfileContactInfos/ProfileContactInfos';
import { ProfileIntroduction } from './ProfileIntroduction';
import { useHeaderProfile } from './useHeaderProfile';

const PROFILE_PICTURE_SIZE = 64;

export interface HeaderProfileProps {
  isEditable?: boolean;
  id: string;
  isAvailable: boolean;
  firstName: string;
  lastName: string;
  role: UserRoles;
  department: DepartmentName;
  introduction?: string;

  // Only for own profile
  phone?: string;
  email?: string;
  driverLicenses?: string[];
  hasPicture: boolean;
}

export const HeaderProfileMobile = ({
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
                    <Tag size={TagSize.Small} variant={TagVariant.Secondary}>
                      {role === UserRoles.ADMIN
                        ? UserRoles.ADMIN
                        : contextualRole}
                    </Tag>
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
                      variant="secondary"
                      rounded
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
            <UserActions userId={id} userRole={role} openDirection="right" />
          </StyledHeaderAvailibilityAndUserActions>

          {shouldShowAllProfile && introduction && (
            <ProfileIntroduction introduction={introduction} />
          )}

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
