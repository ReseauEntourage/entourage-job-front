import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { Api } from 'src/api';
import {
  Button,
  ButtonMock,
  ImgProfile,
  Section,
  Tag,
} from 'src/components/utils';
import { AvailabilityTag } from 'src/components/utils/AvailabilityTag/AvailabilityTag';
import { Dropdown } from 'src/components/utils/Dropdown/Dropdown';
import { DropdownToggle } from 'src/components/utils/Dropdown/DropdownToggle';
import { H1, H5 } from 'src/components/utils/Headings';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { ImageInput } from 'src/components/utils/Inputs';
import { Spinner } from 'src/components/utils/Spinner';
import { UserActions } from 'src/components/utils/UserActions/UserActions';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { UserRoles } from 'src/constants/users';
import { gaEvent } from 'src/lib/gtag';
import { selectCurrentUserId } from 'src/use-cases/current-user';
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
  const currentUserId = useSelector(selectCurrentUserId);

  const hasCv = !!cvUrl || hasExternalCv;
  const hasTwoCv = !!cvUrl && hasExternalCv;
  const ownProfile = currentUserId === id;
  const displayMessageButton =
    shouldShowAllProfile && isAvailable && !ownProfile;

  const openProCv = () => {
    gaEvent(GA_TAGS.BACKOFFICE_MEMBER_PROFILE_VIEWCV_PRO_CLIC);
    window.open(`/cv/${cvUrl}`, '_blank');
  };

  const openExternalCv = () => {
    gaEvent(GA_TAGS.BACKOFFICE_MEMBER_PROFILE_VIEWCV_PERSO_CLIC);
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
                  variant="secondary"
                  rounded
                  className="button-mock-image-input"
                  size="small"
                  dataTestId="button-mock-image-input"
                >
                  Modifier
                </ButtonMock>
              </ImageInput>
            )}
            {hasCv && (
              <StyledHeaderProfileCVButton>
                {!hasTwoCv ? (
                  <Button
                    id="nav-cv-button"
                    size="small"
                    variant="secondary"
                    rounded
                    onClick={openCv}
                  >
                    Voir le CV
                  </Button>
                ) : (
                  <Dropdown>
                    <DropdownToggle>
                      <Button
                        id="nav-cv-button"
                        size="small"
                        variant="secondary"
                        rounded
                      >
                        Voir le CV{' '}
                        {hasTwoCv && <LucidIcon name="ChevronDown" />}
                      </Button>
                    </DropdownToggle>
                    <Dropdown.Menu openDirection="right">
                      <Dropdown.Item onClick={openExternalCv}>
                        Voir le CV personnel
                      </Dropdown.Item>
                      <Dropdown.Item onClick={openProCv}>
                        Voir le CV Entourage Pro
                      </Dropdown.Item>
                    </Dropdown.Menu>
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
                    role === UserRoles.ADMIN ? UserRoles.ADMIN : contextualRole
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
            {displayMessageButton && (
              <div>
                <Button onClick={openConversation} variant="secondary" rounded>
                  Envoyer un message
                </Button>
              </div>
            )}
          </StyledHeaderProfileInfoContainer>
        </StyledHeaderProfileContent>
      </Section>
    </StyledHeaderProfile>
  );
};
