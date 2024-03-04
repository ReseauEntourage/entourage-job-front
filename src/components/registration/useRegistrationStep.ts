import { useStep } from 'src/hooks/queryParams/useStep';

export function useRegistrationStep() {
  const step = useStep();

  if (!step) {
    throw new Error('No registration step');
  }

  return step;
}
