// Own file, so that a constants module re-exported by the barrel (e.g.
// `pusher.ts`) can read it without a circular import
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access-token',
  ONBOARDING_COMPLETION_STATUS: 'onboarding-completion-status',
  TAX_MODAL_CLOSED: 'tax-modal-closed',
  ENTOURAGE_PRO_MODAL_CLOSED: 'entourage-pro-modal-closed',
  PINNED_COMMUNICATION_CLOSED: 'pinned-communication-closed',
};
