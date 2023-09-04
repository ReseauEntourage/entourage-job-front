import React from 'react';
import { CV } from 'src/api/types';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { PageCVContent } from 'src/components/partials/CV/PageCvContent';
import { Button } from 'src/components/utils';

interface ModalPreviewProps {
  cv: CV;
}

export const CVModalPreview = ({ cv }: ModalPreviewProps) => {
  const { onClose } = useModalContext();

  return (
    <ModalGeneric title="Prévisualisation du CV" fullWidth>
      <PageCVContent cv={cv} actionDisabled />
      <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom uk-margin-medium-top">
        <Button onClick={onClose} style="default">
          Fermer
        </Button>
      </div>
    </ModalGeneric>
  );
};
