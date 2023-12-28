import React from 'react';
import { DefaultValues } from 'react-hook-form';
import {
  ExtractFormSchemaValidation,
  FormSchema,
} from 'src/components/forms/FormSchema';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';

import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { AnyCantFix } from 'src/utils/Types';

interface ModalEditProps<S extends FormSchema<AnyCantFix>> {
  title: string | JSX.Element;
  formSchema: S;
  onCancel?: () => void;
  onSubmit: (
    values: ExtractFormSchemaValidation<S>,
    onClose: () => void,
    requestErrorCallback: (msg: string) => void
  ) => void;
  onError?: (values: ExtractFormSchemaValidation<S>) => void;
  defaultValues?: DefaultValues<ExtractFormSchemaValidation<S>>;
  description?: string | JSX.Element;
  submitText?: string;
  cancelText?: string;
  noCompulsory?: boolean;
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
}: ModalEditProps<S>) {
  const { onClose } = useModalContext();
  return (
    <ModalGeneric title={title} description={description}>
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
          if (onClose) onClose();
        }}
        onError={onError}
        onSubmit={(fields, setError) => {
          if (!onClose) return;
          onSubmit(fields, onClose, setError);
        }}
      />
    </ModalGeneric>
  );
}
