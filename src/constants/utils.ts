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

export type FilterConstant<
  T extends string | number | boolean = string | number | boolean
> = { value: T; label: string | React.ReactNode };

export interface Filter<
  T extends string | number | boolean = string | number | boolean
> {
  key: string;
  constants: FilterConstant<T>[];
  title: string;
  tag?: {
    action: string;
  };
  mandatory?: boolean;
  priority?: FilterConstant<T>[];
  type?: 'checkbox';
  icon?: React.ReactNode;
  disabled?: boolean;
}

export type FilterObject<T extends Filter[] = Filter[]> = {
  [K in T[number]['key']]: T[number]['constants'];
};
