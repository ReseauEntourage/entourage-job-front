import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFileActivator } from '@/src/hooks/useFileActivator';
import {
  StyledProfileFormImageInputsContainer,
  StyledProfileFormImageContainer,
} from '../../Onboarding.styles';
import { Button, ImgUserProfile } from 'src/components/utils';
import { ImageInput } from 'src/components/utils/Inputs';
import { Spinner } from 'src/components/utils/Spinner';
import { ReduxRequestEvents } from 'src/constants';
import { COLORS } from 'src/constants/styles';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  currentUserActions,
  updateUserProfilePictureSelectors,
} from 'src/use-cases/current-user';

const SIZE = 146;

export const OnboardingProfileForm = () => {
  const user = useAuthenticatedUser();
  const dispatch = useDispatch();
  const { id, role, firstName } = user;
  const [imageUploading, setImageUploading] = useState(false);
  const { setFileInputRef, requestFileUploadClick } = useFileActivator();

  const uploadProfileImage = useCallback(
    async ({ profileImage }: { profileImage: Blob }) => {
      setImageUploading(true);
      dispatch(
        currentUserActions.updateUserProfilePictureRequested({ profileImage })
      );
    },
    [dispatch]
  );

  const updateUserProfilePictureStatus = useSelector(
    updateUserProfilePictureSelectors.selectUpdateUserProfilePictureStatus
  );

  useEffect(() => {
    if (updateUserProfilePictureStatus === ReduxRequestEvents.SUCCEEDED) {
      setImageUploading(false);
    }
  }, [updateUserProfilePictureStatus]);

  return (
    <StyledProfileFormImageInputsContainer>
      <StyledProfileFormImageContainer>
        {imageUploading ? (
          <Spinner color={COLORS.white} />
        ) : (
          <ImgUserProfile
            user={{ id, role, firstName }}
            size={SIZE}
            hasPicture={user.userProfile?.hasPicture || false}
          />
        )}
      </StyledProfileFormImageContainer>
      <ImageInput
        onChange={uploadProfileImage}
        id="profile-picture-upload-desktop-onboarding"
        name="profile-picture-upload-desktop"
        inputRef={setFileInputRef}
      >
        <Button
          variant="secondary"
          rounded
          size="small"
          dataTestId="button-image-input"
          onClick={requestFileUploadClick}
        >
          Modifier la photo de profil
        </Button>
      </ImageInput>
    </StyledProfileFormImageInputsContainer>
  );
};
