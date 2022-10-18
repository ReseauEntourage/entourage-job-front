import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';

export function useNewsletterTracking() {
  const {
    query: { utm, utm_medium, utm_source, gclid, referer },
  } = useRouter();
  const visit = getCookie('visit');
  const visitor = getCookie('visitor')?.split('---')[0];

  return {
    visit,
    visitor,
    urlParams: { utm, utm_medium, utm_source, gclid, referer },
  };
}
