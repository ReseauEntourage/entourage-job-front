import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

// eslint-disable-next-line no-shadow
export enum UtmParameters {
  UTM_SOURCE = 'utm_source',
  UTM_MEDIUM = 'utm_medium',
  UTM_CAMPAIGN = 'utm_campaign',
  UTM_TERM = 'utm_term',
  UTM_CONTENT = 'utm_content',
  UTM_ID = 'utm_id',
}

const getParameterName = (key: string): UtmParameters | null => {
  // Si pas de clé ou la clé n'est pas du type UTM_PARAMETER on retourne null
  if (!key || !(Object.values(UtmParameters) as string[]).includes(key)) {
    return null;
  }
  return key as UtmParameters;
};

export const useUtm = () => {
  const searchParams = useSearchParams();

  const extractUtmFromUrl = useCallback((): UtmParameters[] => {
    const urlParsed = searchParams.toString().trim().replace('?', '&'); // Remove first ? if exists

    if (!searchParams || !searchParams.toString().includes('utm_')) {
      return [];
    }

    const parts = urlParsed.split('&');
    const utmParameters: UtmParameters[] = [];

    parts.forEach((part: string) => {
      const [key, value] = part.split('=');
      const validParameter = getParameterName(key);

      if (!validParameter) {
        return;
      }

      utmParameters[validParameter] = value;
    });

    return utmParameters;
  }, [searchParams]);

  const saveUtmToLocalStorage = useCallback(() => {
    const utmParams = extractUtmFromUrl();

    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(key, value);
      }
    });
  }, [extractUtmFromUrl]);

  // Automatically execute saveUTMToLocalStorage when the hook is used
  useEffect(() => {
    saveUtmToLocalStorage();
  }, [saveUtmToLocalStorage, searchParams]);
};
