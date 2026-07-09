import { RefObject, useCallback } from 'react';
import { FormWithValidationRef } from '@/src/features/forms/FormWithValidation';

// useStepFormSubmit - Contrat de soumission partagé par les étapes du wizard
// rendues via FormWithValidation + innerRef : délègue la validation au formulaire
// et ne bloque l'avancement du wizard qu'en cas d'échec explicite.
export const useStepFormSubmit = (
  formRef: RefObject<FormWithValidationRef | null>
): (() => Promise<boolean | void>) => {
  return useCallback(async () => {
    const success = await formRef.current?.submit();
    return success === false ? false : undefined;
  }, [formRef]);
};
