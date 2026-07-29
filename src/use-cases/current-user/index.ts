import { UseCaseConfigItem } from '../types';
import './current-user.listeners';
import { slice } from './current-user.slice';

export * from './current-user.selectors';
export * from './current-user.api';

export const currentUserActions = slice.actions;

export const currentUserConfig = {
  slice,
} as UseCaseConfigItem;
