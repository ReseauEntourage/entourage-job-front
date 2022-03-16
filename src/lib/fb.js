export const fbEvent = ({ type, action, options }) => {
  window.fbq(type || 'trackCustom', action, options);
};
