import { UtmParameters } from '@/src/hooks/queryParams/useUTM';

export const incrementRegistrationStep = (step: number): number => {
  return step + 1;
};

export const getUtmFromLocalStorage = (): UtmParameters[] => {
  const utmParameters: UtmParameters[] = [];

  Object.values(UtmParameters).forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      utmParameters[key] = value;
    }
  });

  return utmParameters;
};
