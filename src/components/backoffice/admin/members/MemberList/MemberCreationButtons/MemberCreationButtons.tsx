import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { UserDto } from 'src/api/types';
import { useOnMemberFormSubmit } from 'src/components/backoffice/admin/members/useOnMemberFormSubmit';
import { formAddOrganization } from 'src/components/forms/schema/formAddOrganization';
import { formAddUser } from 'src/components/forms/schema/formAddUser';
import { openModal } from 'src/components/modals/Modal';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { ButtonMultiple } from 'src/components/utils';
import Icon from 'src/components/utils/Icon';
import { useIsDesktop } from 'src/hooks/utils';

export function MemberCreationButtons({ fetchMembers }) {
  const isDesktop = useIsDesktop();

  const {
    onSubmit,
    filledUserFields,
    prevFilledUserFields,
    setFilledUserFields,
  } = useOnMemberFormSubmit(async (userToCreate: UserDto) => {
    return Api.postUser(userToCreate);
  });

  const handleMemberCreationSubmit = useCallback(
    async (fields, closeModal) => {
      await onSubmit(fields, closeModal);
      UIkit.notification('Le membre a bien été créé', 'success');
      await fetchMembers();
    },
    [fetchMembers, onSubmit]
  );

  const handleOrganizationCreationSubmit = useCallback(
    async (fields, closeModal) => {
      try {
        await Api.postOrganization(fields);
        closeModal();
        UIkit.notification('La structure a bien été créé', 'success');
      } catch (error) {
        console.error(error);
        UIkit.notification(
          "Une erreur s'est produite lors de la création de la structure",
          'danger'
        );
      }
    },
    []
  );

  const addUserModalProps = useMemo(() => {
    return {
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
      style="custom-primary"
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
                formId={formAddOrganization.id}
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
      <Icon name="plus" ratio={0.8} className="uk-margin-small-right" />
      Créer
    </ButtonMultiple>
  );
}

MemberCreationButtons.propTypes = {
  fetchMembers: PropTypes.func.isRequired,
};
