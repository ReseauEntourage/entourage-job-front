import React, { useCallback, useState } from 'react';
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

import type { SocialSituationFormValues } from './types';

interface SocialSituationSchemaFieldProps {
  formSchema: FormSchema<AnyCantFix>;
  field: FormFieldInput<AnyCantFix>;
}

export const SocialSituationSchemaField = ({
  formSchema,
  field,
}: SocialSituationSchemaFieldProps) => {
  const { control, getValues, resetField, watch } =
    useFormContext<SocialSituationFormValues>();
  const [fieldOptions, setFieldOptions] = useState<Record<string, unknown>>({});

  const updateFieldOptions = useCallback((newFieldOption?: any) => {
    if (!newFieldOption) {
      return;
    }
    setFieldOptions((prev) => ({ ...prev, ...newFieldOption }));
  }, []);

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
      showError
    />
  );
};
