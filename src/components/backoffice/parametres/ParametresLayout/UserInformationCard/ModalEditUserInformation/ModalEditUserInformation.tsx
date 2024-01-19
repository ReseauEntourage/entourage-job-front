import React, { useCallback } from 'react';
import { DefaultValues } from 'react-hook-form';
import { UserProfile, UserWithUserCandidate } from 'src/api/types';
import { useUpdateProfile } from 'src/components/backoffice/parametres/useUpdateProfile';
import { useUpdateUser } from 'src/components/backoffice/parametres/useUpdateUser';
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

function isCoachForm(
  schema: ExtractFormSchemaValidation<PersonalDataFormSchema>
): schema is ExtractFormSchemaValidation<typeof formPersonalDataAsCoach> {
  return 'department' in schema && !('address' in schema);
}

function isCandidateForm(
  schema: ExtractFormSchemaValidation<PersonalDataFormSchema>
): schema is ExtractFormSchemaValidation<typeof formPersonalDataAsCandidate> {
  return 'department' in schema && 'address' in schema;
}

function isAdminForm(
  schema: ExtractFormSchemaValidation<PersonalDataFormSchema>
): schema is ExtractFormSchemaValidation<typeof formPersonalDataAsAdmin> {
  return (
    !isCandidateForm(schema) &&
    !isCoachForm(schema) &&
    'firstName' in schema &&
    'lastName' in schema &&
    'gender' in schema
  );
}

interface ModalEditUserInformationProps {
  defaultValues?: DefaultValues<
    ExtractFormSchemaValidation<PersonalDataFormSchema>
  >;
  // onSubmit: (values: ExtractFormSchemaValidation<S>) => void,
  formSchema: PersonalDataFormSchema;
}

export const ModalEditUserInformation = ({
  defaultValues,
  // onSubmit,
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
      defaultValues={defaultValues}
      submitText="Sauvegarder"
      closeOnNextRender={shouldCloseModal}
      onSubmit={(
        values: ExtractFormSchemaValidation<PersonalDataFormSchema>,
        onClose: () => void,
        requestErrorCallback: (msg: string) => void
      ) => {
        const { oldEmail, newEmail0, newEmail1, phone } = values;

        let newUserData: Partial<UserWithUserCandidate> = {};
        let newUserProfileData: Partial<UserProfile> = {};

        if (phone !== user.phone) {
          newUserData = {
            ...newUserData,
            phone,
          };
        }

        if (isCandidateForm(values) || isCoachForm(values)) {
          const { department } = values;

          if (department.value !== user.userProfile.department) {
            newUserProfileData = {
              ...newUserProfileData,
              department: department.value,
            };
          }

          if (isCandidateForm(values)) {
            const { address } = values;

            if (address !== user.address) {
              newUserData = {
                ...newUserData,
                address,
              };
            }
          }
        }

        if (isAdminForm(values)) {
          const { firstName, lastName, gender } = values;

          newUserData = {
            ...newUserData,
            firstName,
            lastName,
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
