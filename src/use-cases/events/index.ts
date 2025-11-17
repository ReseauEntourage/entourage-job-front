import { UseCaseConfigItem } from '../types';
import { saga } from './events.saga';
import { slice } from './events.slice';

export * from './events.selectors';

export const eventsActions = slice.actions;

export const eventsConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
