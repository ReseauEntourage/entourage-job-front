import { UseCaseConfigItem } from '../types';
import { saga } from './registration.saga';
import { slice } from './registration.slice';

export * from './registration.selectors';

export const registrationActions = slice.actions;

export const registrationConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
