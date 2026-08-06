import { UseCaseConfigItem } from '../types';
import './elearning.listeners';
import { slice } from './elearning.slice';

export * from './elearning.selectors';
export * from './elearning.api';

export const elearningActions = slice.actions;

export const elearningConfig = {
  slice,
} as UseCaseConfigItem;
