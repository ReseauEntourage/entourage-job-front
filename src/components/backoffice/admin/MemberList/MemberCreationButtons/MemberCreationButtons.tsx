import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
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
import { useIsDesktop, useMount } from 'src/hooks/utils';

export function MemberCreationButtons({ fetchMembers }) {
  console.log('rerender');
  const isDesktop = useIsDesktop();

  useMount(() => {
    return () => {
      console.log('UNMOUNT');
    };
  });

  const [createdOrganizationId, setCreatedOrganizationId] = useState(null);

  useEffect(() => {
    console.log('createdOrganizationId', createdOrganizationId);
  }, [createdOrganizationId]);

  const handleMemberCreationSubmit = useCallback(
    async (fields, closeModal) => {
      try {
        let { organizationId } = fields;

        console.log('createdOrganizationId on submit', createdOrganizationId);

        if (createdOrganizationId) {
          organizationId = createdOrganizationId;
        } else if (organizationId === CREATE_NEW_ORGANIZATION_VALUE) {
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

          ({
            data: { id: organizationId },
          } = await Api.postOrganization(organizationFields));

          setCreatedOrganizationId(organizationId);
        }

        const userFields = {
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

        // TODO MANAGE IF USER FAILS DOUBLE ORGANIZATION
        await Api.postUser(userFields);

        closeModal();
        UIkit.notification('Le membre a bien été créé', 'success');
        setCreatedOrganizationId(null);
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
      }
    },
    [createdOrganizationId, fetchMembers]
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

  return (
    <ButtonMultiple
      id="admin-create"
      align={isDesktop ? 'right' : 'left'}
      dataTestId="button-admin-create"
      style="custom-primary"
      buttons={[
        {
          onClick: () => {
            openModal(
              <ModalEdit
                formSchema={formAddUser}
                title="Ajouter un nouveau membre"
                description="Merci de renseigner quelques informations afin de créer un nouveau membre"
                submitText="Ajouter"
                onSubmit={handleMemberCreationSubmit}
              />
            );
          },
          label: 'Nouveau membre',
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
