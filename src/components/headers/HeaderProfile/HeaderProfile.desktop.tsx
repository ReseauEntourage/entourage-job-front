import React from 'react';
import {
  Button,
  ButtonMock,
  ImgProfile,
  Section,
  Tag,
} from 'src/components/utils';
import { AvailabilityTag } from 'src/components/utils/AvailabilityTag/AvailabilityTag';
import { H1, H5 } from 'src/components/utils/Headings';
import { ImageInput } from 'src/components/utils/Inputs';
import { Spinner } from 'src/components/utils/Spinner';
import { COLORS } from 'src/constants/styles';
import { USER_ROLES } from 'src/constants/users';
import {
  StyledHeaderNameAndRole,
  StyledHeaderProfile,
  StyledHeaderProfileContent,
  StyledHeaderProfileCVButton,
  StyledHeaderProfileInfoContainer,
  StyledHeaderProfileNameContainer,
  StyledHeaderProfilePicture,
  StyledHeaderProfilePictureContainer,
  StyledProfilePlaceholder,
} from './HeaderProfile.styles';
import { HeaderProfileProps } from './HeaderProfile.types';
import { ProfileDescription } from './ProfileDescription';
import { useHeaderProfile } from './useHeaderProfile';

const SIZE = 146;
export const HeaderProfileDesktop = ({
  id,
  firstName,
  lastName,
  role,
  department,
  description,
  isAvailable,
  isEditable = false,
  cvUrl,
}: HeaderProfileProps) => {
  const {
    openCorrespondingModal,
    imageUploading,
    uploadProfileImage,
    shouldShowAllProfile,
    contextualRole,
  } = useHeaderProfile(id, role);

  return (
    <StyledHeaderProfile>
      <Section>
        <StyledHeaderProfileContent>
          <StyledHeaderProfilePictureContainer>
            <StyledHeaderProfilePicture size={SIZE}>
              {imageUploading ? (
                <Spinner color={COLORS.white} />
              ) : (
                <ImgProfile user={{ id, role, firstName }} size={SIZE} />
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
            {cvUrl && (
              <StyledHeaderProfileCVButton>
                <Button
                  size="small"
                  style="custom-secondary"
                  href={`/cv/${cvUrl}`}
                >
                  Voir le CV
                </Button>
              </StyledHeaderProfileCVButton>
            )}
          </StyledHeaderProfilePictureContainer>
          <StyledHeaderProfileInfoContainer>
            <StyledHeaderProfileNameContainer>
              <StyledHeaderNameAndRole>
                <H1
                  title={
                    <>
                      {firstName} {lastName}
                    </>
                  }
                  color="black"
                />
                <Tag
                  content={
                    role === USER_ROLES.ADMIN
                      ? USER_ROLES.ADMIN
                      : contextualRole
                  }
                  style="secondary"
                />
              </StyledHeaderNameAndRole>
              {shouldShowAllProfile && (
                <AvailabilityTag isAvailable={isAvailable} />
              )}
            </StyledHeaderProfileNameContainer>
            {shouldShowAllProfile && (
              <>
                {department && <H5 title={department} color="black" />}
                {!department && isEditable && (
                  <StyledProfilePlaceholder onClick={openCorrespondingModal}>
                    Ajouter votre département
                  </StyledProfilePlaceholder>
                )}
                <ProfileDescription
                  description={description}
                  isEditable={isEditable}
                />
              </>
            )}
          </StyledHeaderProfileInfoContainer>
        </StyledHeaderProfileContent>
      </Section>
    </StyledHeaderProfile>
  );
};
