import _ from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from 'src/api';
import { User, UserDto } from 'src/api/types';
import { useOnMemberFormSubmit } from 'src/components/backoffice/admin/useOnMemberFormSubmit';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { formAddUser } from 'src/components/forms/schemas/formAddUser';
import { openModal } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { ROLES_WITH_ORGANIZATION } from 'src/constants/users';
import { Actions } from 'src/constants/utils';
import { notificationsActions } from 'src/use-cases/notifications';
import { getRelatedUser, isRoleIncluded } from 'src/utils/Finding';

interface EditMemberModal {
  user: User;
  setUser: (user: User) => void;
}
export function EditMemberModal({ user, setUser }: EditMemberModal) {
  const dispatch = useDispatch();

  const userToLink = useMemo(() => {
    const relatedUser = getRelatedUser(user);
    if (relatedUser) {
      return {
        value: relatedUser[0].id,
        label: `${relatedUser[0].firstName} ${relatedUser[0].lastName}`,
      };
    }
  }, [user]);

  const organization = useMemo(() => {
    return isRoleIncluded(ROLES_WITH_ORGANIZATION, user.role) &&
      user.organization
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
        const userToLinkId = fields.userToLinkId?.value;
        const { data: updatedUserWithLinkedMember } = await Api.putLinkUser(
          user.id,

          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          userToLinkId || null
        );

        setUser(updatedUserWithLinkedMember);
      } catch (err) {
        console.error(err);
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message:
              "Une erreur s'est produite lors de l'association à un autre membre",
          })
        );
        setUser(updatedUser);
      }
    },
    [onSubmit, setUser, dispatch, user.id]
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
