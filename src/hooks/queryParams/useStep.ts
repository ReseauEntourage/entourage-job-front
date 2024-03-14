import { useRouter } from 'next/router';
import { RegistrationStep } from 'src/components/registration/Registration.types';

export function useStep() {
  const {
    query: { step },
  } = useRouter();

  return step as RegistrationStep;
}
