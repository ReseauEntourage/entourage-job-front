import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HelpGroupAdminItem } from '@/src/api/types';
import { Button, Text } from '@/src/components/ui';
import { TextInput } from '@/src/components/ui/Inputs';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { ModalFooter } from '@/src/features/modals/Modal/ModalGeneric/ModalFooter/ModalFooter';
import { useDeleteHelpGroupMutation } from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import { StyledDeleteHelpGroupModalContent } from './DeleteHelpGroupModal.styles';

export const DELETE_HELP_GROUP_CONSEQUENCE =
  'Les discussions et les réponses de ce groupe ne seront plus visibles par personne, y compris par leurs auteurs. Les données sont conservées et le groupe pourra être restauré.';

interface DeleteHelpGroupModalProps {
  group: HelpGroupAdminItem;
}

/**
 * The confirmation is an interface guard only: the button is enabled once
 * the typed name is strictly equal to the group name.
 */
export function DeleteHelpGroupModal({ group }: DeleteHelpGroupModalProps) {
  const { onClose } = useModalContext();
  const dispatch = useDispatch();
  const [typedName, setTypedName] = useState('');
  const [deleteHelpGroup, { isLoading }] = useDeleteHelpGroupMutation();
  const isConfirmed = typedName === group.name;

  const onConfirm = async () => {
    if (!isConfirmed || isLoading) {
      return;
    }
    const result = await deleteHelpGroup(group.id);
    if ('error' in result && result.error) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: "Une erreur s'est produite lors de la suppression du groupe",
        })
      );
      return;
    }
    dispatch(
      notificationsActions.addNotification({
        type: 'success',
        message: 'Le groupe a bien été supprimé',
      })
    );
    onClose?.();
  };

  return (
    <ModalGeneric title={`Supprimer le groupe « ${group.name} »`}>
      <StyledDeleteHelpGroupModalContent>
        <Text>{DELETE_HELP_GROUP_CONSEQUENCE}</Text>
        <TextInput
          id="delete-help-group-name"
          name="delete-help-group-name"
          title="Saisissez le nom du groupe pour confirmer"
          showLabel
          value={typedName}
          onChange={setTypedName}
        />
      </StyledDeleteHelpGroupModalContent>
      <ModalFooter>
        <Button
          variant="default"
          onClick={onClose}
          dataTestId="delete-help-group-cancel"
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          disabled={!isConfirmed || isLoading}
          onClick={onConfirm}
          dataTestId="delete-help-group-confirm"
        >
          Supprimer le groupe
        </Button>
      </ModalFooter>
    </ModalGeneric>
  );
}
