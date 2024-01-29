import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Button } from 'src/components/utils/Button';
import { Grid } from 'src/components/utils/Grid';
import { ReduxRequestEvents } from 'src/constants';
import { usePrevious } from 'src/hooks/utils';
import { updateCandidateSelectors } from 'src/use-cases/authentication';

interface CVModalConfirmationProps {
  dispatchOnSubmit: (keyValue: { hidden: boolean }) => void;
  id: string;
}

export const CVModalConfirmation = ({
  dispatchOnSubmit,
  id,
}: CVModalConfirmationProps) => {
  const { onClose } = useModalContext();
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const updateCandidateStatus = useSelector(
    updateCandidateSelectors.selectUpdateCandidateStatus
  );

  const prevUpdateCandidateStatus = usePrevious(updateCandidateStatus);

  useEffect(() => {
    if (
      prevUpdateCandidateStatus === ReduxRequestEvents.REQUESTED &&
      updateCandidateStatus === ReduxRequestEvents.SUCCEEDED
    ) {
      setCloseModal(true);
    }
  }, [prevUpdateCandidateStatus, updateCandidateStatus]);

  return (
    <ModalGeneric
      title="Changer la visibilité du CV en ligne ?"
      closeOnNextRender={closeModal}
      description={
        <>
          En masquant votre CV de LinkedOut, il ne sera plus visible par les
          utilisateurs du site.
          <br />
          Vous pourrez le remettre en ligne à tout moment.
        </>
      }
    >
      <Grid className="uk-grid-small uk-flex-center uk-margin-large-top">
        <Button style="default" onClick={onClose}>
          Annuler
        </Button>
        <Button
          style="primary"
          dataTestId={`test-confirm-${id}`}
          onClick={() => {
            dispatchOnSubmit({ hidden: true });
          }}
        >
          Oui, masquer mon CV
        </Button>
      </Grid>
    </ModalGeneric>
  );
};
