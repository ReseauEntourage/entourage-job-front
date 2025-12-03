import React, { useRef } from 'react';
import {
  ProfileGenerationProcess,
  ProfileGenerationProcessHandle,
} from '../../profile/ProfileGenerationProcess/ProfileGenerationProcess';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm/ModalConfirm';

export const GenerateProfileConfirmModal = () => {
  const { onClose } = useModalContext();
  const ref = useRef<ProfileGenerationProcessHandle>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const onLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

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
