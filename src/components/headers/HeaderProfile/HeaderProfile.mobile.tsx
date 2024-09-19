import React from 'react';
import CaretDownIcon from 'assets/icons/caret-down.svg';
import EditIcon from 'assets/icons/editIcon.svg';
import { Api } from 'src/api';
import {
  Button,
  ButtonIcon,
  Dropdown,
  ImgProfile,
  Section,
  Tag,
} from 'src/components/utils';
import { AvailabilityTag } from 'src/components/utils/AvailabilityTag/AvailabilityTag';
import { H2, H6 } from 'src/components/utils/Headings';
import { ImageInput } from 'src/components/utils/Inputs';
import { Spinner } from 'src/components/utils/Spinner';
import { UserActions } from 'src/components/utils/UserActions/UserActions';
import { COLORS } from 'src/constants/styles';
import { USER_ROLES } from 'src/constants/users';
import {
  StyledEditPictureIconContainer,
  StyledHeaderAvailibilityAndUserActions,
  StyledHeaderNameAndRoleMobile,
  StyledHeaderProfile,
  StyledHeaderProfileContent,
  StyledHeaderProfileCVButton,
  StyledHeaderProfileDescription,
  StyledHeaderProfileInfoContainer,
  StyledHeaderProfileNameContainer,
  StyledHeaderProfilePicture,
  StyledHeaderProfilePictureContainerMobile,
  StyledProfilePlaceholder,
} from './HeaderProfile.styles';
import { HeaderProfileProps } from './HeaderProfile.types';
import { ProfileDescription } from './ProfileDescription';
import { useHeaderProfile } from './useHeaderProfile';

const SIZE = 64;
export const HeaderProfileMobile = ({
  id,
  firstName,
  lastName,
  role,
  department,
  description,
  isAvailable,
  isEditable,
  cvUrl,
  hasExternalCv,
}: HeaderProfileProps) => {
  const {
    openCorrespondingModal,
    imageUploading,
    uploadProfileImage,
    shouldShowAllProfile,
    contextualRole,
  } = useHeaderProfile(role);
  const hasCv = !!cvUrl || hasExternalCv;
  const hasTwoCv = !!cvUrl && hasExternalCv;

  const openProCv = () => {
    window.open(`/cv/${cvUrl}`, '_blank');
  };

  const openExternalCv = () => {
    Api.getExternalCvByUser(id).then((response) => {
      const externalCvUrl = response.data;
      window.open(externalCvUrl.url, '_blank');
    });
  };

  const openCv = () => {
    if (hasExternalCv) {
      openExternalCv();
    } else {
      openProCv();
    }
  };

  return (
    <StyledHeaderProfile>
      <Section>
        <StyledHeaderProfileContent>
          <StyledHeaderProfilePictureContainerMobile>
            <StyledHeaderProfilePicture size={SIZE}>
              {imageUploading ? (
                <Spinner color={COLORS.white} />
              ) : (
                <ImgProfile user={{ id, role, firstName }} size={SIZE} />
              )}
            </StyledHeaderProfilePicture>
            {isEditable && (
              <StyledEditPictureIconContainer>
                <ImageInput
                  onChange={uploadProfileImage}
                  id="profile-picture-upload-mobile"
                  name="profile-picture-upload-mobile"
                >
                  <ButtonIcon icon={<EditIcon />} />
                </ImageInput>
              </StyledEditPictureIconContainer>
            )}
          </StyledHeaderProfilePictureContainerMobile>
          <StyledHeaderProfileInfoContainer>
            <StyledHeaderProfileNameContainer>
              <StyledHeaderNameAndRoleMobile>
                <H2
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
              </StyledHeaderNameAndRoleMobile>
            </StyledHeaderProfileNameContainer>
            {shouldShowAllProfile && (
              <>
                {department && <H6 title={department} color="black" />}
                {!department && isEditable && (
                  <StyledProfilePlaceholder onClick={openCorrespondingModal}>
                    Ajouter votre département
                  </StyledProfilePlaceholder>
                )}
              </>
            )}
          </StyledHeaderProfileInfoContainer>
        </StyledHeaderProfileContent>
        {shouldShowAllProfile && (
          <StyledHeaderProfileDescription>
            <StyledHeaderAvailibilityAndUserActions>
              <AvailabilityTag isAvailable={isAvailable} />
              <UserActions userId={id} openDirection="right" />
            </StyledHeaderAvailibilityAndUserActions>
            <ProfileDescription
              description={description}
              isEditable={isEditable}
            />
            {hasCv && (
              <StyledHeaderProfileCVButton>
                <Button
                  id="nav-cv-button"
                  size="small"
                  style="custom-secondary"
                  onClick={!hasTwoCv ? openCv : undefined}
                >
                  Voir le CV {hasTwoCv && <CaretDownIcon />}
                </Button>
                {hasTwoCv && (
                  <Dropdown
                    id="nav-cv-dropdown"
                    boundaryId="nav-cv-button"
                    dividers={[1]}
                  >
                    <a
                      aria-hidden="true"
                      onClick={() => {
                        openExternalCv();
                      }}
                    >
                      Voir le CV personnel
                    </a>
                    <a
                      aria-hidden="true"
                      onClick={() => {
                        openProCv();
                      }}
                    >
                      Voir le CV Entourage Pro
                    </a>
                  </Dropdown>
                )}
              </StyledHeaderProfileCVButton>
            )}
          </StyledHeaderProfileDescription>
        )}
      </Section>
    </StyledHeaderProfile>
  );
};
