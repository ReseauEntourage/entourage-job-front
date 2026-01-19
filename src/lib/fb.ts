import { AnyCantFix } from 'src/utils/Types';

declare global {
  interface Window {
    fbq: AnyCantFix;
  }
}

export const fbEvent = ({
  type = 'trackCustom',
  action,

  // @ts-expect-error after enable TS strict mode. Please, try to fix it
  options = null,
}: {
  type?: string;
  action: string;
  options?: { content_category: string };
}) => {
  if (window.fbq) {
    window.fbq(type || 'trackCustom', action, options);
  }
};
