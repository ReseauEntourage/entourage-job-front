import { AnyCantFix } from 'src/utils/Types';

declare global {
  interface Window {
    gtag: AnyCantFix;
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const gaEvent = ({
  action,
  category = '',
  label = '',
  value = '',
}: {
  action: string;
  label?: string;
  category?: string;
  value?: string;
}) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

type GaEventUserParams = {
  zone: string;
  role: string;
  userId: string;
};
export const gaEventWithUser = (action: string, user: GaEventUserParams) => {
  if (window.gtag && user.userId) {
    const encoder = new TextEncoder();
    const data = encoder.encode(user.userId);
    void crypto.subtle.digest('SHA-256', data).then((hashBuffer) => {
      const userHashId = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      window.gtag('event', action, {
        zone: user.zone,
        role: user.role,
        user_hash_id: userHashId,
      });
    });
  }
};
