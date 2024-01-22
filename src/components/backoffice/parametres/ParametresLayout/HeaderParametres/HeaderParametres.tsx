import React, { useState } from 'react';
import EditIcon from 'assets/icons/editIcon.svg';
import { useOpenCorrespondingModal } from '../UserInformationCard/useOpenModal';
import {
  StyledHeaderProfile,
  StyledHeaderProfileContent,
  StyledMobileHeaderProfileTitlesContainer,
  StyledHeaderProfilePicture,
  StyledHeaderProfilePictureContainer,
  StyledHeaderProfileTextContainer,
} from '../../../Backoffice.styles';
import { Api } from 'src/api';
import {
  ButtonIcon,
  ButtonMock,
  ImgProfile,
  Section,
} from 'src/components/utils';
import { H1, H2, H5, H6 } from 'src/components/utils/Headings';
import { ImageInput } from 'src/components/utils/Inputs';
import { Spinner } from 'src/components/utils/Spinner';
import { COLORS } from 'src/constants/styles';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledEditPictureIconContainer } from './HeaderParametres.styles';
import { isRoleIncluded } from 'src/utils';
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
              <H1
                title={
                  <>
                    {user.firstName} {user.lastName}
                  </>
                }
                color="black"
              />
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
              <H2
                title={
                  <>
                    {user.firstName} {user.lastName}
                  </>
                }
                color="black"
              />
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
        {!isDesktop && shouldShowAllProfile && <ParametresDescription />}
      </Section>
    </StyledHeaderProfile>
  );
};
