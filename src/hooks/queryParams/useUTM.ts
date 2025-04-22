// import { useSearchParams } from 'next/navigation';

export type UTM_PARAMETER =
  | 'utm_source'
  | 'utm_medium'
  | 'utm_campaign'
  | 'utm_term'
  | 'utm_content'
  | 'utm_id';

export type UTMParameters = {
  [key in UTM_PARAMETER]?: string | null;
};

const getParameterName = (key: string): UTM_PARAMETER | null => {
  // Si pas de clé ou la clé n'est pas du type UTM_PARAMETER on retourne null
  if (!key || !(key in ({} as UTMParameters))) {
    return null;
  }
  return key as UTM_PARAMETER;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useUTMParameters = (url = ''): UTMParameters => {
  const urlParsed = url.toString().trim().replace('?', '&'); // Remove first ? if exists

  if (!url || !urlParsed.includes('utm_')) {
    return {};
  }

  const parts = urlParsed.split('&');
  const utmParameters: UTMParameters = {};

  parts.forEach((part: string) => {
    const [key, value] = part.split('=');
    const validParameter = getParameterName(key);

    if (!validParameter) {
      return;
    }

    utmParameters[validParameter] = value;
  });

  return utmParameters;
};

export const useStoreUTMParameters = () => {
  // const searchParams = useSearchParams();
  // console.log('searchParams', searchParams);
  // return userId as string;
};
