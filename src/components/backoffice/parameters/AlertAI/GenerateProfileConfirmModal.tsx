import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Img } from '@/src/components/utils';
import { currentUserActions } from '@/src/use-cases/current-user';
import { generateProfileFromCVSelectors } from '@/src/use-cases/cv';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm/ModalConfirm';
import { slice as cvSlice } from 'src/use-cases/cv/cv.slice';
import { StyledLoadingContainer } from './AlertAI.styles';

export const GenerateProfileConfirmModal = () => {
  const dispatch = useDispatch();
  const { onClose } = useModalContext();

  const isLoading = useSelector(
    generateProfileFromCVSelectors.selectIsGenerateProfileFromCVRequested
  );
  const isSuccess = useSelector(
    generateProfileFromCVSelectors.selectIsGenerateProfileFromCVSucceeded
  );

  useEffect(() => {
    if (isSuccess) {
      dispatch(currentUserActions.fetchUserRequested());
      if (onClose) {
        onClose();
      }
    }
  }, [isSuccess, dispatch, onClose]);

  const handleConfirm = () => {
    dispatch(cvSlice.actions.generateProfileFromCVRequested());
  };

  return (
    <ModalConfirm
      title="Générer mon profil à partir de mon CV"
      text="Vos données du profil vont être écrasées. Voulez-vous continuer ?"
      buttonText="Générer"
      onConfirm={handleConfirm}
      isLoading={isLoading}
      keepOpenOnConfirm
    >
      {isLoading && (
        <StyledLoadingContainer>
          <Img
            src="/static/img/illustrations/cv-ia.gif"
            width={150}
            height={150}
            alt="Chargement en cours"
          />
        </StyledLoadingContainer>
      )}
    </ModalConfirm>
  );
};
