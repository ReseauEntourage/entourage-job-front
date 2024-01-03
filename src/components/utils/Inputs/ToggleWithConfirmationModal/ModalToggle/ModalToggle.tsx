import React from 'react';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Button } from 'src/components/utils/Button';
import { Grid } from 'src/components/utils/Grid';

interface ModalToggleProps {
  modalTitle: string;
  modalDescription: React.ReactNode;
  modalConfirmation: string;
  onToggle: (value: boolean, fields?) => void;
  setIsToggled: (boolean) => void;
  id: string;
}

export const ModalToggle = ({
    modalTitle,
    modalDescription,
    onToggle,
    setIsToggled,
    modalConfirmation,
    id,
  }: ModalToggleProps) => {
    const { onClose } = useModalContext();
  
    return (
      <ModalGeneric title={modalTitle} description={modalDescription}>
        <Grid className="uk-grid-small uk-flex-center uk-margin-large-top">
          <Button style="default" onClick={onClose}>
            Annuler
          </Button>
          <Button
            style="primary"
            dataTestId={`test-confirm-${id}`}
            onClick={() => {
              onToggle(true).then(() => {
                return setIsToggled(true);
              });
              if (onClose) onClose();
            }}
          >
            {modalConfirmation}
          </Button>
        </Grid>
      </ModalGeneric>
    );
  };
  
  ModalToggle.propTypes = {
   
  };
  

ModalToggle.defaultProps = {
  modalDescription: undefined,
  modalConfirmation: 'Oui',
};
