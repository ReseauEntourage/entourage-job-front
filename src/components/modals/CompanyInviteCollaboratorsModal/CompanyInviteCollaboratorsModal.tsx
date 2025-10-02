import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { companyActions } from '@/src/use-cases/company';
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
    dispatch(
      companyActions.inviteCollaboratorsRequested({
        companyId,
        emails: fields.emails.map((e) => e.value),
      })
    );
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
