import React, { useState } from 'react';
import EditIcon from 'assets/icons/editIcon.svg';
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
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledEditPictureIconContainer,
  StyledHeaderParametres,
  StyledHeaderParametresContent,
  StyledMobileTitlesContainer,
  StyledProfilePicture,
  StyledProfilePictureContainer,
  StyledTextContainer,
} from './HeaderParametres.styles';
import { ParametresDescription } from './ParametresDescription';

export const HeaderParametres = () => {
  const isDesktop = useIsDesktop();
  const [imageUploading, setImageUploading] = useState(false);
  const size = isDesktop ? 146 : 64;
  const user = useAuthenticatedUser();
  return (
    <StyledHeaderParametres className={`${isDesktop ? '' : 'mobile'}`}>
      <Section>
        <StyledHeaderParametresContent>
          <StyledProfilePictureContainer
            className={`${isDesktop ? '' : 'mobile'}`}
          >
            <StyledProfilePicture
              size={size}
              className={isDesktop ? '' : 'isMobile'}
            >
              {imageUploading ? (
                <Spinner color={COLORS.white} />
              ) : (
                <ImgProfile user={user} size={size} />
              )}
            </StyledProfilePicture>
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
          </StyledProfilePictureContainer>
          {isDesktop ? (
            <StyledTextContainer>
              <H1
                title={
                  <>
                    {user.firstName} {user.lastName}
                  </>
                }
                color="black"
              />
              {user.userProfile.department && (
                <H5 title={user.userProfile.department} color="black" />
              )}
              <ParametresDescription />
            </StyledTextContainer>
          ) : (
            <StyledMobileTitlesContainer>
              <H2
                title={
                  <>
                    {user.firstName} {user.lastName}
                  </>
                }
                color="black"
              />
              {user.zone && (
                <H6
                  title={user.zone.charAt(0) + user.zone.slice(1).toLowerCase()}
                  color="black"
                />
              )}
            </StyledMobileTitlesContainer>
          )}
        </StyledHeaderParametresContent>
        {!isDesktop && <ParametresDescription />}
      </Section>
    </StyledHeaderParametres>
  );
};
