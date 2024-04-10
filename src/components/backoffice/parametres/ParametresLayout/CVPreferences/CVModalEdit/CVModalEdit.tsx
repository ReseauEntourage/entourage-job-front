import useChange from '@react-hook/change';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formEditEmployed } from 'src/components/forms/schemas/formEditEmployed';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Contract, ReduxRequestEvents } from 'src/constants';
import {
  currentUserActions,
  updateCandidateSelectors,
} from 'src/use-cases/current-user';

interface CVModalEditProps {
  title: string;
  dispatchOnSubmit: (keyValue: {
    employed?: boolean;
    contract?: Contract | null;
    endOfContract?: string | null;
  }) => void;
}

export const CVModalEdit = ({ title, dispatchOnSubmit }: CVModalEditProps) => {
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const updateCandidateStatus = useSelector(
    updateCandidateSelectors.selectUpdateCandidateStatus
  );
  const dispatch = useDispatch();

  useChange(updateCandidateStatus, () => {
    if (updateCandidateStatus === ReduxRequestEvents.SUCCEEDED) {
      setCloseModal(true);
    }
  });

  useEffect(() => {
    return () => {
      dispatch(currentUserActions.updateCandidateReset());
    };
  }, [dispatch]);

  return (
    <ModalEdit
      title={title}
      formSchema={formEditEmployed}
      closeOnNextRender={closeModal}
      onSubmit={(fields) => {
        dispatchOnSubmit({ employed: true, ...fields });
      }}
    />
  );
};
