import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { PleziTrackingData } from 'src/api/types';

export function useNewsletterTracking(): PleziTrackingData {
  const {
    query: { utm, utm_medium, utm_source, gclid, referer },
  } = useRouter();
  const visit = getCookie('visit') as string;
  const visitor = (getCookie('visitor') as string)?.split('---')[0];

  return {
    visit,
    visitor,
    urlParams: {
      utm: utm as string,
      utm_medium: utm_medium as string,
      utm_source: utm_source as string,
      gclid: gclid as string,
      referer: referer as string,
    },
  };
}
