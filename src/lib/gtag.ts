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

export const gaEventWithUser = (
  action: string,
  { zone = '', role = '', userHashId = '' } = {}
) => {
  if (window.gtag) {
    window.gtag('event', action, {
      zone,
      role,
      user_hash_id: userHashId,
    });
  }
};
