import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Button } from 'src/components/utils/Button';
import { Grid } from 'src/components/utils/Grid';
import { ReduxRequestEvents } from 'src/constants';
import {
  authenticationActions,
  updateCandidateSelectors,
} from 'src/use-cases/authentication';

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
  const dispatch = useDispatch();

  const updateCandidateStatus = useSelector(
    updateCandidateSelectors.selectUpdateCandidateStatus
  );

  useEffect(() => {
    return () => {
      dispatch(authenticationActions.updateCandidateReset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (updateCandidateStatus === ReduxRequestEvents.SUCCEEDED) {
      setCloseModal(true);
    }
  }, [updateCandidateStatus]);

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
