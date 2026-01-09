import _ from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ButtonMultiple } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { useOnMemberFormSubmit } from '@/src/features/backoffice/admin/useOnMemberFormSubmit';
import { openModal } from '@/src/features/modals/Modal';
import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';
import { useOnOrganizationFormSubmit } from '../useOnOrganizationFormSubmit';
import { Api } from 'src/api';
import { OrganizationDto, UserDto } from 'src/api/types';
import { Actions } from 'src/constants/utils';
import { formAddOrganization } from 'src/features/forms/schemas/formAddOrganization';
import { formAddUser } from 'src/features/forms/schemas/formAddUser';
import { useIsDesktop } from 'src/hooks/utils';

interface AdminCreationButtonsProps {
  refreshList: () => void;
}
export function AdminCreationButtons({
  refreshList,
}: AdminCreationButtonsProps) {
  const isDesktop = useIsDesktop();

  const {
    onSubmit,
    filledUserFields,
    prevFilledUserFields,
    setFilledUserFields,
  } = useOnMemberFormSubmit(async (userToCreate: UserDto) => {
    return Api.postUser(userToCreate);
  }, Actions.CREATE);

  const { onSubmit: handleOrganizationCreationSubmit } =
    useOnOrganizationFormSubmit(
      async (organizationToCreate: OrganizationDto) => {
        return Api.postOrganization(organizationToCreate);
      },
      Actions.CREATE
    );

  const handleMemberCreationSubmit = useCallback(
    async (fields, closeModal) => {
      await onSubmit(fields, closeModal);
      await refreshList();
    },
    [refreshList, onSubmit]
  );

  const addUserModalProps = useMemo(() => {
    return {
      formId: formAddUser.id,
      formSchema: formAddUser,
      title: 'Ajouter un nouveau membre',
      description:
        'Merci de renseigner quelques informations afin de créer un nouveau membre',
      submitText: 'Ajouter',
      onSubmit: handleMemberCreationSubmit,
      onCancel: () => setFilledUserFields({}),
    };
  }, [handleMemberCreationSubmit, setFilledUserFields]);

  useEffect(() => {
    if (
      !_.isEmpty(filledUserFields) &&
      filledUserFields !== prevFilledUserFields
    ) {
      openModal(
        <ModalEdit {...addUserModalProps} defaultValues={filledUserFields} />
      );
    }
  }, [addUserModalProps, filledUserFields, prevFilledUserFields]);

  return (
    <ButtonMultiple
      id="admin-create"
      align={isDesktop ? 'right' : 'left'}
      dataTestId="button-admin-create"
      variant="primary"
      buttons={[
        {
          onClick: () => {
            openModal(<ModalEdit {...addUserModalProps} />);
          },
          label: 'Nouveau membre',
          dataTestId: 'button-create-user',
        },
        {
          onClick: () => {
            openModal(
              <ModalEdit
                formSchema={formAddOrganization}
                title="Création de structure partenaire"
                description="Merci de renseigner quelques informations afin de créer la structure"
                submitText="Créer la structure"
                onSubmit={handleOrganizationCreationSubmit}
              />
            );
          },
          dataTestId: 'button-create-organization',
          label: 'Nouvelle structure',
        },
      ]}
    >
      <LucidIcon name="Plus" />
      Créer
    </ButtonMultiple>
  );
}
