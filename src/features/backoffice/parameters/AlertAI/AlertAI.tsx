import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Text } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import {
  currentUserActions,
  uploadExternalCvSelectors,
} from 'src/use-cases/current-user';
import {
  StyledAlertIAColumn,
  StyledAlertIAContentContainer,
  StyledAlertIAContentLeft,
} from './AlertAI.styles';
import { GenerateProfileConfirmModal } from './GenerateProfileConfirmModal';

// Si le user n'a pas encore téléchargé son CV, on lui propose de le faire
// Si le user a déjà téléchargé son CV, mais n'a pas de generated CV, on lui propose de le générer
// Sinon on affiche rien

export const AlertIA = () => {
  const isDesktop = useIsDesktop();
  const user = useAuthenticatedUser();
  const dispatch = useDispatch();

  // Accès à l'état de l'upload du CV externe
  const isCvLoading = useSelector(
    uploadExternalCvSelectors.selectIsUploadExternalCvRequested
  );

  const handleGenerateProfile = () => {
    openModal(<GenerateProfileConfirmModal />);
  };

  const handleUploadCv = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.style.display = 'none';

    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        if (file.type !== 'application/pdf') {
          return;
        }
        const formData = new FormData();
        formData.append('file', file);

        dispatch(currentUserActions.uploadExternalCvRequested(formData));
      }
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  if (user.userProfile.hasExternalCv) {
    if (user.hasExtractedCvData) {
      return null;
    }
    return (
      <Alert
        variant="darkBlue"
        icon={<LucidIcon name="WandSparkles" color="white" />}
        clickable
        onClick={handleGenerateProfile}
      >
        <StyledAlertIAContentContainer>
          <StyledAlertIAContentLeft>
            <StyledAlertIAColumn>
              <Text color="white" weight="bold">
                Nouvelle fonctionnalité IA
              </Text>
              <Text color="white">
                Cliquez sur le bouton “Générer mon profil” pour remplir
                automatiquement votre profil
              </Text>
            </StyledAlertIAColumn>
          </StyledAlertIAContentLeft>
          <Button
            variant="secondary"
            size="small"
            rounded
            onClick={(e) => {
              e.stopPropagation();
              handleGenerateProfile();
            }}
          >
            {isDesktop ? 'Générer mon profil' : 'Générer'}
          </Button>
        </StyledAlertIAContentContainer>
      </Alert>
    );
  }

  return (
    <Alert
      variant="darkBlue"
      icon={<LucidIcon name="WandSparkles" size={32} color="white" />}
      clickable
      onClick={handleUploadCv}
    >
      <StyledAlertIAContentContainer>
        <StyledAlertIAContentLeft>
          <StyledAlertIAColumn>
            <Text color="white" weight="bold">
              Nouvelle fonctionnalité IA
            </Text>
            <Text color="white">
              Téléchargez votre CV pour remplir votre profil automatiquement
            </Text>
          </StyledAlertIAColumn>
        </StyledAlertIAContentLeft>
        <Button
          variant="secondary"
          size="small"
          rounded
          onClick={(e) => {
            e.stopPropagation();
            handleUploadCv();
          }}
          disabled={isCvLoading}
        >
          {isDesktop ? 'Télécharger mon CV' : 'Télécharger'}
        </Button>
      </StyledAlertIAContentContainer>
    </Alert>
  );
};
