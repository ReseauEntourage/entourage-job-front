import React, { useCallback } from 'react';
import { DefaultValues } from 'react-hook-form';
import { UserRoles } from '@/src/constants/users';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { UserProfile, UserWithUserCandidate } from 'src/api/types';
import { useUpdateUser } from 'src/components/backoffice/parametres-old/useUpdateUser';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import {
  formPersonalDataAsAdmin,
  formPersonalDataAsCandidate,
  formPersonalDataAsCoach,
} from 'src/components/forms/schemas/formPersonalData';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';

type PersonalDataFormSchema =
  | typeof formPersonalDataAsCandidate
  | typeof formPersonalDataAsCoach
  | typeof formPersonalDataAsAdmin;

interface ModalEditUserInformationProps {
  defaultValues?: DefaultValues<
    ExtractFormSchemaValidation<PersonalDataFormSchema>
  >;
  formSchema: PersonalDataFormSchema;
}

export const ModalEditUserInformation = ({
  defaultValues,
  formSchema,
}: ModalEditUserInformationProps) => {
  const user = useAuthenticatedUser();

  const { updateUser, closeModal: closeModalUser } = useUpdateUser(user);
  const { updateUserProfile, closeModal: closeModalUserProfile } =
    useUpdateProfile(user);

  const shouldCloseModal = closeModalUser && closeModalUserProfile;

  const isEmailValidated = useCallback(
    (
      oldEmail: string,
      newEmail0: string,
      newEmail1: string,
      setError: (msg: string) => void
    ): boolean => {
      if (oldEmail || newEmail0 || newEmail1) {
        if (user.email !== oldEmail.toLowerCase()) {
          setError("L'ancienne adresse email n'est pas valide");
          return false;
        }
        if (newEmail0.length === 0 || newEmail0 !== newEmail1) {
          setError('Les deux adresses email ne sont pas indentiques');
          return false;
        }
        setError('');
        return true;
      }
      return true;
    },
    [user]
  );

  return (
    <ModalEdit
      title="Édition - Informations personnelles"
      description="L'adresse mail, le numéro de téléphone et le département ne seront pas visible par les autres membres de la communauté"
      defaultValues={defaultValues}
      submitText="Sauvegarder"
      closeOnNextRender={shouldCloseModal}
      onSubmit={(
        values: ExtractFormSchemaValidation<PersonalDataFormSchema>,
        onClose: () => void,
        requestErrorCallback: (msg: string) => void
      ) => {
        const { firstName, lastName, oldEmail, newEmail0, newEmail1, phone } =
          values;

        let newUserData: Partial<UserWithUserCandidate> = {};
        let newUserProfileData: Partial<UserProfile> = {};

        if (
          phone !== user.phone ||
          firstName !== user.firstName ||
          lastName !== user.lastName
        ) {
          newUserData = {
            ...newUserData,
            firstName,
            lastName,
            phone,
          };
        }

        if (
          user.role === UserRoles.CANDIDATE ||
          user.role === UserRoles.COACH
        ) {
          const { department, introduction } =
            values as ExtractFormSchemaValidation<
              | typeof formPersonalDataAsCandidate
              | typeof formPersonalDataAsCoach
            >;

          if (department.value !== user.userProfile.department) {
            newUserProfileData = {
              ...newUserProfileData,
              department: department.value,
            };
          }

          if (introduction !== user.userProfile.introduction) {
            newUserProfileData = {
              ...newUserProfileData,
              introduction,
            };
          }
        }

        if (user.role === UserRoles.ADMIN) {
          const { gender } = values as ExtractFormSchemaValidation<
            typeof formPersonalDataAsAdmin
          >;

          newUserData = {
            ...newUserData,
            gender,
          };
        }

        if (
          isEmailValidated(oldEmail, newEmail0, newEmail1, requestErrorCallback)
        ) {
          if (newEmail0) {
            newUserData = {
              ...newUserData,
              email: newEmail0.toLowerCase(),
            };
          }
          updateUser(newUserData);
          updateUserProfile(newUserProfileData);
        }
      }}
      formSchema={formSchema}
    />
  );
};
