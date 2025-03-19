import React from 'react';
import { useDispatch } from 'react-redux';
import { ModalConfirm } from '../Modal/ModalGeneric/ModalConfirm';
import { Api } from 'src/api';
import { Text } from 'src/components/utils';
import { authenticationActions } from 'src/use-cases/authentication';
import { StyledContainer } from './DeleteAccountModal.styles';

export function DeleteAccountModal() {
  const dispatch = useDispatch();
  const confirmDeletion = async () => {
    await Api.deleteUser('me');
    dispatch(authenticationActions.logoutRequested());
  };

  return (
    <ModalConfirm
      title="Supprimer mon compte"
      onConfirm={confirmDeletion}
      buttonText="Supprimer mon compte"
    >
      <StyledContainer>
        <Text weight="bold">
          Êtes-vous sur de vouloir supprimer votre compte Entourage Pro ?
        </Text>
        <Text>Toutes vos données et vos message seront supprimés</Text>
      </StyledContainer>
    </ModalConfirm>
  );
}
