import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Close } from 'assets/icons/icons';
import { ButtonIcon } from 'src/components/utils';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserExternalCv } from 'src/hooks/useCurrentUserExternalCv';
import { currentUserActions } from 'src/use-cases/current-user';
import {
  StyledCvUploadInfosText,
  StyledDeleteIconContainer,
  StyledFilename,
} from './ExternalCVCard.styles';

interface ContentProps {
  dataTestId?: string;
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
