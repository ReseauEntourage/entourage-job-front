import PropTypes from 'prop-types';
import React from 'react';
import UIkit from 'uikit';
import Api from 'src/api';
import { User } from 'src/api/types';
import schemaEditUser from 'src/components/forms/schema/formEditUser';
import { openModal } from 'src/components/modals/Modal';
import ModalConfirm from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import {
  ALL_USER_ROLES,
  CANDIDATE_USER_ROLES,
  USER_ROLES,
} from 'src/constants/users';
import { mutateFormSchema } from 'src/utils';
import { isRoleIncluded } from 'src/utils/Finding';

interface EditMemberModal {
  user: User;
  setUser: (user: User) => void;
}
export function EditMemberModal({ user, setUser }: EditMemberModal) {
  let mutatedSchema = mutateFormSchema(schemaEditUser, [
    {
      fieldId: 'userToCoach',
      props: [
        {
          propName: 'disabled',
          value: true,
        },
        {
          propName: 'hidden',
          value: true,
        },
      ],
    },
    {
      fieldId: 'role',
      props: [
        {
          propName: 'hidden',
          value: true,
          option: USER_ROLES.ADMIN,
        },
      ],
    },
    {
      fieldId: 'adminRole',
      props: [
        {
          propName: 'hidden',
          value: true,
        },
        {
          propName: 'disabled',
          value: true,
        },
      ],
    },
  ]);

  if (user) {
    if (!isRoleIncluded(CANDIDATE_USER_ROLES, user.role)) {
      mutatedSchema = mutateFormSchema(mutatedSchema, [
        {
          fieldId: 'address',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
      ]);
    }
    if (user.role === USER_ROLES.ADMIN) {
      mutatedSchema = mutateFormSchema(mutatedSchema, [
        {
          fieldId: 'phone',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
      ]);
    }
  }

  // TODO TEST
  return (
    <ModalEdit
      formSchema={mutatedSchema}
      title="Edition d'un membre"
      description="Merci de modifier les informations que vous souhaitez concernant le membre."
      submitText="Modifier le membre"
      defaultValues={{ ...user, gender: user.gender.toString() }}
      onSubmit={async (fields, closeModal) => {
        const updateUser = async (onError?: () => void) => {
          try {
            const { data } = await Api.putUser(user.id, {
              ...fields,
              email: fields.email.toLowerCase(),
              firstName: fields.firstName.trim().replace(/\s\s+/g, ' '),
              lastName: fields.lastName.trim().replace(/\s\s+/g, ' '),
            });
            closeModal();
            UIkit.notification('Le membre a bien été modifié', 'success');
            setUser(data);
          } catch (error) {
            console.error(error);
            if (onError) onError();
            if (error.response.status === 409) {
              UIkit.notification(
                'Cette adresse email est déjà utilisée',
                'danger'
              );
            } else {
              UIkit.notification(
                "Une erreur s'est produite lors de la modification du membre",
                'danger'
              );
            }
          }
        };

        if (fields.role !== user.role) {
          openModal(
            <ModalConfirm
              text="Attention, si vous modifiez le rôle d'un candidat, tout son suivi sera perdu et son CV sera dépublié. Êtes-vous sûr de vouloir continuer ?"
              buttonText="Valider"
              onConfirm={async () => {
                await updateUser(() => {
                  openModal(<EditMemberModal user={user} setUser={setUser} />);
                });
              }}
            />
          );
        } else {
          await updateUser();
        }
      }}
    />
  );
}

EditMemberModal.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.oneOf(ALL_USER_ROLES),
    gender: PropTypes.number.isRequired,
  }).isRequired,
  setUser: PropTypes.func.isRequired,
};
