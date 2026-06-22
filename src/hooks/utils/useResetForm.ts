import { useRef } from 'react';
import { FormWithValidationRef } from '@/src/features/forms/FormWithValidation';

export function useResetForm() {
  const form = useRef<FormWithValidationRef>(null);

  const resetForm = () => {
    if (form.current) {
      form.current.resetForm();
    }
  };

  return [form, resetForm] as const;
}
