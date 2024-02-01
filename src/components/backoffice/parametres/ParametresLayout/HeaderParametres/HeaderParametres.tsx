import React, { useState } from 'react';
import EditIcon from 'assets/icons/editIcon.svg';
import { useOpenCorrespondingModal } from '../UserInformationCard/useOpenModal';
import { Api } from 'src/api';
import {
  StyledHeaderNameAndRole,
  StyledHeaderProfile,
  StyledHeaderProfileContent,
  StyledHeaderProfileDescription,
  StyledHeaderProfileNameContainer,
  StyledHeaderProfilePicture,
  StyledHeaderProfilePictureContainer,
  StyledHeaderProfileTextContainer,
  StyledMobileHeaderProfileTitlesContainer,
} from 'src/components/backoffice/Backoffice.styles';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import {
  ButtonIcon,
  ButtonMock,
  ImgProfile,
  Section,
  Tag,
} from 'src/components/utils';
import { AvailabilityTag } from 'src/components/utils/AvailabilityTag/AvailabilityTag';
import { H1, H2, H5, H6 } from 'src/components/utils/Headings';
import { ImageInput } from 'src/components/utils/Inputs';
import { Spinner } from 'src/components/utils/Spinner';
import { COLORS } from 'src/constants/styles';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import { isRoleIncluded } from 'src/utils';
import {
  StyledEditPictureIconContainer,
  StyledParametresPlaceholder,
} from './HeaderParametres.styles';
import { ParametresDescription } from './ParametresDescription';

export const HeaderParametres = () => {
  const isDesktop = useIsDesktop();
  const [imageUploading, setImageUploading] = useState(false);
  const size = isDesktop ? 146 : 64;
  const user = useAuthenticatedUser();

  const { openCorrespondingModal } = useOpenCorrespondingModal(user);

  const shouldShowAllProfile = isRoleIncluded(
    [USER_ROLES.COACH, USER_ROLES.CANDIDATE, USER_ROLES.CANDIDATE_EXTERNAL],
    user.role
  );

  const { contextualRole } = useContextualRole(user.role);

  return (
    <StyledHeaderProfile className={`${isDesktop ? '' : 'mobile'}`}>
      <Section>
        <StyledHeaderProfileContent>
          <StyledHeaderProfilePictureContainer
            className={`${isDesktop ? '' : 'mobile'}`}
          >
            <StyledHeaderProfilePicture
              size={size}
              className={isDesktop ? '' : 'isMobile'}
            >
              {imageUploading ? (
                <Spinner color={COLORS.white} />
              ) : (
                <ImgProfile user={user} size={size} />
              )}
            </StyledHeaderProfilePicture>
            {isDesktop ? (
              <ImageInput
                onChange={async ({ profileImage }) => {
                  setImageUploading(true);
                  const formData = new FormData();
                  formData.append('profileImage', profileImage);

                  await Api.postProfileImage(user.id, formData);
                  setImageUploading(false);
                }}
                id="profile-picture-upload-desktop"
                name="profile-picture-upload-desktop"
              >
                <ButtonMock
                  style="custom-secondary"
                  className="button-mock-image-input"
                  dataTestId="button-mock-image-input"
                >
                  Modifier
                </ButtonMock>
              </ImageInput>
            ) : (
              <StyledEditPictureIconContainer isMobile={!isDesktop}>
                <ImageInput
                  onChange={async ({ profileImage }) => {
                    setImageUploading(true);
                    const formData = new FormData();
                    formData.append('profileImage', profileImage);

                    await Api.postProfileImage(user.id, formData);
                    setImageUploading(false);
                  }}
                  id="profile-picture-upload-mobile"
                  name="profile-picture-upload-mobile"
                >
                  <ButtonIcon icon={<EditIcon />} />
                </ImageInput>
              </StyledEditPictureIconContainer>
            )}
          </StyledHeaderProfilePictureContainer>
          {isDesktop ? (
            <StyledHeaderProfileTextContainer>
              <StyledHeaderProfileNameContainer>
                <StyledHeaderNameAndRole isDesktop={isDesktop}>
                  <H1
                    title={
                      <>
                        {user.firstName} {user.lastName}
                      </>
                    }
                    color="black"
                  />
                  <Tag content={contextualRole} style="secondary" />
                </StyledHeaderNameAndRole>
                {shouldShowAllProfile && (
                  <AvailabilityTag isAvailable={user.userProfile.isAvailable} />
                )}
              </StyledHeaderProfileNameContainer>
              {shouldShowAllProfile && (
                <>
                  {user.userProfile.department ? (
                    <H5 title={user.userProfile.department} color="black" />
                  ) : (
                    <StyledParametresPlaceholder
                      onClick={openCorrespondingModal}
                    >
                      Ajouter votre département
                    </StyledParametresPlaceholder>
                  )}
                  <ParametresDescription />
                </>
              )}
            </StyledHeaderProfileTextContainer>
          ) : (
            <StyledMobileHeaderProfileTitlesContainer>
              <StyledHeaderNameAndRole isDesktop={isDesktop}>
                <H2
                  title={
                    <>
                      {user.firstName} {user.lastName}
                    </>
                  }
                  color="black"
                />
                <Tag content={contextualRole} style="secondary" />
              </StyledHeaderNameAndRole>
              {shouldShowAllProfile && (
                <>
                  {user.userProfile.department ? (
                    <H6 title={user.userProfile.department} color="black" />
                  ) : (
                    <StyledParametresPlaceholder
                      onClick={openCorrespondingModal}
                    >
                      Ajouter votre département
                    </StyledParametresPlaceholder>
                  )}
                </>
              )}
            </StyledMobileHeaderProfileTitlesContainer>
          )}
        </StyledHeaderProfileContent>
        {!isDesktop && shouldShowAllProfile && (
          <StyledHeaderProfileDescription>
            <AvailabilityTag isAvailable={user.userProfile.isAvailable} />
            <ParametresDescription />
          </StyledHeaderProfileDescription>
        )}
      </Section>
    </StyledHeaderProfile>
  );
};
