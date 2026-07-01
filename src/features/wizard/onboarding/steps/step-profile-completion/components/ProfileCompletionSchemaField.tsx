import React, { useCallback, useMemo, useState } from 'react';
import type {
  Control,
  UseFormGetValues,
  UseFormResetField,
  UseFormWatch,
} from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import type {
  FormFieldInput,
  FormSchema,
} from '@/src/features/forms/FormSchema';
import { GenericField } from '@/src/features/forms/fields/GenericField';
import type { AnyCantFix } from '@/src/utils/Types';

import type { ProfileCompletionFormValues } from '../types';

interface ProfileCompletionSchemaFieldProps {
  formSchema: FormSchema<AnyCantFix>;
  field: FormFieldInput<AnyCantFix>;
  showError?: boolean;
}

export const ProfileCompletionSchemaField = ({
  formSchema,
  field,
  showError,
}: ProfileCompletionSchemaFieldProps) => {
  const {
    control,
    getValues,
    resetField,
    watch,
    formState: { submitCount },
  } = useFormContext<ProfileCompletionFormValues>();

  const [fieldOptions, setFieldOptions] = useState<Record<string, unknown>>({});

  const updateFieldOptions = useCallback((newFieldOption?: any) => {
    if (!newFieldOption) {
      return;
    }
    setFieldOptions((prev) => ({ ...prev, ...newFieldOption }));
  }, []);

  const resolvedShowError = useMemo(() => {
    if (typeof showError === 'boolean') {
      return showError;
    }
    return submitCount > 0;
  }, [showError, submitCount]);

  return (
    <GenericField
      formSchema={formSchema as any}
      field={field as any}
      control={control as unknown as Control<AnyCantFix>}
      getValue={getValues as unknown as UseFormGetValues<AnyCantFix>}
      resetField={resetField as unknown as UseFormResetField<AnyCantFix>}
      watch={watch as unknown as UseFormWatch<AnyCantFix>}
      fieldOptions={fieldOptions as any}
      updateFieldOptions={updateFieldOptions}
      showError={resolvedShowError}
    />
  );
};
