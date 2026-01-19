import { UseCaseConfigItem } from '../types';
import { saga } from './elearning.saga';
import { slice } from './elearning.slice';

export * from './elearning.selectors';

export const elearningActions = slice.actions;

export const elearningConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
