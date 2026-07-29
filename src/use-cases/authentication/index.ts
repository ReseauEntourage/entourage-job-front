import { UseCaseConfigItem } from '../types';
import './authentication.listeners';
import { slice } from './authentication.slice';

export * from './authentication.selectors';
export * from './authentication.api';

export const authenticationActions = slice.actions;

export const authenticationConfig = {
  slice,
} as UseCaseConfigItem;
