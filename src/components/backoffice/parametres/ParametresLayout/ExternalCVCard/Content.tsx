import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IlluCV } from 'assets/icons/icons';
import { FilePreviewCV } from 'src/components/utils/Inputs/FileInput/FilePreview';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserExternalCv } from 'src/hooks/useCurrentUserExternalCv';
import { currentUserActions } from 'src/use-cases/current-user';
import { StyledCvUploadInfosText } from './ExternalCVCard.styles';

interface ContentProps {
  dataTestId: string;
}

export const Content = ({ dataTestId }: ContentProps) => {
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
      <FilePreviewCV
        filename="Votre CV"
        onRemoveFile={removeCallback}
        onOpenFile={openExternalCV}
        dataTestId={dataTestId}
      />
    );
  }
  return (
    <>
      <IlluCV width={70} height={70} />
      <StyledCvUploadInfosText>
        Vous n&apos;avez pas encore de CV Entourage Pro. Téléchargez votre
        propre propre CV.
      </StyledCvUploadInfosText>
    </>
  );
};
