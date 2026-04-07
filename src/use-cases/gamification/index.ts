import { UseCaseConfigItem } from '../types';
import { saga } from './gamification.saga';
import { slice } from './gamification.slice';

export * from './gamification.selectors';

export const gamificationActions = slice.actions;

export const gamificationConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
