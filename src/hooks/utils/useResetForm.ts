import { useRef } from 'react';

export function useResetForm() {
  const form = useRef<{ resetForm: () => void }>(null);

  const resetForm = () => {
    if (form.current) form.current.resetForm();
  };

  return [form, resetForm] as const;
}
