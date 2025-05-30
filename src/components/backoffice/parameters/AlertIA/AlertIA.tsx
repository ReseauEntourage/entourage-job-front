import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { openModal } from 'src/components/modals/Modal';
import { Alert, Button, Text } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { useIsDesktop } from 'src/hooks/utils';
import {
  currentUserActions,
  uploadExternalCvSelectors,
} from 'src/use-cases/current-user';
import {
  StyledAlertIAContentContainer,
  StyledAlertIAContentLeft,
} from './AlertIA.styles';
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
    if (user.userProfile.hasExtractedCvData) {
      return null;
    }
    return (
      <Alert
        variant="darkBlue"
        icon={<LucidIcon name="WandSparkles" size={20} color="white" />}
      >
        <StyledAlertIAContentContainer>
          <StyledAlertIAContentLeft>
            <Text color="white">
              Votre CV a été téléchargé, mais vous n&apos;avez pas généré votre
              profil.
            </Text>
          </StyledAlertIAContentLeft>
          <Button
            variant="secondary"
            size="small"
            rounded
            onClick={handleGenerateProfile}
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
      icon={<LucidIcon name="WandSparkles" size={20} color="white" />}
    >
      <StyledAlertIAContentContainer>
        <StyledAlertIAContentLeft>
          <Text color="white">
            Pour activer la fonctionnalité IA, vous devez télécharger votre CV
          </Text>
        </StyledAlertIAContentLeft>
        <Button
          variant="secondary"
          size="small"
          rounded
          onClick={handleUploadCv}
          disabled={isCvLoading}
        >
          {isDesktop ? 'Télécharger mon CV' : 'Télécharger'}
        </Button>
      </StyledAlertIAContentContainer>
    </Alert>
  );
};
