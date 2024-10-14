import { useRouter } from 'next/router';
import React from 'react';
import { Api } from 'src/api';
import {
  Button,
  ButtonMock,
  Dropdown,
  ImgProfile,
  Section,
  Tag,
} from 'src/components/utils';
import { AvailabilityTag } from 'src/components/utils/AvailabilityTag/AvailabilityTag';
import { H1, H5 } from 'src/components/utils/Headings';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { ImageInput } from 'src/components/utils/Inputs';
import { Spinner } from 'src/components/utils/Spinner';
import { UserActions } from 'src/components/utils/UserActions/UserActions';
import { COLORS } from 'src/constants/styles';
import { USER_ROLES } from 'src/constants/users';
import {
  StyledHeaderAvailibilityAndUserActions,
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
  hasExternalCv,
}: HeaderProfileProps) => {
  const {
    openCorrespondingModal,
    imageUploading,
    uploadProfileImage,
    shouldShowAllProfile,
    contextualRole,
  } = useHeaderProfile(role);
  const router = useRouter();

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

  const openConversation = () => {
    router.push(`/backoffice/messaging?userId=${id}`);
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
            {hasCv && (
              <StyledHeaderProfileCVButton>
                <Button
                  id="nav-cv-button"
                  size="small"
                  style="custom-secondary"
                  onClick={!hasTwoCv ? openCv : undefined}
                >
                  Voir le CV {hasTwoCv && <LucidIcon name="ChevronDown" />}
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
              <StyledHeaderAvailibilityAndUserActions>
                {shouldShowAllProfile && (
                  <AvailabilityTag isAvailable={isAvailable} />
                )}
                <UserActions userId={id} />
              </StyledHeaderAvailibilityAndUserActions>
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
            <div>
              <Button
                onClick={openConversation}
                style="custom-primary-inverted"
              >
                Envoyer un message
              </Button>
            </div>
          </StyledHeaderProfileInfoContainer>
        </StyledHeaderProfileContent>
      </Section>
    </StyledHeaderProfile>
  );
};
