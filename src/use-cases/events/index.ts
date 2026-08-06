import { UseCaseConfigItem } from '../types';
import './events.listeners';
import { slice } from './events.slice';

export * from './events.selectors';
export * from './events.api';

export const eventsActions = slice.actions;

export const eventsConfig = {
  slice,
} as UseCaseConfigItem;
