import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Api } from '@/src/api';
import { notificationsActions } from '@/src/use-cases/notifications';
import { ExtractFormSchemaValidation } from '../../forms/FormSchema';
import { formInviteCompanyCollaborators } from '../../forms/schemas/formInviteCompanyCollaborators';
import { ModalEdit } from '../Modal/ModalGeneric/ModalEdit';

export interface CompanyInviteCollaboratorsModalProps {
  companyId: string;
}

export function CompanyInviteCollaboratorsModal({
  companyId,
}: CompanyInviteCollaboratorsModalProps) {
  const dispatch = useDispatch();
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<typeof formInviteCompanyCollaborators>
  > = {
    emails: [],
  };

  const dispatchOnSubmit = (fields) => {
    Api.inviteCollaboratorsFromCompany(companyId, {
      emails: fields.emails.map((email) => email.value),
    })
      .then(() => {
        dispatch(
          notificationsActions.addNotification({
            type: 'success',
            message: 'Toutes les invitations ont été envoyées avec succès.',
          })
        );
      })
      .catch((error) => {
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: `Une erreur est survenue lors de l'envoi des invitations`,
          })
        );
        console.error('Error inviting collaborators:', error);
      });
    setCloseModal(true);
  };

  return (
    <ModalEdit
      title="Inviter des collaborateurs"
      formSchema={formInviteCompanyCollaborators}
      defaultValues={defaultValues}
      closeOnNextRender={closeModal}
      onSubmit={(fields) => {
        dispatchOnSubmit(fields);
        setCloseModal(true);
      }}
    />
  );
}
