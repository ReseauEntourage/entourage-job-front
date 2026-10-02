import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { HelpGroupAdminItem, HelpGroupDto } from '@/src/api/types';
import { ExtractFormSchemaValidation } from '@/src/features/forms/FormSchema';
import { formHelpGroup } from '@/src/features/forms/schemas/formHelpGroup';
import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';
import {
  useCreateHelpGroupMutation,
  useUpdateHelpGroupMutation,
} from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';

interface EditHelpGroupModalProps {
  // Creation when absent
  group?: HelpGroupAdminItem;
}

/**
 * Creation and edition of a group: name (80), description (500) and charter
 * (5000), plain text, with characters counters.
 */
export function EditHelpGroupModal({ group }: EditHelpGroupModalProps) {
  const dispatch = useDispatch();
  const [createHelpGroup] = useCreateHelpGroupMutation();
  const [updateHelpGroup] = useUpdateHelpGroupMutation();
  const isCreation = !group;

  const onSubmit = useCallback(
    async (
      fields: ExtractFormSchemaValidation<typeof formHelpGroup>,
      closeModal: () => void
    ) => {
      const dto: HelpGroupDto = {
        name: fields.name,
        description: fields.description,
        charter: fields.charter,
      };
      const result = group
        ? await updateHelpGroup({ id: group.id, dto })
        : await createHelpGroup(dto);

      if ('error' in result && result.error) {
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: `Une erreur s'est produite lors de la ${
              isCreation ? 'création' : 'modification'
            } du groupe`,
          })
        );
        return;
      }
      closeModal();
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: `Le groupe a bien été ${isCreation ? 'créé' : 'modifié'}`,
        })
      );
    },
    [createHelpGroup, dispatch, group, isCreation, updateHelpGroup]
  );

  return (
    <ModalEdit
      formSchema={formHelpGroup}
      title={isCreation ? "Création d'un groupe" : "Modification d'un groupe"}
      description={
        isCreation
          ? 'Le groupe est créé non publié : il ne sera visible qu’une fois publié.'
          : undefined
      }
      submitText={isCreation ? 'Créer le groupe' : 'Modifier le groupe'}
      defaultValues={
        group
          ? {
              name: group.name,
              description: group.description,
              charter: group.charter,
            }
          : undefined
      }
      onSubmit={onSubmit}
    />
  );
}
