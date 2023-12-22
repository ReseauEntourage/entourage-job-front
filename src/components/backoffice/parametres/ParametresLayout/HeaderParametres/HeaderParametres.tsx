import React, { useState } from 'react';
import EditIcon from 'assets/icons/editIcon.svg';
import { Api } from 'src/api';
import { ButtonIcon, ImgProfile, Section } from 'src/components/utils';
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
            <StyledEditPictureIconContainer isMobile={!isDesktop}>
              <ImageInput
                onChange={async ({ profileImage }) => {
                  setImageUploading(true);
                  const formData = new FormData();
                  formData.append('profileImage', profileImage);

                  await Api.postProfileImage(user.id, formData);
                  setImageUploading(false);
                }}
                id="profile-picture-upload"
                name="profile-picture-upload"
              >
                {/* TODO Fix, the file wrapper doesn't work with buttons */}
                <ButtonIcon icon={<EditIcon />} />
              </ImageInput>
            </StyledEditPictureIconContainer>
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
              {user.zone && (
                <H5
                  title={
                    user.zone?.charAt(0) + user.zone?.slice(1).toLowerCase()
                  }
                  color="black"
                />
              )}
              {/* <p>to be done</p> */}
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
      </Section>
    </StyledHeaderParametres>
  );
};
