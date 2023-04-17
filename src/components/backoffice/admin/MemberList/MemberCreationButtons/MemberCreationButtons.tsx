import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import UIkit from 'uikit';
import Api from 'src/api';
import { formAddOrganization } from 'src/components/forms/schema/formAddOrganization';
import {
  CREATE_NEW_ORGANIZATION_VALUE,
  formAddUser,
} from 'src/components/forms/schema/formAddUser';
import { openModal } from 'src/components/modals/Modal';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { ButtonMultiple } from 'src/components/utils';
import Icon from 'src/components/utils/Icon';
import { USER_ROLES } from 'src/constants';
import { useIsDesktop, usePrevious } from 'src/hooks/utils';

export function MemberCreationButtons({ fetchMembers }) {
  const isDesktop = useIsDesktop();

  const [filledUserFields, setFilledUserFields] = useState({});

  const prevFilledUserFields = usePrevious(filledUserFields);

  const handleMemberCreationSubmit = useCallback(
    async (fields, closeModal) => {
      let userFields;
      let name;
      const shouldTryToCreateOrganization =
        fields.organizationId === CREATE_NEW_ORGANIZATION_VALUE;

      try {
        let { organizationId } = fields;

        if (shouldTryToCreateOrganization) {
          const organizationFields = {
            name: fields.nameOrganization,
            address: fields.addressOrganization,
            zone: fields.zoneOrganization,
            referentInformation: fields.referentInformationOrganization,
            referentFirstName: fields.referentFirstNameOrganization,
            referentLastName: fields.referentLastNameOrganization,
            referentPhone: fields.referentPhoneOrganization,
            referentMail: fields.referentMailOrganization,
          };

          try {
            ({
              data: { id: organizationId, name },
            } = await Api.postOrganization(organizationFields));

            UIkit.notification('La structure a bien été créé', 'success');
          } catch (error) {
            console.error(error);
            UIkit.notification(
              "Une erreur s'est produite lors de la création de la structure",
              'danger'
            );
          }
        }

        userFields = {
          firstName: fields.firstName,
          lastName: fields.lastName,
          gender: fields.gender,
          zone: fields.zone,
          phone: fields.phone,
          role: fields.role,
          email: fields.email,
          userToLinkId: fields.userToLinkId,
          ...(fields.role === USER_ROLES.ADMIN
            ? { adminRole: fields.adminRole }
            : {}),
          ...(organizationId ? { OrganizationId: organizationId } : {}),
        };

        await Api.postUser(userFields);
        setFilledUserFields({});
        closeModal();
        UIkit.notification('Le membre a bien été créé', 'success');
        await fetchMembers();
      } catch (error) {
        console.error(error);
        if (error?.response?.status === 409) {
          UIkit.notification('Cette adresse email est déjà utilisée', 'danger');
        } else {
          UIkit.notification(
            "Une erreur s'est produite lors de la création du membre",
            'danger'
          );
        }

        if (shouldTryToCreateOrganization) {
          const { OrganizationId, ...restUserFields } = userFields;

          setFilledUserFields({
            ...restUserFields,
            organizationId: { value: OrganizationId, label: name },
          });
          closeModal();
        }
      }
    },
    [fetchMembers]
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
  }, [handleMemberCreationSubmit]);

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
