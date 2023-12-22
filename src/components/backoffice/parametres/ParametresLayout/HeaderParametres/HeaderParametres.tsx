import React, { useState } from 'react';
import EditIcon from 'assets/icons/editIcon.svg';
import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import { ButtonIcon, ImgProfile, Section } from 'src/components/utils';
import { H1, H2, H5, H6 } from 'src/components/utils/Headings';
import { ImageInput } from 'src/components/utils/Inputs';
import { Spinner } from 'src/components/utils/Spinner';
import { COLORS } from 'src/constants/styles';
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

export const HeaderParametres = ({
  userData,
}: {
  userData: UserWithUserCandidate;
}) => {
  const isDesktop = useIsDesktop();
  const [imageUploading, setImageUploading] = useState(false);
  const size = isDesktop ? 146 : 64;
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
                <ImgProfile user={userData} size={size} />
              )}
            </StyledProfilePicture>
            <StyledEditPictureIconContainer isMobile={!isDesktop}>
              <ImageInput
                onChange={async ({ profileImage }) => {
                  setImageUploading(true);
                  const formData = new FormData();
                  formData.append('profileImage', profileImage);

                  await Api.postProfileImage(userData.id, formData);
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
                    {userData.firstName} {userData.lastName}
                  </>
                }
                color="black"
              />
              {userData.zone && (
                <H5
                  title={
                    userData.zone?.charAt(0) +
                    userData.zone?.slice(1).toLowerCase()
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
                    {userData.firstName} {userData.lastName}
                  </>
                }
                color="black"
              />
              {userData.zone && (
                <H6
                  title={
                    userData.zone.charAt(0) +
                    userData.zone.slice(1).toLowerCase()
                  }
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
