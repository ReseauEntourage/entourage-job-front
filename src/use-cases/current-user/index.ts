import { UseCaseConfigItem } from '../types';
import { saga } from './current-user.saga';
import { slice } from './current-user.slice';

export * from './current-user.selectors';

export const currentUserActions = slice.actions;

export const currentUserConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
