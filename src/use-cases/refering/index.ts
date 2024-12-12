import { UseCaseConfigItem } from '../types';
import { saga } from './refering.saga';
import { slice } from './refering.slice';

export * from './refering.selectors';

export const referingActions = slice.actions;

export const referingConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
