import React from 'react';
import { DefaultValues } from 'react-hook-form';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import {
  ExtractFormSchemaValidation,
  FormSchema,
} from 'src/features/forms/FormSchema';
import { FormWithValidation } from 'src/features/forms/FormWithValidation';

import { AnyCantFix } from 'src/utils/Types';

interface ModalEditProps<S extends FormSchema<AnyCantFix>> {
  title: React.ReactNode;
  formSchema: S;
  onCancel?: () => void;
  onSubmit: (
    values: ExtractFormSchemaValidation<S>,
    onClose: () => void,
    requestErrorCallback: (msg: string) => void
  ) => void;
  onError?: (values: ExtractFormSchemaValidation<S>) => void;
  defaultValues?: DefaultValues<ExtractFormSchemaValidation<S>>;
  description?: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  noCompulsory?: boolean;
  closeOnNextRender?: boolean;
}
export function ModalEdit<S extends FormSchema<AnyCantFix>>({
  title,
  description,
  formSchema,
  defaultValues,
  onSubmit,
  submitText = 'Sauvegarder',
  cancelText = 'Annuler',
  onError = () => {},
  onCancel = () => {},
  noCompulsory = false,
  closeOnNextRender = false,
}: ModalEditProps<S>) {
  const { onClose } = useModalContext();

  return (
    <ModalGeneric
      title={title}
      description={description}
      closeOnNextRender={closeOnNextRender}
    >
      <FormWithValidation
        submitText={submitText}
        cancelText={cancelText}
        formSchema={formSchema}
        defaultValues={defaultValues}
        noCompulsory={noCompulsory}
        onCancel={() => {
          if (onCancel) {
            onCancel();
          }
          if (onClose) {
            onClose();
          }
        }}
        onError={onError}
        onSubmit={(fields, setError) => {
          const safeClose = onClose || (() => {});
          onSubmit(fields, safeClose, setError);
        }}
      />
    </ModalGeneric>
  );
}
