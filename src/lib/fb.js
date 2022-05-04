export const fbEvent = ({ type, action, options }) => {
  if (window.fbq) window.fbq(type || 'trackCustom', action, options);
};
