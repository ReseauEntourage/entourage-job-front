import { UseCaseConfigItem } from '../types';
import './registration.listeners';
import { slice } from './registration.slice';

export * from './registration.selectors';
export * from './registration.api';

export const registrationActions = slice.actions;

export const registrationConfig = {
  slice,
} as UseCaseConfigItem;
