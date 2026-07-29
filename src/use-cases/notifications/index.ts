import { UseCaseConfigItem } from '../types';
import { slice } from './notifications.slice';

export * from './notifications.selectors';

export const notificationsActions = slice.actions;

export const notificationsConfig = {
  slice,
} as UseCaseConfigItem;
