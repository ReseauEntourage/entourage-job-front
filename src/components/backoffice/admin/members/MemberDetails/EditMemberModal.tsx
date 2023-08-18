import _ from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { User, UserDto } from 'src/api/types';
import { useOnMemberFormSubmit } from 'src/components/backoffice/admin/useOnMemberFormSubmit';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { formAddUser } from 'src/components/forms/schemas/formAddUser';
import { openModal } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { EXTERNAL_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { Actions } from 'src/constants/utils';
import { getRelatedUser, isRoleIncluded } from 'src/utils/Finding';

interface EditMemberModal {
  user: User;
  setUser: (user: User) => void;
}
export function EditMemberModal({ user, setUser }: EditMemberModal) {
  const userToLink = useMemo(() => {
    const relatedUser = getRelatedUser(user);

    if (relatedUser) {
      if (user.role === USER_ROLES.COACH_EXTERNAL) {
        return relatedUser.map(({ id, firstName, lastName }) => {
          return { value: id, label: `${firstName} ${lastName}` };
        });
      }
      return {
        value: relatedUser[0].id,
        label: `${relatedUser[0].firstName} ${relatedUser[0].lastName}`,
      };
    }
  }, [user]);

  const organization = useMemo(() => {
    return isRoleIncluded(EXTERNAL_USER_ROLES, user.role) && user.organization
      ? {
          value: user.organization.id,
          label: user.organization.name,
        }
      : undefined;
  }, [user.organization, user.role]);

  const {
    onSubmit,
    filledUserFields,
    prevFilledUserFields,
    setFilledUserFields,
  } = useOnMemberFormSubmit(async (userToUpdate: UserDto) => {
    return Api.putUser(user.id, userToUpdate);
  }, Actions.UPDATE);

  const handleMemberUpdateSubmit = useCallback(
    async (
      fields: ExtractFormSchemaValidation<typeof formAddUser>,
      closeModal
    ) => {
      const updatedUser = await onSubmit(fields, closeModal);
      try {
        const userToLinkId = Array.isArray(fields.userToLinkId)
          ? fields.userToLinkId.map(({ value }) => value)
          : fields.userToLinkId?.value;
        const { data: updatedUserWithLinkedMember } = await Api.putLinkUser(
          user.id,
          userToLinkId || null
        );

        setUser(updatedUserWithLinkedMember);
      } catch (err) {
        console.error(err);
        UIkit.notification(
          "Une erreur s'est produite lors de l'association à un autre membre",
          'danger'
        );
        setUser(updatedUser);
      }
    },
    [onSubmit, setUser, user.id]
  );

  const updateUserModalProps = useMemo(() => {
    return {
      formId: formAddUser.id,
      formSchema: formAddUser,
      title: "Edition d'un membre",
      description:
        'Merci de modifier les informations que vous souhaitez concernant le membre.',
      submitText: 'Modifier le membre',
      onSubmit: async (
        fields: ExtractFormSchemaValidation<typeof formAddUser>,
        closeModal
      ) => {
        if (fields.role !== user.role) {
          openModal(
            <ModalConfirm
              text="Attention, si vous modifiez le rôle d'un candidat, tout son suivi sera perdu et son CV sera dépublié. Êtes-vous sûr de vouloir continuer ?"
              buttonText="Valider"
              onConfirm={async () => {
                await handleMemberUpdateSubmit(fields, closeModal);
              }}
            />
          );
        } else {
          await handleMemberUpdateSubmit(fields, closeModal);
        }
      },
      onCancel: () => setFilledUserFields({}),
      defaultValues: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        adminRole: user.adminRole,
        gender: user.gender,
        phone: user.phone,
        address: user.address,
        zone: user.zone,
        organizationId: organization,
        userToLinkId: userToLink,
      },
    };
  }, [
    handleMemberUpdateSubmit,
    organization,
    setFilledUserFields,
    user,
    userToLink,
  ]);

  // TODO TEST AND FIX
  useEffect(() => {
    if (
      !_.isEmpty(filledUserFields) &&
      filledUserFields !== prevFilledUserFields
    ) {
      openModal(
        <ModalEdit {...updateUserModalProps} defaultValues={filledUserFields} />
      );
    }
  }, [updateUserModalProps, filledUserFields, prevFilledUserFields]);

  return <ModalEdit {...updateUserModalProps} />;
}
