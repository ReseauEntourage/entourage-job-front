export const OFFCANVAS_GUEST = 'offcanvas-guest';
export const OFFCANVAS_LOGGED = 'offcanvas-logged';
export const SEARCH_MAX_WIDTH = 1100;

export const Actions = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
} as const;

export type Action = (typeof Actions)[keyof typeof Actions];

export const ActionsLabels = {
  [Actions.CREATE]: { NAME: 'création', VERB: 'créé' },
  [Actions.UPDATE]: { NAME: 'modification', VERB: 'modifié' },
} as const;
