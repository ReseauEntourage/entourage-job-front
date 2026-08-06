import { UseCaseConfigItem } from '../types';
import './refering.listeners';
import { slice } from './refering.slice';

export * from './refering.selectors';
export * from './refering.api';

export const referingActions = slice.actions;

export const referingConfig = {
  slice,
} as UseCaseConfigItem;
