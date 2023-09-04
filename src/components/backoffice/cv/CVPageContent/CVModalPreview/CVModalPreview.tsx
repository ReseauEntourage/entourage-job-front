import React, { useEffect, useState } from 'react';
import { CV } from 'src/api/types';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { PageCVContent } from 'src/components/partials/CV/PageCvContent';
import { Button } from 'src/components/utils';

interface ModalPreviewProps {
  imageUrl: string;
  cv: CV;
}

export const CVModalPreview = ({ imageUrl, cv }: ModalPreviewProps) => {
  const { onClose } = useModalContext();
  const [cvPreview, setCVPreview] = useState<CV>(cv);

  useEffect(() => {
    setCVPreview({ ...cv, urlImg: imageUrl });
  }, [imageUrl, cv]);

  return (
    <ModalGeneric title="Prévisualisation du CV" fullWidth>
      <PageCVContent cv={cvPreview} actionDisabled />
      <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom uk-margin-medium-top">
        <Button onClick={onClose} style="default">
          Fermer
        </Button>
      </div>
    </ModalGeneric>
  );
};
