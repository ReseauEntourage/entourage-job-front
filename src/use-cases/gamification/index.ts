import { UseCaseConfigItem } from '../types';
import './gamification.listeners';
import { slice } from './gamification.slice';

export * from './gamification.selectors';
export * from './gamification.api';

export const gamificationActions = slice.actions;

export const gamificationConfig = {
  slice,
} as UseCaseConfigItem;
