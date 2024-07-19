import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import { Close, IlluCV } from 'assets/icons/icons';
import QuestionIcon from 'assets/icons/question.svg';
import { Button } from 'src/components/utils/Button';
import { ButtonIcon } from 'src/components/utils/ButtonIcon';
import { Card } from 'src/components/utils/Cards/Card';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserExternalCv } from 'src/hooks/useCurrentUserExternalCv';
import { currentUserActions } from 'src/use-cases/current-user';
import {
  StyledCvCardContentContainer,
  StyledCvUploadInfos,
  StyledCvUploadInfosText,
  StyledDeleteIconContainer,
  StyledFilename,
} from './ExternalCVCard.styles';

interface ContentProps {
  dataTestId?: string;
}

const tooltipId = 'external-cv-tooltip';

const Content = ({ dataTestId }: ContentProps) => {
  const user = useAuthenticatedUser();
  const externalCv = useCurrentUserExternalCv();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.userProfile.hasExternalCv) {
      dispatch(currentUserActions.getExternalCvRequested());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userProfile.hasExternalCv]);

  const removeCallback = () => {
    dispatch(currentUserActions.deleteExternalCvRequested());
  };

  const openExternalCV = () => {
    if (externalCv === null) return;
    window.open(externalCv, '_blank');
  };

  if (user.userProfile.hasExternalCv) {
    return (
      <>
        <StyledFilename onClick={openExternalCV}>Votre CV</StyledFilename>
        <StyledDeleteIconContainer onClick={removeCallback}>
          <ButtonIcon
            icon={<Close width={10} height={10} />}
            dataTestId={`${dataTestId}-button-edit`}
          />
        </StyledDeleteIconContainer>
      </>
    );
  }
  return (
    <StyledCvUploadInfosText>
      Vous n&apos;avez pas encore de CV Entourage Pro. Téléchargez votre propre
      CV.
    </StyledCvUploadInfosText>
  );
};

export interface ExternalCvCardProps {
  dataTestId?: string;
}
export const ExternalCVCard = ({ dataTestId }: ExternalCvCardProps) => {
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();

  const openFileExplorer = () => {
    const input = document.getElementById('external-cv-upload-input');
    if (input) {
      input.click();
    }
  };

  const uploadCV = () => {
    const input = document.getElementById(
      'external-cv-upload-input'
    ) as HTMLInputElement;
    if (input.files) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);
      dispatch(currentUserActions.uploadExternalCvRequested(formData));
    }
  };

  return (
    <Card
      title="Télécharger mon CV"
      editIcon={
        <>
          <QuestionIcon
            data-tooltip-id={tooltipId}
            data-tooltip-html="Votre CV sera consultable par tous les membres du réseau.<br>Il ne sera pas publié dans la galerie de CVs publique"
            data-tooltip-place="left"
          />
          <Tooltip id={tooltipId} style={{ zIndex: 99 }} />
        </>
      }
      editCallback={() => {}}
    >
      <StyledCvCardContentContainer>
        <StyledCvUploadInfos>
          <IlluCV width={70} height={70} />
          <Content dataTestId={dataTestId} />
        </StyledCvUploadInfos>
        {!user.userProfile.hasExternalCv && (
          <>
            <Button onClick={openFileExplorer}>Télécharger</Button>
            <input
              type="file"
              id="external-cv-upload-input"
              hidden
              onChange={uploadCV}
              accept=".pdf"
            />
          </>
        )}
      </StyledCvCardContentContainer>
    </Card>
  );
};
