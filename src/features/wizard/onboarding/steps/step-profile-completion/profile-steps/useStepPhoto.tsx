import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { User } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { currentUserActions } from '@/src/use-cases/current-user';
import { StyledOnboardingStepContainer } from '../../../onboarding.styles';
import { ProfileLivePreviewPanel } from '../ProfileLivePreview/ProfileLivePreviewPanel';
import { StepPhotoContent } from './StepPhotoContent';

interface UseStepPhotoProps {
  user: User | null;
}

export const useStepPhoto = ({ user }: UseStepPhotoProps) => {
  const dispatch = useDispatch();
  const profileComplete = useCurrentUserProfileComplete();
  const [selectedPhoto, setSelectedPhoto] = useState<Blob | null>(null);
  const [photoObjectUrl, setPhotoObjectUrl] = useState<string | null>(null);

  const handlePhotoSelected = (blob: Blob, objectUrl: string) => {
    setSelectedPhoto(blob);
    setPhotoObjectUrl(objectUrl);
  };

  const isCandidate = user?.role === UserRoles.CANDIDATE;

  const onboardingStepPhoto: WizardStep = {
    summary: {
      title: 'Photo de profil',
      duration: '~1 minute',
    },
    hideGenericStepHeader: undefined,
    title: 'Commençons par une photo de vous',
    smallTitle: 'Photo',
    description: isCandidate
      ? "Une photo aide les coachs à mettre un visage sur votre profil. C'est la première chose qu'ils verront."
      : "Une photo aide les personnes que vous soutenez à mettre un visage sur votre profil. C'est la première chose qu'elles verront.",
    content: (
      <StyledOnboardingStepContainer>
        <StepPhotoContent
          photoObjectUrl={photoObjectUrl}
          onPhotoSelected={handlePhotoSelected}
          existingUser={user}
          hasPicture={profileComplete?.hasPicture ?? false}
        />
      </StyledOnboardingStepContainer>
    ),
    sidePanelContent: () => <ProfileLivePreviewPanel />,
    mobileBottomSheet: false,
    isNextEnabled: true,
    isStepCompleted: async () => true,
    onSubmit: async () => {
      if (selectedPhoto) {
        dispatch(
          currentUserActions.updateUserProfilePictureRequested({
            profileImage: selectedPhoto,
          })
        );
      }
      return true;
    },
    section: 'profil',
  };

  return { onboardingStepPhoto };
};
