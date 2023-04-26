import _ from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import UIkit from 'uikit';
import { useOnMemberFormSubmit } from '../useOnMemberFormSubmit';
import Api from 'src/api';
import { User, UserDto } from 'src/api/types';
import { formAddUser } from 'src/components/forms/schema/formAddUser';
import { openModal } from 'src/components/modals/Modal';
import ModalConfirm from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { EXTERNAL_USER_ROLES, USER_ROLES } from 'src/constants/users';
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
  });

  const handleMemberUpdateSubmit = useCallback(
    async (fields, closeModal) => {
      const updatedUser = await onSubmit(fields, closeModal);
      UIkit.notification('Le membre a bien été mis à jour', 'success');
      try {
        const { data: updatedUserWithLinkedMember } = await Api.putLinkUser(
          user.id,
          fields.userToLinkId || null
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
      formSchema: formAddUser,
      title: "Edition d'un membre",
      description:
        'Merci de modifier les informations que vous souhaitez concernant le membre.',
      submitText: 'Modifier le membre',
      onSubmit: async (fields, closeModal) => {
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
        ...user,
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
