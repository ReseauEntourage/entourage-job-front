import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyledProfileForm,
  StyledProfileFormImageInputsContainer,
  StyledProfileFormTextAreaContainer,
  StyledProfileFormImageContainer,
} from '../../Onboarding.styles';
import { FlattenedOnboardingFormData } from '../../Onboarding.types';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { ButtonMock, ImgProfile } from 'src/components/utils';
import { ImageInput } from 'src/components/utils/Inputs';
import { Spinner } from 'src/components/utils/Spinner';
import { ReduxRequestEvents } from 'src/constants';
import { COLORS } from 'src/constants/styles';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  currentUserActions,
  updateUserProfilePictureSelectors,
} from 'src/use-cases/current-user';
import { formOnboardingCandidateProfile } from './schemas/formOnboardingCandidateProfile';
import { formOnboardingCoachProfile } from './schemas/formOnboardingCoachProfile';

interface OnboardingProfileFormProps {
  onSubmit: (values: Partial<FlattenedOnboardingFormData>) => void;
  onBeforeStep: () => void;
}

const SIZE = 146;

export const OnboardingProfileForm = ({
  onSubmit,
  onBeforeStep,
}: OnboardingProfileFormProps) => {
  const user = useAuthenticatedUser();
  const dispatch = useDispatch();
  const { userProfile, id, role, firstName } = user;
  const { contextualRole } = useContextualRole(role);
  const [imageUploading, setImageUploading] = useState(false);
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
    <StyledProfileForm>
      <StyledProfileFormImageInputsContainer>
        <StyledProfileFormImageContainer size={SIZE}>
          {imageUploading ? (
            <Spinner color={COLORS.white} />
          ) : (
            <ImgProfile user={{ id, role, firstName }} size={SIZE} />
          )}
        </StyledProfileFormImageContainer>
        <ImageInput
          onChange={uploadProfileImage}
          id="profile-picture-upload-desktop-onboarding"
          name="profile-picture-upload-desktop"
        >
          <ButtonMock
            style="custom-secondary"
            size="small"
            className="button-mock-image-input"
            dataTestId="button-mock-image-input"
          >
            Modifier la photo de profil
          </ButtonMock>
        </ImageInput>
      </StyledProfileFormImageInputsContainer>
      <StyledProfileFormTextAreaContainer>
        <FormWithValidation
          formSchema={
            contextualRole === USER_ROLES.CANDIDATE
              ? formOnboardingCandidateProfile
              : formOnboardingCoachProfile
          }
          onSubmit={onSubmit}
          submitText="Finalisez"
          cancelText="Précédent"
          onCancel={onBeforeStep}
          defaultValues={{ description: userProfile.description }}
        />
      </StyledProfileFormTextAreaContainer>
    </StyledProfileForm>
  );
};
