import React, { useCallback, useRef } from 'react';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalConfirm } from '@/src/features/modals/Modal/ModalGeneric/ModalConfirm/ModalConfirm';
import {
  ProfileGenerationProcess,
  ProfileGenerationProcessHandle,
} from '../../profile/ProfileGenerationProcess/ProfileGenerationProcess';

export const GenerateProfileConfirmModal = () => {
  const { onClose } = useModalContext();
  const ref = useRef<ProfileGenerationProcessHandle>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const onLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return (
    <ModalConfirm
      buttonText="Générer"
      onConfirm={() => {
        ref.current?.generateProfileFromCV();
      }}
      isLoading={isLoading}
      keepOpenOnConfirm
    >
      <ProfileGenerationProcess
        ref={ref}
        title="Générer mon profil à partir de mon CV"
        overwriteWarning
        noAction
        onProfileGenerated={onClose}
        onLoadingChange={onLoadingChange}
      />
    </ModalConfirm>
  );
};
