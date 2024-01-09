import React, { useCallback } from 'react';
import { DefaultValues } from 'react-hook-form';
import { useUpdateUser } from '../../../useUpdateUser';
import { UserWithUserCandidate } from 'src/api/types';
import {
  ExtractFormSchemaValidation,
  FormSchema,
} from 'src/components/forms/FormSchema';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { AnyCantFix } from 'src/utils/Types';

interface ModalEditUserInformationProps<S extends FormSchema<AnyCantFix>> {
  defaultValues?: DefaultValues<ExtractFormSchemaValidation<S>>;
  // onSubmit: (values: ExtractFormSchemaValidation<S>) => void,
  formSchema: S;
}

export const ModalEditUserInformation = <S extends FormSchema<AnyCantFix>>({
  defaultValues,
  // onSubmit,
  formSchema,
}: ModalEditUserInformationProps<S>) => {
  const user = useAuthenticatedUser();

  const { updateUser, closeModal } = useUpdateUser(user);

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
      closeOnNextRender={closeModal}
      onSubmit={(
        values: ExtractFormSchemaValidation<S>,
        onClose: () => void,
        requestErrorCallback: (msg: string) => void
      ) => {
        const { oldEmail, newEmail0, newEmail1, address, phone } = values;
        const newUserData: Partial<UserWithUserCandidate> = {};
        if (phone !== user.phone) {
          newUserData.phone = phone;
        }
        if (address !== user.address) {
          newUserData.address = address;
        }
        if (
          isEmailValidated(oldEmail, newEmail0, newEmail1, requestErrorCallback)
        ) {
          if (newEmail0) newUserData.email = newEmail0.toLowerCase();
          updateUser(newUserData);
          onClose();
        }
      }}
      formSchema={formSchema}
    />
  );
};
