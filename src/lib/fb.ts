declare global {
  interface Window {
    fbq: any;
  }
}

export const fbEvent = ({
  type = 'trackCustom',
  action,
  options = null,
}: {
  type?: string;
  action: string;
  options?: { content_category: string };
}) => {
  if (window.fbq) window.fbq(type || 'trackCustom', action, options);
};
