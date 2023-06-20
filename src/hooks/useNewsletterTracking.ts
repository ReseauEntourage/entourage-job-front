import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';

export function useNewsletterTracking() {
  const {
    query: { utm, utm_medium, utm_source, gclid, referer },
  } = useRouter();
  const visit = getCookie('visit') as string;
  const visitor = (getCookie('visitor') as string)?.split('---')[0];

  return {
    visit,
    visitor,
    urlParams: { utm, utm_medium, utm_source, gclid, referer },
  };
}
