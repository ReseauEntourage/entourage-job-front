import { UseCaseConfigItem } from '../types';
import './messaging.listeners';
import { slice } from './messaging.slice';

export * from './messaging.selectors';
export * from './messaging.api';

export const messagingActions = slice.actions;

export const messagingConfig = {
  slice,
} as UseCaseConfigItem;
