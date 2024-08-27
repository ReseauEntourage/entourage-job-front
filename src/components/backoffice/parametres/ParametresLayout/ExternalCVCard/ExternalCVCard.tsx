import React from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import QuestionIcon from 'assets/icons/question.svg';
import { Button } from 'src/components/utils/Button';
import { Card } from 'src/components/utils/Cards/Card';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { currentUserActions } from 'src/use-cases/current-user';
import { Content } from './Content';
import {
  StyledCvCardContentContainer,
  StyledCvUploadInfos,
} from './ExternalCVCard.styles';

const tooltipId = 'external-cv-tooltip';

export interface ExternalCvCardProps {
  dataTestId: string;
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
