import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Close, IlluCV } from 'assets/icons/icons';
import { Api } from 'src/api';
import { Button } from 'src/components/utils/Button';
import { ButtonIcon } from 'src/components/utils/ButtonIcon';
import { Card } from 'src/components/utils/Cards/Card';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { currentUserActions } from 'src/use-cases/current-user';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  StyledCVCardContentContainer,
  StyledCVUploadInfos,
  StyledCVUploadInfosText,
  StyledDeleteIconContainer,
  StyledFilename,
} from './ExternalCVCard.styles';

interface ContentProps {
  dataTestId?: string;
  externalCv: string | null;
  setExternalCv: (value: string | null) => void;
}

const Content = ({ dataTestId, externalCv, setExternalCv }: ContentProps) => {
  const user = useAuthenticatedUser();
  const dispatch = useDispatch();
  useEffect(() => {
    if (user.userProfile.gotExternalCv) {
      Api.getExternalCv().then((response) => {
        setExternalCv(response.data.url);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userProfile.gotExternalCv]);

  const removeCallback = () => {
    Api.deleteExternalCv().then(() => {
      dispatch(currentUserActions.setGotExternalCv(false));
      setExternalCv(null);
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: `Le CV a bien été supprimé`,
        })
      );
    });
  };

  const openExternalCV = () => {
    if (externalCv === null) return;
    window.open(externalCv, '_blank');
  };

  if (user.userProfile.gotExternalCv) {
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
    <StyledCVUploadInfosText>
      Vous n&apos;avez pas encore de CV Entourage Pro. Téléchargez votre propre
      CV.
    </StyledCVUploadInfosText>
  );
};

export interface ExternalCVCardProps {
  dataTestId?: string;
}
export const ExternalCVCard = ({ dataTestId }: ExternalCVCardProps) => {
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();
  const [externalCv, setExternalCv] = useState<string | null>(null);

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
      Api.postExternalCv(formData)
        .then((response) => {
          setExternalCv(response.data.url);
          dispatch(currentUserActions.setGotExternalCv(true));
          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message: `Le CV a bien été importé`,
            })
          );
        })
        .catch(() => {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message: `Une erreur est survenue lors de l'import du CV. Veuillez réessayer.`,
            })
          );
        });
    }
  };

  return (
    <Card title="Télécharger mon CV" isMobileClosable>
      <StyledCVCardContentContainer>
        <StyledCVUploadInfos>
          <IlluCV width={70} height={70} />
          <Content
            dataTestId={dataTestId}
            externalCv={externalCv}
            setExternalCv={setExternalCv}
          />
        </StyledCVUploadInfos>
        {!user.userProfile.gotExternalCv && (
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
      </StyledCVCardContentContainer>
    </Card>
  );
};
