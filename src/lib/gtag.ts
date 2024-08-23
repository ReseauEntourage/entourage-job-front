import { createHash } from 'crypto';
import { AnyCantFix } from 'src/utils/Types';

declare global {
  interface Window {
    gtag: AnyCantFix;
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (window.gtag) {
    window.gtag('config', process.env.GA_TRACKING_ID, {
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

export type GaEventUserParams = {
  zone: string;
  role: string;
  userId: string;
};
export const gaEventWithUser = (action: string, user: GaEventUserParams) => {
  if (window.gtag && user.userId) {
    const hash = createHash('sha256');
    hash.update(user.userId);
    const userHashId = hash.digest('hex');
    window.gtag('event', action, {
      zone: user.zone,
      role: user.role,
      user_hash_id: userHashId,
    });
  }
};
